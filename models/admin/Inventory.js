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
    status: { type: String, enum: ["Good", "Low", "Critical"] },
  },
  { timestamps: true }
);

// Function to determine status based on stock and minRequired
function determineStatus(stock, minRequired) {
  if (stock > minRequired * 1.25) return "Good";
  if (stock > minRequired) return "Low";
  return "Critical";
}

// Pre-save middleware to set status automatically
adminInventorySchema.pre("save", function (next) {
  this.status = determineStatus(this.stock, this.minRequired);
  next();
});

// Pre-update middleware to set status automatically
adminInventorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.stock !== undefined || update.minRequired !== undefined) {
    const newStock = update.stock ?? this.stock;
    const newMinRequired = update.minRequired ?? this.minRequired;
    update.status = determineStatus(newStock, newMinRequired);
  }
  next();
});

const AdminInventory = mongoose.model("AdminInventory", adminInventorySchema);
export default AdminInventory;
