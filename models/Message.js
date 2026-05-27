// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat', // Yeh batayega ki message kis chat room ka hai
    required: true
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Kisne bheja
    required: true 
  },
  text: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true }); // Ismein createdAt hi aapka timestamp ban jayega

// Index lagane se chat history fast load hogi (Pagination ke waqt)
messageSchema.index({ chatId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
