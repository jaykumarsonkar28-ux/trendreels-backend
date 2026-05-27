// models/Block.js
const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  blocker: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // User model ka naam jo aapne module.exports mein rakha ho
    required: true 
  },
  blocked: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Kise block kiya ja raha hai
    required: true 
  }
}, { timestamps: true });

// Isse ek hi user doosre ko do baar block nahi kar payega, aur search fast hogi
blockSchema.index({ blocker: 1, blocked: 1 }, { unique: true });

module.exports = mongoose.model('Block', blockSchema);
