const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  description: String,
  prix: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0    // ← NOUVEAU
  },
  boutique: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boutique',
    required: true
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Produit', produitSchema);