import MenuItem from "../../models/kitchen/MenuItem.js";

// Create a new menu item
export const createMenuItem = async (req, res) => {
  try {
    const { name, category, description, price, prepTime, status } = req.body;

    const newMenuItem = new MenuItem({
      name,
      category,
      description,
      price,
      prepTime,
      status,
    });
    await newMenuItem.save();

    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error("❌ Error creating menu item:", error);
    res.status(500).json({ message: "Failed to create menu item", error });
  }
};

// Get all menu items (with optional pagination and filtering)
export const getMenuItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, category = "", status = "" } = req.query;

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const menuItems = await MenuItem.find(query)
      .populate("category", "name")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalItems = await MenuItem.countDocuments(query);

    res.json({
      results: menuItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("❌ Error fetching menu items:", error);
    res.status(500).json({ message: "Failed to fetch menu items", error });
  }
};

// Get a single menu item by ID
export const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(menuItem);
  } catch (error) {
    console.error("❌ Error fetching menu item:", error);
    res.status(500).json({ message: "Failed to fetch menu item", error });
  }
};

// Update a menu item
export const updateMenuItem = async (req, res) => {
  try {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(updatedMenuItem);
  } catch (error) {
    console.error("❌ Error updating menu item:", error);
    res.status(500).json({ message: "Failed to update menu item", error });
  }
};

// Delete a menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deletedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting menu item:", error);
    res.status(500).json({ message: "Failed to delete menu item", error });
  }
};
