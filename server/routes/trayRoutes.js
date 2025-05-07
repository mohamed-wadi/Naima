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
    
    console.log('Received egg type:', eggType); // Log pour déboguer
    
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
    
    // Calculate the removal date (18 days for chicken, 25 days for duck)
    const daysToAdd = savedTray.eggType === 'duck' ? 25 : 18;
    const removalDate = moment(savedTray.addedDate).add(daysToAdd, 'days').format('D MMMM YYYY');
    
    // Traduction du type d'œuf
    const eggTypeTranslated = savedTray.eggType === 'duck' ? 'canard' : 'poulet';
    
    // Traduction de la porte
    const doorTranslated = savedTray.door === 'left' ? 'Gauche' : 'Droite';
    
    // Traduction de la position
    const positionTranslated = savedTray.position === 'left' ? 'Gauche' : 'Droite';
    
    // Send confirmation message
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const message = `Salam Naima Mouloua\nPlateau Ajouté\nPorte ${doorTranslated}\nPlateau ${row}\nType : ${eggTypeTranslated}\nAjouté le : ${moment(savedTray.addedDate).format('D MMMM YYYY')}\nRappelez-vous de le retirer avant le : ${removalDate}`;
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
    // Vérifier d'abord si le plateau existe et s'il n'est pas déjà supprimé pour éviter les doublons
    const existingTray = await Tray.findById(req.params.id).lean();
    
    if (!existingTray) {
      return res.status(404).json({ message: 'Plateau non trouvé' });
    }
    
    // Si le plateau est déjà marqué comme supprimé, ne rien faire et renvoyer le plateau tel quel
    // Cela évite les doubles notifications
    if (existingTray.removed) {
      console.log(`Plateau ${req.params.id} déjà supprimé, aucune action requise`);
      return res.status(200).json(existingTray);
    }
    
    // Créer une copie des données du plateau pour le message Telegram
    const trayData = { ...existingTray };
    
    // Mise à jour du plateau avec une seule opération pour améliorer la performance
    const updatedTray = await Tray.findByIdAndUpdate(
      req.params.id,
      { 
        removed: true, 
        removedDate: new Date() 
      },
      { new: true }
    );
    
    // Traduction du type d'œuf
    const eggTypeTranslated = trayData.eggType === 'duck' ? 'canard' : 'poulet';
    
    // Traduction de la porte
    const doorTranslated = trayData.door === 'left' ? 'Gauche' : 'Droite';
    
    // Date d'ajout formatée
    const addedDate = moment(trayData.addedDate).format('D MMMM YYYY');
    
    // Date de retrait formatée
    const removedDate = moment(new Date()).format('D MMMM YYYY');
    
    // Envoyer le message de confirmation une seule fois
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const message = `Salam Naima Mouloua\nPlateau Retiré\nPorte ${doorTranslated}\nPlateau ${trayData.row}\nType : ${eggTypeTranslated}\nAjouté le : ${addedDate}\nRetiré le : ${removedDate}`;
      
      // Envoyer la notification sans attendre la réponse pour améliorer la performance
      sendTelegramNotification(message).catch(err => console.error('Erreur envoi notification Telegram:', err));
    }
    
    // Répondre immédiatement pour améliorer la performance perçue
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
