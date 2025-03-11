import express from "express";
import {
  getInventory,
  updateInventoryItem,
  deleteInventoryItem,
  createInventoryItem
} from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/api/inventory", getInventory); 
router.post("/api/inventory", createInventoryItem); 
router.put("/api/inventory/:id", updateInventoryItem); 
router.delete("/api/inventory/:id", deleteInventoryItem); 

export default router;
