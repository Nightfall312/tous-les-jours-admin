const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteOne({ email: "admin@tlj.mn" });

  await User.create({
    name: "Admin",
    email: "admin@tlj.mn",
    password: "admin123",
    role: "admin",
  });

  console.log("Admin created");
  process.exit();
};

seedAdmin();