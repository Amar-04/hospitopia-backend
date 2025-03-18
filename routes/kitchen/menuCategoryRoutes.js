import express from "express";
import {
  createMenuCategory,
  getAllMenuCategories,
  updateMenuCategory,
  deleteMenuCategory,
} from "../../controllers/kitchen/menuCategoryController.js";

const router = express.Router();

// ✅ Create a new category
router.post("/api/menu-categories", createMenuCategory);

// ✅ Get all categories
router.get("/api/menu-categories", getAllMenuCategories);

// ✅ Update a category
router.put("/api/menu-categories/:id", updateMenuCategory);

// ✅ Delete a category
router.delete("/api/menu-categories/:id", deleteMenuCategory);

export default router;
