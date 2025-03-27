import express from "express";
import { getRooms, createRoom, updateRoom, deleteRoom, updateRoomStatus, getOccupancyData } from "../../controllers/admin/roomController.js";

const router = express.Router();

router.get("/api/rooms", getRooms);
router.post("/api/rooms", createRoom);
router.put("/api/rooms/:id", updateRoom);
router.patch("/api/rooms/:id", updateRoomStatus);
router.delete("/api/rooms/:id", deleteRoom);
router.get("/api/rooms/occupancy", getOccupancyData);

export default router;
