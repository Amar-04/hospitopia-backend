import AdminInventory from "../../models/admin/Inventory.js";

// Get all inventory items with pagination & filtering
export const getAdminInventory = async (req, res) => {
  try {
    const { page = 1, limit = 5, category, status } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    console.log("🔍 Applied Filters:", filter); // Debugging filters

    let query = AdminInventory.find(filter).sort({ createdAt: -1 });

    // If limit is not 0, apply pagination
    if (limit > 0) {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    const inventory = await query;

    const totalItems = await AdminInventory.countDocuments(filter);

    res.json({
      results: inventory,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("❌ Error Fetching Inventory:", error);
    res.status(500).json({ message: "Failed to fetch inventory", error });
  }
};

// Add new inventory item
export const createAdminInventoryItem = async (req, res) => {
  try {
    const newItem = await AdminInventory.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: "Failed to add item", error });
  }
};

// Update inventory item
export const updateAdminInventoryItem = async (req, res) => {
  try {
    const updatedItem = await AdminInventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem)
      return res.status(404).json({ message: "Item not found" });

    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: "Failed to update item", error });
  }
};

// Delete inventory item
export const deleteAdminInventoryItem = async (req, res) => {
  try {
    const deletedItem = await AdminInventory.findByIdAndDelete(req.params.id);
    if (!deletedItem)
      return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item", error });
  }
};
