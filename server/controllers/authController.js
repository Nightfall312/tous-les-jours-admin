const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
};

const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  loginUser,
  getProfile,
};