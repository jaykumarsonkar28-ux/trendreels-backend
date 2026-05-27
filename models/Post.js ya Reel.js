const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  
  // Yahan hum Reference (ref) de rahe hain
  author: {
    type: mongoose.Schema.Types.ObjectId, // Yeh MongoDB ki automatic _id hoti hai
    ref: 'User' // Yeh bilkul wahi naam hona chahiye jo User model mein module.exports mein hai
  }
});

module.exports = mongoose.model('Post', postSchema);
