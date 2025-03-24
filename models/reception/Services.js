const mongoose = require("mongoose");

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
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
