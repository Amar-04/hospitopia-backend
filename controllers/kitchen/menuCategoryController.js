// controllers/kitchen/menuCategoryController.js
import MenuCategory from "../../models/kitchen/MenuCategory.js";
import MenuItem from "../../models/kitchen/MenuItem.js";

// @desc    Get all menu categories
// @route   GET /api/kitchen/categories
// @access  Public

export const getMenuCategories = async (req, res) => {
  console.log("🚀 getMenuCategories controller called");
  console.log("📥 Request query parameters:", req.query);

  try {
    const { search = "" } = req.query; 
    console.log(`🔍 Search term: "${search}"`);

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
      console.log(`📝 Adding name filter: ${search}`);
    }

    console.log("🔍 Final query filters:", JSON.stringify(filter, null, 2));

    console.log("💾 Executing database query...");
    const categories = await MenuCategory.find(filter)
      .sort({ name: 1 }); // Sort alphabetically by name
    console.log(`✅ Query complete, found ${categories.length} categories`);

    console.log("🔄 Preparing response payload...");
    const responsePayload = {
      results: categories, // Direct array of results
    };
    console.log("📤 Sending response");

    res.status(200).json(responsePayload);
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in getMenuCategories:", error);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to fetch menu categories" });
  }
};

// @desc    Get a single menu category by ID
// @route   GET /api/kitchen/categories/:id
// @access  Public
export const getMenuCategoryById = async (req, res) => {
  console.log("🚀 getMenuCategoryById controller called");
  
  const categoryId = req.params.id;
  console.log(`🔑 Category ID: ${categoryId}`);
  
  try {
    console.log(`💾 Executing findById for ID: ${categoryId}`);
    const category = await MenuCategory.findById(categoryId);
    
    if (!category) {
      console.log(`⚠️ Category with ID ${categoryId} not found`);
      console.log("📤 Sending not found error response");
      return res.status(404).json({ error: "Menu category not found" });
    }
    
    console.log("✅ Category found");
    console.log("📝 Category data:", JSON.stringify(category, null, 2));

    console.log("📤 Sending success response");
    res.status(200).json(category);
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in getMenuCategoryById:", error);
    console.error("❌ Error stack:", error.stack);
    
    // Check for cast error (invalid ID format)
    if (error.name === "CastError") {
      console.error(`❌ Invalid ID format: ${categoryId}`);
      return res.status(400).json({ error: "Invalid category ID format" });
    }
    
    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to fetch menu category" });
  }
};

