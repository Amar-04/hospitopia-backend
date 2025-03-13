import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/admin/User.js";
import Guest from "../models/reception/Customers.js";

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

const seedGuests = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    status: "Current Guest",
    lastStay: "Room 101 (now)",
    // visits: 3,
  },
  {
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    phone: "+1 (555) 234-5678",
    status: "Arriving Today",
    lastStay: "Room 202 (booked)",
    // visits: 1,
  },
  {
    name: "Robert Fox",
    email: "robert.fox@example.com",
    phone: "+1 (555) 345-6789",
    status: "Current Guest",
    lastStay: "Room 305 (now)",
    // visits: 2,
  },
  {
    name: "Emma Wilson",
    email: "emma.w@example.com",
    phone: "+1 (555) 456-7890",
    status: "Past Guest",
    lastStay: "Feb 15, 2024",
    // visits: 5,
  },
  {
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1 (555) 567-8901",
    status: "Past Guest",
    lastStay: "Jan 23, 2024",
    // visits: 4,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    console.log("✅ Connected to Database");

    // Clear existing data
    // await User.deleteMany();
    // await Guest.deleteMany();
    // console.log("🗑 Cleared existing data for Users and Guests");

    // Insert new data
    // await User.insertMany(seedUsers);
    await Guest.insertMany(seedGuests);
    console.log("✅ Database Seeded Successfully with Users and Guests");

    process.exit(); // Exit script
  } catch (error) {
    console.error("❌ Error Seeding Database:", error);
    process.exit(1);
  }
};

seedDatabase();
