import express from "express";
import {
  createInventoryOrder,
  getAllInventoryOrders,
  updateInventoryOrderStatus
} from "../../controllers/admin/inventoryOrderController.js";

const router = express.Router();

router.post("/api/inventory-orders", createInventoryOrder);
router.get("/api/inventory-orders", getAllInventoryOrders);
router.patch("/api/inventory-orders/:orderId",updateInventoryOrderStatus );

export default router;
