import express from "express";
import {
  getRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from "../../controllers/admin/roomTypeController.js";

const router = express.Router();

router.get("/api/room-types", getRoomTypes);
router.post("/api/room-types", createRoomType);
router.put("/api/room-types/:id", updateRoomType);
router.delete("/api/room-types/:id", deleteRoomType);

export default router;
