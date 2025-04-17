import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      min: new Date("2000-01-01"),
    },
    category: {
      type: String,
      enum: ["Inventory", "Salary", "Maintenance", "Utility", "Other"],
      required: true,
      maxlength: 20
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", ExpenseSchema);
