import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

describe('Inventory API (Sunil)', () => {
  it('GET /api/groups/:id/inventory → aggregate shape', async () => {
    const list = await request(app).get('/api/groups');
    const id = list.body[0].id;
    expect(list.body[0]).to.have.property('inventory');

    const inventory = await request(app).get(`/api/groups/${id}/inventory`);
    expect(inventory.status).to.equal(200);
    expect(inventory.body).to.be.an('array');
  });

  it('Check all fields valid', async () => {
    const list = await request(app).get('/api/groups');
    const id = list.body[0].id;

    //Get inventory
    const inventory = await request(app).get(`/api/groups/${id}/inventory`);

    expect(inventory.status).to.equal(200);
    expect(inventory.body).to.be.an('array');

    inventory.body.forEach(item => {
      expect(item).to.include.keys(['id', 'name', 'status']);
      expect(item.id).to.be.a('string').that.is.not.empty;
      expect(item.name).to.be.a('string').that.is.not.empty;
      expect(item.status).to.be.a('string').that.is.not.empty;
    });
  });

  it('GET /api/groups/:bad/dashboard → 404', async () => {
    const res = await request(app).get('/api/groups/__bad__/inventory');
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
  });
});
