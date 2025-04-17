import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlentgh: 1,
      maxlength: 500,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: [true, "Category is required"],
    },
    prepTime: {
      type: String,
      required: [true, "Preparation time is required"],
      match: [/^\d+\s?(mins|minutes|hours|hrs)$/, "Invalid prep time format"],
    },
    status: {
      type: String,
      enum: ["Available", "Out of Stock"],
      default: "Available",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      max: [10000, "Price cannot exceed 10000"],
    },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema, "menuItem");
export default MenuItem;
