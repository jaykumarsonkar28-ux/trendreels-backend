// utils/errorHandler.js
const https = require('https');

// Aapka personal Telegram Bot Token aur Chat ID
const TELEGRAM_TOKEN = '8881018793:AAHO7QISjDMn7Ayk4tzHfIkeGZdP6VtDGVc';
const CHAT_ID = '8258356316';

const sendErrorToTelegram = (error, req = null) => {
  try {
    let message = `🚨 *SERVER ERROR ALERT* 🚨\n\n`;
    message += `❌ *Error:* ${error.message}\n`;
    
    if (req) {
      message += `🌐 *Route:* ${req.method} ${req.originalUrl}\n`;
      message += `👤 *User ID:* ${req.user ? req.user._id : 'Guest User'}\n`;
    }

    // Markdown issues se bachne ke liye message ko encode karna zaroori hai
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodedMessage}&parse_mode=Markdown`;

    // Telegram API ko hit karne ke liye bina kisi external package ke default https use kiya hai
    https.get(url, (res) => {}).on('error', (e) => {
      console.error("Telegram par alert nahi ja paya:", e.message);
    });

  } catch (err) {
    console.error("Error handler mein dikkat hui:", err.message);
  }
};

module.exports = sendErrorToTelegram;
                                             
