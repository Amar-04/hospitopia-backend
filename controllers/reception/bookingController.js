import mongoose from "mongoose";
import Booking from "../../models/reception/Booking.js";
import Room from "../../models/admin/Room.js";
import Guest from "../../models/reception/Guest.js";
import AdminInventory from "../../models/admin/Inventory.js";
import Billing from "../../models/reception/Billing.js";

// 🟢 Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      guestId,
      roomId,
      checkIn,
      checkOut,
      numAdults,
      numChildren,
      extras,
      guestComment,
    } = req.body;

    // Validate Guest existence & status
    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({ message: "Guest not found." });
    }
    if (guest.status !== "New Guest" && guest.status !== "Past Guest") {
      return res
        .status(400)
        .json({ message: "Only 'New Guest' or 'Past Guest' can book a room." });
    }

    // Validate Room existence
    const room = await Room.findById(roomId).populate("type");
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    // Validate Check-in and Check-out dates
    if (new Date(checkIn) >= new Date(checkOut)) {
      return res
        .status(400)
        .json({ message: "Check-in date must be before check-out date." });
    }

    // Get the last booking and increment `bookingId`
    const lastBooking = await Booking.findOne().sort({ bookingId: -1 });
    const newBookingId = lastBooking ? lastBooking.bookingId + 1 : 1001; // Start at 1001

    // Create a new booking
    const newBooking = new Booking({
      bookingId: newBookingId, // Assign sequential booking ID
      guest: guestId,
      room: roomId,
      checkIn,
      checkOut,
      numAdults,
      numChildren,
      extras,
      guestComment,
      bookingStatus: "CheckedIn",
    });

    await newBooking.save();

    // Update the Room's Status
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      {
        status: "Occupied", // Change status to "Occupied"
        guest: guest.name, // Set guest name in room
        checkOut: checkOut, // Set check-out date
        bookingId: newBooking._id,
        cleaning: null, // Remove cleaning info
        lastCleaned: null, // Remove last cleaned date
      },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room update failed" });
    }

    // Update Guest's Status to "Current Guest"
    const updatedGuest = await Guest.findByIdAndUpdate(
      guestId,
      { status: "Current Guest" },
      { new: true }
    );

    if (!updatedGuest) {
      return res.status(404).json({ message: "Guest update failed" });
    }
    res.status(201).json(newBooking);

    // Fetch all inventory items
    const inventoryItems = await AdminInventory.find();
    if (inventoryItems.length === 0) {
      return res.status(400).json({ message: "Inventory items not found" });
    }

    // Decrement stock for each inventory item
    for (const item of inventoryItems) {
      if (item.stock > 0) {
        await AdminInventory.findByIdAndUpdate(item._id, {
          $inc: { stock: -1 },
        });
      }
    }
  } catch (error) {
    console.error("❌ Error Creating Booking:", error);
    res.status(500).json({ message: "Failed to create booking", error });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 5, status, sort } = req.query;
    const filter = {};

    // Optional status filter
    if (status) {
      filter.status = status;
    }

    const sortOrder = sort === "desc" ? -1 : sort === "asc" ? 1 : null;

    // ✅ Define query properly before executing
    let query = Booking.find(filter)
      .populate("guest", "name") // Fetch guest name only
      .populate({
        path: "room",
        select: "number type",
        populate: { path: "type", select: "name" }, // Fetch room type name
      });

    // ✅ Apply sorting before executing the query
    if (sortOrder !== null) {
      query = query.sort({ createdAt: sortOrder });
    }

    // ✅ Apply pagination AFTER sorting
    const bookings = await query
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // Count total matching bookings
    const totalItems = await Booking.countDocuments(filter);

    res.json({
      results: bookings,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("❌ Error Fetching Bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};

// 🟢 Get a single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("guest")
      .populate("room");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("❌ Error Fetching Booking:", error);
    res.status(500).json({ message: "Failed to fetch booking", error });
  }
};

// 🟢 Update a booking
export const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("guest")
      .populate("room");

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error("❌ Error Updating Booking:", error);
    res.status(500).json({ message: "Failed to update booking", error });
  }
};

// 🟢 Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("❌ Error Deleting Booking:", error);
    res.status(500).json({ message: "Failed to delete booking", error });
  }
};

export const checkOut = async (req, res) => {
  try {
    console.log("Received booking ID:", req.params.id);
    const bookingId = new mongoose.Types.ObjectId(req.params.id);

    // Fetch the booking details
    const booking = await Booking.findById(bookingId)
      .populate("guest")
      .populate("room");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Fetch the billing details to check payment status
    const bill = await Billing.findOne({ bookingId });
    if (!bill) {
      return res.status(404).json({ message: "Billing record not found." });
    }

    // Ensure payment is completed before allowing checkout
    if (bill.paymentStatus !== "paid") {
      return res
        .status(400)
        .json({ message: "Payment must be completed before checkout." });
    }

    // Update Room status to Available
    const updatedRoom = await Room.findByIdAndUpdate(
      booking.room._id,
      {
        status: "Available",
        guest: null,
        checkOut: null,
        bookingId: null,
        cleaning: "In Progress",
      },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room update failed" });
    }

    // Update Guest status to "Past Guest"
    const updatedGuest = await Guest.findByIdAndUpdate(
      booking.guest._id,
      { status: "Past Guest" },
      { new: true }
    );

    if (!updatedGuest) {
      return res.status(404).json({ message: "Guest update failed" });
    }

    // ✅ Update Booking status to "CheckedOut"
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { bookingStatus: "CheckedOut" },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking update failed" });
    }

    res
      .status(200)
      .json({ message: `Checkout successful for Booking ID: ${bookingId}` });
  } catch (error) {
    console.error("❌ Checkout Error:", error);
    res.status(500).json({ message: "Failed to checkout", error });
  }
};
