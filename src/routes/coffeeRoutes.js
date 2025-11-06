// src/routes/coffeeRoutes.js

import express from 'express';
import {
  getAllCoffees,
  getCoffeeById,
  createCoffee,
  updateCoffee,
  deleteCoffee
} from '../controllers/coffeeController.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes publiques (lecture)
router.get('/', getAllCoffees);
router.get('/:id', getCoffeeById);

// Routes protégées (Authentification requise)
router.post('/', protect, createCoffee);
router.put('/:id', protect, updateCoffee);

router.delete('/:id', protect, requireRole('ADMIN'), deleteCoffee);

export default router;
