import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

// Import Routes
import userRoutes from "./routes/admin/userRoutes.js";
import inventoryRoutes from "./routes/admin/inventoryRoutes.js";
import roomRoutes from "./routes/admin/roomRoutes.js";
import guestRoutes from "./routes/reception/guestRoutes.js";
import bookingRoutes from "./routes/reception/bookingRoutes.js";
import kitchenInventoryRoutes from "./routes/kitchen/inventoryRoutes.js";
import menuCategoryRoutes from "./routes/kitchen/menuCategoryRoutes.js";
import menuItemRoutes from "./routes/kitchen/menuItemRoutes.js";
import foodOrderRoutes from "./routes/reception/foodOrderRoutes.js";
import staffRoutes from "./routes/admin/staffRoutes.js"
// Load Environment Variables
dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // Logs API requests

// Connect to MongoDB
connectDB();

// Routes
app.use("/", userRoutes);
app.use("/", inventoryRoutes);
app.use("/", roomRoutes);
app.use("/", staffRoutes);

app.use("/", guestRoutes);
app.use("/", bookingRoutes);
app.use("/", foodOrderRoutes);

app.use("/", kitchenInventoryRoutes);
app.use("/", menuCategoryRoutes);
app.use("/", menuItemRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
