import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Inventory from "../models/Inventory.js";
import Room from "../models/Room.js";

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

const seedInventory = [
  {
    name: "Bath Towels",
    category: "Housekeeping",
    stock: 150,
    minRequired: 100,
    status: "Good",
  },
  {
    name: "Toilet Paper",
    category: "Housekeeping",
    stock: 80,
    minRequired: 100,
    status: "Low",
  },
  {
    name: "Bed Sheets",
    category: "Housekeeping",
    stock: 200,
    minRequired: 150,
    status: "Good",
  },
  {
    name: "Soap Bars",
    category: "Amenities",
    stock: 300,
    minRequired: 200,
    status: "Good",
  },
  {
    name: "Coffee Pods",
    category: "Amenities",
    stock: 50,
    minRequired: 100,
    status: "Critical",
  },
];

const seedRooms = [
  {
    number: "101",
    type: "Standard",
    status: "Occupied",
    guest: "John Smith",
    checkOut: new Date("2024-02-28T00:00:00.000Z"),
  },
  {
    number: "102",
    type: "Deluxe",
    status: "Available",
    cleaning: "Completed",
    lastCleaned: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
  },
  {
    number: "201",
    type: "Suite",
    status: "Maintenance",
    issue: "AC Repair",
    eta: "2 hours",
  },
  {
    number: "202",
    type: "Standard",
    status: "Reserved",
    arrival: new Date("2024-02-27T00:00:00.000Z"),
    guest: "Jane Cooper",
  },
  {
    number: "301",
    type: "Deluxe",
    status: "Occupied",
    guest: "Robert Fox",
    checkOut: new Date("2024-03-01T00:00:00.000Z"),
  },
];

const seedDatabase = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    console.log("✅ Connected to Database");

    // Clear existing data
    // await User.deleteMany();
    // await Inventory.deleteMany();
    await Room.deleteMany();
    console.log("🗑 Cleared existing data");

    // Insert new data
    // await User.insertMany(seedUsers);
    // await Inventory.insertMany(seedInventory);
    await Room.insertMany(seedRooms);
    console.log("✅ Database Seeded Successfully");

    process.exit(); // Exit script
  } catch (error) {
    console.error("❌ Error Seeding Database:", error);
    process.exit(1);
  }
};

seedDatabase();
