const Otp = require("../models/otpModel");
const authServices = require("../services/authServices");
const errorHandler = require("../Utils/errorHandler");
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

  signUpWithGoogle: async(req,res)=>{
    try {
      const result = await authServices.registerWithGoogle();
      res.status(200).json(result);
    } catch (error) {
      errorHandler.handleLoginError(error, res);
    }
  }



  // getMyProfile: async (req, res) => {
  //   const { email } = req.user;
  //   try {
  //     const profile = await userService.profile(email);
  //     res.status(200).json(profile);
  //   } catch (error) {
  //     if (error.message === "User does not exist") {
  //       return res.status(404).json({ error: error.message });
  //     } else {
  //       return res
  //         .status(500)
  //         .json({ error: "An error occurred during fetching profile" });
  //     }
  //   }
  // },

  // updateProfile: async (req, res) => {
  //   try {
  //     const { name, email } = req.body;
  //     const userId = req.user.id;
  //     var image = "";
  //     if (req.file) {
  //       image = req.file.path;
  //     }
  //     const details = await userService.updateProfile(
  //       userId,
  //       name,
  //       email,
  //       image
  //     );
  //     res.status(200).json(details);
  //   } catch (error) {
  //     if (error.message === "User does not exist") {
  //       return res.status(404).json({ error: error.message });
  //     } else {
  //       return res
  //         .status(500)
  //         .json({ message: "Failed to update profile", error: error.message });
  //     }
  //   }
  // },
};
