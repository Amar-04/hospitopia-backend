import Billing from "../../models/reception/Billing.js";
import Expense from "../../models/admin/Expense.js";
import mongoose from "mongoose";

export const monthlyRevenueReport = async (req, res) => {
  try {
    // Ensure MongoDB is connected before running the query
    if (mongoose.connection.readyState !== 1) {
      console.log("❌ Database is not connected!");
      return res.status(500).json({ error: "Database not connected" });
    }

    const monthlyRevenueReport = await Billing.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          paymentDate: { $ne: null },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$paymentDate" },
            month: { $month: "$paymentDate" },
          },
          roomRevenue: { $sum: "$room.totalRoomPrice" },
          foodRevenue: { $sum: "$totalFoodCost" },
          servicesRevenue: { $sum: "$totalServiceCost" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: {
            $let: {
              vars: {
                months: [
                  "",
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ],
              },
              in: { $arrayElemAt: ["$$months", "$_id.month"] },
            },
          },
          roomRevenue: 1,
          foodRevenue: 1,
          servicesRevenue: 1,
        },
      },
    ]);

    res.status(200).json(monthlyRevenueReport);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const dailyRevenueReport = async (req, res) => {
  try {
    const { filter } = req.query; // "week" or "month"

    // Get current date and calculate range
    const today = new Date();
    let startDate, endDate;

    if (filter === "week") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      endDate = today;
    } else if (filter === "month") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1); // First day of current month
      endDate = today;
    } else if (filter === "prev-month") {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // First day of last month
      startDate = lastMonth;
      endDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of last month
    } else {
      return res.status(400).json({ error: "Invalid filter" });
    }

    const dailyReport = await Billing.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          paymentDate: { $gte: startDate, $lte: today },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$paymentDate" },
            month: { $month: "$paymentDate" },
            day: { $dayOfMonth: "$paymentDate" },
          },
          roomRevenue: { $sum: "$room.totalRoomPrice" },
          foodRevenue: { $sum: "$totalFoodCost" },
          servicesRevenue: { $sum: "$totalServiceCost" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
          roomRevenue: 1,
          foodRevenue: 1,
          servicesRevenue: 1,
        },
      },
    ]);

    res.status(200).json(dailyReport);
  } catch (error) {
    console.error("Error fetching daily revenue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const monthlyExpenseReport = async (req, res) => {
  try {
    const monthlyExpense = await Expense.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            category: "$category",
          },
          categoryAmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
          },
          totalExpense: { $sum: "$categoryAmount" },
          categories: {
            $push: {
              k: "$_id.category",
              v: "$categoryAmount",
            },
          },
        },
      },
      {
        $addFields: {
          categories: {
            $arrayToObject: "$categories",
          },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: {
            $let: {
              vars: {
                months: [
                  "",
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ],
              },
              in: { $arrayElemAt: ["$$months", "$_id.month"] },
            },
          },
          totalAmount: "$totalExpense",
          categories: 1,
        },
      },
    ]);

    res.status(200).json(monthlyExpense);
  } catch (error) {
    console.error("Error generating monthly expense report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const dailyExpenseReport = async (req, res) => {
  try {
    const { range } = req.query; // "week", "month", or "prev-month"

    const today = new Date();
    let startDate, endDate;

    if (range === "week") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      endDate = today;
    } else if (range === "month") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = today;
    } else if (range === "prev-month") {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      startDate = lastMonth;
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
    } else {
      return res.status(400).json({ error: "Invalid range" });
    }

    const expenses = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);

    const total = expenses.length > 0 ? expenses[0].totalExpense : 0;

    res.status(200).json({ totalExpense: total });
  } catch (error) {
    console.error("Error fetching expense report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
