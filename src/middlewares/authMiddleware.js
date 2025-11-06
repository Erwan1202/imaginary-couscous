// src/middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const protect = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      token = authHeader.split(' ')[1];

      const payload = jwt.verify(token, process.env.JWT_SECRET);

      req.user = { id: payload.sub, role: payload.role };
      next();

    } catch (error) {
      res.status(401).json({ error: "Token non valide ou expiré." });
    }
  } else {
    res.status(401).json({ error: "Accès non autorisé, token manquant." }); 
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Accès refusé. Rôle insuffisant." });
    }
    next();
  };
};
