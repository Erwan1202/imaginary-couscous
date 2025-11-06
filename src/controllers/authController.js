// src/controllers/authController.js

import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "Email et mot de passe requis." });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
    return res.status(409).json({ error: "Cet email est déjà utilisé." }); 
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || 'USER',
    });

    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(422).json({ error: error.message });
    }
    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur." });}
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(422).json({ error: "Email et mot de passe requis." });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: "Identifiants invalides." }); 
    }

    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }

      const payload = {
      sub: user._id, 
      role: user.role,
    };

      const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: "Connexion réussie.",
      accessToken: token, //
    });

  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la connexion." });
  }
};
