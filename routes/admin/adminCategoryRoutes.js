import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
} from "../../controllers/admin/adminCategoryController.js";

const router = express.Router();

router.get("/api/categories", getCategories);
router.get("/api/categories/:id", getCategoryById);
router.post("/api/categories", createCategory);
router.delete("/api/categories/:id", deleteCategory);

export default router;
