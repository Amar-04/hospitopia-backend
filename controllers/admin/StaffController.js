import Staff from "../../models/admin/Staff.js";

// @desc    Get all staff members with pagination & filtering
// @route   GET /api/staff
// @access  Public
export const getStaff = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role, status, shift } = req.query;

    const filter = {};
    if (search) {
      filter.name = search; 
    }
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (shift) filter.shift = shift;

    console.log("🔍 Applied Filters:", filter); // Debugging filters

    const staff = await Staff.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalStaff = await Staff.countDocuments(filter);

    console.log("✅ Found Staff Members:", staff.length); // Debugging count

    res.status(200).json({
      results: staff,
      totalPages: Math.ceil(totalStaff / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("❌ Error Fetching Staff:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
};

// @desc    Create a new staff member
// @route   POST /api/staff
// @access  Public 
export const createStaff = async (req, res) => {
  try {
    const { name, email, role, shift, status } = req.body;

    // Check if email already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const newStaff = new Staff({
      name,
      email,
      role,
      shift,
      status,
    });

    await newStaff.save();
    res
      .status(201)
      .json({ message: "Staff member created successfully", staff: newStaff });
  } catch (error) {
    res.status(500).json({ error: "Failed to create staff member" });
  }
};

// @desc    Update a staff member by ID
// @route   PUT /api/staff/:id
// @access  Public
export const updateStaff = async (req, res) => {
  try {
    const { name, email, role, shift, status } = req.body;
    const staffId = req.params.id;

    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      { name, email, role, shift, status },
      { new: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res
      .status(200)
      .json({ message: "Staff member updated successfully", staff: updatedStaff });
  } catch (error) {
    res.status(500).json({ error: "Failed to update staff member" });
  }
};

// @desc    Delete a staff member by ID
// @route   DELETE /api/staff/:id
// @access  Public
export const deleteStaff = async (req, res) => {
  try {
    const staffId = req.params.id;

    const deletedStaff = await Staff.findByIdAndDelete(staffId);
    if (!deletedStaff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.status(200).json({ message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete staff member" });
  }
};
