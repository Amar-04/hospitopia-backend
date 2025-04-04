import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, "Room number is required"],
      unique: true,
      trim: true,
      match: [/^\d+$/, "Room number must be numeric"], // Ensures only numbers
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType", // References RoomType collection
      required: [true, "Room type is required"],
    },
    price: { type: Number, required: true }, // Auto-assigned, no manual input
    status: {
      type: String,
      enum: {
        values: ["Occupied", "Available", "Maintenance", "Reserved"],
        message:
          "Status must be 'Occupied', 'Available', 'Maintenance', or 'Reserved'",
      },
      required: [true, "Room status is required"],
    },
    guest: { type: String, trim: true },
    checkOut: { type: Date },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", // Store the bookingId from Room
    },
    cleaning: { type: String, trim: true },
    lastCleaned: { type: Date },
    issue: { type: String, trim: true },
    eta: { type: String, trim: true },
    arrival: { type: Date },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
