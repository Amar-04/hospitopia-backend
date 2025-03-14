import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/admin/userController.js";

const router = express.Router();

// GET all users (with pagination & filtering)
router.get("/api/users", getUsers);

// POST a new user
router.post("/api/users", createUser);

// PUT update user by ID
router.put("/api/users/:id", updateUser);

// DELETE user by ID
router.delete("/api/users/:id", deleteUser);

export default router;
 