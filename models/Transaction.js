const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  // 💰 Platform fee (Aapka 30% commission)
  platformFee: {
    type: Number,
    default: 0
  },
  // 💸 Final amount jo user ko transfer karna hai (70%)
  finalPayout: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  purpose: {
    type: String,
    enum: ['withdrawal', 'deposit', 'bonus'], 
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'failed'],
    default: 'pending'
  },
  payoutMethodUsed: {
    type: String
  },
  payoutDetailsSnapshot: {
    bankAccount: String,
    ifsc: String,
    upi: String,
    accountHolderName: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
