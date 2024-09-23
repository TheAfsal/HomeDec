const User = require("../models/userModel");
const generateToken = require("../Utils/jwt");

module.exports = {
  profile: async (email) => {
    try {
      const user = await User.findOne({ email }, { password: 0 });
      if (!user) {
        throw new Error("User does not exist");
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateProfile: async (userId, name, email, image) => {
    console.log(userId, name, email, image);

    try {
      const updateData = {
        name,
        email,
      };

      if (image !== "") {
        updateData.image = image;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        throw new Error("User not found");
      }

      const token = generateToken({ _id: userId, name, email });
      return { token, updateData, userId };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
