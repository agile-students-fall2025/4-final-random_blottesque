import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

// Chore unti tests
describe('Chores API (Lina))', () => {
    
    // get chore array
    it('GET /api/groups/:id/chores -> get array', async() => {
        const list = await request(app).get('/api/groups');
        const id = list.body[0].id; // group id

        const res = await request(app).get(`/api/groups/${id}/chores`);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    // add a new chore
    it('POST /api/groups/:id/chores -> add a chore', async() => {
        const list = await request(app).get('/api/groups');
        const id = list.body[0].id; // group id

        const res = await request(app).post(`/api/groups/${id}/chores`).send({
            title: 'Clean Bathroom',
            due: '11/17/2025',
            assignee: 'lina@gmail.com',
            repeat: 'Weekly',
            description: 'Remember to buy paper towels before',
            done: false
        });

        expect(res.status).to.equal(201);
        expect(res.body).to.include.keys('id', 'title', 'due'); // others are optional?
    });

    // update/edit a chore (edit field or mark as done)
    it('PUT /groups/:id/chores/:cid -> edit a chore, changing done field (edit and update are the same)', async () => {
        const list = await request(app).get('/api/groups');
        const id = list.body[0].id; // group id

        // get one tested
        const all = await request(app).get(`/api/groups/${id}/chores`);
        let cid;

        if (all.body[0] && all.body[0].id) {
            cid = all.body[0].id;
        }
        else {
            const chore = await request(app).post(`/api/groups/${id}/chores`).send({
                title: 'Clean Bathroom',
                due: '11/17/2025',
                assignee: 'lina@gmail.com',
                repeat: 'Weekly',
                description: 'Remember to buy paper towels before',
                done: false
            });

            cid = chore.body.id;
        }

        const res = await request(app).put(`/api/groups/${id}/chores/${cid}`).send({ done: true });

        expect(res.status).to.equal(200);
        expect(res.body.done).to.equal(true);
    });

    // delete chore
    it('DELETE /groups/:id/chores/:cid -> delete a chore', async () => {
        const list = await request(app).get('/api/groups');
        const id = list.body[0].id; // group id

        // get one tested
        const all = await request(app).get(`/api/groups/${id}/chores`);
        let cid;

        if (all.body[0] && all.body[0].id) {
            cid = all.body[0].id;
        }
        else {
            const chore = await request(app).post(`/api/groups/${id}/chores`).send({
                title: 'Clean Bathroom',
                due: '11/17/2025',
                assignee: 'lina@gmail.com',
                repeat: 'Weekly',
                description: 'Remember to buy paper towels before',
                done: false
            });

            cid = chore.body.id;
        }

        const res = await request(app).delete(`/api/groups/${id}/chores/${cid}`);

        expect(res.status).to.equal(200);
        expect(res.body.ok).to.equal(true);
    });

    // 404 not found status code
    it ('GET /api/groups/:bad/dashboard -> 404 status code', async () => {
        const res = await request(app).get('/api/groups/__bad__/chores');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
    });
});