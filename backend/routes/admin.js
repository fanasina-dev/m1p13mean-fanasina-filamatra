// backend/routes/admin.js
const express  = require('express');
const router   = express.Router();
const jwt      = require('jsonwebtoken');
const Admin    = require('../models/Admin');
const Boutique = require('../models/Boutique');
const Produit  = require('../models/Produit');

const JWT_SECRET = process.env.JWT_SECRET || 'monsecretjwt';

// ── Middleware admin auth ──────────────────────────────
function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ message: 'Accès refusé' });
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
}

// ── POST /api/admin/login ──────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    const valide = await admin.comparePassword(password);
    if (!valide) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    const token = jwt.sign(
      { id: admin._id, email: admin.email, isAdmin: true },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ message: 'Connexion admin réussie', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/admin/stats ───────────────────────────────
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalBoutiques = await Boutique.countDocuments();
    const totalProduits  = await Produit.countDocuments();
    const boutiques      = await Boutique.find().select('-password');
    const valeurTotale   = await Produit.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$prix', '$stock'] } } } }
    ]);
    res.json({
      totalBoutiques,
      totalProduits,
      valeurTotale: valeurTotale[0]?.total || 0,
      boutiques
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/admin/boutiques ───────────────────────────
router.get('/boutiques', adminAuth, async (req, res) => {
  try {
    const boutiques = await Boutique.find().select('-password');
    res.json(boutiques);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/admin/boutiques/:id ───────────────────
router.delete('/boutiques/:id', adminAuth, async (req, res) => {
  try {
    await Produit.deleteMany({ boutique: req.params.id });
    await Boutique.findByIdAndDelete(req.params.id);
    res.json({ message: 'Boutique et ses produits supprimés' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/admin/produits ────────────────────────────
router.get('/produits', adminAuth, async (req, res) => {
  try {
    const produits = await Produit.find().populate('boutique', 'nom email');
    res.json(produits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;