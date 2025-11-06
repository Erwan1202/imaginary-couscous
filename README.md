# imaginary-couscous

API Express sécurisée pour une boutique de cafés. Ce dépôt fournit une API REST avec authentification JWT, gestion des rôles (USER / ADMIN), validation des entrées et bonnes pratiques de sécurité.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation & démarrage](#installation--d%C3%A9marrage)
- [Variables d'environnement](#variables-denvironnement)
- [Structure des Endpoints de l'API](#structure-des-endpoints-de-lapi)
- [Exemples d'appels (cURL)](#exemples-dappels-curl)
- [Tests](#tests)
- [Contribuer](#contribuer)

## Fonctionnalités

- Authentification JWT (inscription / connexion).
- Hachage sécurisé des mots de passe (`bcrypt`).
- Contrôle d'accès par rôles (USER / ADMIN).
- Validation des entrées (`express-validator`).
- Limitation de débit (rate limiting).
- Sécurisation des en-têtes HTTP (`helmet`) et configuration CORS.
- CRUD pour les ressources : Utilisateurs, Cafés, Commandes.

## Technologies

- Node.js
- Express
- MongoDB + Mongoose
- jsonwebtoken
- bcrypt
- express-validator
- express-rate-limit
- helmet
- cors
- dotenv
- Jest + Supertest (tests)

## Prérequis

- Node.js (>= 16 recommandé)
- MongoDB en local ou accessible via URI

## Installation & démarrage

1. Clonez le dépôt :

```bash
git clone <repo-url>
cd imaginary-couscous
```

2. Installez les dépendances :

```bash
npm install
```

3. Créez un fichier `.env` (exemples ci-dessous) puis lancez :

```bash
npm start
```

Pour le développement vous pouvez utiliser `npm run dev` si un script `dev` est défini (vérifiez `package.json`).

## Variables d'environnement

Créez un fichier `.env` à la racine et définissez au minimum :

```env
# URL de connexion à votre base de données MongoDB
MONGO_URI="mongodb://localhost:27017/boutique_cafe"

# Clé secrète pour signer les tokens JWT (doit être longue et aléatoire)
JWT_SECRET="VOTRE_SECRET_JWT_TRES_COMPLIQUE_ICI"

# Port (optionnel)
PORT=3000
```

## Structure des Endpoints de l'API

Les routes protégées nécessitent un header `Authorization: Bearer <token>`.

### Authentification (`/api/auth`)

- `POST /api/auth/register` — Créer un nouvel utilisateur.
- `POST /api/auth/login` — Authentifier et recevoir un `accessToken` (JWT).

### Cafés (`/api/coffees`)

- `GET /api/coffees` — Récupérer la liste de tous les cafés (supporte pagination : `?page=1&limit=10`).
- `GET /api/coffees/:id` — Récupérer un café par son ID.
- `POST /api/coffees` — (Protégé) Créer un nouveau café.
- `PUT /api/coffees/:id` — (Protégé) Mettre à jour un café.
- `DELETE /api/coffees/:id` — (Protégé - Admin) Supprimer un café.

### Commandes (`/api/orders`)

- `POST /api/orders` — (Protégé) Créer une nouvelle commande.
- `GET /api/orders/my-orders` — (Protégé) Récupérer l'historique des commandes de l'utilisateur connecté.
- `GET /api/orders/:id` — (Protégé) Récupérer une commande par son ID.

Notes :

- "Protégé" signifie que l'utilisateur doit être authentifié (JWT).
- Pagination : utilisez `page` et `limit` pour paginer les listes.

## Exemples d'appels (cURL)

Inscription d'un utilisateur :

```bash
curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"secret"}'
```

Connexion (retourne un token) :

```bash
curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"secret"}'
```

Récupérer la liste des cafés (page 1, 10 par page) :

```bash
curl "http://localhost:3000/api/coffees?page=1&limit=10"
```

Créer un café (route protégée) :

```bash
curl -X POST http://localhost:3000/api/coffees \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <VOTRE_TOKEN>" \
    -d '{"name":"Café Arabica","price":3.5,"description":"Notes fruits rouges"}'
```

## Tests

Lancez la suite de tests :

```bash
npm test
```

## Contribuer

Contributions bienvenues — ouvrez une issue ou une PR. Pour des modifications importantes, ouvrez d'abord une issue pour discuter.

---

Si vous voulez, j'ajoute une exportation OpenAPI/Swagger minimale ou des collections Postman/Insomnia pour tester rapidement les endpoints.