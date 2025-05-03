const TelegramBot = require('node-telegram-bot-api');

/**
 * Sends a notification message to Telegram
 * @param {string} message - The message to send
 * @returns {Promise<boolean>} - Success status
 */
const sendTelegramNotification = async (message) => {
  try {
    // Check if Telegram credentials are available
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      console.log('Telegram credentials not set. Skipping notification.');
      return false;
    }

    // Create a bot instance
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
    
    // Send message
    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
    console.log('Telegram notification sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return false;
  }
};

module.exports = { sendTelegramNotification };
