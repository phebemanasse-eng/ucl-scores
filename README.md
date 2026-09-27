# UCL Scores — version sécurisée

## Ce qui est sécurisé
La clé `FOOTBALL_DATA_TOKEN` est lue uniquement par `server.js`.
Le navigateur appelle `/api/matches` et `/api/standings`; il ne reçoit jamais le token.

## Installation
Prérequis: Node.js 18 ou plus récent.

1. Copie `.env.example` vers `.env`.
2. Mets ton token football-data.org dans `.env`.
3. Dans ce dossier:
   npm install
   npm start
4. Ouvre: http://localhost:3000

## Mise en ligne
Déploie le dossier sur un hébergeur Node.js (Render, Railway, Fly.io, VPS, etc.) et ajoute
`FOOTBALL_DATA_TOKEN` comme variable d'environnement dans les réglages de l'hébergeur.
Ne mets jamais le token dans `public/script.js`.

## Important
Le token montré dans ton e-mail/capture a été exposé. Pour une utilisation publique,
demande/récupère un nouveau token auprès de football-data.org avant de déployer.
