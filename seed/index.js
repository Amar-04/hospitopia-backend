import dotenv from "dotenv";
import connectDB from "../config/db.js";
import AdminCategory from "../models/admin/Admincategory.js";
import AdminInventory2 from "../models/admin/Admininventory2.js";

dotenv.config();

const seedData = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log("✅ Connected to Database");

    // 🔹 Seed Categories (Hotel-Specific)
    const admincategoriesData = [
      { name: "Housekeeping" },
      { name: "Kitchen Equipment" },
      { name: "Room Supplies" },
      { name: "Lobby & Reception" }
    ];

    const categoryMap = {}; // To store category names & ObjectIds

    for (const category of admincategoriesData) {
      const result = await AdminCategory.findOneAndUpdate(
        { name: category.name }, 
        { $set: category }, 
        { upsert: true, new: true } // Insert if not found, return updated doc
      );
      categoryMap[category.name] = result._id; // Store category ObjectId
      console.log(`Category '${category.name}' ready with ID: ${result._id}`);
    }

    // 🔹 Seed Inventory & Link to Categories
    const admininventory2Data = [
      { name: "Bath Towels", category: "Housekeeping", stock: 50, minRequired: 30, status: "Good", type: "reusable" },
      { name: "Bedsheets", category: "Housekeeping", stock: 20, minRequired: 50, status: "Low", type: "reusable" },
      { name: "Cooking Utensils", category: "Kitchen Equipment", stock: 15, minRequired: 10, status: "Good", type: "reusable" },
      { name: "Wine Glasses", category: "Kitchen Equipment", stock: 5, minRequired: 20, status: "Critical", type: "reusable" },
      { name: "Toiletries Kit", category: "Room Supplies", stock: 100, minRequired: 60, status: "Good", type: "single-use" },
      { name: "Reception Desk Bells", category: "Lobby & Reception", stock: 2, minRequired: 5, status: "Low", type: "reusable" }
    ];

    for (const item of admininventory2Data) {
      // Replace category name with ObjectId
      item.category = categoryMap[item.category];

      const inventoryItem = await AdminInventory2.findOneAndUpdate(
        { name: item.name },
        { $set: item },
        { upsert: true, new: true }
      );

      // 🔹 Add inventory item to the corresponding category
      await AdminCategory.findByIdAndUpdate(item.category, {
        $addToSet: { items: inventoryItem._id } // Prevent duplicates
      });

      console.log(`Inventory item '${item.name}' added to category '${item.category}'.`);
    }

    console.log("✅ Hotel Inventory & Categories Seeded Successfully!");
    process.exit();

  } catch (error) {
    console.error("❌ Error seeding hotel data:", error);
    process.exit(1);
  }
};

// Execute seeding function
seedData();
