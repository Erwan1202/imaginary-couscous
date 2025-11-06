// src/controllers/coffeeController.js

import Coffee from '../models/Coffee.js';


export const getAllCoffees = async (req, res) => {
  try {
    const coffees = await Coffee.find();
    res.status(200).json(coffees);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur." });
  }
};


export const getCoffeeById = async (req, res) => {
  try {
    const coffee = await Coffee.findById(req.params.id);
    if (!coffee) {
      return res.status(404).json({ error: "Café non trouvé." });
    }
    res.status(200).json(coffee);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur." });
  }
};


export const createCoffee = async (req, res) => {
  try {
    const { name, description, price, origin } = req.body;

    if (!name || !price) {
      return res.status(422).json({ error: "Nom et prix sont requis." });
    }

    const newCoffee = new Coffee({ name, description, price, origin });
    await newCoffee.save();
    res.status(201).json(newCoffee);
  } catch (error) {
    if (error.code === 11000) { 
      return res.status(409).json({ error: "Ce nom de café existe déjà." });
    }
    res.status(500).json({ error: "Erreur lors de la création." });
  }
};


export const updateCoffee = async (req, res) => {
  try {
    const coffee = await Coffee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } 
    );
    if (!coffee) {
      return res.status(404).json({ error: "Café non trouvé." });
    }
    res.status(200).json(coffee);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour." });
  }
};

export const deleteCoffee = async (req, res) => {
  try {
    const coffee = await Coffee.findByIdAndDelete(req.params.id);
    if (!coffee) {
      return res.status(404).json({ error: "Café non trouvé." });
    }
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
};
