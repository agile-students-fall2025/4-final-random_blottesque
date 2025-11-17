import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

describe('Profile API (Cyryl)', () => {
  it('signup → get → update profile', async () => {
    const email = `user${Date.now()}@example.com`;
    const signup = await request(app).post('/api/signup').send({
      email,
      password: 'pw123',
      name: 'Demo',
    });
    expect(signup.status).to.be.oneOf([200, 201]);
    expect(signup.body).to.include.keys(['id', 'email']);
    const id = signup.body.id;

    const read = await request(app).get(`/api/users/${id}`);
    expect(read.status).to.equal(200);
    expect(read.body).to.include({ id, email });
    expect(read.body).to.not.have.property('password');

    const put = await request(app).put(`/api/users/${id}`).send({
      name: 'Updated Name',
      phone: '212-555-0101',
    });
    expect(put.status).to.equal(200);
    expect(put.body).to.include({ id, email, name: 'Updated Name' });
    expect(put.body).to.have.property('phone', '212-555-0101');
  });

  it('login returns token for seeded test user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'testpassword' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });
});
