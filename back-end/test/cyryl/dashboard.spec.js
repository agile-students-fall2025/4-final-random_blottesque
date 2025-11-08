import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

describe('Dashboard API (Cyryl)', () => {
  it('GET /api/groups/:id/dashboard → aggregate shape', async () => {
    const list = await request(app).get('/api/groups');
    const id = list.body[0].id;

    const res = await request(app).get(`/api/groups/${id}/dashboard`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.keys(['group', 'prefs', 'roommates', 'chores', 'expenses', 'inventory']);
    expect(res.body.group).to.include.keys('id', 'name');
    expect(res.body.prefs).to.include.keys('quietStart', 'quietEnd', 'temperatureF', 'guestsAllowed');
    expect(res.body.roommates).to.be.an('array');
    expect(res.body.chores).to.be.an('array');
    expect(res.body.expenses).to.be.an('array');
    expect(res.body.inventory).to.be.an('array');
  });

  it('Derived counts (client logic parity): choresDue & expense sums are computable', async () => {
    const list = await request(app).get('/api/groups');
    const id = list.body[0].id;

    const res = await request(app).get(`/api/groups/${id}/dashboard`);
    const { chores, expenses } = res.body;

    const choresDue = chores.filter(c => !c.done).length;
    const youOwe = expenses.filter(e => e.youOwe).reduce((s, e) => s + Number(e.amount || 0), 0);
    const youreOwed = expenses.filter(e => !e.youOwe).reduce((s, e) => s + Number(e.amount || 0), 0);

    expect(choresDue).to.be.a('number').that.is.gte(0);
    expect(youOwe).to.be.a('number');
    expect(youreOwed).to.be.a('number');
  });

  it('GET /api/groups/:bad/dashboard → 404', async () => {
    const res = await request(app).get('/api/groups/__bad__/dashboard');
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
  });
});
