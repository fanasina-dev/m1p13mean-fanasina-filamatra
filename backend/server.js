// server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Test dotenv
console.log("MONGO_URI =", process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const produitsRoutes = require('./routes/produits');
app.use('/api/produits', produitsRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('Backend de la Boutique fonctionne 🚀');
});

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté ✅'))
  .catch(err => console.error('Erreur MongoDB ❌', err));

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
