// src/middlewares/validationMiddleware.js

import { body, validationResult } from 'express-validator';


export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};


export const registerRules = () => [
  body('email', 'Email non valide')
    .isEmail()
    .normalizeEmail(),
  body('password', 'Le mot de passe doit faire 6 caractères minimum')
    .isLength({ min: 6 })
];


export const loginRules = () => [
  body('email', 'Email est requis').isEmail(),
  body('password', 'Mot de passe est requis').notEmpty()
];


export const coffeeRules = () => [
  body('name', 'Le nom est requis').notEmpty().trim(),
  body('price', 'Le prix doit être un nombre positif').isFloat({ gt: 0 })
];
