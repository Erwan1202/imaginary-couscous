// src/server.js

import app from './app.js';
import connectDB from './config/db.js';

// Connexion à la base de données
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur 'imaginary-couscous' démarré sur http://localhost:${PORT}`);
});