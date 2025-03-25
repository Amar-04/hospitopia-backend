import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/admin/userRoutes.js";
import inventoryRoutes from "./routes/admin/inventoryRoutes.js";
import roomRoutes from "./routes/admin/roomRoutes.js";
import roomTypeRoutes from "./routes/admin/roomTypeRoutes.js";
import guestRoutes from "./routes/reception/guestRoutes.js";
import bookingRoutes from "./routes/reception/bookingRoutes.js";
import billingRoutes from "./routes/reception/billingRoutes.js"
import kitchenInventoryRoutes from "./routes/kitchen/inventoryRoutes.js";
import menuCategoryRoutes from "./routes/kitchen/menuCategoryRoutes.js";
import menuItemRoutes from "./routes/kitchen/menuItemRoutes.js";
import foodOrderRoutes from "./routes/reception/foodOrderRoutes.js";
import adminCategory from "./routes/admin/adminCategoryRoutes.js";
import adminInventory from "./routes/admin/adminInventoryRoutes.js"
import staffRoutes from "./routes/admin/staffRoutes.js"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Incoming request: ${req.method} ${req.url}`);
    console.log("Request Body:", req.body);
    next();
  });
  

connectDB();

//Admin
app.use("/", userRoutes);
app.use("/", inventoryRoutes);
app.use("/", roomRoutes);
app.use("/", roomTypeRoutes);
app.use("/", adminCategory);
app.use("/", adminInventory);
app.use("/", staffRoutes);

//Reception
app.use("/", guestRoutes);
app.use("/", bookingRoutes);
app.use("/", foodOrderRoutes);
app.use("/", billingRoutes);

//Kitchen
app.use("/", kitchenInventoryRoutes);
app.use("/", menuCategoryRoutes);
app.use("/", menuItemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
