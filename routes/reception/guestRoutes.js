import express from "express";
import { getGuests, createGuest, updateGuest, deleteGuest } from "../../controllers/reception/guestController.js";

const router = express.Router();

router.get("/api/guests", getGuests);
router.post("/api/guests", createGuest);
router.put("/api/guests/:id", updateGuest);
router.delete("/api/guests/:id", deleteGuest);

export default router;
