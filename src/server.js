// src/server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import rateLimit from 'express-rate-limit'; // 1. Importer

import authRoutes from './routes/authRoutes.js';
import coffeeRoutes from './routes/coffeeRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors()); 
app.use(morgan('dev'));
app.use(express.json());

// --- Configuration du Rate Limiting ---

// 2. Limiteur global
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requêtes max par IP par minute
  message: "Trop de requêtes, veuillez réessayer dans une minute.",
});

// 3. Limiteur pour l'authentification (brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 tentatives max par IP par 15 minutes
  message: "Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.",
});

// 4. Appliquer les limiteurs
app.use(globalLimiter); // Applique à toutes les routes
app.use('/api/auth', authLimiter); // Surcharge pour les routes /api/auth

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/coffees', coffeeRoutes);

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Serveur 'imaginary-couscous' démarré sur http://localhost:${PORT}`);
});
