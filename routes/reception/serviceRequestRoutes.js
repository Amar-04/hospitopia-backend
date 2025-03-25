import express from "express";
import {
  getServiceRequests,
  createServiceRequest,
  deleteServiceRequest,
} from "../../controllers/reception/serviceRequestController.js";

const router = express.Router();

router.get("/api/service-request", getServiceRequests);

router.post("/api/service-request", createServiceRequest);

router.delete("/api/service-request/:id", deleteServiceRequest);

export default router;
