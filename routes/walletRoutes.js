const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User'); 
const Transaction = require('../models/Transaction'); 

// 💰 AUTOMATED WITHDRAWAL REQUEST ROUTE (AUTO-MOD ACTIVE)
// Endpoint: POST /api/wallet/withdraw
router.post('/withdraw', async (req, res) => {
  const userId = req.user ? req.user.id : req.body.userId; 
  let { amount } = req.body;

  amount = parseFloat(amount);
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: "Valid amount daalein." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "User nahi mila." });
    }

    // 🤖 AUTO-MOD CHECK 1: Monetization Status
    if (!user.monetizationUnlocked) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ success: false, message: "Auto-Mod Decline: Aapka monetization unlocked nahi hai." });
    }

    // 🤖 AUTO-MOD CHECK 2: Bank/UPI Verification Status
    if (!user.payoutDetails || !user.payoutDetails.verified) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Auto-Mod Decline: Pehle apni payout details settings me verify karein." });
    }

    // 🤖 AUTO-MOD CHECK 3: Balance Verification
    if (user.walletBalance < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Auto-Mod Decline: Wallet me paryapt balance nahi hai." });
    }

    // 💰 30% COMMISSION CALCULATIONS
    const platformFee = amount * 0.30;           
    const finalPayoutAmount = amount - platformFee; 

    // Deduct money instantly
    user.walletBalance -= amount;
    await user.save({ session });

    // 📝 CREATE AUTO-APPROVED TRANSACTION RECORD
    const newTransaction = new Transaction({
      user: userId,
      amount: amount,                   
      platformFee: platformFee,         
      finalPayout: finalPayoutAmount,   
      currency: 'INR',
      type: 'debit',
      purpose: 'withdrawal',
      status: 'approved',               // 🔥 AUTO-MOD EFFECT: Manual 'pending' ki jagah direct 'approved'!
      payoutDetailsSnapshot: {
        bankAccount: user.payoutDetails.bankAccount,
        ifsc: user.payoutDetails.ifsc,
        upi: user.payoutDetails.upi,
        accountHolderName: user.username 
      }
    });

    await newTransaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    // 🚀 SUCCESS RESPONSE WITH AUTO-MOD STAMP
    return res.status(200).json({
      success: true,
      message: "Auto-Mod: Withdrawal verified and processed instantly! ✅",
      status: "approved",
      requestedAmount: amount,
      platformFeeCharged: platformFee,       
      creditedToUser: finalPayoutAmount,  
      currentBalance: user.walletBalance,
      transactionId: newTransaction._id
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Auto-Withdraw Error:", error);
    return res.status(500).json({ success: false, message: "Server temporary failure." });
  }
});

module.exports = router;
        
