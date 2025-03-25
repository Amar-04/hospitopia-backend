import express from "express";
import { generateBill, getBill, getAllBills, updatePaymentStatus } from "../../controllers/reception/billingController.js";

const router = express.Router();

router.post("/api/billing/:bookingId", generateBill);
router.get("/api/billing/:bookingId", getBill);
router.get("/api/billing/", getAllBills);
router.patch("/api/billing/:billId", updatePaymentStatus)

export default router;
