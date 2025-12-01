import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

describe('Expenses API (Shritha)', () => {
  let groupId;
  let expenseId;

  before(async () => {
    // Create a test group first
    const createRes = await request(app)
      .post('/api/groups')
      .send({
        name: 'Expenses Test Group',
        roommates: ['shritha@gmail.com', 'test@gmail.com']
      });
    groupId = createRes.body._id;
  });

  it('GET /api/groups/:id/expenses → returns array', async () => {
    const res = await request(app).get(`/api/groups/${groupId}/expenses`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /api/groups/:id/expenses → creates an expense', async () => {
    const res = await request(app)
      .post(`/api/groups/${groupId}/expenses`)
      .send({
        description: 'Groceries',
        amount: 45.50,
        paidBy: { email: 'shritha@gmail.com' },
        youOwe: true
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.include.keys('id', 'description', 'amount');
    expect(res.body.description).to.equal('Groceries');
    expect(res.body.amount).to.equal(45.50);
    
    expenseId = res.body.id || res.body._id;
  });

  it('PUT /api/groups/:id/expenses/:eid → updates expense', async () => {
    if (!expenseId) {
      const expense = await request(app)
        .post(`/api/groups/${groupId}/expenses`)
        .send({ description: 'Test Expense', amount: 10 });
      expenseId = expense.body.id || expense.body._id;
    }

    const res = await request(app)
      .put(`/api/groups/${groupId}/expenses/${expenseId}`)
      .send({ amount: 50.00 });

    expect(res.status).to.equal(200);
    expect(res.body.amount).to.equal(50.00);
  });

  it('DELETE /api/groups/:gid/expenses/:eid → deletes expense', async () => {
    // Create an expense to delete
    const expense = await request(app)
      .post(`/api/groups/${groupId}/expenses`)
      .send({ description: 'Expense to Delete', amount: 25 });
    
    const eid = expense.body.id || expense.body._id;

    const res = await request(app)
      .delete(`/api/groups/${groupId}/expenses/${eid}`);

    expect(res.status).to.equal(200);
    expect(res.body.ok).to.equal(true);
  });

  it('GET /api/groups/:bad/expenses → 404', async () => {
    const res = await request(app).get('/api/groups/000000000000000000000000/expenses');
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
  });

  it('POST /api/groups/:id/expenses → validates required fields', async () => {
    const res = await request(app)
      .post(`/api/groups/${groupId}/expenses`)
      .send({ amount: 10 }); // Missing description

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });
});
