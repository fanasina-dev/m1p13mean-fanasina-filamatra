// backend/routes/auth.js
const express    = require('express');
const router     = express.Router();
const jwt        = require('jsonwebtoken');
const Boutique   = require('../models/Boutique');
const JWT_SECRET = process.env.JWT_SECRET || 'monsecretjwt';

// ── Middleware auth ────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
}

// ── POST /api/auth/register ────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { nom, email, password } = req.body;
    const existe = await Boutique.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    const boutique = new Boutique({ nom, email, password });
    await boutique.save();
    const token = jwt.sign(
      { id: boutique._id, email: boutique.email, nom: boutique.nom },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      boutique: { id: boutique._id, nom: boutique.nom, email: boutique.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/login ───────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const boutique = await Boutique.findOne({ email });
    if (!boutique) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    const valide = await boutique.comparePassword(password);
    if (!valide) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    const token = jwt.sign(
      { id: boutique._id, email: boutique.email, nom: boutique.nom },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      message: 'Connexion réussie',
      token,
      boutique: { id: boutique._id, nom: boutique.nom, email: boutique.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/profil ───────────────────────────────
router.get('/profil', authMiddleware, async (req, res) => {
  try {
    const boutique = await Boutique.findById(req.user.id).select('-password');
    res.json(boutique);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/auth/profil ───────────────────────────────
router.put('/profil', authMiddleware, async (req, res) => {
  try {
    const { nom, password, photo } = req.body;
    const boutique = await Boutique.findById(req.user.id);
    if (nom)      boutique.nom      = nom;
    if (photo)    boutique.photo    = photo;
    if (password) boutique.password = password;
    await boutique.save();
    const token = jwt.sign(
      { id: boutique._id, email: boutique.email, nom: boutique.nom },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      message: 'Profil mis à jour',
      token,
      boutique: { id: boutique._id, nom: boutique.nom, email: boutique.email, photo: boutique.photo }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;