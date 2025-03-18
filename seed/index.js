  import mongoose from "mongoose";
  import dotenv from "dotenv";
  import connectDB from "../config/db.js";
  import User from "../models/admin/User.js";
  import Guest from "../models/reception/Customers.js";
  import MenuItem from "../models/kitchen/MenuItem.js";
  import MenuCategory from "../models/kitchen/MenuCategory.js";
  import SpecialOffer from "../models/kitchen/SpecialOffer.js";
  import KitchenInventory from "../models/kitchen/KitchenInventory.js";

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

  // New menu categories data
  const seedMenuCategories = [
    { name: "Breakfast" },
    { name: "Lunch" },
    { name: "Dinner" },
    { name: "Appetizers" },
    { name: "Main Courses" },
    { name: "Desserts" },
    { name: "Beverages" },
    { name: "Alcoholic Drinks" },
    { name: "Special Offers" },
  ];

  // New menu items data
  const seedMenuItems = [
    { 
      name: "Continental Breakfast", 
      description: "Selection of pastries, bread, jam, butter, coffee/tea", 
      prepTime: "10 mins", 
      status: "Available", 
      price: 12.50,
      category: "Breakfast"
    },
    { 
      name: "American Breakfast", 
      description: "Eggs, bacon, toast, hash browns, coffee/tea", 
      prepTime: "15 mins", 
      status: "Available", 
      price: 18.75,
      category: "Breakfast",
      popularity: 286
    },
    { 
      name: "Vegetarian Breakfast", 
      description: "Vegetable omelet, avocado toast, fruit, coffee/tea", 
      prepTime: "15 mins", 
      status: "Available", 
      price: 16.50,
      category: "Breakfast" 
    },
    { 
      name: "Pancake Stack", 
      description: "Pancakes with maple syrup, butter, and berries", 
      prepTime: "12 mins", 
      status: "Available", 
      price: 14.25,
      category: "Breakfast"
    },
    { 
      name: "Eggs Benedict", 
      description: "Poached eggs, ham, hollandaise sauce on English muffin", 
      prepTime: "18 mins", 
      status: "Out of Stock", 
      price: 19.95,
      category: "Breakfast"
    },
    { 
      name: "Club Sandwich", 
      description: "Triple-decker sandwich with chicken, bacon, lettuce, tomato", 
      prepTime: "10 mins", 
      status: "Available", 
      price: 16.95,
      category: "Lunch",
      popularity: 342
    },
    { 
      name: "Steak (Medium)", 
      description: "8oz ribeye steak with roasted vegetables and mashed potatoes", 
      prepTime: "25 mins", 
      status: "Available", 
      price: 32.50,
      category: "Dinner",
      popularity: 253
    }
  ];

  // New special offers data
  const seedSpecialOffers = [
    { 
      name: "Weekend Brunch Buffet", 
      description: "All-you-can-eat brunch with complimentary mimosa", 
      price: 32.50,
      startTime: "9:00 AM",
      endTime: "2:00 PM",
      daysAvailable: "Sat-Sun"
    },
    { 
      name: "Dinner for Two", 
      description: "3-course dinner with bottle of wine", 
      price: 95.00,
      startTime: "6:00 PM",
      endTime: "10:00 PM",
      daysAvailable: "Daily"
    },
    { 
      name: "Happy Hour", 
      description: "50% off selected drinks and appetizers", 
      price: 0,
      startTime: "4:00 PM",
      endTime: "7:00 PM",
      daysAvailable: "Mon-Fri"
    }
  ];

  const seedKitchenInventoryItems = [
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
      // await Guest.deleteMany();
      // await MenuItem.deleteMany();
      // await MenuCategory.deleteMany();
      // await SpecialOffer.deleteMany();
       await KitchenInventory.deleteMany();
      // console.log("🗑 Cleared existing data for Users, Guests, and Menu items");

      // Insert new data
      // await User.insertMany(seedUsers);
      // await Guest.insertMany(seedGuests);
      // console.log("✅ Database Seeded Successfully with Guests");
      
      // Insert menu categories
      // const categories = await MenuCategory.insertMany(seedMenuCategories);
      // console.log("✅ Menu Categories Seeded Successfully");
      
      // Map category names to IDs
      // const categoryMap = {};
      // categories.forEach(cat => {
      //   categoryMap[cat.name] = cat._id;
      // });
      
      // Insert menu items with category references
      // const menuItemsWithCategoryIds = seedMenuItems.map(item => ({
      //   ...item,
      //   categoryId: categoryMap[item.category],
      //   category: undefined
      // }));
      
      // await MenuItem.insertMany(menuItemsWithCategoryIds);
      // console.log("✅ Menu Items Seeded Successfully");
      
      // Insert special offers
      // await SpecialOffer.insertMany(seedSpecialOffers);
      // console.log("✅ Special Offers Seeded Successfully");
      
      // Insert inventory items
      await KitchenInventory.insertMany(seedKitchenInventoryItems);
      console.log("✅ KitchenInventory Items Seeded Successfully");
          
      console.log("✅ Database Seeding Complete");

      process.exit(); // Exit script
    } catch (error) {
      console.error("❌ Error Seeding Database:", error);
      process.exit(1);
    }
  };

  seedDatabase();