import express from "express";
import { generateBill, getBill } from "../../controllers/reception/billingController.js";

const router = express.Router();

router.post("/api/billing/:bookingId", generateBill);
router.get("/api/billing/:bookingId", getBill);

export default router;
