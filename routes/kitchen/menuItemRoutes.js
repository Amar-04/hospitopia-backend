import express from "express";
import {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from "../../controllers/kitchen/menuItemController.js";

const router = express.Router();

router.post("/api/menu-items", createMenuItem);
router.get("/api/menu-items", getMenuItems);
router.get("/api/menu-items/:id", getMenuItemById);
router.put("/api/menu-items/:id", updateMenuItem);
router.delete("/api/menu-items/:id", deleteMenuItem);

export default router;
