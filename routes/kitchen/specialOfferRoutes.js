// routes/kitchen/specialOfferRoutes.js
import express from "express";
import {
  getSpecialOffers,
  getSpecialOfferById,
  createSpecialOffer,
  updateSpecialOffer,
  deleteSpecialOffer
} from "../../controllers/kitchen/specialOfferController.js";

const router = express.Router();

// GET all special offers (with pagination & filtering)
router.get("/api/kitchen/special-offers", getSpecialOffers);

// GET a single special offer by ID
router.get("/api/kitchen/special-offers/:id", getSpecialOfferById);

// POST a new special offer
router.post("/api/kitchen/special-offers", createSpecialOffer);

// PUT update special offer by ID
router.put("/api/kitchen/special-offers/:id", updateSpecialOffer);

// DELETE special offer by ID
router.delete("/api/kitchen/special-offers/:id", deleteSpecialOffer);

export default router;