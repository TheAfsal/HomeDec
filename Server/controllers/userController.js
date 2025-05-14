const { addUserImages } = require("../middleware/uploadSingleImage");
const Otp = require("../models/otpModel");
const accountServices = require("../services/accountServices");
const authServices = require("../services/authServices");
const cartServices = require("../services/cartServices");
const categoryServices = require("../services/categoryServices");
const couponServices = require("../services/couponServices");
const orderService = require("../services/orderService");
const productServices = require("../services/productServices");
const userService = require("../services/userService");
const walletService = require("../services/walletService");
const errorHandler = require("../Utils/authErrorHandler");
const sendOTP = require("../Utils/sendOTPMail");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

module.exports = {
  createUser: async (req, res) => {
    const { otp } = req.body;
    const { firstName, lastName, email, password } = req.body.credentials;

    try {
      const existingOtp = await Otp.findOne({ email });

      if (!existingOtp) {
        return res.status(400).json({ error: "No OTP sent for this email." });
      }

      if (existingOtp.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP." });
      }

      const result = await authServices.createUser({
        firstName,
        lastName,
        email,
        password,
      });

      await Otp.deleteOne({ email });
      res.status(201).json(result);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "User already exists" });
      } else {
        return res
          .status(500)
          .json({ error: "An error occurred during user creation" });
      }
    }
  },

  verifyEmail: async (req, res) => {
    const { email } = req.body;

    const otp = generateOTP();

    try {
      const existingUser = await authServices.isUserExist(email);

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      } else {
        const otpDoc = new Otp({ email, otp });
        await otpDoc.save();
        // await sendOTP(email, otp);
      }
      res.status(201).json();
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "User already exists" });
      } else {
        return res
          .status(500)
          .json({ error: "An error occurred during login" });
      }
    }
  },

  userVerified: async (req, res) => {
    res.status(200).json({ role: "user" });
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;

    res.cookie("myCookie", "dfsadfsafsdff", {
      maxAge: 900000,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    try {
      const result = await authServices.loginUser({ email, password });
      res.status(200).json(result);
    } catch (error) {
      errorHandler.handleLoginError(error, res);
    }
  },

  signUpWithGoogle: async (req, res) => {
    try {
      const result = await authServices.registerWithGoogle();
      res.status(200).json(result);
    } catch (error) {
      errorHandler.handleLoginError(error, res);
    }
  },

  fetchProductDetails: async (req, res) => {
    const productId = req.params.id;

    try {
      const result = await productServices.fetchDetails(productId);
      res.status(200).json(result);
    } catch (error) {
      errorHandler.handleLoginError(error, res);
    }
  },

  fetchProducts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const cursor = req.query.cursor === "0" ? null : req.query.cursor;
      const result = await productServices.listAllProducts(limit, cursor);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch products" });
    }
  },

  distinctCatForHome: async (req, res) => {
    try {
      const result = await productServices.distinctCatForHome();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch products" });
    }
  },

  fetchMyCart: async (req, res) => {
    try {
      const cartId = req.user.cartId;
      const items = await cartServices.listCartItems(cartId);
      return res.status(200).json(items);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch cart items" });
    }
  },

  addToCart: async (req, res) => {
    try {
      const { productId, variantId, quantity } = req.body;
      const { cartId } = req.user;

      const items = await cartServices.addProductToCart(
        cartId,
        productId,
        variantId,
        quantity
      );
      return res.status(200).json(items);
    } catch (error) {
      if (error.status)
        return res.status(error.status).json({ error: error.message });
      else res.status(400).json({ error: error.message });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const { productId, variantId } = req.body;
      const { cartId } = req.user;

      const items = await cartServices.removeProductToCart(
        cartId,
        productId,
        variantId
      );
      return res.status(200).json(items);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },

  fetchProfileDetails: async (req, res) => {
    try {
      const email = req.user.email;
      const details = await userService.profileDetails(email);
      return res.status(200).json(details);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },

  updateBasicDetails: async (req, res) => {
    try {
      const email = req.user.email;
      const { firstName, lastName, gender, dob } = req.body;

      let imageDetails;
      if (req.files.length) {
        imageDetails = await addUserImages(req.files);
      } else {
        imageDetails = {};
      }

      const details = await userService.updateBasicDetails(
        email,
        firstName,
        lastName,
        gender,
        dob,
        imageDetails,
        req.files.length
      );
      return res.status(200).json(details);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },

  updateContactDetails: async (req, res) => {
    try {
      const email = req.user.email;
      const { newEmail, phoneNumber } = req.body;

      const details = await userService.updateContact(
        email,
        newEmail,
        phoneNumber
      );

      return res.status(200).json(details);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const email = req.user.email;
      const { oldPassword, newPassword } = req.body;

      const details = await userService.changeNewPassword(
        email,
        oldPassword,
        newPassword
      );

      return res.status(200).json(details);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },

  fetchAddresses: async (req, res) => {
    try {
      const addressId = req.user.addressId;

      const items = await accountServices.listAddresses(addressId);
      return res.status(200).json(items);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch Addresses" });
    }
  },

  addAdress: async (req, res) => {
    const { label, street, city, state, postalCode, country, mob } = req.body;

    if (
      !label ||
      !street ||
      !city ||
      !state ||
      !postalCode ||
      !country ||
      !mob
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const addressId = req.user.addressId;
      const items = await accountServices.AddNewAddress(addressId, {
        label,
        street,
        city,
        state,
        postalCode,
        country,
        mob,
        primary: false,
      });
      return res.status(200).json(items);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },

  removeAdress: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      const addressId = req.user.addressId;
      const items = await accountServices.deleteAddress(addressId, id);
      return res.status(200).json(items);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },

  placeNewOrder: async (req, res) => {
    try {
      const { cartItems, promoCode } = req.body;
      const { _id } = req.user;

      if (!cartItems.length) {
        return res.status(400).json({ message: "Order empty" });
      }

      const order = await orderService.AddNewOrder(_id, cartItems, promoCode);
      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        orderId: order.orderId,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  updateExistingOrder: async (req, res) => {
    try {
      const { orderId, shippingAddress, paymentMethod } = req.body;
      const { _id, cartId } = req.user;

      const order = await orderService.updateExistingOrder(
        orderId,
        shippingAddress,
        paymentMethod,
        _id,
        cartId
      );
      return res.status(201).json({
        success: true,
        message: "Order updated successfully",
        orderDetails: order,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  addTransactionId: async (req, res) => {
    try {
      const { paymentStatus, orderId, razorpayOrderId } = req.body;
      const { _id } = req.user;

      const order = await orderService.addTransactionId(
        _id,
        orderId,
        razorpayOrderId,
        paymentStatus
      );
      return res.status(201).json({
        success: true,
        message: "Order updated successfully",
        orderDetails: order,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  fetchUserOrders: async (req, res) => {
    try {
      const { _id } = req.user;
      const items = await orderService.listOrdersForUser(_id);
      return res.status(200).json(items);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch Orders" });
    }
  },

  requestReturnOrcancel: async (req, res) => {
    try {
      const {
        orderId,
        productId,
        variantId,
        reason,
        comments,
        returnOrCancel,
      } = req.body;

      const items = await orderService.requestReturnOrcancel(
        orderId,
        productId,
        variantId,
        reason,
        comments,
        returnOrCancel
      );
      return res.status(200).json(items);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch Orders" });
    }
  },

  fetchOrderDetail: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { _id } = req.user;
      const items = await orderService.OrderDetail(_id, orderId);
      return res.status(200).json(items);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch Order" });
    }
  },

  searchProduct: async (req, res) => {
    try {
      const query = req.query.q;
      const sort = req.query.sort;
      const filter = {
        option: req.query.option,
        value: req.query.value,
      };
      const products = await productServices.searchProducts(
        query,
        sort,
        filter
      );
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: "Failed to search products" });
    }
  },

  fetchWishList: async (req, res) => {
    try {
      const { wishlistId } = req.user;

      const wishlistProducts = await accountServices.fetchWishList(wishlistId);
      return res.status(200).json(wishlistProducts);
    } catch (error) {
      return res.status(500).json({ error: "Failed to find wishList" });
    }
  },

  AddToWishList: async (req, res) => {
    try {
      const { productId, variantId } = req.body;
      const { wishlistId } = req.user;

      const items = await accountServices.addProductToWishList(
        wishlistId,
        productId,
        variantId
      );
      return res.status(200).json(items);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },

  removeFromWishList: async (req, res) => {
    try {
      const { itemsToRemove } = req.body;
      const { wishlistId } = req.user;

      const items = await accountServices.removeProductsFromWishList(
        wishlistId,
        itemsToRemove
      );
      return res.status(200).json(items);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },

  addMultipleItemsToCart: async (req, res) => {
    try {
      const { products } = req.body;
      const { cartId, wishlistId } = req.user;

      const items = await cartServices.addMultipleProductsToCart(
        cartId,
        products,
        wishlistId
      );
      return res.status(200).json(items);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },

  validatePromoCodeController: async (req, res) => {
    const { _id } = req.user;
    const { promoCode, orderItems, finalAmount } = req.body;

    try {
      const result = await couponServices.validatePromoCode(
        _id,
        promoCode,
        orderItems,
        finalAmount
      );
      return res.status(200).json({
        message: "Promo code is valid",
        discountAmount: result.discountAmount,
        discountType: result.discountType,
        discountValue: result.discountValue,
        couponId: result.couponId,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  // Category Related
  listCategory: async (req, res) => {
    try {
      const result = await categoryServices.listCategory("name");
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
  },

  // Wallet history
  getWalletDetails: async (req, res) => {
    try {
      const { _id } = req.user;
      const result = await walletService.getWalletDetails(_id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch Wallet Details" });
    }
  },

  //Invoice
  generateInvoice: async (req, res) => {
    try {
      const { orderId, productId, variantId } = req.params;
      const { _id } = req.user;

      const result = await orderService.generateInvoice(
        _id,
        orderId,
        productId,
        variantId,
        res
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Failed to download Invoice" });
    }
  },
};
