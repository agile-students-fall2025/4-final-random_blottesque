import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

describe('Groups API (Cyryl)', () => {
  it('GET /api/health → ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('ok', true);
  });

  it('GET /api/groups → returns an array', async () => {
    const res = await request(app).get('/api/groups');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').that.is.not.empty;
    expect(res.body[0]).to.include.keys('id', 'name', 'prefs');
  });

  it('POST /api/groups → creates group with normalized prefs/components', async () => {
    const res = await request(app)
      .post('/api/groups')
      .send({
        name: 'Demo House',
        roommates: ['alice@x.com', 'bob@x.com'],
        components: ['chores', 'inventory'], // array shape
        quietHours: { start: '23:00', end: '07:00' },
        preferences: { temperatureF: 70, guestsAllowed: false }
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.include.keys('id', 'name', 'prefs', 'roommates', 'components');
    expect(res.body.prefs).to.include({ quietStart: '23:00', quietEnd: '07:00', temperatureF: 70, guestsAllowed: false });
    expect(res.body.components).to.deep.equal({ chores: true, expenses: false, inventory: true });
  });

  it('PUT /api/groups/:id → updates name and prefs via quietHours/preferences', async () => {
    const list = await request(app).get('/api/groups');
    const id = list.body[0].id;

    const res = await request(app)
      .put(`/api/groups/${id}`)
      .send({
        name: 'Renamed House',
        quietHours: { start: '21:30' },
        preferences: { temperatureF: 71 }
      });

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal('Renamed House');

    // ensure DB actually updated
    const read = await request(app).get(`/api/groups/${id}`);
    expect(read.status).to.equal(200);
    expect(read.body.prefs.quietStart).to.equal('21:30');
    expect(read.body.prefs.temperatureF).to.equal(71);
  });

  it('GET /api/groups/:id/dashboard → aggregate shape', async () => {
    const list = await request(app).get('/api/groups');
    const id = list.body[0].id;

    const res = await request(app).get(`/api/groups/${id}/dashboard`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.keys(['group', 'prefs', 'roommates', 'chores', 'expenses', 'inventory']);
  });

  it('GET /api/groups/bad-id → 404', async () => {
    const res = await request(app).get('/api/groups/__nope__');
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
  });
});
