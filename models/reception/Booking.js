import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: Number, unique: true },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
      validate: {
        validator: async function (guestId) {
          const guest = await mongoose.model("Guest").findById(guestId);
          return (
            guest &&
            (guest.status === "New Guest" || guest.status === "Past Guest")
          );
        },
        message: "Guest must be a 'New Guest' or 'Past Guest'.",
      },
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    numAdults: {
      type: Number,
      required: true,
      default: 1,
    },
    numChildren: {
      type: Number,
      required: true,
      default: 0,
    },
    extras: {
      type: [String],
      enum: ["Breakfast", "Lunch", "Dinner", "Laundry"],
      default: [],
    },
    guestComment: {
      type: String,
      default: "No Request",
    },
    bookingStatus: {
      type: String,
      enum: ["Pending", "CheckedIn", "Payment Completed", "CheckedOut"],
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
