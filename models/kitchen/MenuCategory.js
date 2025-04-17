import mongoose from "mongoose";

const menuCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlenght: 1,
      maxlenght: 100,
    },
  },
  { timestamps: true }
);

const MenuCategory = mongoose.model(
  "MenuCategory",
  menuCategorySchema,
  "menuCategory"
);
export default MenuCategory;
