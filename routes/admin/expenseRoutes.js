import express from "express";
import {
  createExpense,
  getAllExpenses,
  updateExpense,
} from "../../controllers/admin/expenseController.js";

const router = express.Router();

router.post("/api/expenses", createExpense);

router.get("/api/expenses", getAllExpenses);

router.put("/api/expenses/:id", updateExpense);

export default router;
