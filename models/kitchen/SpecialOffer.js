import mongoose from "mongoose";

const specialOfferSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Special offer name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Special offer description is required"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Price is required"],
      trim: true,
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      trim: true,
    },
    daysAvailable: {
      type: String,
      required: [true, "Days available is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const SpecialOffer = mongoose.model("SpecialOffer", specialOfferSchema);

export default SpecialOffer;