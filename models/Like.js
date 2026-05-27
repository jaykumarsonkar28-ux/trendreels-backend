// models/Like.js
const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  videoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Video', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

// IMPORTANT INDEXES:
// 1. Ek user ek video ko ek hi baar like kar sake (Duplicate entries rokne ke liye)
// 2. Taaki video ke likes fast fetch ho sakein
likeSchema.index({ videoId: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
