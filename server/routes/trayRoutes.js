const express = require('express');
const router = express.Router();
const Tray = require('../models/Tray');
const moment = require('moment');
const { sendTelegramNotification } = require('../telegramBot');

// Get all trays
router.get('/', async (req, res) => {
  try {
    const trays = await Tray.find().sort({ addedDate: -1 });
    res.json(trays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active trays (not removed)
router.get('/active', async (req, res) => {
  try {
    const trays = await Tray.find({ removed: false }).sort({ addedDate: 1 });
    res.json(trays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new tray
router.post('/', async (req, res) => {
  try {
    const { door, row, position, addedDate, notes, eggType } = req.body;
    
    // Check if there's already an active tray in this position
    const existingTray = await Tray.findOne({
      door,
      row,
      position,
      removed: false
    });
    
    if (existingTray) {
      return res.status(400).json({ 
        message: 'There is already an active tray in this position' 
      });
    }
    
    // Create new tray
    const newTray = new Tray({
      door,
      row,
      position,
      eggType: eggType || 'chicken', // Utiliser le type d'oeuf sélectionné ou 'chicken' par défaut
      addedDate: addedDate || new Date(),
      notes
    });
    
    const savedTray = await newTray.save();
    
    // Calculate the removal date (18 days from added date)
    const removalDate = moment(savedTray.addedDate).add(18, 'days').format('MMMM Do YYYY');
    
    // Send confirmation message
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const message = `New tray added to ${door} door, row ${row}, ${position} position. Remember to remove it on ${removalDate}!`;
      await sendTelegramNotification(message);
    }
    
    res.status(201).json(savedTray);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark a tray as removed
router.patch('/:id/remove', async (req, res) => {
  try {
    const tray = await Tray.findById(req.params.id);
    
    if (!tray) {
      return res.status(404).json({ message: 'Tray not found' });
    }
    
    tray.removed = true;
    tray.removedDate = new Date();
    
    const updatedTray = await tray.save();
    
    // Send confirmation message
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const message = `Tray from ${tray.door} door, row ${tray.row}, ${tray.position} position has been marked as removed.`;
      await sendTelegramNotification(message);
    }
    
    res.json(updatedTray);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific tray
router.get('/:id', async (req, res) => {
  try {
    const tray = await Tray.findById(req.params.id);
    
    if (!tray) {
      return res.status(404).json({ message: 'Tray not found' });
    }
    
    res.json(tray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a tray
router.patch('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const tray = await Tray.findByIdAndUpdate(
      req.params.id, 
      updates,
      { new: true }
    );
    
    if (!tray) {
      return res.status(404).json({ message: 'Tray not found' });
    }
    
    res.json(tray);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a tray
router.delete('/:id', async (req, res) => {
  try {
    const tray = await Tray.findById(req.params.id);
    
    if (!tray) {
      return res.status(404).json({ message: 'Tray not found' });
    }
    
    await Tray.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tray deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
