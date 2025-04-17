import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Room type name is required"],
      unique: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: [true, "Room price is required"],
      min: 0, // Price can't be negative
      max: 100000,
    },
    maxGuests: {
      adults: {
        type: Number,
        required: [true, "Maximum adults is required"],
        min: 1,
        max: 10,
      },
      children: {
        type: Number,
        required: [true, "Maximum children is required"],
        min: 0,
        max: 10,
      },
    },
    extraCost: {
      adult: {
        type: Number,
        required: [true, "Extra cost for adult is required"],
        min: 0,
        max: 1000,
      },
      child: {
        type: Number,
        required: [true, "Extra cost for child is required"],
        min: 0,
        max: 1000,
      },
    },
  },
  { timestamps: true }
);

const RoomType = mongoose.model("RoomType", roomTypeSchema);
export default RoomType;
