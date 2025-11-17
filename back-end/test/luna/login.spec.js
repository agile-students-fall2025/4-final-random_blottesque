import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

describe('Auth API (Luna)', function() {
  const testUser = { email: 'test@example.com', password: 'testpassword' };

  it('POST /api/login → authenticates valid user', async function() {
    const res = await request(app).post('/api/login').send(testUser);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('POST /api/login → rejects bad password', async function() {
    const res = await request(app)
      .post('/api/login')
      .send({ email: testUser.email, password: 'wrong' });
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/signup → registers new user', async function() {
    const newUser = { email: 'luna1@example.com', password: 'password123' };
    const res = await request(app).post('/api/signup').send(newUser);
    expect(res.status).to.be.oneOf([200, 201]);
    expect(res.body).to.include.keys(['id', 'email']);
  });
});