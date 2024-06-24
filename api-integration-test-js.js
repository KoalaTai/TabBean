const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/user');
const Tab = require('../../src/models/tab');
const KnowledgeBase = require('../../src/models/knowledgeBase');

let token;

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useUnifiedTopology: true });
  
  // Create a test user and get JWT token
  const testUser = new User({
    auth0Id: 'auth0|123456',
    email: 'test@example.com',
    name: 'Test User'
  });
  await testUser.save();
  
  const response = await request(app)
    .post('/api/auth/token')
    .send({ code: 'test_code' });
  
  token = response.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Tab API', () => {
  beforeEach(async () => {
    await Tab.deleteMany({});
  });

  test('Should create a new tab', async () => {
    const response = await request(app)
      .post('/api/tabs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        url: 'https://example.com',
        title: 'Example Website'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.url).toBe('https://example.com');
    expect(response.body.title).toBe('Example Website');
  });

  test('Should get all tabs for a user', async () => {
    await Tab.create([
      { userId: 'auth0|123456', url: 'https://example1.com', title: 'Example 1' },
      { userId: 'auth0|123456', url: 'https://example2.com', title: 'Example 2' }
    ]);

    const response = await request(app)
      .get('/api/tabs')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });
});

describe('Knowledge Base API', () => {
  beforeEach(async () => {
    await KnowledgeBase.deleteMany({});
  });

  test('Should create a new knowledge base entry', async () => {
    const response = await request(app)
      .post('/api/knowledge-base')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Entry',
        content: 'This is a test entry content',
        tags: ['test', 'integration']
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('Test Entry');
    expect(response.body.tags).toContain('test');
    expect(response.body.tags).toContain('integration');
  });

  test('Should search knowledge base', async () => {
    await KnowledgeBase.create([
      { userId: 'auth0|123456', title: 'Test Entry 1', content: 'Content 1', tags: ['test'] },
      { userId: 'auth0|123456', title: 'Test Entry 2', content: 'Content 2', tags: ['integration'] }
    ]);

    const response = await request(app)
      .get('/api/knowledge-base/search?q=test')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
