const mongoose = require('mongoose');
const Tab = require('../../src/models/tab');

describe('Tab Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create & save tab successfully', async () => {
        const validTab = new Tab({
            userId: new mongoose.Types.ObjectId(),
            url: 'https://www.example.com',
            title: 'Example Website'
        });
        const savedTab = await validTab.save();
        
        expect(savedTab._id).toBeDefined();
        expect(savedTab.url).toBe(validTab.url);
        expect(savedTab.title).toBe(validTab.title);
    });

    it('should fail to save tab with invalid URL', async () => {
        const invalidTab = new Tab({
            userId: new mongoose.Types.ObjectId(),
            url: 'not-a-valid-url',
            title: 'Invalid URL'
        });
        let err;
        try {
            await invalidTab.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should fail to save tab without required fields', async () => {
        const tabWithoutRequiredField = new Tab({
            userId: new mongoose.Types.ObjectId(),
            url: 'https://www.example.com'
        });
        let err;
        try {
            await tabWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.title).toBeDefined();
    });
});
