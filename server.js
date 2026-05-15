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
  } // <-- Ye bracket missing tha, maine jod diya
};

// ==========================================
// --- HUMARE NAYE ROUTES (RASTE) ---
// ==========================================

// 1. App ko Reels/Edits bhejne ka rasta
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
    io.emit('receiveMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User chala gaya');
  });
});

// ==========================================
// --- SERVER KO "ON" KARNE KA MAIN CODE ---
// ==========================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Bhai tera server Port ${PORT} par daud raha hai! 🚀`);
});
