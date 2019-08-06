require('dotenv').config();

const Accounts = require('../index').Accounts;

describe('Accounts suite', () => {
    const defaultTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    describe('when creating accounts', () => {
        it('should succeed', async() => {
            const a = new Accounts();
            await a.create('test-id', 'user345', 'shapeofflakes#43');
            let user = await a.getUser('user345', 'shapeofflakes#43');
            expect(user.userId).toBe('test-id');
        })
    })

    describe('when getting user', () => {
        it('should fail if bad password', async() => {
            const a = new Accounts();
            await a.create('test-id', 'user345', 'shapeofflakes#43');
            try {
                let user = await a.getUser('user345', 'badpasswrd');
                fail('should throw an error');
            } catch (err) {
                expect(err.message).toBe('Invalid credentials');
            }
        })
    })

    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = defaultTimeout;
    })
})