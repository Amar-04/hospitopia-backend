import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: ["Housekeeping", "Room Service", "Concierge", "Others"],
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "Service name must be at least 2 characters"],
      maxLength: [100, "Service name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: [10000, "Price cannot exceed 10000"],
    },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
