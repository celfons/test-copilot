import request from 'supertest';
import { Express } from 'express';
import { createApp } from './app';

describe('API Integration Tests', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp();
  });

  describe('Health Check', () => {
    it('GET /health should return ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });

  describe('User CRUD Operations', () => {
    describe('POST /api/users', () => {
      it('should create a new user', async () => {
        const response = await request(app).post('/api/users').send({
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
        });

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe('John Doe');
        expect(response.body.data.email).toBe('john@example.com');
        expect(response.body.data.age).toBe(30);
      });

      it('should return 400 for invalid data', async () => {
        const response = await request(app).post('/api/users').send({
          name: '',
          email: 'invalid-email',
          age: -1,
        });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
      });

      it('should return 409 for duplicate email', async () => {
        await request(app).post('/api/users').send({
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
        });

        const response = await request(app).post('/api/users').send({
          name: 'Jane Doe',
          email: 'john@example.com',
          age: 25,
        });

        expect(response.status).toBe(409);
        expect(response.body.type).toBe('ConflictError');
      });
    });

    describe('GET /api/users', () => {
      it('should return all users', async () => {
        await request(app).post('/api/users').send({
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
        });

        await request(app).post('/api/users').send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          age: 25,
        });

        const response = await request(app).get('/api/users');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveLength(2);
      });

      it('should return empty array when no users', async () => {
        const response = await request(app).get('/api/users');

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(0);
      });
    });

    describe('GET /api/users/:id', () => {
      it('should return a user by id', async () => {
        const createResponse = await request(app).post('/api/users').send({
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
        });

        const userId = createResponse.body.data.id;
        const response = await request(app).get(`/api/users/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data.id).toBe(userId);
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app).get('/api/users/non-existent-id');

        expect(response.status).toBe(404);
        expect(response.body.type).toBe('NotFoundError');
      });
    });

    describe('PUT /api/users/:id', () => {
      it('should update a user', async () => {
        const createResponse = await request(app).post('/api/users').send({
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
        });

        const userId = createResponse.body.data.id;
        const response = await request(app).put(`/api/users/${userId}`).send({
          name: 'Jane Doe',
          age: 25,
        });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data.name).toBe('Jane Doe');
        expect(response.body.data.age).toBe(25);
        expect(response.body.data.email).toBe('john@example.com');
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app).put('/api/users/non-existent-id').send({
          name: 'Jane Doe',
        });

        expect(response.status).toBe(404);
        expect(response.body.type).toBe('NotFoundError');
      });

      it('should return 409 when email is already in use', async () => {
        await request(app).post('/api/users').send({
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
        });

        const createResponse = await request(app).post('/api/users').send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          age: 25,
        });

        const userId = createResponse.body.data.id;
        const response = await request(app).put(`/api/users/${userId}`).send({
          email: 'john@example.com',
        });

        expect(response.status).toBe(409);
        expect(response.body.type).toBe('ConflictError');
      });
    });

    describe('DELETE /api/users/:id', () => {
      it('should delete a user', async () => {
        const createResponse = await request(app).post('/api/users').send({
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
        });

        const userId = createResponse.body.data.id;
        const response = await request(app).delete(`/api/users/${userId}`);

        expect(response.status).toBe(204);

        const getResponse = await request(app).get(`/api/users/${userId}`);
        expect(getResponse.status).toBe(404);
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app).delete('/api/users/non-existent-id');

        expect(response.status).toBe(404);
        expect(response.body.type).toBe('NotFoundError');
      });
    });
  });
});
