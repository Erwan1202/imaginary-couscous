// src/server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import rateLimit from 'express-rate-limit'; 

import authRoutes from './routes/authRoutes.js';
import coffeeRoutes from './routes/coffeeRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors()); 
app.use(morgan('dev'));
app.use(express.json());


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

app.use(globalLimiter); 
app.use('/api/auth', authLimiter); 


app.use('/api/auth', authRoutes);
app.use('/api/coffees', coffeeRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Serveur 'imaginary-couscous' démarré sur http://localhost:${PORT}`);
});
