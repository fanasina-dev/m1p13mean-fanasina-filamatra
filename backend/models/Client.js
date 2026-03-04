// backend/models/Client.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const clientSchema = new mongoose.Schema({
  nom:      { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

clientSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

clientSchema.methods.comparePassword = async function(pwd) {
  return bcrypt.compare(pwd, this.password);
};

module.exports = mongoose.model('Client', clientSchema);