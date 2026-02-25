const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit');

// ✅ 1. Ajouter un produit
// Utile pour le profil "Boutique" qui veut remplir son catalogue
router.post('/', async (req, res) => {
    try {
        const produit = new Produit(req.body);
        await produit.save();
        res.status(201).json(produit);
    } catch (err) {
        res.status(400).json({ message: "Erreur lors de l'ajout : " + err.message });
    }
});

// ✅ 2. Voir TOUS les produits
// Utile pour une page d'accueil globale du centre commercial
router.get('/', async (req, res) => {
    try {
        const produits = await Produit.find().populate('boutique', 'nom'); 
        // Le .populate('boutique', 'nom') permet de voir le nom de la boutique au lieu de juste l'ID
        res.json(produits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ 3. Voir les produits d'une BOUTIQUE spécifique
// C'est la route la plus importante pour ton binôme (Client)
router.get('/boutique/:boutiqueId', async (req, res) => {
    try {
        const produits = await Produit.find({ boutique: req.params.boutiqueId });
        res.json(produits);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération : " + err.message });
    }
});

// ✅ 4. Voir un produit seul par son ID
router.get('/:id', async (req, res) => {
    try {
        const produit = await Produit.findById(req.params.id).populate('boutique');
        if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
        res.json(produit);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ 5. Modifier un produit
router.put('/:id', async (req, res) => {
    try {
        const produit = await Produit.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Retourne la version modifiée du produit
        );
        if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
        res.json(produit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ 6. Supprimer un produit
router.delete('/:id', async (req, res) => {
    try {
        const produit = await Produit.findByIdAndDelete(req.params.id);
        if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;