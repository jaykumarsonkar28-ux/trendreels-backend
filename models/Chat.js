// models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    }
  ],
  isCheatingRoom: { 
    type: Boolean, 
    default: false 
  },
  // Last message store karna achhi practice hai, taaki chat list screen fast load ho
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message' // Neeche diye gaye Message model se connect hoga
  },
  lastMessageTime: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// Index lagane se chat list jaldi fetch hogi
chatSchema.index({ participants: 1 });

module.exports = mongoose.model('Chat', chatSchema);
