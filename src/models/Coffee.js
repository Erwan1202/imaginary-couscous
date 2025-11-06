// src/models/Coffee.js

import mongoose from 'mongoose';

const coffeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Le prix est obligatoire"],
      min: [0, "Le prix ne peut être négatif"],
    },
    origin: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coffee = mongoose.model('Coffee', coffeeSchema);

export default Coffee;
