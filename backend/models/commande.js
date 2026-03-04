// backend/models/Commande.js
const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  items: [
    {
      produit:  { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
      nom:      String,
      prix:     Number,
      quantite: Number,
    }
  ],
  total:   { type: Number, required: true },
  statut:  { type: String, default: 'en attente' },
}, { timestamps: true });

module.exports = mongoose.model('Commande', commandeSchema);