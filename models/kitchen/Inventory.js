import mongoose from "mongoose";

const kitchenInventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Meat", "Seafood", "Produce", "Dry Goods", "Oils"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
    },
    minRequired: {
      type: Number,
      required: [true, "Minimum required stock is required"],
      min: [0, "Minimum required stock cannot be negative"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Good", "Low", "Critical"],
    },
  },
  { timestamps: true }
);

const KitchenInventory = mongoose.model("Inventory", kitchenInventorySchema);
export default KitchenInventory;
