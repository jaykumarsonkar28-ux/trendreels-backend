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
// 🌟 NAYA: Badi photos (edits) ke liye limit badha di hai
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB ekdum jhakkaas jud gaya!'))
  .catch(err => console.error('MongoDB error:', err));

// ==========================================
// --- MONGODB DATABASE KA DACHA (SCHEMA) ---
// ==========================================
const reelSchema = new mongoose.Schema({
  username: String,
  description: String,
  image: String, // Yahan aapki photo ka data save hoga
  createdAt: { type: Date, default: Date.now }
});
const Reel = mongoose.model('Reel', reelSchema);

// Daily cron job for monetization check (Aapka purana code)
const checkMonetizationEligibility = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  // Note: Ensure User model is imported if you are using it
  /* const eligibleUsers = await User.find({ ... });
  for (let user of eligibleUsers) { ... }
  */
};

// ==========================================
// --- HUMARE NAYE ROUTES (DARWAZE) ---
// ==========================================

// 1. App ko Reels bhejne ka rasta (Ab seedha MongoDB se)
app.get('/api/reels', async (req, res) => {
  try {
    // MongoDB se saari posts nikalo, aur sabse nayi pehle dikhao (createdAt: -1)
    const reels = await Reel.find().sort({ createdAt: -1 });
    res.json(reels);
  } catch (error) {
    res.status(500).json({ error: 'Server se post nikalne me dikkat aayi' });
  }
});

// 2. 🌟 NAYA: App se Photo Upload (Save) karne ka rasta
app.post('/api/reels', async (req, res) => {
  try {
    const newReel = new Reel({
      username: '@_sagarr08', // Aapka handle
      description: req.body.description || 'Meri nayi edit! 🔥',
      image: req.body.image // App se aane wali photo
    });
    
    await newReel.save(); // Data hamesha ke liye MongoDB mein save!
    console.log("Ek nayi post save ho gayi!");
    res.json({ message: 'Post ekdum success ho gayi!', reel: newReel });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Upload fail ho gaya' });
  }
});

// 3. Cheat Room ke liye Live Chatting (Socket.io)
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
