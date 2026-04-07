import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 0,
    },
    unit: {
      type: String,
      enum: ['pcs', 'kg', 'g', 'L', 'ml', 'pkt', 'dozen', 'box'],
      default: 'pcs',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    addedDate: {
      type: Date,
      default: Date.now,
    },
    costPrice: {
      type: Number,
      required: [true, 'Cost price is required'],
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Use _id as id in JSON responses
itemSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

const Item = mongoose.model('Item', itemSchema);
export default Item;
