// Mock service for trays that uses localStorage instead of a backend API
import { checkTrayNotification, prepareTrayNotificationMessage, sendTelegramMessage } from './telegramService';

const STORAGE_KEY = 'egg_incubator_trays';

// Initial demo data
const initialTrays = [
  {
    _id: '1',
    door: 'left',
    row: 1,
    position: 'left',
    addedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    notificationSent: false,
    removed: false,
    notes: 'Demo tray 1 - 15 days old'
  },
  {
    _id: '2',
    door: 'left',
    row: 2,
    position: 'right',
    addedDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000), // 17 days ago
    notificationSent: false,
    removed: false,
    notes: 'Demo tray 2 - Almost ready to be removed'
  },
  {
    _id: '3',
    door: 'right',
    row: 3,
    position: 'left',
    addedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
    notificationSent: true,
    removed: false,
    notes: 'Demo tray 3 - Ready to be removed!'
  },
  {
    _id: '4',
    door: 'right',
    row: 1,
    position: 'right',
    addedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    notificationSent: true,
    removed: true,
    removedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Removed yesterday
    notes: 'Demo tray 4 - Already removed'
  }
];

// Initialize localStorage if needed
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTrays));
  }
};

// Check for trays that need notifications
const checkNotifications = () => {
  initStorage();
  const trays = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
  const traysToNotify = trays.filter(tray => checkTrayNotification(tray));
  
  // Send notifications and update status
  if (traysToNotify.length > 0) {
    const updatedTrays = trays.map(tray => {
      if (traysToNotify.some(t => t._id === tray._id)) {
        // Send notification
        const message = prepareTrayNotificationMessage(tray);
        sendTelegramMessage(message).catch(err => console.error('Erreur lors de l\'envoi du message Telegram:', err));
        
        // Mark notification as sent
        return {
          ...tray,
          notificationSent: true
        };
      }
      return tray;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrays));
  }
};

// Get all trays
export const getAllTrays = () => {
  initStorage();
  // Check for notifications when getting trays
  checkNotifications();
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
};

// Get active trays (not removed)
export const getActiveTrays = () => {
  initStorage();
  // Check for notifications when getting active trays
  checkNotifications();
  const trays = JSON.parse(localStorage.getItem(STORAGE_KEY));
  return trays.filter(tray => !tray.removed);
};

// Add a new tray
export const addTray = (trayData) => {
  initStorage();
  const trays = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
  // Check if there's already an active tray in this position
  const existingTray = trays.find(
    t => t.door === trayData.door && 
    t.row === trayData.row && 
    t.position === trayData.position && 
    !t.removed
  );
  
  if (existingTray) {
    throw new Error('Il y a déjà un plateau actif à cette position');
  }
  
  // Create new tray
  const newTray = {
    _id: Date.now().toString(),
    ...trayData,
    notificationSent: false,
    removed: false
  };
  
  // Add to storage
  trays.push(newTray);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trays));
  
  return newTray;
};

// Mark a tray as removed
export const removeTray = (id) => {
  initStorage();
  const trays = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
  const updatedTrays = trays.map(tray => {
    if (tray._id === id) {
      return {
        ...tray,
        removed: true,
        removedDate: new Date()
      };
    }
    return tray;
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrays));
  
  return updatedTrays.find(tray => tray._id === id);
};

// Get a specific tray
export const getTrayById = (id) => {
  initStorage();
  const trays = JSON.parse(localStorage.getItem(STORAGE_KEY));
  return trays.find(tray => tray._id === id);
};

// Update a tray
export const updateTray = (id, updates) => {
  initStorage();
  const trays = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
  const updatedTrays = trays.map(tray => {
    if (tray._id === id) {
      return {
        ...tray,
        ...updates
      };
    }
    return tray;
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrays));
  
  return updatedTrays.find(tray => tray._id === id);
};

// Delete a tray
export const deleteTray = (id) => {
  initStorage();
  const trays = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
  const updatedTrays = trays.filter(tray => tray._id !== id);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrays));
  
  return { success: true };
};
