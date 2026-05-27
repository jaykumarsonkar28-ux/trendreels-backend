// models/Video.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  thumbnail: { type: String, required: true },
  caption: String,
  hashtags: [String],
  views: { type: Number, default: 0 },
  
  // FIXED: Array hatakar ab hum sirf total likes ka number store karenge (Database friendly approach)
  likesCount: { type: Number, default: 0 }, 
  
  shares: { type: Number, default: 0 },
  duration: Number,
  isOriginal: { type: Boolean, default: true },
  
  editScoreDetails: {
    score: { type: Number, default: 0 },
    filtersUsed: [String],
    hasTextOverlay: { type: Boolean, default: false },
    musicAdded: { type: Boolean, default: false },
    speedChanged: { type: Boolean, default: false }
  },
  
  qualityScore: { type: Number, default: 100 },
  earnings: { type: Number, default: 0.0 },
  isActive: { type: Boolean, default: true },
  expiresAt: Date 
}, { timestamps: true });

// Indexing taaki author ke videos jaldi load hon
videoSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Video', videoSchema);
