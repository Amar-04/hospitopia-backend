// controllers/kitchen/specialOfferController.js
import SpecialOffer from "../../models/kitchen/SpecialOffer.js";

// @desc    Get all special offers
// @route   GET /api/kitchen/special-offers
// @access  Public

export const getSpecialOffers = async (req, res) => {
  console.log("🚀 getSpecialOffers controller called");
  console.log("📥 Request query parameters:", req.query);

  try {
    const { search = "", isActive } = req.query;
    console.log(`🔍 Search term: "${search}"`);
    console.log(`🏷️ Active status filter: "${isActive}"`);

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
      console.log(`📝 Adding name filter: ${search}`);
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
      console.log(`📝 Adding isActive filter: ${isActive}`);
    }

    console.log("🔍 Final query filters:", JSON.stringify(filter, null, 2));

    console.log("💾 Executing database query...");
    const specialOffers = await SpecialOffer.find(filter)
      .sort({ name: 1 }); // Sort alphabetically by name
    console.log(`✅ Query complete, found ${specialOffers.length} special offers`);

    console.log("🔄 Preparing response payload...");
    const responsePayload = {
      results: specialOffers, // Direct array of results
    };
    console.log("📤 Sending response");

    res.status(200).json(responsePayload);
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in getSpecialOffers:", error);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to fetch special offers" });
  }
};

// @desc    Get a single special offer by ID
// @route   GET /api/kitchen/special-offers/:id
// @access  Public
export const getSpecialOfferById = async (req, res) => {
  console.log("🚀 getSpecialOfferById controller called");
  
  const offerId = req.params.id;
  console.log(`🔑 Special offer ID: ${offerId}`);
  
  try {
    console.log(`💾 Executing findById for ID: ${offerId}`);
    const specialOffer = await SpecialOffer.findById(offerId);
    
    if (!specialOffer) {
      console.log(`⚠️ Special offer with ID ${offerId} not found`);
      console.log("📤 Sending not found error response");
      return res.status(404).json({ error: "Special offer not found" });
    }
    
    console.log("✅ Special offer found");
    console.log("📝 Special offer data:", JSON.stringify(specialOffer, null, 2));

    console.log("📤 Sending success response");
    res.status(200).json(specialOffer);
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in getSpecialOfferById:", error);
    console.error("❌ Error stack:", error.stack);
    
    // Check for cast error (invalid ID format)
    if (error.name === "CastError") {
      console.error(`❌ Invalid ID format: ${offerId}`);
      return res.status(400).json({ error: "Invalid special offer ID format" });
    }
    
    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to fetch special offer" });
  }
};

// @desc    Create a new special offer
// @route   POST /api/kitchen/special-offers
// @access  Public
export const createSpecialOffer = async (req, res) => {
  console.log("🚀 createSpecialOffer controller called");
  console.log("📥 Request body:", JSON.stringify(req.body, null, 2));
  
  try {
    // Destructure required fields from schema
    const { 
      name,
      description,
      price,
      startTime,
      endTime,
      daysAvailable
    } = req.body;

    // Validate required fields
    if (!name || !description || price === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check for duplicate name
    const existingOffer = await SpecialOffer.findOne({ name });
    if (existingOffer) {
      return res.status(400).json({ 
        error: "Special offer with this name already exists" 
      });
    }

    // Create new offer object
    const newSpecialOffer = new SpecialOffer({
      name,
      description,
      price,
      startTime,
      endTime,
      daysAvailable
    });

    // Save to database
    await newSpecialOffer.save();
    res.status(201).json({ 
      message: "Special offer created successfully",
      specialOffer: newSpecialOffer 
    });

  } catch (error) {
    console.error("❌ Error details:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: "Validation failed", details: errors });
    }

    // Handle other errors
    res.status(500).json({ error: "Failed to create special offer" });
  }
};

// @desc    Update a special offer by ID
// @route   PUT /api/kitchen/special-offers/:id
// @access  Public
export const updateSpecialOffer = async (req, res) => {
  console.log("🚀 updateSpecialOffer controller called");
  
  const offerId = req.params.id;
  console.log(`🔑 Special offer ID to update: ${offerId}`);
  console.log("📥 Update data:", JSON.stringify(req.body, null, 2));
  
  try {
    const { name, description, price, isActive, startDate, endDate } = req.body;
    console.log(`📝 Extracted update fields - Name: ${name}, Price: ${price}, Active: ${isActive}`);

    console.log(`💾 Executing findByIdAndUpdate for ID: ${offerId}`);
    const updatedOffer = await SpecialOffer.findByIdAndUpdate(
      offerId,
      { name, description, price, isActive, startDate, endDate },
      { new: true, runValidators: true }
    );
    
    if (!updatedOffer) {
      console.log(`⚠️ Special offer with ID ${offerId} not found`);
      console.log("📤 Sending not found error response");
      return res.status(404).json({ error: "Special offer not found" });
    }
    
    console.log("✅ Special offer updated successfully");
    console.log("📝 Updated special offer data:", JSON.stringify(updatedOffer, null, 2));

    console.log("📤 Sending success response");
    res.status(200).json({ message: "Special offer updated successfully", specialOffer: updatedOffer });
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in updateSpecialOffer:", error);
    console.error("❌ Error stack:", error.stack);
    
    // Check for specific error types
    if (error.name === "CastError") {
      console.error(`❌ Invalid ID format: ${offerId}`);
      return res.status(400).json({ error: "Invalid special offer ID format" });
    }
    
    if (error.name === "ValidationError") {
      console.error("❌ Validation error details:", JSON.stringify(error.errors, null, 2));
    }
    
    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to update special offer" });
  }
};

// @desc    Delete a special offer by ID
// @route   DELETE /api/kitchen/special-offers/:id
// @access  Public
export const deleteSpecialOffer = async (req, res) => {
  console.log("🚀 deleteSpecialOffer controller called");
  
  const offerId = req.params.id;
  console.log(`🔑 Special offer ID to delete: ${offerId}`);
  
  try {
    console.log(`💾 Executing findByIdAndDelete for ID: ${offerId}`);
    const deletedOffer = await SpecialOffer.findByIdAndDelete(offerId);
    
    if (!deletedOffer) {
      console.log(`⚠️ Special offer with ID ${offerId} not found`);
      console.log("📤 Sending not found error response");
      return res.status(404).json({ error: "Special offer not found" });
    }
    
    console.log("✅ Special offer deleted successfully");
    console.log("📝 Deleted special offer data:", JSON.stringify(deletedOffer, null, 2));

    console.log("📤 Sending success response");
    res.status(200).json({ 
      message: "Special offer deleted successfully",
      deletedOfferId: offerId 
    });
    console.log("✅ Response sent successfully");
  } catch (error) {
    console.error("❌ Error in deleteSpecialOffer:", error);
    console.error("❌ Error stack:", error.stack);
    
    // Check for cast error (invalid ID format)
    if (error.name === "CastError") {
      console.error(`❌ Invalid ID format: ${offerId}`);
      return res.status(400).json({ error: "Invalid special offer ID format" });
    }
    
    console.error("❌ Sending error response");
    res.status(500).json({ error: "Failed to delete special offer" });
  }
};