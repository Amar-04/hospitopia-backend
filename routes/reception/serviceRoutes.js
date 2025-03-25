import express from "express";
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
} from "../../controllers/reception/serviceController.js";

const router = express.Router();

router.get("/api/services", getAllServices);
router.post("/api/services", createService);
router.put("/api/services/:id", updateService);
router.delete("/api/services/:id", deleteService);

export default router;
