const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  thumbnail: { type: String, required: true },
  caption: String,
  hashtags: [String],
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  shares: { type: Number, default: 0 },
  duration: Number,
  isOriginal: { type: Boolean, default: true },
  editScore: { 
    type: Number, 
    default: 0, 
    filtersUsed: [String],
    hasTextOverlay: Boolean,
    musicAdded: Boolean,
    speedChanged: Boolean
  },
  qualityScore: { type: Number, default: 100 },
  earnings: { type: Number, default: 0.0 },
  isActive: { type: Boolean, default: true },
  expiresAt: Date 
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
             
