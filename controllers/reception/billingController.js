import Billing from "../../models/reception/Billing.js";
import Booking from "../../models/reception/Booking.js";
import Room from "../../models/admin/Room.js";
import RoomType from "../../models/admin/RoomType.js";
import FoodOrder from "../../models/reception/FoodOrder.js";
import ServiceRequest from "../../models/reception/ServiceRequest.js";

export const generateBill = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Check if a bill already exists
    let bill = await Billing.findOne({ bookingId });

    // Fetch Booking Details
    const booking = await Booking.findById(bookingId)
      .populate("guest")
      .populate("room");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Fetch Room Details
    const room = await Room.findById(booking.room);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Fetch Room Type Details
    const roomType = await RoomType.findById(room.type);
    if (!roomType)
      return res.status(404).json({ message: "Room Type not found" });

    // Extract guest details
    const guest = booking.guest;
    if (!guest)
      return res.status(404).json({ message: "Guest not found in booking" });

    // Calculate Number of Nights
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const numNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    // Calculate Extra Guest Charges
    const extraAdults = Math.max(
      0,
      booking.numAdults - roomType.maxGuests.adults
    );
    const extraChildren = Math.max(
      0,
      booking.numChildren - roomType.maxGuests.children
    );
    const extraAdultCost = extraAdults * roomType.extraCost.adult * numNights;
    const extraChildCost = extraChildren * roomType.extraCost.child * numNights;

    // Total Room Price Calculation
    const totalRoomPrice =
      roomType.price * numNights + extraAdultCost + extraChildCost;

    // Fetch All Food Orders for this Booking
    const foodOrders = await FoodOrder.find({
      room: room._id,
      bookingId,
      receptionStatus: "Delivered",
    }).populate("items");

    const totalFoodCost = foodOrders.reduce(
      (sum, order) => sum + order.price,
      0
    );

    // Fetch All Service Requests for this Booking
    const serviceRequests = await ServiceRequest.find({
      room: room._id,
      bookingId,
    }).populate("services");

    const totalServiceCost = serviceRequests.reduce(
      (sum, request) => sum + request.price,
      0
    );

    // Calculate Subtotal, Taxes, and Total Amount
    const subtotal = totalRoomPrice + totalFoodCost + totalServiceCost;
    const taxAmount = subtotal * 0.05;
    const totalAmount = subtotal + taxAmount;

    if (bill) {
      // ✅ **Update Existing Bill**
      bill.guest = {
        guestId: guest._id,
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
      };
      bill.room = {
        roomId: room._id,
        roomNumber: room.number,
        roomTypeId: roomType._id,
        numNights,
        numAdults: booking.numAdults,
        numChildren: booking.numChildren,
        extraAdults,
        extraChildren,
        totalRoomPrice,
      };
      bill.foodOrders = foodOrders.map((order) => ({
        orderId: order._id,
        items: order.items.map((item) => ({
          itemId: item._id,
          name: item.name,
        })),
        price: order.price,
      }));
      bill.totalFoodCost = totalFoodCost;
      bill.serviceRequests = serviceRequests.map((request) => ({
        requestId: request._id,
        services: request.services.map((service) => ({
          serviceId: service._id,
          name: service.serviceName,
        })),
        price: request.price,
      }));
      bill.totalServiceCost = totalServiceCost;
      bill.subtotal = subtotal;
      bill.taxes = 5;
      bill.totalAmount = totalAmount;
      bill.updatedAt = new Date(); // Track last update time

      await bill.save();
      res.status(200).json({ message: "Bill updated successfully", bill });
    } else {
      // ✅ **Create New Bill If None Exists**
      const newBill = new Billing({
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
          roomTypeId: roomType._id,
          numNights,
          numAdults: booking.numAdults,
          numChildren: booking.numChildren,
          extraAdults,
          extraChildren,
          totalRoomPrice,
        },
        foodOrders: foodOrders.map((order) => ({
          orderId: order._id,
          items: order.items.map((item) => ({
            itemId: item._id,
            name: item.name,
          })),
          price: order.price,
        })),
        totalFoodCost,
        serviceRequests: serviceRequests.map((request) => ({
          requestId: request._id,
          services: request.services.map((service) => ({
            serviceId: service._id,
            name: service.serviceName,
          })),
          price: request.price,
        })),
        totalServiceCost,
        subtotal,
        taxes: 5,
        totalAmount,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await newBill.save();
      res
        .status(201)
        .json({ message: "Bill created successfully", bill: newBill });
    }
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

// Get all bills
export const getAllBills = async (req, res) => {
  try {
    const bills = await Billing.find()
      .populate("bookingId")
      .populate("guest.guestId")
      .populate("room.roomTypeId");

    if (!bills || bills.length === 0) {
      return res.status(404).json({ message: "No bills found" });
    }

    res.status(200).json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { billId } = req.params;
    const { paymentStatus, paymentMethod } = req.body;

    const updateFields = { paymentStatus };

    if (paymentStatus === "paid") {
      updateFields.paymentMethod = paymentMethod;
      updateFields.paymentDate = new Date(); // ✅ Store payment date
    } else {
      updateFields.paymentMethod = null;
      updateFields.paymentDate = null; // Reset if payment is changed back to pending
    }

    const updatedBill = await Billing.findByIdAndUpdate(billId, updateFields, {
      new: true,
    });

    if (!updatedBill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // ✅ Update Booking status to "Payment Completed" when payment is made
    if (paymentStatus === "paid") {
      const updatedBooking = await Booking.findOneAndUpdate(
        updatedBill.bookingId, // Find booking by bookingId
        { bookingStatus: "Payment Completed" },
        { new: true }
      );

      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
    }

    res.status(200).json(updatedBill);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
