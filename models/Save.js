// models/Save.js
const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  videoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Video', 
    required: true 
  }
}, { timestamps: true });

// INDEXES: 
// 1. Ek user ek video ko ek hi baar save kar sake (Duplicate entries nahi hongi)
// 2. User jab apni saved videos ki list dekhega toh query super-fast chalegi
saveSchema.index({ user: 1, videoId: 1 }, { unique: true });
saveSchema.index({ user: 1, createdAt: -1 }); // Saved list ko nayi se purani ke order mein dikhane ke liye

module.exports = mongoose.model('Save', saveSchema);
