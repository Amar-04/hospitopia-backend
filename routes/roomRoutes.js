import express from "express";
import { getRooms, createRoom, updateRoom, deleteRoom } from "../controllers/roomController.js";

const router = express.Router();

router.get("/api/rooms", getRooms);
router.post("/api/rooms", createRoom);
router.put("/api/rooms/:id", updateRoom);
router.delete("/api/rooms/:id", deleteRoom);

export default router;
