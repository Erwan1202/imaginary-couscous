// src/app.js


import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import coffeeRoutes from './routes/coffeeRoutes.js';
import orderRoutes from './routes/orderRoutes.js';


const app = express();

app.use(helmet());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Limiteurs
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Trop de requêtes, veuillez réessayer dans une minute.",
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.",
});

if (process.env.NODE_ENV !== 'test') {
  app.use(globalLimiter);
  app.use('/api/auth', authLimiter);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/coffees', coffeeRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Exporter l'application pour les tests
export default app;