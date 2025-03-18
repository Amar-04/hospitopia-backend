// controllers/kitchen/menuItemController.js
import MenuItem from "../../models/kitchen/MenuItem.js";

// @desc    Get all menu items with pagination & filtering
// @route   GET /api/kitchen/menu-items
// @access  Public

export const getMenuItems = async (req, res) => {
  console.log("🚀 getMenuItems controller called");
  console.log("📥 Request query parameters:", req.query);

  try {
    const { search = "", category = "", status } = req.query;
    console.log(`🔍 Search term: "${search}"`);
    console.log(`🏷️ Category filter: "${category}"`);
    console.log(`🏷️ Status filter: "${status}"`);

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
      console.log(`📝 Adding name filter: ${search}`);
    }
    if (category) {
      filter.categoryId = category;
      console.log(`📝 Adding category filter: ${category}`);
    }
    if (status) {
      filter.status = status;
      console.log(`📝 Adding status filter: ${status}`);
    }

    console.log("🔍 Final query filters:", JSON.stringify(filter, null, 2));

    console.log("💾 Executing database query...");
    const menuItems = await MenuItem.find(filter)
      .populate("categoryId", "name") // Populate category details
      .sort({ name: 1 }); // Sort alphabetically by name
    console.log(`✅ Query complete, found ${menuItems.length} menu items`);

    console.log("🔄 Preparing response payload...");
    const responsePayload = {
      results: menuItems, // Direct array of results
    };
    console.log("📤 Sending response");

    res.status(200).json(responsePayload);
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in getMenuItems:", error);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

// @desc    Get a single menu item by ID
// @route   GET /api/kitchen/menu-items/:id
// @access  Public
export const getMenuItemById = async (req, res) => {
  console.log("🚀 getMenuItemById controller called");
  
  const itemId = req.params.id;
  console.log(`🔑 Menu item ID: ${itemId}`);
  
  try {
    console.log(`💾 Executing findById for ID: ${itemId}`);
    const menuItem = await MenuItem.findById(itemId).populate("categoryId", "name");
    
    if (!menuItem) {
      console.log(`⚠️ Menu item with ID ${itemId} not found`);
      console.log("📤 Sending not found error response");
      return res.status(404).json({ error: "Menu item not found" });
    }
    
    console.log("✅ Menu item found");
    console.log("📝 Menu item data:", JSON.stringify(menuItem, null, 2));

    console.log("📤 Sending success response");
    res.status(200).json(menuItem);
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in getMenuItemById:", error);
    console.error("❌ Error stack:", error.stack);
    
    // Check for cast error (invalid ID format)
    if (error.name === "CastError") {
      console.error(`❌ Invalid ID format: ${itemId}`);
      return res.status(400).json({ error: "Invalid menu item ID format" });
    }
    
    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to fetch menu item" });
  }
};

// @desc    Create a new menu item
// @route   POST /api/kitchen/menu-items
// @access  Public
export const createMenuItem = async (req, res) => {
  console.log("🚀 createMenuItem controller called");
  console.log("📥 Request body:", JSON.stringify(req.body, null, 2));
  
  try {
    const { name, description, prepTime, status, price, categoryId, popularity } = req.body;
    console.log(`📝 Extracted menu item data - Name: ${name}, Category: ${categoryId}, Price: ${price}`);

    console.log("🔄 Creating new menu item object");
    const newMenuItem = new MenuItem({
      name,
      description,
      prepTime,
      status: status || "Available",
      price,
      categoryId,
      popularity: popularity || 0
    });
    console.log("📝 New menu item object created:", JSON.stringify(newMenuItem, null, 2));

    console.log("💾 Saving menu item to database...");
    await newMenuItem.save();
    console.log(`✅ Menu item saved successfully with ID: ${newMenuItem._id}`);

    // Populate the category information
    await newMenuItem.populate("categoryId", "name");

    console.log("📤 Sending success response");
    res.status(201).json({ message: "Menu item created successfully", menuItem: newMenuItem });
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in createMenuItem:", error);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Error details:", error.message);
    
    // Check for validation errors
    if (error.name === "ValidationError") {
      console.error("❌ Validation error details:", JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    
    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to create menu item" });
  }
};

// @desc    Update a menu item by ID
// @route   PUT /api/kitchen/menu-items/:id
// @access  Public
export const updateMenuItem = async (req, res) => {
  console.log("🚀 updateMenuItem controller called");
  
  const itemId = req.params.id;
  console.log(`🔑 Menu item ID to update: ${itemId}`);
  console.log("📥 Update data:", JSON.stringify(req.body, null, 2));
  
  try {
    const { name, description, prepTime, status, price, categoryId, popularity } = req.body;
    console.log(`📝 Extracted update fields - Name: ${name}, Status: ${status}, Price: ${price}`);

    console.log(`💾 Executing findByIdAndUpdate for ID: ${itemId}`);
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      itemId,
      { name, description, prepTime, status, price, categoryId, popularity },
      { new: true, runValidators: true }
    ).populate("categoryId", "name");
    
    if (!updatedMenuItem) {
      console.log(`⚠️ Menu item with ID ${itemId} not found`);
      console.log("📤 Sending not found error response");
      return res.status(404).json({ error: "Menu item not found" });
    }
    
    console.log("✅ Menu item updated successfully");
    console.log("📝 Updated menu item data:", JSON.stringify(updatedMenuItem, null, 2));

    console.log("📤 Sending success response");
    res.status(200).json({ message: "Menu item updated successfully", menuItem: updatedMenuItem });
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in updateMenuItem:", error);
    console.error("❌ Error stack:", error.stack);
    
    // Check for specific error types
    if (error.name === "CastError") {
      console.error(`❌ Invalid ID format: ${itemId}`);
      return res.status(400).json({ error: "Invalid menu item ID format" });
    }
    
    if (error.name === "ValidationError") {
      console.error("❌ Validation error details:", JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    
    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to update menu item" });
  }
};

// @desc    Delete a menu item by ID
// @route   DELETE /api/kitchen/menu-items/:id
// @access  Public
export const deleteMenuItem = async (req, res) => {
  console.log("🚀 deleteMenuItem controller called");
  
  const itemId = req.params.id;
  console.log(`🔑 Menu item ID to delete: ${itemId}`);
  
  try {
    console.log(`💾 Executing findByIdAndDelete for ID: ${itemId}`);
    const deletedMenuItem = await MenuItem.findByIdAndDelete(itemId);
    
    if (!deletedMenuItem) {
      console.log(`⚠️ Menu item with ID ${itemId} not found`);
      console.log("📤 Sending not found error response");
      return res.status(404).json({ error: "Menu item not found" });
    }
    
    console.log("✅ Menu item deleted successfully");
    console.log("📝 Deleted menu item data:", JSON.stringify(deletedMenuItem, null, 2));

    console.log("📤 Sending success response");
    res.status(200).json({ 
      message: "Menu item deleted successfully",
      deletedMenuItemId: itemId 
    });
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in deleteMenuItem:", error);
    console.error("❌ Error stack:", error.stack);
    
    // Check for cast error (invalid ID format)
    if (error.name === "CastError") {
      console.error(`❌ Invalid ID format: ${itemId}`);
      return res.status(400).json({ error: "Invalid menu item ID format" });
    }
    
    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to delete menu item" });
  }
};