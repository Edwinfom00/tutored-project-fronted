# Frontend Next.js – IDS AI System

## Pages principales

### 1. Dashboard (`/dashboard`)
- Vue globale sur les métriques du modèle, l’historique d’entraînement, et les logs de tests.

### 2. Settings (`/settings`)
- **Configuration réelle** des seuils d’alerte (sliders) et des modules actifs (toggles).
- Les modifications sont **persistées côté backend** via l’API `/api/settings`.
- Design moderne, feedback utilisateur (succès/erreur).

### 3. Rules (`/rules`)
- **Gestion dynamique des règles de détection** (ajout, édition, suppression).
- Les règles sont stockées côté backend via l’API `/api/rules`.
- Édition inline, ajout rapide, suppression, feedback utilisateur.

### 4. Threats (`/threats`)
- Présentation pédagogique de toutes les attaques détectées par le système.
- Explications, méthodes de détection, mitigations, exemples.

## Endpoints backend utilisés
- `GET/POST /api/settings` : lecture et modification des paramètres système.
- `GET/POST /api/rules` : lecture et modification des règles de détection.

## Prérequis
- Le backend Flask doit être lancé et accessible sur `http://localhost:5000`.
- Les routes `/api/settings` et `/api/rules` doivent être enregistrées côté backend.

## Nouveautés UI/UX
- Design moderne (cards, sliders, toggles, édition inline, feedback visuel).
- Pages 100% interactives et synchronisées avec le backend.

---

Pour toute modification, voir aussi le README backend.
