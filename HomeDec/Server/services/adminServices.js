const User = require("../models/userModel");

module.exports = {
  listUsers: async () => {
    const userList = await User.find({}, { password: 0 });
    return userList;
  },

  toggleUserStatus: async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found" );
    }

    user.isActive = !user.isActive;

    await user.save();

    const status = user.isActive ? "activated" : "deactivated";
    return { message: `User successfully ${status}`, user };
  },
};
