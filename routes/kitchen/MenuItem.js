import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, 
  description: { type: String }, 
  prepTime: { type: String },
  price: { type: Number, required: true }, 
  status: { type: String, enum: ["Available", "Out of Stock"], default: "Available" },
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
