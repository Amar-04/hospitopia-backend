import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, "Room number is required"],
      unique: true,
      trim: true,
      match: [/^\d+$/, "Room number must be numeric"], // Ensures only numbers
      minlength: 1,
      maxlength: 5,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType", // References RoomType collection
      required: [true, "Room type is required"],
    },
    price: { type: Number, required: true, min: 0, max: 10000 }, // Auto-assigned, no manual input
    status: {
      type: String,
      enum: {
        values: ["Occupied", "Available", "Maintenance", "Reserved"],
        message:
          "Status must be 'Occupied', 'Available', 'Maintenance', or 'Reserved'",
      },
      required: [true, "Room status is required"],
    },
    guest: { type: String, trim: true, maxlength: 100 },
    checkOut: { type: Date },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", // Store the bookingId from Room
    },
    cleaning: { type: String, trim: true, maxlength: 100 },
    lastCleaned: { type: Date },
    issue: { type: String, trim: true, maxlength: 200 },
    eta: { type: String, trim: true, maxlength: 50 },
    arrival: { type: Date },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
