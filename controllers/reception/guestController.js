  import Guest from "../../models/reception/Customers.js";

  // @desc    Get all guests with pagination & filtering
  // @route   GET /api/guests
  // @access  Public
  export const getGuests = async (req, res) => {
    console.log("🚀 getGuests controller called");
    console.log("📥 Request query parameters:", req.query);
    
    try {
      const { page = 1, limit = 5, search = "", status } = req.query;
      console.log(`📊 Pagination: page=${page}, limit=${limit}`);
      console.log(`🔍 Search term: "${search}"`);
      console.log(`🏷️ Status filter: "${status}"`);

      const filter = {};
      if (search) {
        filter.name = search; // Exact match for name
        console.log(`📝 Adding name filter: ${search}`);
      }
      if (status) {
        filter.status = status;
        console.log(`📝 Adding status filter: ${status}`);
      }

      console.log("🔍 Final query filters:", JSON.stringify(filter, null, 2));

      console.log("💾 Executing database query...");
      const guests = await Guest.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit));
      console.log(`✅ Query complete, found ${guests.length} guests`);
      
      console.log("💾 Counting total documents matching filter...");
      const totalGuests = await Guest.countDocuments(filter);
      console.log(`✅ Total matching guests: ${totalGuests}`);

      const totalPages = Math.ceil(totalGuests / limit);
      console.log(`📊 Total pages calculated: ${totalPages}`);

      console.log("🔄 Preparing response payload...");
      const responsePayload = {
        results: guests,
        totalPages: totalPages,
        currentPage: Number(page),
      };
      console.log("📤 Sending response");
      
      res.status(200).json(responsePayload);
      console.log("✅ Response sent successfully");
    } catch (error) {
      console.error("❌ Error in getGuests:", error);
      console.error("❌ Error stack:", error.stack);
      console.error("❌ Sending error response");
      res.status(500).json({ error: "Failed to fetch guests" });
    }
  };

  // @desc    Create a new guest
  // @route   POST /api/guests
  // @access  Public
  export const createGuest = async (req, res) => {
    console.log("🚀 createGuest controller called");
    console.log("📥 Request body:", JSON.stringify(req.body, null, 2));
    
    try {
      const { name, email, phone, status, lastStay } = req.body;
      console.log(`📝 Extracted guest data - Name: ${name}, Email: ${email}, Status: ${status}`);

      // Check for an existing guest by email to prevent duplicates
      console.log(`🔍 Checking if email already exists: ${email}`);
      const existingGuest = await Guest.findOne({ email });
      
      if (existingGuest) {
        console.log(`⚠️ Email already exists: ${email}`);
        console.log("📤 Sending duplicate email error response");
        return res.status(400).json({ error: "Email already exists" });
      }
      console.log("✅ Email is unique, proceeding with guest creation");

      console.log("🔄 Creating new guest object");
      const newGuest = new Guest({
        name,
        email,
        phone,
        status,
        lastStay,
      });
      console.log("📝 New guest object created:", JSON.stringify(newGuest, null, 2));

      console.log("💾 Saving guest to database...");
      await newGuest.save();
      console.log(`✅ Guest saved successfully with ID: ${newGuest._id}`);

      console.log("📤 Sending success response");
      res.status(201).json({ message: "Guest created successfully", guest: newGuest });
      console.log("✅ Response sent successfully");
    } catch (error) {
      console.error("❌ Error in createGuest:", error);
      console.error("❌ Error stack:", error.stack);
      console.error("❌ Error details:", error.message);
      
      // Check for validation errors
      if (error.name === "ValidationError") {
        console.error("❌ Validation error details:", JSON.stringify(error.errors, null, 2));
      }
      
      console.error("❌ Sending error response");
      res.status(500).json({ error: "Failed to create guest" });
    }
  };

  // @desc    Update a guest by ID
  // @route   PUT /api/guests/:id
  // @access  Public
  export const updateGuest = async (req, res) => {
    console.log("🚀 updateGuest controller called");
    
    const guestId = req.params.id;
    console.log(`🔑 Guest ID to update: ${guestId}`);
    console.log("📥 Update data:", JSON.stringify(req.body, null, 2));
    
    try {
      const { name, email, phone, status, lastStay } = req.body;
      console.log(`📝 Extracted update fields - Name: ${name}, Email: ${email}, Status: ${status}`);

      console.log(`💾 Executing findByIdAndUpdate for ID: ${guestId}`);
      const updatedGuest = await Guest.findByIdAndUpdate(
        guestId,
        { name, email, phone, status, lastStay },
        { new: true, runValidators: true }
      );
      
      if (!updatedGuest) {
        console.log(`⚠️ Guest with ID ${guestId} not found`);
        console.log("📤 Sending not found error response");
        return res.status(404).json({ error: "Guest not found" });
      }
      
      console.log("✅ Guest updated successfully");
      console.log("📝 Updated guest data:", JSON.stringify(updatedGuest, null, 2));

      console.log("📤 Sending success response");
      res.status(200).json({ message: "Guest updated successfully", guest: updatedGuest });
      console.log("✅ Response sent successfully");
    } catch (error) {
      console.error("❌ Error in updateGuest:", error);
      console.error("❌ Error stack:", error.stack);
      
      // Check for specific error types
      if (error.name === "CastError") {
        console.error(`❌ Invalid ID format: ${guestId}`);
        return res.status(400).json({ error: "Invalid guest ID format" });
      }
      
      if (error.name === "ValidationError") {
        console.error("❌ Validation error details:", JSON.stringify(error.errors, null, 2));
      }
      
      console.error("❌ Sending error response");
      res.status(500).json({ error: "Failed to update guest" });
    }
  };

  // @desc    Delete a guest by ID
  // @route   DELETE /api/guests/:id
  // @access  Public
  export const deleteGuest = async (req, res) => {
    console.log("🚀 deleteGuest controller called");
    
    const guestId = req.params.id;
    console.log(`🔑 Guest ID to delete: ${guestId}`);
    
    try {
      console.log(`💾 Executing findByIdAndDelete for ID: ${guestId}`);
      const deletedGuest = await Guest.findByIdAndDelete(guestId);
      
      if (!deletedGuest) {
        console.log(`⚠️ Guest with ID ${guestId} not found`);
        console.log("📤 Sending not found error response");
        return res.status(404).json({ error: "Guest not found" });
      }
      
      console.log("✅ Guest deleted successfully");
      console.log("📝 Deleted guest data:", JSON.stringify(deletedGuest, null, 2));

      console.log("📤 Sending success response");
      res.status(200).json({ 
        message: "Guest deleted successfully",
        deletedGuestId: guestId 
      });
      console.log("✅ Response sent successfully");
    } catch (error) {
      console.error("❌ Error in deleteGuest:", error);
      console.error("❌ Error stack:", error.stack);
      
      // Check for cast error (invalid ID format)
      if (error.name === "CastError") {
        console.error(`❌ Invalid ID format: ${guestId}`);
        return res.status(400).json({ error: "Invalid guest ID format" });
      }
      
      console.error("❌ Sending error response");
      res.status(500).json({ error: "Failed to delete guest" });
    }
  };