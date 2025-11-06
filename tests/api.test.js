// tests/api.test.js

import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Coffee from '../src/models/Coffee.js';
import Order from '../src/models/Order.js';



beforeAll(async () => {
  const testMongoUri = process.env.MONGO_URI.replace('/boutique_cafe', '/boutique_cafe_test');
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(testMongoUri);
  }
});

beforeEach(async () => {
  await User.deleteMany({});
  await Coffee.deleteMany({});
  await Order.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('API Imaginary Couscous', () => {

  let userToken;
  let adminToken;
  let coffeeId;

  beforeEach(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'admin@test.com',
        password: 'password123',
        role: 'ADMIN'
      });
    
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });
    adminToken = adminRes.body.accessToken;

    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user@test.com',
        password: 'password123'
      });

    const userRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@test.com',
        password: 'password123'
      });
    userToken = userRes.body.accessToken;

    const coffeeRes = await request(app)
      .post('/api/coffees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Espresso', price: 3.5 });
    coffeeId = coffeeRes.body._id;
  });

  describe('POST /api/auth', () => {
    it('devrait inscrire un nouvel utilisateur (201)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@test.com',
          password: 'password123'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Utilisateur créé avec succès.');
    });

    it('ne devrait pas inscrire un utilisateur avec un email existant (409)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user@test.com',
          password: 'password123'
        });
      expect(res.statusCode).toBe(409);
    });

    it('devrait connecter un utilisateur existant (200)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@test.com',
          password: 'password123'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
    });

    it('ne devrait pas connecter un utilisateur avec un mot de passe erroné (401)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@test.com',
          password: 'wrongpassword'
        });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Sécurité des Endpoints', () => {
    it('devrait refuser l\'accès à une route protégée sans token (401)', async () => {
      const res = await request(app).post('/api/orders').send({});
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toContain('token manquant');
    });

    it('devrait refuser l\'accès à une route protégée avec un mauvais token (401)', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', 'Bearer tokeninvalide123')
        .send({});
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toContain('non valide');
    });

    it('devrait refuser l\'accès à une route ADMIN pour un USER (403)', async () => {
      const res = await request(app)
        .delete(`/api/coffees/${coffeeId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain('Rôle insuffisant');
    });

    it('devrait rejeter une requête avec des données invalides (422)', async () => {
      const res = await request(app)
        .post('/api/coffees')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Café sans prix',
          price: -5
        });
      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/coffees (Pagination)', () => {
    it('devrait renvoyer une liste paginée de cafés', async () => {
      const res = await request(app).get('/api/coffees?page=1&limit=5');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('limit', 5);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
    });
  });

  describe('DELETE /api/coffees/:id (Admin)', () => {
    it('devrait autoriser un ADMIN à supprimer un café (204)', async () => {
      const res = await request(app)
        .delete(`/api/coffees/${coffeeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(204);
    });
  });

  describe('POST /api/orders', () => {
    it('devrait créer une commande pour un utilisateur connecté (201)', async () => {
      const orderData = {
        items: [
          { coffeeId: coffeeId, quantity: 2 }
        ]
      };

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('total', 7);
      expect(res.body.items[0].name).toBe('Test Espresso');
    });
  });

  describe('GET /api/status (Rate Limit Global)', () => {
    it.skip('devrait bloquer après 100 requêtes (429)', async () => {
      jest.setTimeout(20000);

      const requests = [];
      for (let i = 0; i < 105; i++) {
        requests.push(request(app).get('/api/status'));
      }

      const responses = await Promise.all(requests);
      
      const lastResponse = responses[responses.length - 1];
      expect(lastResponse.statusCode).toBe(429);
      expect(lastResponse.text).toContain('Trop de requêtes');

    }, 20000);
  });

});