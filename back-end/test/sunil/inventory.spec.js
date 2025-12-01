import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

describe('Inventory API (Sunil)', () => {
  let groupId;
  let itemId;

  before(async () => {
    // Create a test group first
    const createRes = await request(app)
      .post('/api/groups')
      .send({
        name: 'Inventory Test Group',
        roommates: ['sunil@gmail.com']
      });
    groupId = createRes.body._id;
  });

  it('GET /api/groups/:id/inventory → returns array', async () => {
    const res = await request(app).get(`/api/groups/${groupId}/inventory`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /api/groups/:id/inventory → creates item', async () => {
    const res = await request(app)
      .post(`/api/groups/${groupId}/inventory`)
      .send({
        name: 'Milk',
        status: 'Low',
        info: 'Need to buy more'
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.include.keys('id', 'name', 'status');
    expect(res.body.name).to.equal('Milk');
    expect(res.body.status).to.equal('Low');
    
    itemId = res.body.id || res.body._id;
  });

  it('Check all fields valid', async () => {
    // Add an item first
    await request(app)
      .post(`/api/groups/${groupId}/inventory`)
      .send({ name: 'Dish Soap', status: 'Good' });

    const inventory = await request(app).get(`/api/groups/${groupId}/inventory`);

    expect(inventory.status).to.equal(200);
    expect(inventory.body).to.be.an('array');

    inventory.body.forEach(item => {
      expect(item).to.include.keys(['_id', 'name', 'status']);
      expect(item._id).to.be.a('string').that.is.not.empty;
      expect(item.name).to.be.a('string').that.is.not.empty;
      expect(item.status).to.be.a('string').that.is.not.empty;
    });
  });

  it('PUT /api/groups/:id/inventory/:iid → updates item', async () => {
    if (!itemId) {
      const item = await request(app)
        .post(`/api/groups/${groupId}/inventory`)
        .send({ name: 'Test Item', status: 'Good' });
      itemId = item.body.id || item.body._id;
    }

    const res = await request(app)
      .put(`/api/groups/${groupId}/inventory/${itemId}`)
      .send({ status: 'Full' });

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('Full');
  });

  it('DELETE /api/groups/:gid/inventory/:iid → deletes item', async () => {
    // Create an item to delete
    const item = await request(app)
      .post(`/api/groups/${groupId}/inventory`)
      .send({ name: 'Item to Delete', status: 'Low' });
    
    const iid = item.body.id || item.body._id;

    const res = await request(app)
      .delete(`/api/groups/${groupId}/inventory/${iid}`);

    expect(res.status).to.equal(200);
    expect(res.body.ok).to.equal(true);
  });

  it('GET /api/groups/:bad/inventory → 404', async () => {
    const res = await request(app).get('/api/groups/000000000000000000000000/inventory');
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
  });
});