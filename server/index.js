const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const cron = require('node-cron');
const dotenv = require('dotenv');
const { sendTelegramNotification } = require('./telegramBot');
const trayRoutes = require('./routes/trayRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple landing page route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Egg Incubator Tracker</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
          color: #2c3e50;
          text-align: center;
        }
        .status {
          padding: 15px;
          background-color: #e8f5e9;
          border-left: 4px solid #4caf50;
          margin-bottom: 20px;
        }
        button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background-color: #388e3c;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        input, select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Egg Incubator Tracker</h1>
        <div class="status">
          <strong>Status:</strong> Telegram notifications active! Using chat ID: ${process.env.TELEGRAM_CHAT_ID || 'Not configured'}
        </div>
        
        <h2>Add New Tray</h2>
        <form id="trayForm">
          <div class="form-group">
            <label for="door">Door:</label>
            <select id="door" required>
              <option value="Left">Left</option>
              <option value="Right">Right</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="row">Row:</label>
            <select id="row" required>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="position">Position:</label>
            <select id="position" required>
              <option value="Front">Front</option>
              <option value="Middle">Middle</option>
              <option value="Back">Back</option>
            </select>
          </div>
          
          <button type="submit">Add Tray</button>
        </form>
        
        <div id="message" style="margin-top: 20px;"></div>
      </div>
      
      <script>
        document.getElementById('trayForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const trayData = {
            door: document.getElementById('door').value,
            row: document.getElementById('row').value,
            position: document.getElementById('position').value,
            addedDate: new Date()
          };
          
          try {
            const response = await fetch('/api/trays', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(trayData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
              document.getElementById('message').innerHTML = '<div style="padding: 10px; background-color: #e8f5e9; border-left: 4px solid #4caf50;">Tray added successfully! Telegram notification sent.</div>';
              document.getElementById('trayForm').reset();
            } else {
              document.getElementById('message').innerHTML = '<div style="padding: 10px; background-color: #ffebee; border-left: 4px solid #f44336;">Error: ' + data.message + '</div>';
            }
          } catch (error) {
            document.getElementById('message').innerHTML = '<div style="padding: 10px; background-color: #ffebee; border-left: 4px solid #f44336;">Error: Could not connect to the server.</div>';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/egg-incubator', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// API routes
app.use('/api/trays', trayRoutes);

// Check for trays that need to be removed (every hour)
cron.schedule('0 * * * *', async () => {
  try {
    const Tray = require('./models/Tray');
    const moment = require('moment');
    
    // Find trays that have been in the incubator for 18 days and haven't been notified
    const traysToRemove = await Tray.find({
      addedDate: { 
        $lte: moment().subtract(18, 'days').toDate() 
      },
      notificationSent: false,
      removed: false
    });
    
    // Send notifications for each tray
    for (const tray of traysToRemove) {
      const message = `Time to remove tray from ${tray.door} door, row ${tray.row}, position ${tray.position}! It has been 18 days since it was added on ${moment(tray.addedDate).format('MMMM Do YYYY')}.`;
      
      // Send Telegram notification
      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        await sendTelegramNotification(message);
      }
      
      // Update tray status
      tray.notificationSent = true;
      await tray.save();
      
      console.log(`Notification sent for tray: ${tray._id}`);
    }
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'up', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
