import InventoryOrder from "../../models/admin/InventoryOrder.js";
import AdminInventory from "../../models/admin/Inventory.js";
import KitchenInventory from "../../models/kitchen/Inventory.js";
import Expense from "../../models/admin/Expense.js";

export const createInventoryOrder = async (req, res) => {
  try {
    const {
      date,
      adminInventoryItems = [],
      kitchenInventoryItems = [],
      totalBill,
    } = req.body;

    // Validation
    if (
      !date ||
      (!adminInventoryItems?.length && !kitchenInventoryItems?.length) ||
      !totalBill
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Populate item name from Admin Inventory model
    const populatedAdminItems = await Promise.all(
      adminInventoryItems.map(async ({ itemId, quantity }) => {
        const inventoryItem = await AdminInventory.findById(itemId);
        return {
          itemId,
          name: inventoryItem?.name || "Unknown Item",
          quantity,
        };
      })
    );

    // Populate item name from Kitchen Inventory model
    const populatedKitchenItems = await Promise.all(
      kitchenInventoryItems.map(async ({ itemId, quantity }) => {
        const inventoryItem = await KitchenInventory.findById(itemId);
        return {
          itemId,
          name: inventoryItem?.name || "Unknown Item",
          quantity,
        };
      })
    );

    const newOrder = await InventoryOrder.create({
      date,
      adminInventoryItems: populatedAdminItems,
      kitchenInventoryItems: populatedKitchenItems,
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
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 5; // Default to 5 items per page if not provided
    const skip = (page - 1) * limit;

    const totalOrders = await InventoryOrder.countDocuments(); // Get total count of orders
    const totalPages = Math.ceil(totalOrders / limit); // Calculate total pages

    const orders = await InventoryOrder.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({ orders, totalPages });
  } catch (error) {
    console.error("Error fetching inventory orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateInventoryOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["received", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await InventoryOrder.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status === "received") {
      // Update inventory stock
      // Update Admin Inventory
      for (const item of order.adminInventoryItems) {
        const inventoryItem = await AdminInventory.findById(item.itemId);
        if (inventoryItem) {
          inventoryItem.stock += item.quantity;
          await inventoryItem.save();
        }
      }

      // Update Kitchen Inventory
      for (const item of order.kitchenInventoryItems) {
        const inventoryItem = await KitchenInventory.findById(item.itemId);
        if (inventoryItem) {
          inventoryItem.stock += item.quantity;
          await inventoryItem.save();
        }
      }

      // Create expense with current date
      const description = [
        ...order.adminInventoryItems.map(
          (item) => `${item.name} x${item.quantity}`
        ),
        ...order.kitchenInventoryItems.map(
          (item) => `${item.name} x${item.quantity}`
        ),
      ].join(", ");

      await Expense.create({
        date: new Date(), // use current timestamp
        category: "Inventory",
        description,
        amount: order.totalBill,
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: `Order marked as ${status}`, order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
