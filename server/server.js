const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');

// Modèles
const Tray = require('./models/Tray');

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes API
const router = express.Router();

// Récupérer tous les plateaux
router.get('/trays', async (req, res) => {
  try {
    const trays = await Tray.find();
    res.json(trays);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Récupérer les plateaux actifs (non retirés)
router.get('/trays/active', async (req, res) => {
  try {
    const trays = await Tray.find({ removed: false });
    res.json(trays);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ajouter un nouveau plateau
router.post('/trays', async (req, res) => {
  try {
    // Vérifier si un plateau actif existe déjà à cette position
    const existingTray = await Tray.findOne({
      door: req.body.door,
      row: req.body.row,
      position: req.body.position,
      removed: false
    });

    if (existingTray) {
      return res.status(400).json({ message: 'Il y a déjà un plateau actif à cette position' });
    }

    const newTray = new Tray({
      door: req.body.door,
      row: req.body.row,
      position: req.body.position,
      addedDate: req.body.addedDate,
      notes: req.body.notes,
      eggType: req.body.eggType || 'chicken',
      notificationSent: false,
      removed: false
    });

    const savedTray = await newTray.save();
    res.status(201).json(savedTray);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Marquer un plateau comme retiré
router.patch('/trays/:id/remove', async (req, res) => {
  try {
    const tray = await Tray.findById(req.params.id);
    
    if (!tray) {
      return res.status(404).json({ message: 'Plateau non trouvé' });
    }
    
    tray.removed = true;
    tray.removedDate = new Date();
    
    const updatedTray = await tray.save();
    res.json(updatedTray);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mettre à jour un plateau
router.patch('/trays/:id', async (req, res) => {
  try {
    const tray = await Tray.findById(req.params.id);
    
    if (!tray) {
      return res.status(404).json({ message: 'Plateau non trouvé' });
    }
    
    // Mettre à jour les champs modifiables
    if (req.body.notes !== undefined) tray.notes = req.body.notes;
    if (req.body.notificationSent !== undefined) tray.notificationSent = req.body.notificationSent;
    
    const updatedTray = await tray.save();
    res.json(updatedTray);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Vérifier les plateaux qui nécessitent une notification
const checkNotifications = async () => {
  try {
    // Trouver les plateaux qui ont 18 jours ou plus et qui n'ont pas encore reçu de notification
    const now = new Date();
    const eighteenDaysAgo = new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000);
    
    const traysToNotify = await Tray.find({
      addedDate: { $lte: eighteenDaysAgo },
      notificationSent: false,
      removed: false
    });
    
    // Envoyer des notifications pour chaque plateau
    for (const tray of traysToNotify) {
      // Préparer le message
      const doorName = tray.door === 'left' ? 'Gauche' : 'Droite';
      const addedDate = new Date(tray.addedDate).toLocaleDateString('fr-FR');
      const daysInIncubator = Math.ceil((now - new Date(tray.addedDate)) / (1000 * 60 * 60 * 24));
      
      const message = `🚨 <b>ALERTE: Plateau prêt à être retiré</b> 🚨\n\n` +
        `Porte: <b>${doorName}</b>\n` +
        `Plateau: <b>N°${tray.row}</b>\n` +
        `Date d'ajout: <b>${addedDate}</b>\n` +
        `Jours dans la couveuse: <b>${daysInIncubator}</b>\n\n` +
        `Ce plateau a atteint ou dépassé la période d'incubation de 18 jours et est prêt à être retiré.`;
      
      // Envoyer la notification Telegram
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        try {
          await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
              chat_id: TELEGRAM_CHAT_ID,
              text: message,
              parse_mode: 'HTML'
            }
          );
          
          // Marquer la notification comme envoyée
          tray.notificationSent = true;
          await tray.save();
          
          console.log(`Notification envoyée pour le plateau ${tray._id}`);
        } catch (err) {
          console.error('Erreur lors de l\'envoi de la notification Telegram:', err);
        }
      }
    }
  } catch (err) {
    console.error('Erreur lors de la vérification des notifications:', err);
  }
};

// Associer le routeur à l'API
app.use('/api', router);

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  
  // Vérifier les notifications toutes les heures
  setInterval(checkNotifications, 60 * 60 * 1000);
  
  // Vérifier les notifications au démarrage
  checkNotifications();
});
