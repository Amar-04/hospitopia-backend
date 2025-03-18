import express from "express";
import {
  getKitchenInventory,
  getKitchenInventoryById,
  createKitchenInventory,
  updateKitchenInventory,
  deleteKitchenInventory,
} from "../../controllers/kitchen/inventoryController.js";

const router = express.Router();

// Routes
router.get("/api/kitchen-inventory", getKitchenInventory); // Fetch all inventory items
router.get("/api/kitchen-inventory/:id", getKitchenInventoryById); // Get a single inventory item
router.post("/api/kitchen-inventory", createKitchenInventory); // Create a new inventory item
router.put("/api/kitchen-inventory/:id", updateKitchenInventory); // Update an inventory item
router.delete("/api/kitchen-inventory/:id", deleteKitchenInventory); // Delete an inventory item

export default router;
