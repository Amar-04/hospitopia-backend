import mongoose from "mongoose";

const inventoryOrderSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    adminInventoryItems: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AdminInventory",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    kitchenInventoryItems: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "KitchenInventory",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "cancelled", "received"],
      default: "pending",
    },
    totalBill: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const InventoryOrder = mongoose.model("InventoryOrder", inventoryOrderSchema);
export default InventoryOrder;
