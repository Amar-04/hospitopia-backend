import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  checkOut,
} from "../../controllers/reception/bookingController.js";

const router = express.Router();

router.post("/api/bookings", createBooking); 
router.get("/api/bookings", getAllBookings); 
router.get("/api/bookings/:id", getBookingById); 
router.put("/api/bookings/:id", updateBooking); 
router.delete("/api/bookings/:id", deleteBooking); 
router.patch("/api/bookings/:id/checkout", checkOut);

export default router;
