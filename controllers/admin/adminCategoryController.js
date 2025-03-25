import AdminCategory from '../../models/admin/Admincategory.js';
import createError from 'http-errors';
import mongoose from 'mongoose';

// Get all categories
export const getCategories = async (req, res, next) => {
  try {
    console.log('Fetching all categories');
    const categories = await AdminCategory.find().sort({ name: 1 });
    console.log('Categories retrieved:', categories);
    res.status(200).json({
      categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    next(error);
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Fetching category with ID:", id);

    let category;

    // Check if ID is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      category = await AdminCategory.findById(id);
    } else {
      // If it's not an ObjectId, search by name (case-insensitive)
      category = await AdminCategory.findOne({ name: { $regex: new RegExp(`^${id}$`, "i") } });
    }

    if (!category) {
      console.log("Category not found:", id);
      return next(createError(404, "Category not found"));
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    next(error);
  }
};


// Create a new category
export const createCategory = async (req, res, next) => {
  try {
    console.log("Request received for creating category:", req.body);

    let { name } = req.body;

    // Fix: Check if name is nested inside another object
    if (typeof name === "object" && name !== null && "name" in name) {
      name = name.name;
    }

    // Ensure name is a string
    if (typeof name !== "string") {
      console.log("Validation failed: Category name must be a string");
      return next(createError(400, "Category name must be a string"));
    }

    name = name.trim();

    if (!name) {
      console.log("Validation failed: Missing category name");
      return next(createError(400, "Category name is required"));
    }

    console.log("Trimmed category name:", name);

    // Check for existing category (case-insensitive)
    const existingCategory = await AdminCategory.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingCategory) {
      console.log("Duplicate category found:", existingCategory);
      return next(createError(409, "This category already exists"));
    }

    const newCategory = new AdminCategory({ name });
    await newCategory.save();

    console.log("Category created successfully:", newCategory);
    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error in createCategory:", error);
    next(error);
  }
};


// Delete a category by ID
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('Deleting category with ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid category ID:', id);
      return next(createError(400, 'Invalid category ID'));
    }

    const deletedCategory = await AdminCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      console.error('Category not found:', id);
      return next(createError(404, 'Category not found'));
    }

    console.log('Category deleted successfully:', id);
    res.status(200).json({
      message: 'Category deleted successfully',
      categoryId: id
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    next(error);
  }
};
