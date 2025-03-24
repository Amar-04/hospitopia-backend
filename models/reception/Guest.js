import mongoose from "mongoose"; 

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["New Guest", "Current Guest", "Arriving Today", "Past Guest"],
      required: true,
    },
    lastStay: { type: Date },
    visits: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Guest = mongoose.model("Guest", guestSchema);
export default Guest;
