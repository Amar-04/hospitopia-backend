import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ["Occupied", "Available", "Maintenance", "Reserved"],
      required: true,
    },
    guest: { type: String },
    checkOut: { type: Date },
    cleaning: { type: String },
    lastCleaned: { type: Date },
    issue: { type: String },
    eta: { type: String },
    arrival: { type: Date },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
