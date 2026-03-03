// backend/models/Boutique.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const boutiqueSchema = new mongoose.Schema({
  nom:      { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Hash le mot de passe avant de sauvegarder
boutiqueSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Méthode pour comparer le mot de passe
boutiqueSchema.methods.comparePassword = async function(motDePasse) {
  return bcrypt.compare(motDePasse, this.password);
};

module.exports = mongoose.model('Boutique', boutiqueSchema);