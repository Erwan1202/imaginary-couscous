// src/routes/coffeeRoutes.js

import express from 'express';
import {
  getAllCoffees,
  getCoffeeById,
  createCoffee,
  updateCoffee,
  deleteCoffee
} from '../controllers/coffeeController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';

// 1. Importer
import { 
  coffeeRules, 
  validateRequest 
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.get('/', getAllCoffees);
router.get('/:id', getCoffeeById);


router.post('/', 
  protect, 
  coffeeRules(), 
  validateRequest, 
  createCoffee
);


router.put('/:id', 
  protect, 
  coffeeRules(), 
  validateRequest, 
  updateCoffee
);

router.delete('/:id', 
  protect, 
  requireRole('ADMIN'), 
  deleteCoffee
);

export default router;