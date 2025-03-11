import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedUsers = [
  {
    name: "John Doe",
    role: "Reception",
    status: "Active",
    email: "john.doe@hotel.com",
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    avatar: "JD",
  },
  {
    name: "Jane Smith",
    role: "Kitchen",
    status: "Active",
    email: "jane.smith@hotel.com",
    lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    avatar: "JS",
  },
  {
    name: "Mike Johnson",
    role: "Admin",
    status: "Away",
    email: "mike.j@hotel.com",
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    avatar: "MJ",
  },
  {
    name: "Sarah Wilson",
    role: "Reception",
    status: "Active",
    email: "sarah.w@hotel.com",
    lastActive: new Date(), // Just now
    avatar: "SW",
  },
  {
    name: "Tom Brown",
    role: "Kitchen",
    status: "Away",
    email: "tom.b@hotel.com",
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    avatar: "TB",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    console.log("✅ Connected to Database");

    // Clear existing data
    await User.deleteMany();
    console.log("🗑 Cleared existing data");

    // Insert new data
    await User.insertMany(seedUsers);
    console.log("✅ Database Seeded Successfully");

    process.exit(); // Exit script
  } catch (error) {
    console.error("❌ Error Seeding Database:", error);
    process.exit(1);
  }
};

seedDatabase();
