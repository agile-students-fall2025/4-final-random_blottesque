import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

describe('Auth API (Luna)', function() {
  let testEmail;
  let testPassword = 'testpassword123';

  before(async () => {
    // Create a test user
    testEmail = `luna${Date.now()}@example.com`;
    await request(app).post('/api/signup').send({
      email: testEmail,
      password: testPassword
    });
  });

  it('POST /api/login → authenticates valid user', async function() {
    const res = await request(app)
      .post('/api/login')
      .send({ email: testEmail, password: testPassword });
    
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    expect(res.body).to.have.property('user');
    expect(res.body.user).to.have.property('email', testEmail);
  });

  it('POST /api/login → rejects bad password', async function() {
    const res = await request(app)
      .post('/api/login')
      .send({ email: testEmail, password: 'wrongpassword' });
    
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/login → rejects non-existent user', async function() {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'nonexistent@example.com', password: 'anypassword' });
    
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/signup → registers new user', async function() {
    const newEmail = `luna${Date.now()}new@example.com`;
    const res = await request(app)
      .post('/api/signup')
      .send({ email: newEmail, password: 'password123', name: 'Luna Test' });
    
    expect(res.status).to.be.oneOf([200, 201]);
    expect(res.body).to.include.keys(['token', 'user']);
    expect(res.body.user).to.have.property('email', newEmail);
  });

  it('POST /api/signup → rejects duplicate email', async function() {
    const res = await request(app)
      .post('/api/signup')
      .send({ email: testEmail, password: 'password123' });
    
    expect(res.status).to.equal(409);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/signup → validates email format', async function() {
    const res = await request(app)
      .post('/api/signup')
      .send({ email: 'invalid-email', password: 'password123' });
    
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/signup → validates password length', async function() {
    const res = await request(app)
      .post('/api/signup')
      .send({ email: 'test@example.com', password: '12345' });
    
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });
});
