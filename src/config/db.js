// src/config/db.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Récupère l'URI de connexion depuis les variables d'environnement
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error('Erreur: MONGO_URI n\'est pas défini dans .env');
      process.exit(1);
    }

    // Connexion à MongoDB
    await mongoose.connect(mongoUri);

    console.log('MongoDB connecté avec succès.');

  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error.message);
    // Quitte l'application en cas d'échec de la connexion
    process.exit(1); 
  }
};

export default connectDB;
