// server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

console.log("MONGO_URI =", process.env.MONGO_URI);

app.use(cors({ origin: '*' }));  // ← MODIFIÉ
app.use(express.json());

const produitsRoutes  = require('./routes/produits');
const boutiquesRoutes = require('./routes/boutiques');
const authRoutes      = require('./routes/auth');

app.use('/api/produits',  produitsRoutes);
app.use('/api/boutiques', boutiquesRoutes);
app.use('/api/auth',      authRoutes);

app.get('/', (req, res) => {
  res.send('Backend de la Boutique fonctionne 🚀');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté ✅'))
  .catch(err => console.error('Erreur MongoDB ❌', err));

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});