// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  videoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Video', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  text: { 
    type: String, 
    required: true,
    trim: true 
  }
}, { timestamps: true }); // createdAt aur updatedAt apne aap mil jayega

// Indexing taaki video ke comments turant fetch ho sakein
commentSchema.index({ videoId: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
