require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const User = require("../src/models/User");

async function createAdmin() {
  await connectDB();

  const email = "admin@test.com";

  const existing = await User.findOne({ email });

  if (existing) {
    console.log("Admin already exists.");
    console.log(`Email: ${email}`);
  } else {
    const passwordHash = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Test Admin",
      email,
      passwordHash,
      role: "admin"
    });

    console.log("Admin created successfully.");
    console.log(`Email: ${email}`);
    console.log("Password: Admin@123");
  }

  await mongoose.disconnect();
}

createAdmin().catch(async (error) => {
  console.error("Admin creation failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});