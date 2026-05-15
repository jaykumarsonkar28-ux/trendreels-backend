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
//app.post('/api/videos/upload', uploadVideo);
//app.get('/api/videos/feed', getPersonalizedFeed);
//app.post('/api/videos/:id/like', likeVideo);
//app.post('/api/wallet/payout', processPayout);
//app.get('/api/dashboard/stats', getCreatorStats);

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

// Server start karne ka code (Jo main naya add kiya hai)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`TrendReels Server is running on port ${PORT}`);
});
  } // Ye for-loop ko band karega
}; // Ye monetization function ko band karega

// --- HUMARE NAYE ROUTES (RASTE) ---

// 1. Frontend ko Reels/Edits bhejne ka rasta
app.get('/api/reels', (req, res) => {
  res.json([
    { id: '1', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000', username: '@_sagarr08', description: 'Backend se aayi pehli post! 🔥' },
    { id: '2', image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=1000', username: '@_sagarr08', description: 'Ek aur original edit 💻' }
  ]);
});

// 2. Cheat Room ke liye Live Chatting (Socket.io)
io.on('connection', (socket) => {
  console.log('Ek naya user Cheat Room me aaya!');
  
  socket.on('sendMessage', (messageData) => {
    // Jab koi message bhejega, toh server wo sabko bhej dega
    io.emit('receiveMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User chala gaya');
  });
});

// --- SERVER KO "ON" KARNE KA MAIN CODE ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Bhai tera server Port ${PORT} par daud raha hai! 🚀`);
});

