import express from "express";
import {
  getAdminInventory,
  updateAdminInventoryItem,
  deleteAdminInventoryItem,
  createAdminInventoryItem
} from "../../controllers/admin/inventoryController.js";

const router = express.Router();

router.get("/api/admin-inventory", getAdminInventory); 
router.post("/api/admin-inventory", createAdminInventoryItem); 
router.put("/api/admin-inventory/:id", updateAdminInventoryItem); 
router.delete("/api/admin-inventory/:id", deleteAdminInventoryItem); 

export default router;
