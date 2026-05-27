const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose'); // Agar mongoose initialization upar hai toh

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Body parser middleware (Zaroori hai taaki req.body ka data mil sake)
app.use(express.json());

// 🟢 1. ROUTES IMPORT (Sare imports top par)
const walletRoutes = require('./routes/walletRoutes');

// 🟢 2. API ENDPOINT LINKING (Server start hone se pehle)
app.use('/api/wallet', walletRoutes);


// 🟢 3. REEL LIKE/UNLIKE ROUTE (Aapka Like logic)
// (Note: Maine yahan example ke liye app.post likha hai, aap apne setup ke hisab se router ya app use kar sakte hain)
app.post('/api/reels/:id/like', async (req, res) => {
  try {
    const { action } = req.body;
    // Reel find karne ka logic yahan hoga (e.g., const reel = await Reel.findById(req.params.id))

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


// 🟢 4. SOCKET.IO FOR CHAT ROOM
io.on('connection', (socket) => {
  console.log('Koi chat room me aaya hai! 💬');

  socket.on('sendMessage', (messageData) => {
    io.emit('receiveMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log('Koi chat chhod kar chala gaya 🏃‍♂️');
  });
});


// 🟢 5. SERVER START
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Bhai tera server Port ${PORT} par daud raha hai! 🚀`);
});
