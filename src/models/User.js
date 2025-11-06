// src/models/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Oublie pas"],
      unique: true,
      trim: true, 
      lowercase: true, 
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Bah oui frérot, ca va te spammer",
      ],
    },
    password: {
      type: String,
      required: [true, "Attention aucunes manieres de le recup, t'oublie -> CHEH"],
      minlength: [6, "Abuse aussi"],

      select: false, 
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER', 
    },
  },
  {

    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
