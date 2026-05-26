// server.js
require('dotenv').config(); // 🌟 Iske bina process.env kaam nahi karega bhai!
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==========================================
// 💸 HUMARE IMPORTED ROUTES
// ==========================================
const walletRoutes = require('./routes/walletRoutes');
const Block = require('./models/Block'); // 🛡️ NAYA: Blocked users filter chalane ke liye model import kiya


// ==========================================
// --- MONGODB DATABASE KA DHANCHA (SCHEMA) ---
// ==========================================
const reelSchema = new mongoose.Schema({
  username: String,
  description: String,
  image: String,
  likes: { type: Number, default: 0 }, // Likes ki ginti save karne ke liye
  createdAt: { type: Date, default: Date.now }
});
const Reel = mongoose.model('Reel', reelSchema);


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB ekdum jhakkaas jud gaya! 🎉'))
  .catch(err => console.error('MongoDB connection error:', err));


// ==========================================
// 💸 API ENDPOINT LINKS
// ==========================================
app.use('/api/wallet', walletRoutes);


// ==========================================
// --- HUMARE ROUTES (DARWAZE) ---
// ==========================================

// 1. Saari Reels mangwane ka rasta (🔥 NAYA: With Block User Filter Active)
app.get('/api/reels', async (req, res) => {
  try {
    // 💡 Note: Agar aapke paas auth middleware hai toh req.user._id milega, 
    // nahi toh testing ke liye aap req.query.userId ya req.body.userId le sakte hain.
    const currentUserId = req.user ? req.user._id : req.query.userId;

    let query = {};

    // 🛡️ Agar user logged in hai, toh blocked users ki list nikalein
    if (currentUserId) {
      const blockedUsers = await Block.find({ blocker: currentUserId }).distinct('blocked');
      
      // Reels query me filter lagayein: un logo ki reel mat dikhao jo blockedUsers list me hain
      query = { username: { $nin: blockedUsers } }; 
    }

    // Filter ke sath reels ko database se nikalna
    const reels = await Reel.find(query).sort({ createdAt: -1 });
    res.json(reels);

  } catch (error) {
    console.error("Feed Load Error:", error);
    res.status(500).json({ error: 'Server se post nikalne me dikkat aayi' });
  }
});

// 2. Nayi Reel upload karne ka rasta
app.post('/api/reels', async (req, res) => {
  try {
    const newReel = new Reel({
      username: '@_sagarr08',
      description: req.body.description || 'Bhai ka naya bawal edit! 🔥🚀',
      image: req.body.image,
      likes: 0 // Shuruat me 0 likes honge
    });
    
    await newReel.save();
    res.json({ message: 'Post ekdum success ho gayi!', reel: newReel });
  } catch (error) {
    res.status(500).json({ error: 'Upload fail ho gaya' });
  }
});

// 3. Like badhane aur ghatane ka rasta
app.post('/api/reels/:id/like', async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ error: 'Reel nahi mili bhai!' });

    const { action } = req.body; // Frontend se aayega ki 'like' karna hai ya 'unlike'
    
    if (action === 'like') {
      reel.likes += 1;
    } else if (action === 'unlike' && reel.likes > 0) {
      reel.likes -= 1;
    }

    await reel.save();
    res.json({ success: true, likes: reel.likes });
  } catch (error) {
    res.status(500).json({ error: 'Like update karne me dikkat aayi' });
  }
});

// Socket.io for Cheat Room
io.on('connection', (socket) => {
  console.log('Koi chat room me aaya hai! 💬');

  socket.on('sendMessage', (messageData) => {
    io.emit('receiveMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log('Koi chat chhod kar chala gaya 🏃‍♂️');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Bhai tera server Port ${PORT} par daud raha hai! 🚀`);
});
