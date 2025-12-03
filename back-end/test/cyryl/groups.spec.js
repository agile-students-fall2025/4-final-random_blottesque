import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

describe('Groups API (Cyryl)', () => {
  let createdGroupId;

  it('GET /api/health → ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('ok', true);
  });

  it('POST /api/groups → creates group with normalized prefs/components', async () => {
    const res = await request(app)
      .post('/api/groups')
      .send({
        name: 'Demo House',
        roommates: ['alice@x.com', 'bob@x.com'],
        components: ['chores', 'inventory'],
        quietHours: { start: '23:00', end: '07:00' },
        preferences: { temperatureF: 70, guestsAllowed: false, smokingAllowed: false, drinkingAllowed: false, partiesAllowed: false, nightTimeGuestsAllowed: false, accommodations: 'None' }
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.include.keys('_id', 'name', 'prefs', 'roommates', 'components');
    expect(res.body.prefs).to.include({ quietStart: '23:00', quietEnd: '07:00', temperatureF: 70, guestsAllowed: false, smokingAllowed: false, drinkingAllowed: false, partiesAllowed: false, nightTimeGuestsAllowed: false, accommodations: 'None' });
    expect(res.body.components).to.deep.equal({ chores: true, expenses: false, inventory: true });
    
    createdGroupId = res.body._id;
  });

  it('GET /api/groups → returns an array', async () => {
    const res = await request(app).get('/api/groups');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('GET /api/groups/:id → returns group', async () => {
    if (!createdGroupId) {
      const createRes = await request(app).post('/api/groups').send({ name: 'Test Group' });
      createdGroupId = createRes.body._id;
    }

    const res = await request(app).get(`/api/groups/${createdGroupId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('name');
  });

  it('PUT /api/groups/:id → updates name and prefs', async () => {
    if (!createdGroupId) {
      const createRes = await request(app).post('/api/groups').send({ name: 'Test Group' });
      createdGroupId = createRes.body._id;
    }

    const res = await request(app)
      .put(`/api/groups/${createdGroupId}`)
      .send({
        name: 'Renamed House',
        quietHours: { start: '21:30' },
        preferences: { temperatureF: 71, smokingAllowed: true, drinkingAllowed: true, partiesAllowed: true, nightTimeGuestsAllowed: true, accommodations: 'None'}, 
      });

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal('Renamed House');
    expect(res.body.prefs.quietStart).to.equal('21:30');
    expect(res.body.prefs.temperatureF).to.equal(71);
    expect(res.body.prefs.smokingAllowed).to.equal(true);
    expect(res.body.prefs.drinkingAllowed).to.equal(true);
    expect(res.body.prefs.partiesAllowed).to.equal(true);
    expect(res.body.prefs.nightTimeGuestsAllowed).to.equal(true);
    expect(res.body.prefs.accommodations).to.equal('None');
  });

  it('GET /api/groups/:id/dashboard → aggregate shape', async () => {
    if (!createdGroupId) {
      const createRes = await request(app).post('/api/groups').send({ name: 'Test Group' });
      createdGroupId = createRes.body._id;
    }

    const res = await request(app).get(`/api/groups/${createdGroupId}/dashboard`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.keys(['group', 'prefs', 'roommates', 'chores', 'expenses', 'inventory']);
  });

  it('GET /api/groups/bad-id → 404', async () => {
    const res = await request(app).get('/api/groups/000000000000000000000000');
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
  });
});
