// server.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const admin = require('firebase-admin');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

// Daily cron job for monetization check
const checkMonetizationEligibility = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const eligibleUsers = await User.find({
    createdAt: { $lte: thirtyDaysAgo },
    'monetizationStats.daysActive': { $gte: 30 },
    'monetizationStats.followers': { $gte: 500 },
    'monetizationStats.totalViews': { $gte: 5000 },
    monetizationUnlocked: false
  });

  for (let user of eligibleUsers) {
    user.monetizationUnlocked = true;
    user.monetizationStats.unlockedAt = new Date();
    await user.save();
    
    // Send push notification
    await sendPushNotification(user._id, 'Monetization Unlocked!', 'You can now earn from your videos!');
  }
};

// Content Quality Algorithm
const calculateContentScore = (video) => {
  let score = 100;
  
  // Penalize raw re-uploads
  if (!video.editScore.filtersUsed.length && 
      !video.editScore.hasTextOverlay && 
      !video.editScore.musicAdded) {
    score -= 50; // Heavy penalty for unedited content
  }
  
  // Reward editing
  if (video.editScore.filtersUsed.length > 0) score += 10;
  if (video.editScore.hasTextOverlay) score += 15;
  if (video.editScore.musicAdded) score += 10;
  if (video.editScore.speedChanged) score += 5;
  
  // Quality bonus
  if (video.qualityScore > 90) score += 10;
  
  video.author.contentScore = Math.max(0, Math.min(100, score));
  video.save();
};

// API Routes
app.post('/api/videos/upload', uploadVideo);
app.get('/api/videos/feed', getPersonalizedFeed);
app.post('/api/videos/:id/like', likeVideo);
app.post('/api/wallet/payout', processPayout);
app.get('/api/dashboard/stats', getCreatorStats);

// Socket.io for Cheating Room
io.on('connection', (socket) => {
  socket.on('join-cheating-room', (roomId) => {
    socket.join(roomId);
  });
  
  socket.on('cheating-message', (data) => {
    io.to(data.roomId).emit('new-cheating-message', data);
  });
});

// AdMob Earnings Split (70/30)
const distributeAdRevenue = async (videoId, revenue) => {
  const video = await Video.findById(videoId).populate('author');
  if (!video.author.monetizationUnlocked) return;
  
  const creatorShare = revenue * 0.7;
  const adminShare = revenue * 0.3;
  
  video.earnings += creatorShare;
  video.author.walletBalance += creatorShare;
  video.author.totalEarnings += creatorShare;
  
  await video.save();
  await video.author.save();
};
