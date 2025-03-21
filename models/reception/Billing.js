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
      name: { type: String, required: true },
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
      numNights: { type: Number, required: true },
      numAdults: { type: Number, required: true },
      numChildren: { type: Number, required: true },
      extraAdults: { type: Number, required: true, default: 0 },
      extraChildren: { type: Number, required: true, default: 0 },
      totalRoomPrice: { type: Number, required: true },
    },
    foodOrders: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodOrder" },
        price: { type: Number, required: true },
      },
    ],
    totalFoodCost: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    taxes: { type: Number, default: 5 }, // Fixed 5% tax
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

const Billing = mongoose.model("Billing", billingSchema);
export default Billing;
