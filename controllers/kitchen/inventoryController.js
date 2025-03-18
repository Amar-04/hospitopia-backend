import KitchenInventory from "../../models/kitchen/Inventory.js"; 

// Get all inventory items with optional filtering
export const getKitchenInventory = async (req, res) => {
  try {
    const { page = 1, limit = 10, category = "", status = "" } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const inventoryItems = await KitchenInventory.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalItems = await KitchenInventory.countDocuments(filter);

    res.json({
      results: inventoryItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("❌ Error fetching inventory:", error);
    res.status(500).json({ message: "Failed to fetch inventory", error });
  }
};

// Get a single inventory item by ID
export const getKitchenInventoryById = async (req, res) => {
  try {
    const item = await KitchenInventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    console.error("❌ Error fetching item:", error);
    res.status(500).json({ message: "Failed to fetch item", error });
  }
};

// Create a new inventory item
export const createKitchenInventory = async (req, res) => {
  try {
    const newItem = new KitchenInventory(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("❌ Error creating item:", error);
    res.status(500).json({ message: "Failed to create item", error });
  }
};

// Update an inventory item
export const updateKitchenInventory = async (req, res) => {
  try {
    const updatedItem = await KitchenInventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    res.json(updatedItem);
  } catch (error) {
    console.error("❌ Error updating item:", error);
    res.status(500).json({ message: "Failed to update item", error });
  }
};

// Delete an inventory item
export const deleteKitchenInventory = async (req, res) => {
  try {
    const deletedItem = await KitchenInventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    res.status(500).json({ message: "Failed to delete item", error });
  }
};
