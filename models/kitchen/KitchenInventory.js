import mongoose from "mongoose";

const KitchenInventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g., Meat, Seafood, Produce, etc.
    stock: { type: Number, required: true, min: 0 }, // Current stock quantity
    minRequired: { type: Number, required: true, min: 0 }, // Minimum required stock
    status: { 
      type: String, 
      enum: ["Good", "Low", "Critical"], // Status can only be one of these values
      default: "Good" 
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

export const KitchenInventory = mongoose.model("KitchenInventory", KitchenInventorySchema);

export default KitchenInventory;