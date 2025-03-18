import { KitchenInventory } from "../../models/kitchen/KitchenInventory.js";
import mongoose from "mongoose";

// @desc    Create a new KitchenInventory item
// @route   POST /api/KitchenInventory
// @access  Public
export const createKitchenInventoryItem = async (req, res) => {
  console.log("🚀 createKitchenInventoryItem controller called");
  console.log("📥 Request body:", JSON.stringify(req.body, null, 2));

  try {
    // Check if an item with the same name already exists
    const { name } = req.body;
    console.log(`🔍 Checking if KitchenInventory item already exists: ${name}`);
    const existingItem = await KitchenInventory.findOne({ name });
    if (existingItem) {
      console.log(`⚠️ KitchenInventory item already exists: ${name}`);
      return res.status(400).json({ error: "KitchenInventory item already exists" });
    }
    console.log("✅ KitchenInventory item name is unique, proceeding with creation");

    // Dynamically calculate status based on stock and minRequired
    const { stock, minRequired } = req.body;
    let status = "Good";
    if (stock < minRequired) {
      status = stock <= minRequired / 2 ? "Critical" : "Low";
    }

    // Create and save the new KitchenInventory item
    const newItem = new KitchenInventory({ ...req.body, status });
    console.log("📝 New KitchenInventory item object created:", JSON.stringify(newItem, null, 2));

    console.log("💾 Saving item to database...");
    await newItem.save();
    console.log(`✅ Item saved successfully with ID: ${newItem._id}`);

    console.log("📤 Sending success response");
    res.status(201).json(newItem);
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in createKitchenInventoryItem:", error);
    console.error("❌ Error stack:", error.stack);

    if (error.name === "ValidationError") {
      console.error("❌ Validation error details:", JSON.stringify(error.errors, null, 2));
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to create KitchenInventory item" });
  }
};

// @desc    Get all KitchenInventory items with pagination & filtering
// @route   GET /api/KitchenInventory
// @access  Public
export const getKitchenInventoryItems = async (req, res) => {
  console.log("🚀 getKitchenInventoryItems controller called");
  console.log("📥 Request query parameters:", req.query);

  try {
    const { page = 1, limit = 10, search = "", category } = req.query;
    console.log(`📊 Pagination: page=${page}, limit=${limit}`);
    console.log(`🔍 Search term: "${search}"`);
    console.log(`🏷️ Category filter: "${category}"`);

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
      console.log(`📝 Adding name filter: ${search}`);
    }
    if (category) {
      filter.category = category;
      console.log(`📝 Adding category filter: ${category}`);
    }

    console.log("🔍 Final query filters:", JSON.stringify(filter, null, 2));

    console.log("💾 Executing database query...");
    const KitchenInventoryItems = await KitchenInventory.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    console.log(`✅ Query complete, found ${KitchenInventoryItems.length} items`);

    console.log("💾 Counting total documents matching filter...");
    const totalItems = await KitchenInventory.countDocuments(filter);
    console.log(`✅ Total matching items: ${totalItems}`);

    const totalPages = Math.ceil(totalItems / limit);
    console.log(`📊 Total pages calculated: ${totalPages}`);

    console.log("🔄 Preparing response payload...");
    const responsePayload = {
      results: KitchenInventoryItems,
      totalPages: totalPages,
      currentPage: Number(page),
      totalItems: totalItems,
    };
    console.log("📤 Sending response");

    res.status(200).json(responsePayload);
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in getKitchenInventoryItems:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({ error: "Failed to fetch KitchenInventory items" });
  }
};

