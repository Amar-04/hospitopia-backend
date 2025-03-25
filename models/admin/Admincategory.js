import mongoose from 'mongoose';

const AdminCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
});

// Create an index for better query performance
AdminCategorySchema.index({ name: 1 });

const AdminCategory = mongoose.model('AdminCategory', AdminCategorySchema);

export default AdminCategory;
