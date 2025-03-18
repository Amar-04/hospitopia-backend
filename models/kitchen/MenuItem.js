import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
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
    },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema, "menuItem");
export default MenuItem;
