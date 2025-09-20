import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/prisma.client';

describe('Auth API Integration', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany(); // Clear test DB
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /api/auth/register - success', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'pass123',
      name: 'Test',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({ email: 'test@example.com', role: 'user' });
  });

  it('POST /api/auth/register - duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'pass123',
    });
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'pass123',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });

  it('POST /api/auth/login - success', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'pass123',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'pass123',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/auth/login - invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrong',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });
});