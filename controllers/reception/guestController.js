import Guest from "../../models/reception/Guest.js";

// Get guests with pagination & filtering
export const getGuests = async (req, res) => {
  try {
    const { page = 1, limit = 5, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const guests = await Guest.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalGuests = await Guest.countDocuments(filter);

    res.json({
      results: guests,
      totalPages: Math.ceil(totalGuests / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching guests:", error);
    res.status(500).json({ message: "Failed to fetch guests", error });
  }
};

// Add new guest
export const createGuest = async (req, res) => {
  try {
    const newGuest = await Guest.create(req.body);
    res.status(201).json(newGuest);
  } catch (error) {
    res.status(400).json({ message: "Failed to add guest", error });
  }
};

// Update guest details
export const updateGuest = async (req, res) => {
  try {
    const updatedGuest = await Guest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedGuest)
      return res.status(404).json({ message: "Guest not found" });

    res.json(updatedGuest);
  } catch (error) {
    res.status(400).json({ message: "Failed to update guest", error });
  }
};

// Delete guest
export const deleteGuest = async (req, res) => {
  try {
    const deletedGuest = await Guest.findByIdAndDelete(req.params.id);
    if (!deletedGuest)
      return res.status(404).json({ message: "Guest not found" });

    res.json({ message: "Guest deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete guest", error });
  }
};
