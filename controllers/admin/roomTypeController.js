import RoomType from "../../models/admin/RoomType.js";

// ✅ Get all room types
export const getRoomTypes = async (req, res) => {
  try {
    const roomTypes = await RoomType.find();
    res.json(roomTypes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch room types", error });
  }
};

// ✅ Create a new room type
export const createRoomType = async (req, res) => {
  try {
    const { name, price } = req.body;

    // Check if room type already exists
    const existingType = await RoomType.findOne({ name });
    if (existingType) {
      return res.status(400).json({ message: "Room type already exists" });
    }

    const newRoomType = await RoomType.create({ name, price });
    res.status(201).json(newRoomType);
  } catch (error) {
    res.status(400).json({ message: "Failed to create room type", error });
  }
};

// ✅ Update a room type
export const updateRoomType = async (req, res) => {
  try {
    const { name, price } = req.body;

    const updatedType = await RoomType.findByIdAndUpdate(
      req.params.id,
      { name, price },
      { new: true }
    );

    if (!updatedType) return res.status(404).json({ message: "Room type not found" });

    res.json(updatedType);
  } catch (error) {
    res.status(400).json({ message: "Failed to update room type", error });
  }
};

// ✅ Delete a room type
export const deleteRoomType = async (req, res) => {
  try {
    const deletedType = await RoomType.findByIdAndDelete(req.params.id);
    if (!deletedType)
      return res.status(404).json({ message: "Room type not found" });

    res.json({ message: "Room type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete room type", error });
  }
};
