// routes/kitchen/menuCategoryRoutes.js
import express from "express";
import {
  getMenuCategories,
  getMenuCategoryById,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory
} from "../../controllers/kitchen/menuCategoryController.js";

const router = express.Router();

// GET all menu categories (with pagination & filtering)
router.get("/api/kitchen/categories", getMenuCategories);

// GET a single menu category by ID
router.get("/api/kitchen/categories/:id", getMenuCategoryById);

// POST a new menu category
router.post("/api/kitchen/categories", createMenuCategory);

// PUT update menu category by ID
router.put("/api/kitchen/categories/:id", updateMenuCategory);

// DELETE menu category by ID
router.delete("/api/kitchen/categories/:id", deleteMenuCategory);

export default router;