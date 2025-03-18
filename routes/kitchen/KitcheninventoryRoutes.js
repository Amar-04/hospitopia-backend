import express from "express";
import {
  createKitchenInventoryItem,
  getKitchenInventoryItems,
  getKitchenInventoryItemById,
  updateKitchenInventoryItem,
  deleteKitchenInventoryItem,
} from "../../controllers/kitchen/KitchenInventoryController.js";

const router = express.Router();

// GET all kitchen inventory items (with pagination & filtering)
router.get("/api/kitchen/inventory", getKitchenInventoryItems);

// GET a single kitchen inventory item by ID
router.get("/api/kitchen/inventory/:id", getKitchenInventoryItemById);

// POST a new kitchen inventory item
router.post("/api/kitchen/inventory", createKitchenInventoryItem);

// PUT update kitchen inventory item by ID
router.put("/api/kitchen/inventory/:id", updateKitchenInventoryItem);

// DELETE kitchen inventory item by ID
router.delete("/api/kitchen/inventory/:id", deleteKitchenInventoryItem);

export default router;