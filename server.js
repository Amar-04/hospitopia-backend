import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/admin/userRoutes.js";
import guestRoutes from './routes/reception/guestRoutes.js'
import menuItemRoutes from "./routes/kitchen/menuItemRoutes.js";
import menuCategoryRoutes from "./routes/kitchen/menuCategoryRoutes.js";
import specialOfferRoutes from "./routes/kitchen/specialOfferRoutes.js"
import KitcheninventoryRoutes from "./routes/kitchen/KitcheninventoryRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/", userRoutes);
app.use("/", guestRoutes);
app.use("/", menuItemRoutes);
app.use("/", menuCategoryRoutes);
app.use("/", specialOfferRoutes);
app.use("/", KitcheninventoryRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
