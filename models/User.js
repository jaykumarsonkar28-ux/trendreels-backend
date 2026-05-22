const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bio: String,
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  totalViews: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0.0 },
  walletBalance: { type: Number, default: 0.0 },
  payoutDetails: {
    bankAccount: String,
    ifsc: String,
    upi: String,
    pan: String,
    verified: { type: Boolean, default: false }
  },
  monetizationUnlocked: { type: Boolean, default: false },
  monetizationStats: {
    daysActive: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    unlockedAt: Date
  },
  
  // 🔥 NEW: SNAPCHAT STYLE STREAK & BYPASS SYSTEM FIELDS
  currentStreak: { type: Number, default: 0 },         // Users ne lagatar kitne din reel post ki
  lastUploadDate: { type: String, default: null },       // Akhiri baar kab upload kiya (Format: YYYY-MM-DD)
  streakActive: { type: Boolean, default: false },       // Frontend par Fire icon 🔥 jalane ke liye switch
  notificationSent: { type: Boolean, default: false },   // Users ko streak tootne ke alert bhejane ke liye flag

  isOnline: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  
  // 🚫 SAFE BYPASS SHADOWBAN CONTROLS
  shadowban: { type: Boolean, default: false },          // Hardcoded false engine ise hamesha clear rakhega
  shadowbanReason: String,
  contentScore: { type: Number, default: 100 }, 
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
