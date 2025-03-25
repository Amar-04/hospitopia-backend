import mongoose from 'mongoose';

const AdminInventory2Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Reference to AdminCategory model
    ref: 'AdminCategory',
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  minRequired: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Good', 'Low', 'Critical'],
    required: true
  },
  type: {
    type: String,
    enum: ['single-use', 'reusable'],
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
});

// Pre-save hook to calculate status before saving
AdminInventory2Schema.pre('save', function (next) {
  this.status = calculateStatus(this.stock, this.minRequired);
  next();
});

// Pre-update hook to update status dynamically
AdminInventory2Schema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.stock !== undefined || update.minRequired !== undefined) {
    try {
      const doc = await this.model.findOne(this.getQuery());
      if (doc) {
        const stock = update.stock !== undefined ? update.stock : doc.stock;
        const minRequired = update.minRequired !== undefined ? update.minRequired : doc.minRequired;

        // Calculate new status
        update.$set = update.$set || {};
        update.$set.status = calculateStatus(stock, minRequired);
        update.$set.lastUpdated = new Date();
      }
    } catch (err) {
      return next(err);
    }
  } else {
    update.$set = update.$set || {};
    update.$set.lastUpdated = new Date();
  }
  next();
});

// Helper function to calculate status
function calculateStatus(stock, minRequired) {
  if (stock > minRequired * 1.5) {
    return 'Good';
  } else if (stock >= minRequired) {
    return 'Low';
  } else {
    return 'Critical';
  }
}

// Virtual for stock level percentage
AdminInventory2Schema.virtual('stockLevel').get(function () {
  return this.minRequired > 0 ? Math.round((this.stock / this.minRequired) * 100) : 0;
});

// Indexes for better query performance
AdminInventory2Schema.index({ category: 1 });
AdminInventory2Schema.index({ status: 1 });
AdminInventory2Schema.index({ name: 'text' });

const AdminInventory2 = mongoose.model('AdminInventory2', AdminInventory2Schema);

export default AdminInventory2;