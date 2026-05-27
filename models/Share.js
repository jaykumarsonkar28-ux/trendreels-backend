// models/Share.js
const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true // Kisne share kiya
  },
  videoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Video', 
    required: true // Kaun si video share hui
  },
  platform: { 
    type: String, 
    enum: ['whatsapp', 'facebook', 'instagram', 'copied_link', 'internal_chat', 'other'],
    default: 'other' // Kis platform par share kiya gaya
  }
}, { timestamps: true });

// Indexing taaki analytics/reports nikalna aasan ho
shareSchema.index({ videoId: 1 });
shareSchema.index({ user: 1 });
// models/Share.js ke andar niche yeh add karein:

shareSchema.post('save', async function (doc, next) {
  try {
    // 'doc' ka matlab hai jo share abhi-abhi save hua hai
    // Hum automatically uski videoId nikal kar count badha rahe hain
    await mongoose.model('Video').findByIdAndUpdate(doc.videoId, {
      $inc: { shares: 1 }
    });
    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model('Share', shareSchema);
