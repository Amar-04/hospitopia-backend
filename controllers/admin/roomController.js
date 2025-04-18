import Room from "../../models/admin/Room.js";
import RoomType from "../../models/admin/RoomType.js";
import mongoose from "mongoose";

// Get all rooms with pagination & filtering
export const getRooms = async (req, res) => {
  try {
    const { page = 1, limit = 5, status, type } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    // Fetch rooms with pagination
    // Fetch rooms with room type details
    const rooms = await Room.find(filter)
      .populate("type") // Fetch RoomType details
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalRooms = await Room.countDocuments(filter);

    res.json({
      results: rooms,
      totalPages: Math.ceil(totalRooms / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("❌ Error Fetching Rooms:", error);
    res.status(500).json({ message: "Failed to fetch rooms", error });
  }
};

// Add new room
export const createRoom = async (req, res) => {
  console.log("📥 Received Room Data:", req.body);

  try {
    const { type, checkOut, lastCleaned, arrival, ...rest } = req.body;

    // ✅ Validate Room Type
    const roomType = await RoomType.findById(type);
    console.log("✅ Found Room Type:", roomType);

    if (!roomType) {
      return res.status(400).json({ message: "Invalid Room Type" });
    }

    // ✅ Attempt to create the room
    const newRoom = await Room.create({
      ...rest,
      type: roomType._id, // Assign RoomType ID
      price: roomType.price,
      checkOut: checkOut ? new Date(checkOut) : null,
      lastCleaned: lastCleaned ? new Date(lastCleaned) : null,
      arrival: arrival ? new Date(arrival) : null,
    });

    res.status(201).json(newRoom);
  } catch (error) {
    console.error("❌ Mongoose Validation Error:", error); // ✅ Log full error
    res
      .status(400)
      .json({ message: "Failed to add room", error: error.message });
  }
};

// Update room details
export const updateRoom = async (req, res) => {
  try {
    const { checkOut, lastCleaned, arrival, ...rest } = req.body;

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        ...rest,
        checkOut: checkOut ? new Date(checkOut) : null,
        lastCleaned: lastCleaned ? new Date(lastCleaned) : null,
        arrival: arrival ? new Date(arrival) : null,
      },
      { new: true }
    );

    if (!updatedRoom)
      return res.status(404).json({ message: "Room not found" });

    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: "Failed to update room", error });
  }
};

// Update room cleaning or maintenance status
export const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status, cleaning, issue, eta } = req.body;

    if (!["Cleaning", "Maintenance", "Available"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    let updateData = { status };

    if (status === "Cleaning" && cleaning) {
      updateData.cleaning = cleaning;
      updateData.issue = null;
      updateData.eta = null;
    } else if (status === "Maintenance") {
      updateData.issue = issue || "";
      updateData.eta = eta || "";
      updateData.cleaning = null;
      updateData.lastCleaned = null;
    } else if (status === "Available") {
      updateData.cleaning = "Completed"; // Mark cleaning as completed
      updateData.lastCleaned = new Date(); // Set last cleaned timestamp
      updateData.issue = null; // Remove previous issue
      updateData.eta = null; // Remove previous ETA
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(updatedRoom);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete room
export const deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom)
      return res.status(404).json({ message: "Room not found" });

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete room", error });
  }
};

export const getOccupancyData = async (req, res) => {
  try {
    // Get all rooms with their status
    const rooms = await Room.find({}, "number status");

    // Get total rooms count
    const totalRooms = rooms.length;

    // Get occupied and available rooms count
    const occupiedRooms = rooms.filter(
      (room) => room.status === "Occupied"
    ).length;
    const availableRooms = rooms.filter(
      (room) => room.status === "Available"
    ).length;

    // Get occupancy per room type with type name instead of ObjectId
    const roomTypeOccupancy = await Room.aggregate([
      {
        $match: { status: "Occupied" },
      },
      {
        $lookup: {
          from: "roomtypes", // Ensure this matches your collection name
          localField: "type",
          foreignField: "_id",
          as: "roomTypeInfo",
        },
      },
      {
        $unwind: "$roomTypeInfo", // Convert array to object
      },
      {
        $group: {
          _id: "$roomTypeInfo.name", // Use room type name instead of ObjectId
          occupiedCount: { $sum: 1 },
        },
      },
    ]);

    // Get previous month's occupancy for comparison
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const prevOccupiedRooms = await Room.countDocuments({
      status: "Occupied",
      updatedAt: {
        $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
      },
    });

    const occupancyPercentage =
      totalRooms > 0
        ? Number(((occupiedRooms / totalRooms) * 100).toFixed(1))
        : 0;
    const prevOccupancyPercentage =
      totalRooms > 0
        ? Number(((prevOccupiedRooms / totalRooms) * 100).toFixed(1))
        : 0;

    const percentageChange =
      prevOccupancyPercentage > 0
        ? (
            ((occupancyPercentage - prevOccupancyPercentage) /
              prevOccupancyPercentage) *
            100
          ).toFixed(1)
        : 0;

    res.status(200).json({
      totalRooms,
      occupiedRooms,
      availableRooms,
      occupancyPercentage,
      prevOccupancyPercentage,
      percentageChange,
      roomTypeOccupancy,
      rooms
    });
  } catch (error) {
    console.error("Error fetching occupancy data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
