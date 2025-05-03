// Service pour envoyer des notifications Telegram
const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

/**
 * Envoie un message au groupe Telegram
 * @param {string} message - Le message à envoyer
 * @returns {Promise} - La réponse de l'API Telegram
 */
export const sendTelegramMessage = async (message) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Les tokens Telegram ne sont pas configurés');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message Telegram:', error);
    return null;
  }
};

/**
 * Vérifie si un plateau nécessite une notification
 * @param {Object} tray - Le plateau à vérifier
 * @returns {boolean} - True si le plateau nécessite une notification
 */
export const checkTrayNotification = (tray) => {
  if (tray.removed || tray.notificationSent) {
    return false;
  }

  const addedDate = new Date(tray.addedDate);
  const now = new Date();
  const diffTime = Math.abs(now - addedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 18;
};

/**
 * Prépare un message de notification pour un plateau
 * @param {Object} tray - Le plateau pour lequel créer une notification
 * @returns {string} - Le message formaté
 */
export const prepareTrayNotificationMessage = (tray) => {
  const doorName = tray.door === 'left' ? 'Gauche' : 'Droite';
  const addedDate = new Date(tray.addedDate).toLocaleDateString('fr-FR');
  const daysInIncubator = calculateDaysInIncubator(tray.addedDate);

  return `🚨 <b>ALERTE: Plateau prêt à être retiré</b> 🚨\n\n` +
    `Porte: <b>${doorName}</b>\n` +
    `Plateau: <b>N°${tray.row}</b>\n` +
    `Date d'ajout: <b>${addedDate}</b>\n` +
    `Jours dans la couveuse: <b>${daysInIncubator}</b>\n\n` +
    `Ce plateau a atteint ou dépassé la période d'incubation de 18 jours et est prêt à être retiré.`;
};

/**
 * Calcule le nombre de jours dans l'incubateur
 * @param {Date} addedDate - La date d'ajout du plateau
 * @returns {number} - Le nombre de jours
 */
const calculateDaysInIncubator = (addedDate) => {
  const added = new Date(addedDate);
  const now = new Date();
  const diffTime = Math.abs(now - added);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
