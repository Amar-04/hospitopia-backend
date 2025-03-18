import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/admin/userRoutes.js";
import inventoryRoutes from "./routes/admin/inventoryRoutes.js";
import roomRoutes from "./routes/admin/roomRoutes.js";
import guestRoutes from "./routes/reception/guestRoutes.js";
import bookingRoutes from "./routes/reception/bookingRoutes.js";
import kitchenInventoryRoutes from "./routes/kitchen/inventoryRoutes.js";
import menuCategoryRoutes from "./routes/kitchen/menuCategoryRoutes.js";
import menuItemRoutes from "./routes/kitchen/menuItemRoutes.js";
import foodOrderRoutes from "./routes/reception/foodOrderRoutes.js"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

//Admin
app.use("/", userRoutes);
app.use("/", inventoryRoutes);
app.use("/", roomRoutes);

//Reception
app.use("/", guestRoutes);
app.use("/", bookingRoutes);
app.use("/", foodOrderRoutes);

//Kitchen
app.use("/", kitchenInventoryRoutes);
app.use("/", menuCategoryRoutes);
app.use("/", menuItemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
