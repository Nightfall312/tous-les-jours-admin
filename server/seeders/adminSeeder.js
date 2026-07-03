const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@example.com" });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();