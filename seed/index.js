import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js"; // Ensure your DB config is correctly set up
import User from "../models/admin/User.js"; // Adjust the path based on your project structure

dotenv.config();

const assignShiftTimings = () => {
  // Define predefined shifts
  const shifts = [
    { shiftStart: "08:00", shiftEnd: "16:00" }, // Morning shift
    { shiftStart: "16:00", shiftEnd: "00:00" }, // Evening shift
    { shiftStart: "00:00", shiftEnd: "08:00" }, // Night shift
  ];

  // Randomly select a shift
  return shifts[Math.floor(Math.random() * shifts.length)];
};

const updateUsersWithShifts = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("✅ Connected to Database");

    // Fetch all users
    const users = await User.find();
    console.log(`🔍 Found ${users.length} users`);

    // Iterate over each user and assign shift timings
    for (const user of users) {
      const { shiftStart, shiftEnd } = assignShiftTimings();

      // Update user document
      await User.findByIdAndUpdate(
        user._id,
        { shiftStart, shiftEnd },
        { new: true }
      );

      console.log(
        `✅ Updated ${user.name} (${user.email}) with Shift: ${shiftStart} - ${shiftEnd}`
      );
    }

    console.log("🎉 All users updated successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error updating users:", error);
    mongoose.connection.close();
  }
};

const removeStatusField = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("✅ Connected to Database");

    // Update all user documents and remove the "status" field
    const result = await User.updateMany({}, { $unset: { status: 1 } });

    console.log(`✅ Removed "status" from ${result.modifiedCount} users`);

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error updating users:", error);
    mongoose.connection.close();
  }
};

// Run the script
removeStatusField();

// Run the script
// updateUsersWithShifts();
