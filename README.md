# Egg Incubator Tracker

Une application de suivi d'incubateur d'œufs qui permet de gérer les plateaux d'incubation et de suivre leur progression.

## Fonctionnalités

- Interface visuelle de l'incubateur avec portes gauche et droite
- Ajout et retrait de plateaux avec dates
- Suivi automatique des jours d'incubation
- Notifications Telegram pour les plateaux prêts à être retirés
- Historique complet avec exportation Excel
- Interface en français

## Stack Technique

- **Frontend**: React, styled-components
- **Backend**: Node.js, Express
- **Base de données**: MongoDB
- **Notifications**: API Telegram Bot

## Installation

1. Clonez ce dépôt
2. Installez les dépendances du projet principal:
   ```
   npm install
   ```
3. Installez les dépendances du client:
   ```
   cd client && npm install
   ```

## Configuration des Notifications Telegram

1. Créez un nouveau bot via [@BotFather](https://t.me/botfather) sur Telegram
2. Copiez le token du bot fourni par BotFather
3. Créez un fichier `.env` à la racine du projet avec les variables suivantes:
   ```
   TELEGRAM_BOT_TOKEN=votre_token_bot
   TELEGRAM_CHAT_ID=votre_chat_id
   MONGODB_URI=votre_uri_mongodb
   PORT=3001
   ```
4. Créez un fichier `.env` dans le dossier client avec les variables suivantes:
   ```
   REACT_APP_TELEGRAM_BOT_TOKEN=votre_token_bot
   REACT_APP_TELEGRAM_CHAT_ID=votre_chat_id
   REACT_APP_API_URL=http://localhost:3001/api
   ```

## Lancement de l'Application

Pour lancer l'application en mode développement:

```
npm run dev
```

Cette commande lancera à la fois le serveur backend et l'application React.

## Déploiement

L'application est configurée pour un déploiement facile sur Railway:

1. Connectez votre dépôt GitHub à Railway
2. Configurez les variables d'environnement sur Railway
3. Railway détectera automatiquement le package.json et déploiera l'application

## Licence

MIT
