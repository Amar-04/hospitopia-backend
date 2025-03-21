import Billing from "../../models/reception/Billing.js";
import Booking from "../../models/reception/Booking.js";
import Room from "../../models/admin/Room.js";
import RoomType from "../../models/admin/RoomType.js";
import FoodOrder from "../../models/reception/FoodOrder.js";

export const generateBill = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Fetch Booking Details
    const booking = await Booking.findById(bookingId).populate("guest").populate("room");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Fetch Room Details
    const room = await Room.findById(booking.room);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Fetch Room Type Details using roomTypeId
    const roomType = await RoomType.findById(room.type);
    if (!roomType) return res.status(404).json({ message: "Room Type not found" });

    // Extract guest details
    const guest = booking.guest;
    if (!guest) return res.status(404).json({ message: "Guest not found in booking" });

    // Calculate Number of Nights
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const numNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    // Calculate Extra Guest Charges
    const extraAdults = Math.max(0, booking.numAdults - roomType.maxGuests.adults);
    const extraChildren = Math.max(0, booking.numChildren - roomType.maxGuests.children);
    const extraAdultCost = extraAdults * roomType.extraCost.adult * numNights;
    const extraChildCost = extraChildren * roomType.extraCost.child * numNights;

    // Total Room Price Calculation
    const totalRoomPrice = roomType.price * numNights + extraAdultCost + extraChildCost;

    // Fetch All Food Orders for this Booking
    const foodOrders = await FoodOrder.find({ room: room._id, bookingId });
    const totalFoodCost = foodOrders.reduce((sum, order) => sum + order.price, 0);

    // Calculate Subtotal, Taxes, and Total Amount
    const subtotal = totalRoomPrice + totalFoodCost;
    const taxAmount = subtotal * 0.05;
    const totalAmount = subtotal + taxAmount;

    // Create Bill
    const bill = new Billing({
      bookingId,
      guest: {
        guestId: guest._id,
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
      },      
      room: {
        roomId: room._id,
        roomNumber: room.number,
        roomTypeId: roomType._id, // Store only roomTypeId
        numNights,
        numAdults: booking.numAdults,
        numChildren: booking.numChildren,
        extraAdults,
        extraChildren,
        totalRoomPrice,
      },
      foodOrders: foodOrders.map((order) => ({
        orderId: order._id,
        price: order.price,
      })),
      totalFoodCost,
      subtotal,
      taxes: 5,
      totalAmount,
    });

    // Save Bill
    await bill.save();

    res.status(201).json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Bill by Booking ID
export const getBill = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const bill = await Billing.findOne({ bookingId })
      .populate("bookingId")
      .populate("guest.guestId")
      .populate("room.roomTypeId"); // Populate room type details

    if (!bill) return res.status(404).json({ message: "Bill not found" });

    res.status(200).json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
