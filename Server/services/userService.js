const User = require("../models/userModel");
const { handleError } = require("../Utils/handleError");
const generateToken = require("../Utils/jwt");
const bcrypt = require("bcrypt");

module.exports = {
  profileDetails: async (email) => {
    try {
      const user = await User.findOne({ email }, { password: 0 });
      if (!user) {
        throw { status: 400, message: "User does not exist" };
      }
      return user;
    } catch (error) {
      throw error;
    }
  },

  updateBasicDetails: async (
    email,
    firstName,
    lastName,
    gender,
    dob,
    imageDetails,
    fileLength
  ) => {
    data = {
      firstName,
      lastName,
      gender,
      dob,
    };

    if (fileLength) {
      data.image = imageDetails;
    }

    try {
      const updatedUser = await User.findOneAndUpdate({ email }, data, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        throw { status: 400, message: "User not found" };
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  updateContact: async (email, newEmail, phoneNumber) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          email: newEmail,
          phoneNumber,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedUser) {
        throw { status: 400, message: "User not found" };
      }

      const payload = {
        user: {
          _id: updatedUser._id,
          email: updatedUser.email,
          cartId: updatedUser.cartId,
          addressId: updatedUser.addressId,
        },
      };

      const token = generateToken(payload.user, false, true);

      return { token, updatedUser };
    } catch (error) {
      throw handleError(error);
    }
  },

  changeNewPassword: async (email, oldPassword, newPassword) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw { status: 404, message: "User not found" };
      }

      // Compare old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw { status: 404, message: "Incorrect existing password" };
      }

      // Hash new password and update
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      return { message: "Password changed successfully" };
    } catch (error) {
      if (error.status) throw error;
      else throw handleError(error);
    }
  },
};
