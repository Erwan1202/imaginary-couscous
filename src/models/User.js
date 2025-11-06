// src/models/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Oublie pas"],
      unique: true, // Assure que l'email n'est pas déjà utilisé
      trim: true, // Retire les espaces inutiles au début et à la fin
      lowercase: true, // Stocke l'email en minuscules
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Bah oui frérot, ca va te spammer",
      ],
    },
    password: {
      type: String,
      required: [true, "Attention aucunes manieres de le recup, t'oublie -> CHEH"],
      minlength: [6, "Abuse aussi"],
      // Important : Ne jamais retourner le mot de passe dans les requêtes !
      // On le cache par défaut avec 'select: false'
      select: false, 
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'], // Définit les rôles possibles
      default: 'USER', // Rôle par défaut 
    },
  },
  {
    // Ajoute automatiquement createdAt et updatedAt
    timestamps: true,
  }
);

// Crée le modèle 'User' à partir du schéma
const User = mongoose.model('User', userSchema);

export default User;
