const express = require('express');
const router = express.Router();
const Boutique = require('../models/Boutique');

// ✅ Ajouter une boutique
router.post('/', async (req, res) => {
  try {
    const boutique = new Boutique(req.body);
    const savedBoutique = await boutique.save();
    res.status(201).json(savedBoutique);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Voir toutes les boutiques
router.get('/', async (req, res) => {
  try {
    const boutiques = await Boutique.find();
    res.json(boutiques);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
