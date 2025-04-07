// controllers/inventoryOrderController.js

import InventoryOrder from "../../models/admin/InventoryOrder.js";
import AdminInventory from "../../models/admin/Inventory.js";

export const createInventoryOrder = async (req, res) => {
  try {
    const { date, items, totalBill } = req.body;

    // Validation
    if (!date || !items || !items.length || !totalBill) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Populate item name from Inventory model
    const populatedItems = await Promise.all(
      items.map(async ({ itemId, quantity }) => {
        const inventoryItem = await AdminInventory.findById(itemId);
        return {
          itemId,
          name: inventoryItem?.name || "Unknown Item",
          quantity,
        };
      })
    );

    const newOrder = await InventoryOrder.create({
      date,
      items: populatedItems,
      totalBill,
      status: "pending",
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating inventory order:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getAllInventoryOrders = async (req, res) => {
  try {
    const orders = await InventoryOrder.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching inventory orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateInventoryOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // "received" or "cancelled"

    if (!["received", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await InventoryOrder.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // If received, update stock
    if (status === "received") {
      for (const item of order.items) {
        const inventoryItem = await AdminInventory.findById(item.itemId);
        if (inventoryItem) {
          inventoryItem.stock += item.quantity;
          await inventoryItem.save();
        }
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: `Order marked as ${status}`, order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
