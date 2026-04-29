const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videoUrl: String,
  thumbnail: String,
  caption: String,
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expiresAt: { type: Date, required: true }
}, { timestamps: true, expiresIn: '24h' });

module.exports = mongoose.model('Story', storySchema);
