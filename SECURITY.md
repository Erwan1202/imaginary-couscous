# Politique de sécurité

Ce document décrit les mesures de sécurité implémentées dans l'API `imaginary-couscous`.

## Mesures de sécurité implémentées

* **Authentification JWT** : L'accès aux routes sensibles (création, mise à jour, suppression) est protégé. Les utilisateurs doivent s'authentifier via `/api/auth/login` pour obtenir un `accessToken` (Bearer token) valide.
* **Hachage des mots de passe** : Les mots de passe des utilisateurs ne sont jamais stockés en clair. Ils sont hachés en utilisant `bcrypt` (avec un salt de 10) avant d'être sauvegardés dans la base de données.
* **Contrôle d'accès basé sur les rôles (RBAC)** : L'API distingue les rôles `USER` et `ADMIN`. Les actions critiques (ex: `DELETE /api/coffees`) sont restreintes au rôle `ADMIN`.
* **Validation des entrées** : Toutes les données envoyées à l'API (via `req.body` ou `req.query`) sont validées et nettoyées par `express-validator`. Les requêtes contenant des données non valides sont rejetées avec un statut `422 Unprocessable Entity`.
* **Limitation de débit (Rate Limiting)** : `express-rate-limit` est utilisé pour protéger l'API contre les attaques par force brute et le déni de service. Une limite globale est en place, ainsi qu'une limite plus stricte sur les routes d'authentification (`/api/auth`).
* **Sécurité des en-têtes HTTP** : `helmet` est utilisé pour configurer divers en-têtes HTTP de sécurité (ex: X-Content-Type-Options, Strict-Transport-Security) afin de protéger contre des attaques courantes comme le XSS et le clickjacking.
* **Configuration CORS** : L'API n'autorise que des origines spécifiques (ex: `http://localhost:5173`) à lui envoyer des requêtes, empêchant ainsi les attaques de type Cross-Site Request Forgery (CSRF) depuis des domaines non autorisés.
* **Logging** : `morgan` est utilisé pour journaliser toutes les requêtes HTTP, fournissant une piste d'audit pour le débogage et la surveillance de la sécurité.

## Preuves de test

La sécurité de l'API est validée par une suite de tests d'intégration (Jest + Supertest) qui vérifie automatiquement les points suivants :

* Les routes protégées renvoient bien une erreur `401 Unauthorized` si aucun token (ou un token invalide) n'est fourni.
* Les routes réservées aux administrateurs renvoient bien une erreur `403 Forbidden` si un utilisateur avec le rôle `USER` tente d'y accéder.
* Les requêtes avec des données invalides (ex: un prix négatif) renvoient bien une erreur `422 Unprocessable Entity`.
* La connexion avec un mot de passe erroné renvoie bien une erreur `401 Unauthorized`.# Politique de sécurité

Ce document décrit les mesures de sécurité implémentées dans l'API `imaginary-couscous`.

## Mesures de sécurité implémentées

* **Authentification JWT** : L'accès aux routes sensibles (création, mise à jour, suppression) est protégé. Les utilisateurs doivent s'authentifier via `/api/auth/login` pour obtenir un `accessToken` (Bearer token) valide.
* **Hachage des mots de passe** : Les mots de passe des utilisateurs ne sont jamais stockés en clair. Ils sont hachés en utilisant `bcrypt` (avec un salt de 10) avant d'être sauvegardés dans la base de données.
* **Contrôle d'accès basé sur les rôles (RBAC)** : L'API distingue les rôles `USER` et `ADMIN`. Les actions critiques (ex: `DELETE /api/coffees`) sont restreintes au rôle `ADMIN`.
* **Validation des entrées** : Toutes les données envoyées à l'API (via `req.body` ou `req.query`) sont validées et nettoyées par `express-validator`. Les requêtes contenant des données non valides sont rejetées avec un statut `422 Unprocessable Entity`.
* **Limitation de débit (Rate Limiting)** : `express-rate-limit` est utilisé pour protéger l'API contre les attaques par force brute et le déni de service. Une limite globale est en place, ainsi qu'une limite plus stricte sur les routes d'authentification (`/api/auth`).
* **Sécurité des en-têtes HTTP** : `helmet` est utilisé pour configurer divers en-têtes HTTP de sécurité (ex: X-Content-Type-Options, Strict-Transport-Security) afin de protéger contre des attaques courantes comme le XSS et le clickjacking.
* **Configuration CORS** : L'API n'autorise que des origines spécifiques (ex: `http://localhost:5173`) à lui envoyer des requêtes, empêchant ainsi les attaques de type Cross-Site Request Forgery (CSRF) depuis des domaines non autorisés.
* **Logging** : `morgan` est utilisé pour journaliser toutes les requêtes HTTP, fournissant une piste d'audit pour le débogage et la surveillance de la sécurité.

## Preuves de test

La sécurité de l'API est validée par une suite de tests d'intégration (Jest + Supertest) qui vérifie automatiquement les points suivants :

* Les routes protégées renvoient bien une erreur `401 Unauthorized` si aucun token (ou un token invalide) n'est fourni.
* Les routes réservées aux administrateurs renvoient bien une erreur `403 Forbidden` si un utilisateur avec le rôle `USER` tente d'y accéder.
* Les requêtes avec des données invalides (ex: un prix négatif) renvoient bien une erreur `422 Unprocessable Entity`.
* La connexion avec un mot de passe erroné renvoie bien une erreur `401 Unauthorized`.