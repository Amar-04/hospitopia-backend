import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+?\d{1,3}?\s?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, "Invalid phone number"],
    },
    status: {
      type: String,
      enum: ["Current Guest", "Arriving Today", "Past Guest", "Future Guest"],
      required: [true, "Status is required"],
    },
    lastStay: {
      type: String,
      required: [true, "Last stay date is required"],
    },
    // visits: {
    //   type: Number,
    //   required: [true, "Visits count is required"],
    //   min: [0, "Visits cannot be negative"],
    // },
  },
  // { timestamps: true }
);

const Guest = mongoose.model("Guest", guestSchema);

export default Guest;
