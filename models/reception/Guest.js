import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 1, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: true,
      minLength: [10, "Phone number must be 10 digits"],
      maxLength: [10, "Phone number must be 10 digits"],
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    status: {
      type: String,
      enum: ["New Guest", "Current Guest", "Arriving Today", "Past Guest"],
      required: true,
    },
    lastStay: { type: Date, min: new Date("2000-01-01"), },
    visits: { type: Number, default: 1 }, //check it later, where it is used and what to keep in min max
  },
  { timestamps: true }
);

const Guest = mongoose.model("Guest", guestSchema);
export default Guest;
