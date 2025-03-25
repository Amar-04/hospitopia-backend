import ServiceRequest from "../../models/reception/ServiceRequest.js";
import Room from "../../models/admin/Room.js";
import Service from "../../models/reception/Service.js";

/**
 * @desc Get all service requests with filtering & pagination
 * @route GET /api/service-requests
 */
export const getServiceRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const serviceRequests = await ServiceRequest.find()
      .populate({ path: "room", select: "number" })
      .populate({ path: "bookingId", select: "_id" })
      .populate({ path: "services", select: "serviceType serviceName price" }) 
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalRequests = await ServiceRequest.countDocuments();

    res.json({
      totalRequests,
      currentPage: Number(page),
      totalPages: Math.ceil(totalRequests / limit),
      serviceRequests,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc Create a new service request
 * @route POST /api/service-requests
 */
export const createServiceRequest = async (req, res) => {
  try {
    const { room, services } = req.body;

    // Validate Room existence
    const existingRoom = await Room.findById(room);
    if (!existingRoom) {
      return res.status(400).json({ error: "Invalid room ID" });
    }

    // Ensure the room has an active booking
    if (!existingRoom.bookingId) {
      return res.status(400).json({ error: "No active booking found for this room" });
    }

    // Validate Services existence
    const existingServices = await Service.find({ _id: { $in: services } });
    if (existingServices.length !== services.length) {
      return res.status(400).json({ error: "One or more services are invalid" });
    }

    const totalPrice = existingServices.reduce((sum, service) => sum + service.price, 0);

    // Find the last service request and increment requestId
    const lastRequest = await ServiceRequest.findOne().sort({ requestId: -1 });
    const newRequestId = lastRequest ? lastRequest.requestId + 1 : 2001; // Start from 2001

    const newRequest = new ServiceRequest({
      requestId: newRequestId,
      room: existingRoom._id,
      bookingId: existingRoom.bookingId,
      services: existingServices.map(service => service._id),
      price: totalPrice,
    });

    await newRequest.save();

    // Populate response before sending it back
    const populatedRequest = await newRequest.populate([
      { path: "room", select: "number" },
      { path: "bookingId", select: "_id" },
      { path: "services", select: "name price" },
    ]);

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error("❌ Error Creating Service Request:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc Delete a service request
 * @route DELETE /api/service-requests/:id
 */
export const deleteServiceRequest = async (req, res) => {
  try {
    const deletedRequest = await ServiceRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) return res.status(404).json({ error: "Service request not found" });

    res.json({ message: "Service request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
