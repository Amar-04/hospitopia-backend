import Billing from "../../models/reception/Billing.js";
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
                    "", "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
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
      let startDate;
  
      if (filter === "week") {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
      } else {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
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
              $dateToString: { format: "%Y-%m-%d", date: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: "$_id.day" } } },
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
  