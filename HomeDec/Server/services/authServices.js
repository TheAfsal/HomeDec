const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const generateToken = require("../Utils/jwt");
const Admin = require("../models/adminModel");
const Seller = require("../models/sellerModel");

module.exports = {
  createUser: async ({ firstName, lastName, email, password }) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    const payload = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    };

    const token = generateToken(payload.user, false, true);
    return { token, role: "user" };
  },

  loginUser: async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User does not exist");
    }

    if (!user.isActive) {
      throw new Error("Account blocked");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Incorrect password");
    }

    const token = generateToken(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      false,
      true
    );
    return { token, role: "user" };
  },

  isUserExist: async (email) => {
    try {
      const user = await User.find({email});
      return user[0];
    } catch (error) {
      console.log(error);
    }
  },

  registerWithGoogle: async (email) => {
    try {
      const user = await User.find({email});
      return user[0];
    } catch (error) {
      console.log(error);
    }
  },  

  loginAdmin: async ({ email, password }) => {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new Error("Invalid credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      throw new Error("Incorrect password");
    }

    const token = generateToken(
      {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
      true,
      false
    );
    return { token, role: "admin" };
  },

  loginSeller: async ({ email, password }) => {
    const seller = await Seller.findOne({ email });

    if (!seller) {
      throw new Error("Invalid credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(password, seller.password);
    if (!isPasswordCorrect) {
      throw new Error("Incorrect password");
    }

    const token = generateToken(
      {
        _id: seller._id,
        name: seller.name,
        email: seller.email,
      },
      false,
      false
    );
    console.log(token);

    return { token, role: "seller" };
  },

  createSeller: async ({
    address,
    altContactNumber,
    businessName,
    commissionRate,
    confirmPassword,
    contactNumber,
    email,
    password,
    sellerName,
    taxId,
  }) => {
    try {
      let existingSeller = await Seller.findOne({ email });
      if (existingSeller) {
        throw new Error("Seller already exists with this email");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const seller = new Seller({
        sellerName,
        businessName,
        email,
        password: hashedPassword,
        contactNumber,
        altContactNumber,
        taxId,
        address,
        commissionRate,
      });

      await seller.save();

      return { message: "Seller created successfully" };
    } catch (error) {
      console.error(error);
      throw new Error("Error creating seller: " + error.message);
    }
  },
};
