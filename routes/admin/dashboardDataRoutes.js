import {
  monthlyRevenueReport,
  dailyRevenueReport,
} from "../../controllers/admin/dashboardDataController.js";
import express from "express";

const router = express.Router();

router.get("/api/dashboard-data/monthly-revenue", monthlyRevenueReport);
router.get("/api/dashboard-data/daily-revenue", dailyRevenueReport);

export default router;