// @desc    Create a new menu category
// @route   POST /api/kitchen/categories
// @access  Public
export const createMenuCategory = async (req, res) => {
  console.log("🚀 createMenuCategory controller called");
  console.log("📥 Request body:", JSON.stringify(req.body, null, 2));
  
  try {
    const { name, isActive } = req.body;
    console.log(`📝 Extracted category data - Name: ${name}, isActive: ${isActive}`);

    // Check for an existing category by name to prevent duplicates
    console.log(`🔍 Checking if category name already exists: ${name}`);
    const existingCategory = await MenuCategory.findOne({ name });
    
    if (existingCategory) {
      console.log(`⚠️ Category name already exists: ${name}`);
      console.log("📤 Sending duplicate name error response");
      return res.status(400).json({ error: "Category name already exists" });
    }
    console.log("✅ Category name is unique, proceeding with creation");

    console.log("🔄 Creating new category object");
    const newCategory = new MenuCategory({
      name,
      isActive: isActive !== undefined ? isActive : true
    });
    console.log("📝 New category object created:", JSON.stringify(newCategory, null, 2));

    console.log("💾 Saving category to database...");
    await newCategory.save();
    console.log(`✅ Category saved successfully with ID: ${newCategory._id}`);

    console.log("📤 Sending success response");
    res.status(201).json({ message: "Menu category created successfully", category: newCategory });
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in createMenuCategory:", error);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Error details:", error.message);
    
    // Check for validation errors
    if (error.name === "ValidationError") {
      console.error("❌ Validation error details:", JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    
    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to create menu category" });
  }
};

// @desc    Update a menu category by ID
// @route   PUT /api/kitchen/categories/:id
// @access  Public
export const updateMenuCategory = async (req, res) => {
  console.log("🚀 updateMenuCategory controller called");
  
  const categoryId = req.params.id;
  console.log(`🔑 Category ID to update: ${categoryId}`);
  console.log("📥 Update data:", JSON.stringify(req.body, null, 2));
  
  try {
    const { name, isActive } = req.body;
    console.log(`📝 Extracted update fields - Name: ${name}, isActive: ${isActive}`);

    // Check if name already exists in another document
    if (name) {
      console.log(`🔍 Checking if name already exists: ${name}`);
      const existingCategory = await MenuCategory.findOne({ 
        name, 
        _id: { $ne: categoryId } 
      });
      
      if (existingCategory) {
        console.log(`⚠️ Category name already exists for a different category: ${name}`);
        console.log("📤 Sending duplicate name error response");
        return res.status(400).json({ error: "Category name already exists" });
      }
      console.log("✅ Category name is unique or unchanged, proceeding with update");
    }

    console.log(`💾 Executing findByIdAndUpdate for ID: ${categoryId}`);
    const updatedCategory = await MenuCategory.findByIdAndUpdate(
      categoryId,
      { name, isActive },
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      console.log(`⚠️ Category with ID ${categoryId} not found`);
      console.log("📤 Sending not found error response");
      return res.status(404).json({ error: "Menu category not found" });
    }
    
    console.log("✅ Category updated successfully");
    console.log("📝 Updated category data:", JSON.stringify(updatedCategory, null, 2));

    console.log("📤 Sending success response");
    res.status(200).json({ message: "Menu category updated successfully", category: updatedCategory });
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in updateMenuCategory:", error);
    console.error("❌ Error stack:", error.stack);
    
    // Check for specific error types
    if (error.name === "CastError") {
      console.error(`❌ Invalid ID format: ${categoryId}`);
      return res.status(400).json({ error: "Invalid category ID format" });
    }
    
    if (error.name === "ValidationError") {
      console.error("❌ Validation error details:", JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    
    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to update menu category" });
  }
};

// @desc    Delete a menu category by ID
// @route   DELETE /api/kitchen/categories/:id
// @access  Public
export const deleteMenuCategory = async (req, res) => {
  console.log("🚀 deleteMenuCategory controller called");
  
  const categoryId = req.params.id;
  console.log(`🔑 Category ID to delete: ${categoryId}`);
  
  try {
    // Check if there are menu items using this category
    console.log(`🔍 Checking if any menu items use this category: ${categoryId}`);
    const itemsUsingCategory = await MenuItem.countDocuments({ categoryId });
    
    if (itemsUsingCategory > 0) {
      console.log(`⚠️ Found ${itemsUsingCategory} menu items using this category`);
      console.log("📤 Sending dependency error response");
      return res.status(400).json({ 
        error: "Cannot delete category as it is in use",
        itemCount: itemsUsingCategory
      });
    }
    console.log("✅ No menu items depend on this category, proceeding with deletion");
    
    console.log(`💾 Executing findByIdAndDelete for ID: ${categoryId}`);
    const deletedCategory = await MenuCategory.findByIdAndDelete(categoryId);
    
    if (!deletedCategory) {
      console.log(`⚠️ Category with ID ${categoryId} not found`);
      console.log("📤 Sending not found error response");
      return res.status(404).json({ error: "Menu category not found" });
    }
    
    console.log("✅ Category deleted successfully");
    console.log("📝 Deleted category data:", JSON.stringify(deletedCategory, null, 2));

    console.log("📤 Sending success response");
    res.status(200).json({ 
      message: "Menu category deleted successfully",
      deletedCategoryId: categoryId 
    });
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in deleteMenuCategory:", error);
    console.error("❌ Error stack:", error.stack);
    
    // Check for cast error (invalid ID format)
    if (error.name === "CastError") {
      console.error(`❌ Invalid ID format: ${categoryId}`);
      return res.status(400).json({ error: "Invalid category ID format" });
    }
    
    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to delete menu category" });
  }
};