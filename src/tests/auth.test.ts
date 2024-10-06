import request from 'supertest';
import app from '../index';  

describe('Auth API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({ email: 'test@example.com', password: 'password123' });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should login a user and return a JWT token', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});


