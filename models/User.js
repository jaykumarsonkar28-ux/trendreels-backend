const mongoose = require('mongoose');

// 1. 🟢 FOLLOW SCHEMA (Followers/Following ki badi list ko alag table me handle karne ke liye)
const followSchema = new mongoose.Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Jo follow kar raha hai
  following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Jise follow kiya ja raha hai
}, { timestamps: true });

// Ek user ek hi bande ko do baar follow na kar sake, isliye unique index
followSchema.index({ follower: 1, following: 1 }, { unique: true });


// 2. 🟢 BLOCK SCHEMA 🔥 (Block list ko efficiency ke sath manage karne ke liye)
const blockSchema = new mongoose.Schema({
  blocker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Jisne block kiya hai
  blocked: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }  // Jise block kiya gaya hai
}, { timestamps: true });

// Ek user ek hi bande ko do baar block na kar sake, aur fast querying ke liye unique index
blockSchema.index({ blocker: 1, blocked: 1 }, { unique: true });


// 3. 🟢 USER SCHEMA (Main User Table)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  bio: String,
  
  // Ginti (Count) yahan rahegii, par poori list 'Follow' schema me manage hogi
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  
  totalViews: { type: Number, default: 0 },
  
  // Floating-point error se bachne ke liye Number ki jagah Decimal128 kiya
  totalEarnings: { type: mongoose.Schema.Types.Decimal128, default: 0.0 },
  walletBalance: { type: mongoose.Schema.Types.Decimal128, default: 0.0 },
  
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
  
  // SNAPCHAT STYLE STREAK FIELDS (Date Fix ki gayi hai)
  currentStreak: { type: Number, default: 0 },         
  lastUploadDate: { type: Date, default: null },       // String se badal kar Date kiya (Query karne me aasan hoga)
  streakActive: { type: Boolean, default: false },       
  notificationSent: { type: Boolean, default: false },   

  isOnline: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  
  // SAFE BYPASS SHADOWBAN CONTROLS
  shadowban: { type: Boolean, default: false },          
  shadowbanReason: String,
  contentScore: { type: Number, default: 100 }, 

  // 🔥 OTP SYSTEM FIELDS (Email/Phone Verification Ke Liye)
  otp: { type: String, default: null },               // 4 ya 6 digit ka OTP code yahan save hoga
  otpExpires: { type: Date, default: null },           // OTP kab expire hoga (e.g., 5 minute baad)
  isEmailVerified: { type: Boolean, default: false }  // OTP verify hone ke baad yeh true ho jayega
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Follow = mongoose.model('Follow', followSchema);
const Block = mongoose.model('Block', blockSchema); // 🔥 Block model create kiya

// Teeno models ko export kar rahe hain
module.exports = { User, Follow, Block };
