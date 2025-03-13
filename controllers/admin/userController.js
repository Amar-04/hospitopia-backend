import User from "../../models/admin/User.js";

// @desc    Get all users with pagination & filtering
// @route   GET /api/users
// @access  Public
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role, status } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) filter.role = role;
    if (status) filter.status = status;

    console.log("🔍 Applied Filters:", filter); // Debugging filters

    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments(filter);

    console.log("✅ Found Users:", users.length); // Debugging count

    res.status(200).json({
      results: users,
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
    const { name, email, role, status } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const newUser = new User({
      name,
      email,
      role,
      status,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// @desc    Update a user by ID
// @route   PUT /api/users/:id
// @access  Public
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role, status },
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
