import mongoose from "mongoose";

const kitchenInventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      minlength: 1,
      maxlength: 200,
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
      max: [10000, "Stock exceeds the maximum allowed"],
    },
    minRequired: {
      type: Number,
      required: [true, "Minimum required stock is required"],
      min: [0, "Minimum required stock cannot be negative"],
      max: [5000, "Minimum required stock exceeds the allowed limit"],
    },
    status: {
      type: String,
      // required: [true, "Status is required"],
      enum: ["Good", "Low", "Critical"],
    },
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
kitchenInventorySchema.pre("save", function (next) {
  this.status = determineStatus(this.stock, this.minRequired);
  next();
});

// Pre-update middleware to set status automatically
kitchenInventorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.stock !== undefined || update.minRequired !== undefined) {
    const newStock = update.stock ?? this.stock;
    const newMinRequired = update.minRequired ?? this.minRequired;
    update.status = determineStatus(newStock, newMinRequired);
  }
  next();
});

const KitchenInventory = mongoose.model(
  "kitchenInventory",
  kitchenInventorySchema
);
export default KitchenInventory;
