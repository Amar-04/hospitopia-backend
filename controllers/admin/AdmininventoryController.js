import AdminInventory2 from '../../models/admin/Admininventory2.js';
import AdminCategory from '../../models/admin/Admincategory.js';
import createError from 'http-errors';
import mongoose from 'mongoose';

// Get all inventory items with pagination and filtering
export const getInventory = async (req, res, next) => {
  try {
    console.log('Fetching inventory items with query:', req.query);
    const page = Math.max(parseInt(req.query.page), 1) || 1;
    const limit = Math.max(parseInt(req.query.limit), 1) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      query.name = { $regex: new RegExp(req.query.search, 'i') };
    }

    if (req.query.category && req.query.category !== 'All Categories') {
      const category = await AdminCategory.findOne({ name: req.query.category });
      if (category) query.category = category._id;
    }

    if (req.query.status && req.query.status !== 'All Statuses') {
      query.status = req.query.status;
    }

    // Add this block to handle the type filter
    if (req.query.type && req.query.type !== 'All Types') {
      query.type = req.query.type;
    }

    console.log('Final query:', query);
    const items = await AdminInventory2.find(query)
      .populate('category', 'name')
      .sort({ lastUpdated: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalItems = await AdminInventory2.countDocuments(query);
    console.log('Total items found:', totalItems);
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      results: items,
      pagination: { currentPage: page, totalPages, totalItems, itemsPerPage: limit }
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    next(error);
  }
};

// Get inventory item by ID
export const getInventoryItem = async (req, res, next) => {
  try {
    let { type, category, status } = req.query;
    let query = {};

    if (type && ['single-use', 'reusable'].includes(type)) {
      query.type = type;
    }

    if (category) query.category = category;
    if (status) query.status = status;

    const items = await AdminInventory2.find(query).populate('category');
    res.status(200).json({ total: items.length, items });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    next(error);
  }
};


// Create new inventory item
export const createInventoryItem = async (req, res, next) => {
  try {
    console.log('Creating new inventory item with data:', req.body);
    let { name, category, stock, minRequired, status, type } = req.body;

    if (!name || name.trim() === '') {
      return next(createError(400, 'Item name is required'));
    }

    if (!status || status.trim() === '') {
      return next(createError(400, 'Status is required'));
    }

    if (!type || !['single-use', 'reusable'].includes(type)) {
      return next(createError(400, 'Type must be either "single-use" or "reusable"'));
    }

    const trimmedName = name.trim();
    const existingItem = await AdminInventory2.findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
    if (existingItem) return next(createError(409, 'Item with this name already exists'));

    const existingCategory = await AdminCategory.findOne({ name: category });
    if (!existingCategory) return next(createError(400, 'Invalid category name'));

    stock = Number(stock);
    minRequired = Number(minRequired);
    if (isNaN(stock) || isNaN(minRequired)) {
      return next(createError(400, 'Stock and minimum required should be valid numbers'));
    }

    const newItem = new AdminInventory2({ 
      name: trimmedName, 
      category: existingCategory._id, 
      stock, 
      minRequired,
      status: status.trim(),
      type  // ✅ Store single-use or reusable
    });

    await newItem.save();

    console.log('Inventory item created successfully:', newItem);
    res.status(201).json({ message: 'Inventory item created successfully', item: newItem });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    next(error);
  }
};



// Update inventory item
export const updateInventoryItem = async (req, res, next) => {
  try {
    console.log('Updating inventory item with ID:', req.params.id, 'Data:', req.body);
    const { id } = req.params;
    let { name, category, stock, minRequired, type } = req.body; // Added type here

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, 'Invalid item ID'));
    }

    if (name) name = name.trim();
    if (category) {
      // Find category by name instead of trying to use name as ID
      const categoryExists = await AdminCategory.findOne({ name: category });
      if (!categoryExists) return next(createError(400, 'Invalid category'));
      // Use the found category's ID in the update
      category = categoryExists._id;
    }
    if (stock !== undefined) {
      stock = Number(stock);
      if (isNaN(stock)) return next(createError(400, 'Stock should be a valid number'));
    }
    if (minRequired !== undefined) {
      minRequired = Number(minRequired);
      if (isNaN(minRequired)) return next(createError(400, 'Minimum required should be a valid number'));
    }
    
    // Validate the type field
    if (type && !['single-use', 'reusable'].includes(type)) {
      return next(createError(400, 'Type must be either "single-use" or "reusable"'));
    }

    // Include type in the update operation
    const updatedItem = await AdminInventory2.findByIdAndUpdate(
      id, 
      { name, category, stock, minRequired, type }, // Added type here
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) return next(createError(404, 'Inventory item not found'));

    console.log('Inventory item updated successfully:', updatedItem);
    res.status(200).json({ message: 'Inventory item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    next(error);
  }
};

// Delete inventory item
export const deleteInventoryItem = async (req, res, next) => {
  try {
    console.log('Deleting inventory item with ID:', req.params.id);
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, 'Invalid item ID'));
    }

    const deletedItem = await AdminInventory2.findByIdAndDelete(id);
    if (!deletedItem) return next(createError(404, 'Inventory item not found'));

    console.log('Inventory item deleted successfully:', deletedItem);
    res.status(200).json({ message: 'Inventory item deleted successfully', itemId: id });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    next(error);
  }
};
