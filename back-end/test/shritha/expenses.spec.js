import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

// Expenses unit tests
describe('Expenses API (Shritha)', () => {

    // GET expenses array
    it('GET /api/groups/:id/expenses -> returns array', async () => {
        const list = await request(app).get('/api/groups');
        const id = list.body[0].id; // group id

        const res = await request(app).get(`/api/groups/${id}/expenses`);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    // POST new expense
    it('POST /api/groups/:id/expenses -> adds a new expense', async () => {
        const list = await request(app).get('/api/groups');
        const id = list.body[0].id;

        const res = await request(app)
            .post(`/api/groups/${id}/expenses`)
            .send({
                title: 'Groceries',
                amount: 42.50,
                paidBy: 'shritha@gmail.com',
                date: '2025-11-18',
                category: 'Food'
            });

        expect(res.status).to.equal(201);
        expect(res.body).to.include.keys('id', 'title', 'amount');
    });

    // PUT update/edit an expense
    it('PUT /api/groups/:id/expenses/:eid -> edits an expense', async () => {
        const list = await request(app).get('/api/groups');
        const id = list.body[0].id;

        // get one expense or create one
        const all = await request(app).get(`/api/groups/${id}/expenses`);
        let eid;

        if (all.body[0] && all.body[0].id) {
            eid = all.body[0].id;
        } else {
            const exp = await request(app)
                .post(`/api/groups/${id}/expenses`)
                .send({
                    title: 'Internet Bill',
                    amount: 80,
                    paidBy: 'shritha@gmail.com',
                    date: '2025-11-18',
                    category: 'Utilities'
                });
            eid = exp.body.id;
        }

        const res = await request(app)
            .put(`/api/groups/${id}/expenses/${eid}`)
            .send({ amount: 100 });

        expect(res.status).to.equal(200);
        expect(res.body.amount).to.equal(100);
    });

    // DELETE an expense
    it('DELETE /api/groups/:id/expenses/:eid -> deletes an expense', async () => {
        const list = await request(app).get('/api/groups');
        const id = list.body[0].id;

        // get one or create one
        const all = await request(app).get(`/api/groups/${id}/expenses`);
        let eid;

        if (all.body[0] && all.body[0].id) {
            eid = all.body[0].id;
        } else {
            const exp = await request(app)
                .post(`/api/groups/${id}/expenses`)
                .send({
                    title: 'Utilities',
                    amount: 50,
                    paidBy: 'shritha@gmail.com',
                    date: '2025-11-18',
                    category: 'Bills'
                });
            eid = exp.body.id;
        }

        const res = await request(app).delete(`/api/groups/${id}/expenses/${eid}`);

        expect(res.status).to.equal(200);
        expect(res.body.ok).to.equal(true);
    });

    // 404 test
    it('GET /api/groups/:bad/expenses -> returns 404', async () => {
        const res = await request(app).get('/api/groups/__bad__/expenses');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
    });

});
