// backend/routes/client.js
const express  = require('express');
const router   = express.Router();
const jwt      = require('jsonwebtoken');
const Client   = require('../models/Client');
const Produit  = require('../models/Produit');
const Commande = require('../models/Commande');

const JWT_SECRET = process.env.JWT_SECRET || 'monsecretjwt';

// ── Middleware client auth ─────────────────────────────
function clientAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isClient) return res.status(403).json({ message: 'Accès refusé' });
    req.client = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
}

// ── POST /api/client/register ──────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { nom, email, password } = req.body;
    const existe = await Client.findOne({ email });
    if (existe) return res.status(400).json({ message: 'Email déjà utilisé' });
    const client = new Client({ nom, email, password });
    await client.save();
    const token = jwt.sign(
      { id: client._id, email: client.email, nom: client.nom, isClient: true },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      client: { id: client._id, nom: client.nom, email: client.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/client/login ─────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await Client.findOne({ email });
    if (!client) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    const valide = await client.comparePassword(password);
    if (!valide) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    const token = jwt.sign(
      { id: client._id, email: client.email, nom: client.nom, isClient: true },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      message: 'Connexion réussie',
      token,
      client: { id: client._id, nom: client.nom, email: client.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/client/catalogue ──────────────────────────
router.get('/catalogue', async (req, res) => {
  try {
    const produits = await Produit.find({ stock: { $gt: 0 } })
      .populate('boutique', 'nom');
    res.json(produits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/client/catalogue/:id ─────────────────────
router.get('/catalogue/:id', async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id)
      .populate('boutique', 'nom');
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(produit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/client/commandes ─────────────────────────
router.post('/commandes', clientAuth, async (req, res) => {
  try {
    const { items } = req.body;
    const total = items.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    const commande = new Commande({
      client: req.client.id,
      items,
      total
    });
    await commande.save();
    // Mettre à jour le stock
    for (const item of items) {
      await Produit.findByIdAndUpdate(item.produit, {
        $inc: { stock: -item.quantite }
      });
    }
    res.status(201).json({ message: 'Commande passée avec succès', commande });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/client/commandes ──────────────────────────
router.get('/commandes', clientAuth, async (req, res) => {
  try {
    const commandes = await Commande.find({ client: req.client.id })
      .sort({ createdAt: -1 });
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;