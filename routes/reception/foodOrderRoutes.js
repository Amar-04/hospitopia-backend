import express from "express";
import {
  getFoodOrders,
  createFoodOrder,
  updateFoodOrderStatus,
  deleteFoodOrder,
} from "../../controllers/reception/foodOrderController.js";

const router = express.Router();

router.get("/api/food-orders", getFoodOrders);

router.post("/api/food-orders", createFoodOrder);

router.put("/api/food-orders/:id", updateFoodOrderStatus);

router.delete("/api/food-orders/:id", deleteFoodOrder);

export default router;
