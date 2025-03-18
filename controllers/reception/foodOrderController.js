import FoodOrder from "../../models/reception/FoodOrder.js";
import Room from "../../models/admin/Room.js";
import MenuItem from "../../models/kitchen/MenuItem.js";

/**
 * @desc Get all food orders with filtering & pagination
 * @route GET /api/food-orders
 */
export const getFoodOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};

    const foodOrders = await FoodOrder.find(filter)
      .populate({
        path: "room",
        select: "number", // Fetch room number
      })
      .populate({
        path: "items",
        select: "name price", // Fetch item name & price
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalOrders = await FoodOrder.countDocuments(filter);

    res.json({
      totalOrders,
      currentPage: Number(page),
      totalPages: Math.ceil(totalOrders / limit),
      foodOrders,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc Create a new food order
 * @route POST /api/food-orders
 */
export const createFoodOrder = async (req, res) => {
  try {
    const { room, items, status, time, price } = req.body;

    // Validate Room existence
    const existingRoom = await Room.findById(room);
    if (!existingRoom)
      return res.status(400).json({ error: "Invalid room ID" });

    // Validate Menu Items existence
    const existingItems = await MenuItem.find({ _id: { $in: items } });
    if (existingItems.length !== items.length)
      return res.status(400).json({ error: "One or more items are invalid" });

    // Find the last order and increment orderId
    const lastOrder = await FoodOrder.findOne().sort({ orderId: -1 });
    const newOrderId = lastOrder ? lastOrder.orderId + 1 : 1001; // Start from 1001

    const newOrder = new FoodOrder({
      orderId: newOrderId,
      room: existingRoom._id,
      items: existingItems.map((item) => item._id),
      receptionStatus: "New Order", // Auto-set for reception
      kitchenStatus: "Pending", // Auto-set for kitchen
      time,
      price,
    });

    await newOrder.save();

    // Populate response before sending it back
    const populatedOrder = await newOrder.populate([
      { path: "room", select: "number" },
      { path: "items", select: "name price" },
    ]);

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc Update food order status
 * @route PUT /api/food-orders/:id
 */
export const updateFoodOrderStatus = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the request body
    console.log("Request Params:", req.params);
    const { kitchenStatus } = req.body;
    const updateData = {};

    if (!["Pending", "Cooking", "Ready", "Delivered"].includes(kitchenStatus)) {
      return res.status(400).json({ error: "Invalid kitchen status" });
    }

    updateData.kitchenStatus = kitchenStatus;

    // 🔹 Update receptionStatus based on kitchenStatus transitions
    if (kitchenStatus === "Cooking") {
      updateData.receptionStatus = "In Progress";
    } else if (kitchenStatus === "Ready") {
      updateData.receptionStatus = "Ready";
    } else if (kitchenStatus === "Delivered") {
      updateData.receptionStatus = "Delivered";
    }

    const updatedOrder = await FoodOrder.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ error: "Order not found" });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc Delete a food order
 * @route DELETE /api/food-orders/:id
 */
export const deleteFoodOrder = async (req, res) => {
  try {
    const deletedOrder = await FoodOrder.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ error: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
