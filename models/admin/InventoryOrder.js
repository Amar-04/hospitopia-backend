import mongoose from "mongoose";

const inventoryOrderSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      min: new Date("2000-01-01"),
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
          maxlength: 100,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          max: 1000,
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
          maxlength: 100,
        },
        quantity: {
          type: Number,
          required: true,
          max: 1000,
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
      min: 0,
      max: 1000000,
    },
  },
  { timestamps: true }
);

const InventoryOrder = mongoose.model("InventoryOrder", inventoryOrderSchema);
export default InventoryOrder;
