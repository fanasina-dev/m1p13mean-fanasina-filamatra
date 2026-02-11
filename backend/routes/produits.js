const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit');

// Ajouter un produit
router.post('/', async (req, res) => {
    try {
        const produit = new Produit(req.body);
        await produit.save();
        res.status(201).json(produit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Voir tous les produits
router.get('/', async (req, res) => {
    try {
        const produits = await Produit.find();
        res.json(produits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Voir un produit par ID
router.get('/:id', async (req, res) => {
    try {
        const produit = await Produit.findById(req.params.id);
        if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
        res.json(produit);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Modifier un produit
router.put('/:id', async (req, res) => {
    try {
        const produit = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
        res.json(produit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Supprimer un produit
router.delete('/:id', async (req, res) => {
    try {
        const produit = await Produit.findByIdAndDelete(req.params.id);
        if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
        res.json({ message: 'Produit supprimé' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
