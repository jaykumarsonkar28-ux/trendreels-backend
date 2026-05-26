const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Yahan index: true add ho gaya hai fast searching ke liye
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  
  amount: { type: Number, required: true },
  platformFee: { type: Number, required: true }, // 30% Cut Snapshot
  finalPayout: { type: Number, required: true },  // 70% User Share
  currency: { type: String, default: 'INR', uppercase: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  purpose: { type: String, default: 'withdrawal' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  payoutDetailsSnapshot: {
    bankAccount: String,
    ifsc: String,
    upi: String,
    accountHolderName: String
  }
}, { timestamps: true });

// Yahan missing bracket fix kar diya hai
module.exports = mongoose.model('Transaction', transactionSchema);
