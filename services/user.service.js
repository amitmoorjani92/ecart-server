const { default: User } = require("../models/User");

const isAuthService = async (userId) => {
  const user = await User.findById(userId).select("-password");
  return user;
};

module.exports = { isAuthService };
