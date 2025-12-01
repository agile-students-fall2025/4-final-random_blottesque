import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

describe('Profile API (Cyryl)', () => {
  let userId;
  let testEmail;

  it('signup → creates new user', async () => {
    testEmail = `user${Date.now()}@example.com`;
    const signup = await request(app).post('/api/signup').send({
      email: testEmail,
      password: 'pw123456',
      name: 'Demo User',
    });
    
    expect(signup.status).to.be.oneOf([200, 201]);
    expect(signup.body).to.include.keys(['token', 'user']);
    expect(signup.body.user).to.have.property('email', testEmail);
    expect(signup.body.user).to.not.have.property('password');
    
    userId = signup.body.user._id || signup.body.user.id;
  });

  it('GET /api/users/:id → returns user without password', async () => {
    if (!userId) {
      testEmail = `user${Date.now()}@example.com`;
      const signup = await request(app).post('/api/signup').send({
        email: testEmail,
        password: 'pw123456',
      });
      userId = signup.body.user._id || signup.body.user.id;
    }

    const read = await request(app).get(`/api/users/${userId}`);
    expect(read.status).to.equal(200);
    expect(read.body).to.have.property('email');
    expect(read.body).to.not.have.property('password');
  });

  it('PUT /api/users/:id → updates profile', async () => {
    if (!userId) {
      testEmail = `user${Date.now()}@example.com`;
      const signup = await request(app).post('/api/signup').send({
        email: testEmail,
        password: 'pw123456',
      });
      userId = signup.body.user._id || signup.body.user.id;
    }

    const put = await request(app).put(`/api/users/${userId}`).send({
      name: 'Updated Name',
      phone: '212-555-0101',
    });
    
    expect(put.status).to.equal(200);
    expect(put.body).to.include({ name: 'Updated Name' });
    expect(put.body).to.have.property('phone', '212-555-0101');
  });

  it('login returns token for existing user', async () => {
    const email = `logintest${Date.now()}@example.com`;
    await request(app).post('/api/signup').send({
      email,
      password: 'testpassword123'
    });

    const res = await request(app)
      .post('/api/login')
      .send({ email, password: 'testpassword123' });
    
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    expect(res.body).to.have.property('user');
  });

  it('login rejects invalid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'nonexistent@example.com', password: 'wrongpassword' });
    
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('error');
  });
});
