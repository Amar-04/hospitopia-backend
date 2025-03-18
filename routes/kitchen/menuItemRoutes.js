// routes/kitchen/menuItemRoutes.js
import express from "express";
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from "../../controllers/kitchen/menuItemController.js";

const router = express.Router();

// GET all menu items (with pagination & filtering)
router.get("/api/kitchen/menu-items", getMenuItems);

// GET a single menu item by ID
router.get("/api/kitchen/menu-items/:id", getMenuItemById);

// POST a new menu item
router.post("/api/kitchen/menu-items", createMenuItem);

// PUT update menu item by ID
router.put("/api/kitchen/menu-items/:id", updateMenuItem);

// DELETE menu item by ID
router.delete("/api/kitchen/menu-items/:id", deleteMenuItem);

export default router;