import Booking from "../../models/reception/Booking.js";
import Room from "../../models/admin/Room.js";
import Guest from "../../models/reception/Guest.js";

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
      roomPlan,
      extras,
      guestComment,
      subtotal,
      discount,
      taxes,
      totalAmount,
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
    const room = await Room.findById(roomId);
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
      roomPlan,
      extras,
      guestComment,
      subtotal: subtotal || 0, // Default to 0 if not provided
      discount: discount || 0,
      taxes: taxes || 0,
      totalAmount: totalAmount || 0,
    });

    await newBooking.save();

    // Update the Room's Status
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      {
        status: "Occupied", // Change status to "Occupied"
        guest: guest.name, // Set guest name in room
        checkOut: checkOut, // Set check-out date
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
  } catch (error) {
    console.error("❌ Error Creating Booking:", error);
    res.status(500).json({ message: "Failed to create booking", error });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 5, status } = req.query;
    const filter = {};

    // Optional status filter
    if (status) {
      filter.status = status;
    }

    // Fetch bookings with pagination
    const bookings = await Booking.find(filter)
      .populate("guest", "name") // Only fetch name
      .populate("room", "number type") // Only fetch number & type
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
