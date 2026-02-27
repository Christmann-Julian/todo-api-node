# Todo API

![Release](https://img.shields.io/github/v/release/Christmann-Julian/todo-api-node)
![Build](https://img.shields.io/github/actions/workflow/status/Christmann-Julian/todo-api-node/ci.yml?branch=develop)
![Tests](https://img.shields.io/badge/tests-jest%20%2B%20supertest-blue)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Christmann-Julian_todo-api-node&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Christmann-Julian_todo-api-node)
![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen)

Une API REST simple pour gérer des TODOs, construite avec Express et une base SQL embarquée.

## État

Cette documentation et les badges sont prêts — certains badges (build, coverage, npm) deviendront pleinement fonctionnels lorsque l'intégration continue (GitHub Actions) et la publication seront configurées.

## Démarrage rapide

Prérequis:

- Node.js (>= 16)

Installation:

```bash
npm install
```

Lancer l'API en développement (rechargement manuel si nécessaire):

```bash
npm run dev
```

Lancer en production:

```bash
npm start
```

Lancer les tests (Jest + couverture):

```bash
npm test
```

## Structure principale

- `app.js` — point d'entrée de l'application
- `routes/` — routes Express (`todo.js`, `utils.js`)
- `database/` — accès et initialisation de la base
- `api/` — exposition d'API / documentation (Swagger)
- `__tests__/` — tests unitaires et d'intégration

## Endpoints (exemples)

Les routes principales se trouvent dans `routes/todo.js`. Exemple d'usage :

- GET /todos — liste toutes les TODOs
- POST /todos — crée une nouvelle TODO (payload JSON)
- PUT /todos/:id — met à jour une TODO
- DELETE /todos/:id — supprime une TODO

Consultez `docs/swagger.yml` et `api/index.js` pour la documentation OpenAPI/Swagger.

## Scripts utiles (depuis `package.json`)

- `npm start` — démarre l'app
- `npm run dev` — démarre en mode dev (watch)
- `npm test` — lance Jest et génère la couverture
- `npm run lint` — lance ESLint
- `npm run format` — formate avec Prettier

## Contribuer

1. Forkez le dépôt
2. Créez une branche feature: `git checkout -b feat/ma-fonction`
3. Ajoutez des tests et documentez votre modification
4. Ouvrez une Pull Request

## Suggestions / prochaines étapes

- Ajouter une pipeline GitHub Actions pour exécuter `npm test` et publier la couverture (Codecov)
- Ajouter un badge de licence dans `package.json` (champ `license`) si vous souhaitez en afficher un
- Publier le package sur npm si vous voulez un badge npm/version

---

Project: `todo-api-node` — auteur: dépôt GitHub `Christmann-Julian/todo-api-node`.

Pour toute question ou amélioration, ouvrez une issue dans le dépôt.
