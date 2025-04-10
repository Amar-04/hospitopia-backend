import Expense from "../../models/admin/Expense.js";

// Create a new expense
export const createExpense = async (req, res) => {
  try {
    const { date, category, description, amount } = req.body;

    const newExpense = new Expense({ date, category, description, amount });
    await newExpense.save();

    res.status(201).json(newExpense);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create expense", details: error.message });
  }
};

// Get all expenses with pagination
export const getAllExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 5, category } = req.query;

    const filter = {};
    if (category) filter.category = category;

    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalExpenses = await Expense.countDocuments(filter);

    res.json({
      results: expenses,
      totalPages: Math.ceil(totalExpenses / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("❌ Error Fetching Expenses:", error);
    res.status(500).json({ message: "Failed to fetch expenses", error });
  }
};

// Update an expense
export const updateExpense = async (req, res) => {
  try {
    const { date, category, description, amount } = req.body;

    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      { date, category, description, amount },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update expense", details: error.message });
  }
};
