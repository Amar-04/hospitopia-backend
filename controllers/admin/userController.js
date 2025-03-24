import User from "../../models/admin/User.js";

// Helper function to determine user status
const isActive = (shiftStart, shiftEnd) => {
  if (!shiftStart || !shiftEnd) return false;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const startMinutes = parseTime(shiftStart);
  let endMinutes = parseTime(shiftEnd);

  // Handle shifts that end at midnight
  if (endMinutes === 0) {
    endMinutes = 24 * 60;
  }

  // If shiftStart < shiftEnd (normal case)
  if (startMinutes < endMinutes) {
    return currentTime >= startMinutes && currentTime < endMinutes;
  }

  // If shift crosses midnight (e.g., `22:00 - 06:00`)
  return currentTime >= startMinutes || currentTime < endMinutes;
};


const getLastActive = (shiftEnd) => {
  if (!shiftEnd) return null;

  const now = new Date();
  const [hours, minutes] = shiftEnd.split(":").map(Number);

  let lastActive = new Date();
  lastActive.setHours(hours, minutes, 0, 0);

  if (lastActive > now) {
    lastActive.setDate(lastActive.getDate() - 1);
  }

  return lastActive;
};

// @desc    Get all users with pagination & filtering
// @route   GET /api/users
// @access  Public
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role, statusFilter } = req.query;

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (role) filter.role = role;

    // Step 1: Fetch all users matching the search/role filters (before pagination)
    let allUsers = await User.find(filter);

    // Step 2: Compute the status for all users
    allUsers = allUsers.map((user) => ({
      ...user.toObject(),
      status: isActive(user.shiftStart, user.shiftEnd) ? "Active" : "Away",
      lastActive: getLastActive(user.shiftEnd),
    }));

    // Step 3: Apply status filter if provided
    if (statusFilter) {
      allUsers = allUsers.filter((user) => user.status === statusFilter);
    }

    // Step 4: Get total count AFTER filtering for correct pagination
    const totalUsers = allUsers.length;

    // Step 5: Apply pagination to filtered users
    const paginatedUsers = allUsers.slice((page - 1) * limit, page * limit);

    // Step 6: Return paginated results
    res.status(200).json({
      results: paginatedUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("❌ Error Fetching Users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
export const createUser = async (req, res) => {
  try {
    const { name, email, role, shiftStart, shiftEnd } = req.body;

    if (!name || !email || !role || !shiftStart || !shiftEnd) {
      console.error("Missing required fields:", {
        name,
        email,
        role,
        shiftStart,
        shiftEnd,
      });
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("Email already exists:", email);
      return res.status(400).json({ error: "Email already exists" });
    }

    // Validate shiftStart and shiftEnd format (HH:mm)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(shiftStart) || !timeRegex.test(shiftEnd)) {
      console.error("Invalid time format:", { shiftStart, shiftEnd });
      return res
        .status(400)
        .json({ error: "Invalid time format (HH:mm required)" });
    }

    const newUser = new User({
      name,
      email,
      role,
      shiftStart,
      shiftEnd,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// @desc    Update a user by ID
// @route   PUT /api/users/:id
// @access  Public
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, shiftStart, shiftEnd } = req.body;
    const userId = req.params.id;

    // Validate shiftStart and shiftEnd if provided
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (
      (shiftStart && !timeRegex.test(shiftStart)) ||
      (shiftEnd && !timeRegex.test(shiftEnd))
    ) {
      return res
        .status(400)
        .json({ error: "Invalid time format (HH:mm required)" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role, shiftStart, shiftEnd },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// @desc    Delete a user by ID
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
