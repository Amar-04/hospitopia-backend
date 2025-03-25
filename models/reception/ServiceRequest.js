import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({
  requestId: {
    type: Number,
    unique: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "Room number is required"],
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: [true, "Booking ID is required"],
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "At least one item is required"],
    },
  ], 
  price: {
    type: Number,
  },
});

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
export default ServiceRequest;
