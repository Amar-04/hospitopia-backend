import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/", userRoutes);
app.use("/", inventoryRoutes);
app.use("/", roomRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
