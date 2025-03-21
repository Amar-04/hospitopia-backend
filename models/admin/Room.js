import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, "Room number is required"],
      unique: true,
      trim: true,
      match: [/^\d+$/, "Room number must be numeric"], // Ensures only numbers
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType", // References RoomType collection
      required: [true, "Room type is required"],
    },
    price: { type: Number, required: true }, // Auto-assigned, no manual input
    status: {
      type: String,
      enum: {
        values: ["Occupied", "Available", "Maintenance", "Reserved"],
        message:
          "Status must be 'Occupied', 'Available', 'Maintenance', or 'Reserved'",
      },
      required: [true, "Room status is required"],
    },
    guest: { type: String, trim: true },
    checkOut: { type: Date },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", // Store the bookingId from Room
    },
    cleaning: { type: String, trim: true },
    lastCleaned: { type: Date },
    issue: { type: String, trim: true },
    eta: { type: String, trim: true },
    arrival: { type: Date },
  },
  { timestamps: true }
);

// Middleware to set price before saving a new room
roomSchema.pre("save", function (next) {
  const priceMapping = {
    Standard: 100,
    Deluxe: 200,
    Suite: 300,
  };

  if (this.isNew || this.isModified("type")) {
    this.price = priceMapping[this.type]; // Automatically set price
  }

  next();
});

// Middleware to update price when room type is modified using findOneAndUpdate
roomSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.type) {
    const priceMapping = {
      Standard: 100,
      Deluxe: 200,
      Suite: 300,
    };
    update.price = priceMapping[update.type]; // Auto-update price
  }

  next();
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
