import Room from "../../models/admin/Room.js";

// Get all rooms with pagination & filtering
export const getRooms = async (req, res) => {
  try {
    const { page = 1, limit = 5, status, type } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    console.log("🔍 Applied Filters:", filter);

    // Fetch rooms with pagination
    const rooms = await Room.find(filter)
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
  try {
    const { checkOut, lastCleaned, arrival, ...rest } = req.body;

    const newRoom = await Room.create({
      ...rest,
      checkOut: checkOut ? new Date(checkOut) : null,
      lastCleaned: lastCleaned ? new Date(lastCleaned) : null,
      arrival: arrival ? new Date(arrival) : null,
    });

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ message: "Failed to add room", error });
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
