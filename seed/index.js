import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/admin/User.js";
import AdminInventory from "../models/admin/Inventory.js";
import Room from "../models/admin/Room.js";
import Guest from "../models/reception/Guest.js";
import Inventory from "../models/kitchen/Inventory.js";
import Staff from "../models/admin/Staff.js";
dotenv.config();

//Admin

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

const seedStaff = [
  {
    name: "John Doe",
    role: "Reception",
    shift: "Morning",
    status: "Active",
    email: "john.doe@hotel.com",
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    avatar: "JD",
  },
  {
    name: "Jane Smith",
    role: "Kitchen",
    shift: "Evening",
    status: "Active",
    email: "jane.smith@hotel.com",
    lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    avatar: "JS",
  },
  {
    name: "Mike Johnson",
    role: "Admin",
    shift: "Night",
    status: "Away",
    email: "mike.j@hotel.com",
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    avatar: "MJ",
  },
  {
    name: "Sarah Wilson",
    role: "Reception",
    shift: "Morning",
    status: "Active",
    email: "sarah.w@hotel.com",
    lastActive: new Date(), // Just now
    avatar: "SW",
  },
  {
    name: "Tom Brown",
    role: "Kitchen",
    shift: "Night",
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

const seedGuests = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    status: "Current Guest",
    lastStay: new Date(),
    visits: 3,
  },
  {
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    phone: "+1 (555) 234-5678",
    status: "Arriving Today",
    lastStay: new Date(),
    visits: 1,
  },
  {
    name: "Robert Fox",
    email: "robert.fox@example.com",
    phone: "+1 (555) 345-6789",
    status: "Current Guest",
    lastStay: new Date(),
    visits: 2,
  },
  {
    name: "Emma Wilson",
    email: "emma.w@example.com",
    phone: "+1 (555) 456-7890",
    status: "Past Guest",
    lastStay: new Date("2024-02-15"),
    visits: 5,
  },
  {
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1 (555) 567-8901",
    status: "Past Guest",
    lastStay: new Date("2024-01-23"),
    visits: 4,
  },
];

const seedKitchenInventory = [
  { name: "Chicken Breast", category: "Meat", stock: 24, minRequired: 20, status: "Good" },
  { name: "Ground Beef", category: "Meat", stock: 18, minRequired: 15, status: "Good" },
  { name: "Salmon Fillet", category: "Seafood", stock: 12, minRequired: 10, status: "Good" },
  { name: "Tomatoes", category: "Produce", stock: 8, minRequired: 15, status: "Low" },
  { name: "Lettuce", category: "Produce", stock: 5, minRequired: 10, status: "Low" },
  { name: "Flour", category: "Dry Goods", stock: 35, minRequired: 20, status: "Good" },
  { name: "Sugar", category: "Dry Goods", stock: 22, minRequired: 15, status: "Good" },
  { name: "Olive Oil", category: "Oils", stock: 3, minRequired: 5, status: "Critical" },
];

const seedDatabase = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    console.log("✅ Connected to Database");

    // Clear existing data
    // await User.deleteMany();
    // await AdminInventory.deleteMany();
    // await Inventory.deleteMany();
    await Staff.deleteMany();
    // await Room.deleteMany();
    // await Guest.deleteMany();
    console.log("🗑 Cleared existing data");

    // Insert new data
    // await User.insertMany(seedUsers);
    // await AdminInventory.insertMany(seedInventory);
    // await Inventory.insertMany(seedKitchenInventory);
    await Staff.insertMany(seedStaff);
    // await Room.insertMany(seedRooms);
    // await Guest.insertMany(seedGuests);
    console.log("✅ Database Seeded Successfully");

    process.exit(); // Exit script
  } catch (error) {
    console.error("❌ Error Seeding Database:", error);
    process.exit(1);
  }
};

seedDatabase();
