import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/admin/userRoutes.js";
import guestRoutes from './routes/reception/guestRoutes.js'
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/", userRoutes);
app.use("/", guestRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
