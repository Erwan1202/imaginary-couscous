// src/controllers/orderController.js

import Order from '../models/Order.js';
import Coffee from '../models/Coffee.js';
import mongoose from 'mongoose';


export const createOrder = async (req, res) => {
  try {
    const { items } = req.body; 
    const userId = req.user.id; 

    if (!items || items.length === 0) {
      return res.status(422).json({ error: "Le panier est vide." });
    }

    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const coffee = await Coffee.findById(item.coffeeId);
      if (!coffee) {
        return res.status(404).json({ error: `Café ${item.coffeeId} non trouvé.` });
      }

      const itemTotal = coffee.price * item.quantity;
      calculatedTotal += itemTotal;

      orderItems.push({
        coffee: coffee._id,
        name: coffee.name,
        price: coffee.price, 
        quantity: item.quantity,
      });
    }

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      total: calculatedTotal,
      status: 'PENDING',
    });

    await newOrder.save();
    res.status(201).json(newOrder);

  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la commande." });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.coffee', 'name origin'); 

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur." });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'email')
      .populate('items.coffee', 'name');

    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée." });
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: "Accès refusé." });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur." });
  }
};