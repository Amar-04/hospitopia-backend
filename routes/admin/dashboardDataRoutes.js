import {
  monthlyRevenueReport,
  dailyRevenueReport,
  monthlyExpenseReport,
  dailyExpenseReport,
} from "../../controllers/admin/dashboardDataController.js";
import express from "express";

const router = express.Router();

router.get("/api/dashboard-data/monthly-revenue", monthlyRevenueReport);
router.get("/api/dashboard-data/daily-revenue", dailyRevenueReport);
router.get("/api/dashboard-data/monthly-expense", monthlyExpenseReport);
router.get("/api/dashboard-data/daily-expense", dailyExpenseReport);

export default router;
