import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

describe('Chores API (Lina)', () => {
    let groupId;
    let choreId;

    before(async () => {
        // Create a test group first
        const createRes = await request(app)
            .post('/api/groups')
            .send({
                name: 'Chores Test Group',
                roommates: ['lina@gmail.com', 'test@gmail.com']
            });
        groupId = createRes.body._id;
    });

    it('GET /api/groups/:id/chores → returns array', async () => {
        const res = await request(app).get(`/api/groups/${groupId}/chores`);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    it('POST /api/groups/:id/chores → creates a chore', async () => {
        const res = await request(app)
            .post(`/api/groups/${groupId}/chores`)
            .send({
                title: 'Clean Bathroom',
                due: '2025-11-17',
                assignee: 'lina@gmail.com',
                repeat: 'Weekly',
                description: 'Remember to buy paper towels before'
            });

        expect(res.status).to.equal(201);
        expect(res.body).to.include.keys('id', 'title');
        expect(res.body.title).to.equal('Clean Bathroom');
        
        choreId = res.body.id || res.body._id;
    });

    it('PUT /api/groups/:id/chores/:cid → updates done field', async () => {
        if (!choreId) {
            const chore = await request(app)
                .post(`/api/groups/${groupId}/chores`)
                .send({ title: 'Test Chore' });
            choreId = chore.body.id || chore.body._id;
        }

        const res = await request(app)
            .put(`/api/groups/${groupId}/chores/${choreId}`)
            .send({ done: true });

        expect(res.status).to.equal(200);
        expect(res.body.done).to.equal(true);
    });

    it('PUT /api/groups/:id/chores/:cid → updates title', async () => {
        if (!choreId) {
            const chore = await request(app)
                .post(`/api/groups/${groupId}/chores`)
                .send({ title: 'Test Chore' });
            choreId = chore.body.id || chore.body._id;
        }

        const res = await request(app)
            .put(`/api/groups/${groupId}/chores/${choreId}`)
            .send({ title: 'Updated Title' });

        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal('Updated Title');
    });

    it('DELETE /api/groups/:gid/chores/:cid → deletes a chore', async () => {
        // Create a chore to delete
        const chore = await request(app)
            .post(`/api/groups/${groupId}/chores`)
            .send({ title: 'Chore to Delete' });
        
        const cid = chore.body.id || chore.body._id;

        const res = await request(app)
            .delete(`/api/groups/${groupId}/chores/${cid}`);

        expect(res.status).to.equal(200);
        expect(res.body.ok).to.equal(true);
    });

    it('GET /api/groups/:bad/chores → returns 404', async () => {
        const res = await request(app).get('/api/groups/000000000000000000000000/chores');
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
    });
});
