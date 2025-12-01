import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

describe('Dashboard API (Cyryl)', () => {
  let groupId;

  before(async () => {
    // Create a test group first
    const createRes = await request(app)
      .post('/api/groups')
      .send({
        name: 'Dashboard Test Group',
        roommates: ['test@example.com'],
        components: ['chores', 'expenses', 'inventory']
      });
    groupId = createRes.body._id || createRes.body.id;
  });

  it('GET /api/groups/:id/dashboard → aggregate shape', async () => {
    const res = await request(app).get(`/api/groups/${groupId}/dashboard`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.keys(['group', 'prefs', 'roommates', 'chores', 'expenses', 'inventory']);
    expect(res.body.group).to.include.keys('id', 'name');
    expect(res.body.prefs).to.include.keys('quietStart', 'quietEnd', 'temperatureF', 'guestsAllowed');
    expect(res.body.roommates).to.be.an('array');
    expect(res.body.chores).to.be.an('array');
    expect(res.body.expenses).to.be.an('array');
    expect(res.body.inventory).to.be.an('array');
  });

  it('GET /api/groups/:bad/dashboard → 404', async () => {
    const res = await request(app).get('/api/groups/000000000000000000000000/dashboard');
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
  });

  it('GET /api/health → ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('ok', true);
    expect(res.body).to.have.property('ts');
  });
});
