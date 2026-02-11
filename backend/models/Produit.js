const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  prix: { type: Number, required: true },
  boutiqueId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Produit', produitSchema);
