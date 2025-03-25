import express from "express";
import {
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../../controllers/admin/AdmininventoryController.js";

const router = express.Router();

router.get("/api/inventory", getInventory);
router.get("/api/inventory/:id", getInventoryItem);
router.post("/api/inventory", createInventoryItem);
router.put("/api/inventory/:id", updateInventoryItem);
router.delete("/api/inventory/:id", deleteInventoryItem);

export default router;
