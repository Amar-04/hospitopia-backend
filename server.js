import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/admin/userRoutes.js";
import inventoryRoutes from "./routes/admin/inventoryRoutes.js";
import roomRoutes from "./routes/admin/roomRoutes.js";
import roomTypeRoutes from "./routes/admin/roomTypeRoutes.js";
import dashboardDataRoutes from "./routes/admin/dashboardDataRoutes.js";
import guestRoutes from "./routes/reception/guestRoutes.js";
import bookingRoutes from "./routes/reception/bookingRoutes.js";
import serviceRoutes from "./routes/reception/serviceRoutes.js";
import serviceRequestRoutes from "./routes/reception/serviceRequestRoutes.js";
import billingRoutes from "./routes/reception/billingRoutes.js";
import kitchenInventoryRoutes from "./routes/kitchen/inventoryRoutes.js";
import menuCategoryRoutes from "./routes/kitchen/menuCategoryRoutes.js";
import menuItemRoutes from "./routes/kitchen/menuItemRoutes.js";
import foodOrderRoutes from "./routes/reception/foodOrderRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

//Admin
app.use("/", userRoutes);
app.use("/", inventoryRoutes);
app.use("/", roomRoutes);
app.use("/", roomTypeRoutes);
app.use("/",dashboardDataRoutes);

//Reception
app.use("/", guestRoutes);
app.use("/", bookingRoutes);
app.use("/", foodOrderRoutes);
app.use("/", serviceRoutes);
app.use("/", serviceRequestRoutes);
app.use("/", billingRoutes);

//Kitchen
app.use("/", kitchenInventoryRoutes);
app.use("/", menuCategoryRoutes);
app.use("/", menuItemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
