import mongoose from "mongoose";

const adminInventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["Housekeeping", "Amenities"],
      required: true,
    },
    stock: { type: Number, required: true },
    minRequired: { type: Number, required: true },
    status: { type: String, enum: ["Good", "Low", "Critical"], required: true },
  },
  { timestamps: true }
);

const AdminInventory = mongoose.model("AdminInventory", adminInventorySchema);
export default AdminInventory;
