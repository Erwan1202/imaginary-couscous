// src/models/Order.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderItemSchema = new Schema({
  coffee: {
    type: Schema.Types.ObjectId,
    ref: 'Coffee', 
    required: true,
  },
  name: { 
    type: String, 
    required: true 
  }, 
  price: { 
    type: Number, 
    required: true 
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    items: [orderItemSchema], 
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;