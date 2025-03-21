import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Room type name is required"],
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Room price is required"],
    },
    maxGuests: {
      adults: {
        type: Number,
        required: [true, "Maximum adults is required"],
      },
      children: {
        type: Number,
        required: [true, "Maximum children is required"],
      },
    },
    extraCost: {
      adult: {
        type: Number,
        required: [true, "Extra cost for adult is required"],
      },
      child: {
        type: Number,
        required: [true, "Extra cost for child is required"],
      },
    },
  },
  { timestamps: true }
);

const RoomType = mongoose.model("RoomType", roomTypeSchema);
export default RoomType;
