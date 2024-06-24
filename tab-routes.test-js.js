const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const tabRoutes = require('../../src/routes/tabs');
const Tab = require('../../src/models/tab');
const auth = require('../../src/middleware/auth');

jest.mock('../../src/middleware/auth');

const app = express();
app.use(express.json());
app.use('/api/tabs', tabRoutes);

describe('Tab Routes Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(() => {
        auth.mockImplementation((req, res, next) => {
            req.user = { sub: new mongoose.Types.ObjectId() };
            next();
        });
    });

    afterEach(async () => {
        await Tab.deleteMany();
    });

    it('should create a new tab', async () => {
        const res = await request(app)
            .post('/api/tabs')
            .send({
                url: 'https://www.example.com',
                title: 'Example Website'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.url).toBe('https://www.example.com');
        expect(res.body.title).toBe('Example Website');
    });

    it('should get all tabs for a user', async () => {
        const userId = new mongoose.Types.ObjectId();
        await Tab.create([
            { userId, url: 'https://www.example1.com', title: 'Example 1' },
            { userId, url: 'https://www.example2.com', title: 'Example 2' }
        ]);

        auth.mockImplementation((req, res, next) => {
            req.user = { sub: userId };
            next();
        });

        const res = await request(app).get('/api/tabs');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(2);
    });

    it('should update a tab', async () => {
        const tab = await Tab.create({
            userId: new mongoose.Types.ObjectId(),
            url: 'https://www.example.com',
            title: 'Example Website'
        });

        const res = await request(app)
            .put(`/api/tabs/${tab._id}`)
            .send({
                url: 'https://www.updated-example.com',
                title: 'Updated Example Website'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.url).toBe('https://www.updated-example.com');
        expect(res.body.title).toBe('Updated Example Website');
    });

    it('should delete a tab', async () => {
        const tab = await Tab.create({
            userId: new mongoose.Types.ObjectId(),
            url: 'https://www.example.com',
            title: 'Example Website'
        });

        const res = await request(app).delete(`/api/tabs/${tab._id}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Tab deleted successfully');

        const deletedTab = await Tab.findById(tab._id);
        expect(deletedTab).toBeNull();
    });
});
