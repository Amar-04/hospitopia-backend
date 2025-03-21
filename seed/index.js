import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";  // Assuming you have a connectDB function
import RoomType from "../models/admin/RoomType.js";  // Import RoomType model

dotenv.config();

const updateRoomTypes = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log("✅ Connected to Database");

    // Define the updated roomType data
    const roomTypesData = [
      {
        name: "Standard",
        price: 100,
        maxGuests: {
          adults: 2,
          children: 1
        },
        extraCost: {
          adult: 25,
          child: 15
        }
      },
      {
        name: "Deluxe",
        price: 200,
        maxGuests: {
          adults: 3,
          children: 1
        },
        extraCost: {
          adult: 30,
          child: 20
        }
      },
      {
        name: "Suite",
        price: 300,
        maxGuests: {
          adults: 4,
          children: 2
        },
        extraCost: {
          adult: 40,
          child: 25
        }
      }
    ];

    // Update the existing documents without adding new ones
    for (const roomType of roomTypesData) {
      const result = await RoomType.updateOne(
        { name: roomType.name },  // Match by room type name
        { $set: roomType }  // Update the fields if a matching document is found
      );

      // Check if any document was matched and updated
      if (result.matchedCount === 0) {
        console.log(`No document found to update for room type: ${roomType.name}`);
      } else {
        console.log(`Room type '${roomType.name}' updated successfully.`);
      }
    }

    console.log("✅ Room types updated successfully!");

    process.exit(); // Exit the script

  } catch (error) {
    console.error("❌ Error updating room types:", error);
    process.exit(1);
  }
};

// Call the function to update room types
updateRoomTypes();
