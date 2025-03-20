import express from "express";
import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../controllers/admin/StaffController.js";

const router = express.Router();

// GET all staff members (with pagination & filtering)
router.get("/api/staff", getStaff);

// POST a new staff member
router.post("/api/staff", createStaff);

// PUT update staff member by ID
router.put("/api/staff/:id", updateStaff);

// DELETE staff member by ID
router.delete("/api/staff/:id", deleteStaff);

export default router;