// @desc    Get a single KitchenInventory item by ID
// @route   GET /api/KitchenInventory/:id
// @access  Public
export const getKitchenInventoryItemById = async (req, res) => {
  console.log("🚀 getKitchenInventoryItemById controller called");

  const itemId = req.params.id;
  console.log(`🔑 Item ID to fetch: ${itemId}`);

  try {
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      console.error(`❌ Invalid ID format: ${itemId}`);
      return res.status(400).json({ error: "Invalid KitchenInventory item ID format" });
    }

    console.log(`💾 Executing findById for ID: ${itemId}`);
    const KitchenInventoryItem = await KitchenInventory.findById(itemId);

    if (!KitchenInventoryItem) {
      console.log(`⚠️ Item with ID ${itemId} not found`);
      console.log("📤 Sending not found error response");
      return res.status(404).json({ error: "KitchenInventory item not found" });
    }

    console.log("✅ Item found successfully");
    console.log("📝 Retrieved item data:", JSON.stringify(KitchenInventoryItem, null, 2));

    console.log("📤 Sending success response");
    res.status(200).json(KitchenInventoryItem);
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in getKitchenInventoryItemById:", error);
    console.error("❌ Error stack:", error.stack);

    if (error.name === "CastError") {
      console.error(`❌ Invalid ID format: ${itemId}`);
      return res.status(400).json({ error: "Invalid KitchenInventory item ID format" });
    }

    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to fetch KitchenInventory item" });
  }
};

// @desc    Update an KitchenInventory item by ID
// @route   PUT /api/KitchenInventory/:id
// @access  Public
export const updateKitchenInventoryItem = async (req, res) => {
  console.log("🚀 updateKitchenInventoryItem controller called");

  const itemId = req.params.id;
  console.log(`🔑 Item ID to update: ${itemId}`);
  console.log("📥 Update data:", JSON.stringify(req.body, null, 2));

  try {
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      console.error(`❌ Invalid ID format: ${itemId}`);
      return res.status(400).json({ error: "Invalid KitchenInventory item ID format" });
    }

    console.log(`💾 Executing findByIdAndUpdate for ID: ${itemId}`);
    const updatedItem = await KitchenInventory.findByIdAndUpdate(
      itemId,
      { ...req.body, status: calculateStatus(req.body.stock, req.body.minRequired) },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      console.log(`⚠️ Item with ID ${itemId} not found`);
      console.log("📤 Sending not found error response");
      return res.status(404).json({ error: "KitchenInventory item not found" });
    }

    console.log("✅ Item updated successfully");
    console.log("📝 Updated item data:", JSON.stringify(updatedItem, null, 2));

    console.log("📤 Sending success response");
    res.status(200).json(updatedItem);
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in updateKitchenInventoryItem:", error);
    console.error("❌ Error stack:", error.stack);

    if (error.name === "CastError") {
      console.error(`❌ Invalid ID format: ${itemId}`);
      return res.status(400).json({ error: "Invalid KitchenInventory item ID format" });
    }

    if (error.name === "ValidationError") {
      console.error("❌ Validation error details:", JSON.stringify(error.errors, null, 2));
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to update KitchenInventory item" });
  }
};

// @desc    Delete an KitchenInventory item by ID
// @route   DELETE /api/KitchenInventory/:id
// @access  Public
export const deleteKitchenInventoryItem = async (req, res) => {
  console.log("🚀 deleteKitchenInventoryItem controller called");

  const itemId = req.params.id;
  console.log(`🔑 Item ID to delete: ${itemId}`);

  try {
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      console.error(`❌ Invalid ID format: ${itemId}`);
      return res.status(400).json({ error: "Invalid KitchenInventory item ID format" });
    }

    console.log(`💾 Executing findByIdAndDelete for ID: ${itemId}`);
    const deletedItem = await KitchenInventory.findByIdAndDelete(itemId);

    if (!deletedItem) {
      console.log(`⚠️ Item with ID ${itemId} not found`);
      console.log("📤 Sending not found error response");
      return res.status(404).json({ error: "KitchenInventory item not found" });
    }

    console.log("✅ Item deleted successfully");
    console.log("📝 Deleted item data:", JSON.stringify(deletedItem, null, 2));

    console.log("📤 Sending success response");
    res.status(200).json({
      message: "KitchenInventory item deleted successfully",
      deletedItemId: itemId,
    });
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in deleteKitchenInventoryItem:", error);
    console.error("❌ Error stack:", error.stack);

    if (error.name === "CastError") {
      console.error(`❌ Invalid ID format: ${itemId}`);
      return res.status(400).json({ error: "Invalid KitchenInventory item ID format" });
    }

    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to delete KitchenInventory item" });
  }
};

// Helper function to calculate status dynamically
const calculateStatus = (stock, minRequired) => {
  if (stock < minRequired) {
    return stock <= minRequired / 2 ? "Critical" : "Low";
  }
  return "Good";
};