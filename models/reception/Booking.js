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
      min: new Date("2000-01-01"),
    },
    checkOut: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.checkIn;
        },
        message: "Check-out date must be after check-in date.",
      },
    },
    numAdults: {
      type: Number,
      required: true,
      default: 1,
      min: [1, "At least 1 adult is required."],
      max: [5, "Maximum 5 adults allowed per room."],
    },
    numChildren: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Number of children cannot be negative."],
      max: [5, "Maximum 5 children allowed per room."],
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
