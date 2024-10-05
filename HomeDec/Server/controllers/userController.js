const { addUserImages } = require("../middleware/uploadSingleImage");
const Otp = require("../models/otpModel");
const accountServices = require("../services/accountServices");
const authServices = require("../services/authServices");
const cartServices = require("../services/cartServices");
const orderService = require("../services/orderService");
const productServices = require("../services/productServices");
const userService = require("../services/userService");
const errorHandler = require("../Utils/authErrorHandler");
const sendOTP = require("../Utils/sendOTPMail");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

module.exports = {
  createUser: async (req, res) => {
    const { otp } = req.body;
    const { firstName, lastName, email, password } = req.body.credentials;
    console.log(firstName, lastName, email, password, otp);

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
      console.log(error);

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
    console.log(email);

    const otp = generateOTP();

    try {
      const existingUser = await authServices.isUserExist(email);
      console.log(existingUser);

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
        console.log(error);
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
    console.log(email);
    console.log(password);

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
    console.log(productId);

    try {
      const result = await productServices.fetchDetails(productId);
      res.status(200).json(result);
    } catch (error) {
      errorHandler.handleLoginError(error, res);
    }
  },

  fetchProducts: async (req, res) => {
    try {
      const result = await productServices.listAllProducts();
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

      console.log(productId, variantId, quantity);

      const items = await cartServices.addProductToCart(
        cartId,
        productId,
        variantId,
        quantity
      );
      return res.status(200).json(items);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const { productId, variantId } = req.body;
      const { cartId } = req.user;
      console.log(productId, variantId);

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
      console.log(req.files);

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
      console.log("======");
      console.log(error);

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
      console.log(addressId);

      const items = await accountServices.listAddresses(addressId);
      return res.status(200).json(items);
    } catch (error) {
      console.log(error);

      return res.status(500).json({ error: "Failed to fetch Addresses" });
    }
  },

  addAdress: async (req, res) => {
    const { label, street, city, state, postalCode, country, mob } = req.body;
    console.log(label, street, city, state, postalCode, country);
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
    console.log(id);
    if (!id) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      const addressId = req.user.addressId;
      const items = await accountServices.deleteAddress(addressId, id);
      return res.status(200).json(items);
    } catch (error) {
      console.log(error);

      return res.status(error.status).json({ error: error.message });
    }
  },

  placeNewOrder: async (req, res) => {
    try {
      const { cartItems } = req.body;
      const { _id } = req.user;

      if (!cartItems.length) {
        return res.status(400).json({ message: "Order empty" });
      }

      const order = await orderService.AddNewOrder(_id, cartItems);
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
      const { orderId, transactionId } = req.body;
      const { _id } = req.user;

      const order = await orderService.addTransactionId(
        _id,
        orderId,
        transactionId
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
      const products = await productServices.searchProducts(query, sort);
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: "Failed to search products" });
    }
  },

  fetchWishList: async (req, res) => {
    try {
      const { wishListId } = req.user;
      const wishListProducts = await accountServices.fetchWishList(wishListId);
      return res.status(200).json(wishListProducts);
    } catch (error) {
      return res.status(500).json({ error: "Failed to find wishList" });
    }
  },

  AddToWishList: async (req, res) => {
    try {
      const { productId, variantId } = req.body;
      const { wishListId } = req.user;

      console.log(productId, variantId);

      const items = await accountServices.addProductToWishList(
        wishListId,
        productId,
        variantId
      );
      return res.status(200).json(items);
    } catch (error) {
      return res.status(error.status).json({ error: error.message });
    }
  },
};
