import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    guest: {
      guestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guest",
        required: true,
      },
      name: { type: String, required: true, minlength: 1, maxlength: 100 },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    room: {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
      },
      roomNumber: { type: String, required: true },
      roomTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoomType",
        required: true,
      },
      numNights: {
        type: Number,
        required: true,
        min: [1, "Number of nights must be at least 1"], // At least 1 night stay
      },
      numAdults: {
        type: Number,
        required: true,
        min: [1, "Number of adults must be at least 1"], // At least 1 adult
      },
      numChildren: {
        type: Number,
        required: true,
        min: [0, "Number of children cannot be negative"], // No negative number of children
      },
      extraAdults: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Extra adults cannot be negative"], // No negative extra adults
      },
      extraChildren: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Extra children cannot be negative"], // No negative extra children
      },
      totalRoomPrice: {
        type: Number,
        required: true,
        min: [0, "Room price cannot be negative"], // Room price cannot be negative
      },
    },
    foodOrders: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodOrder" },
        items: [
          {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
            name: { type: String, required: true },
          },
        ],
        price: { type: Number, required: true },
      },
    ],
    totalFoodCost: {
      type: Number,
      required: true,
      min: [0, "Total food cost cannot be negative"],
    },
    serviceRequests: [
      {
        requestId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ServiceRequest",
        },
        services: [
          {
            serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
            name: { type: String, required: true },
          },
        ],
        price: {
          type: Number,
          required: true,
          min: [0, "Service request price cannot be negative"],
        },
      },
    ],
    totalServiceCost: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Total Service request price cannot be negative"],
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"], // Subtotal cannot be negative
    },
    taxes: {
      type: Number,
      default: 5, // Fixed 5% tax
      min: [0, "Tax cannot be negative"], // Tax cannot be negative
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"], // Total amount cannot be negative
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "debit card", "credit card", "upi"],
      default: null,
    },
    paymentDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const Billing = mongoose.model("Billing", billingSchema);
export default Billing;
