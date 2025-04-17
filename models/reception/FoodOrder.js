import mongoose from "mongoose";

const foodOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: Number,
      unique: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room number is required"],
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", // Store the bookingId from Room
      required: [true, "Booking ID is required"],
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: [true, "At least one item is required"],
      },
    ],
    receptionStatus: {
      type: String,
      enum: ["New Order", "In Progress", "Ready", "Delivered"],
      default: "New Order",
    },
    kitchenStatus: {
      type: String,
      enum: ["Pending", "Cooking", "Ready", "Delivered"],
      default: "New Order",
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      max: [10000, "Price exceeds maximum allowed limit"],
    },
  },
  { timestamps: true }
);

const FoodOrder = mongoose.model("FoodOrder", foodOrderSchema);
export default FoodOrder;
