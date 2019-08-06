require('dotenv').config();

const Store = require('../index').Store;

describe('Store suite', () => {
    const defaultTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    describe('on create Store object', () => {
        it('should use supplied params', async() => {
            let s = new Store(process.env.LF_URL, process.env.LF_API_KEY, process.env.LF_CLIENT_ID);
            let val = await s.getJSON('test20');
            expect(typeof val).toBe('object');
        })
    })

    describe('when trying to get value', () => {
        it('should fail if no key', async() => {
            let s = new Store();
            try {
                let val = await s.get();
                fail();
            } catch (err) {
                expect(err.message).toBe('Missing required key');
            }
        })

        it('should get the posted value', async() => {
            let date = new Date();
            let s = new Store();
            await s.post('test21', { date });
            let val = await s.getJSON('test21');
            expect(typeof val).toBe('object');
            expect(new Date(val.date).toUTCString()).toBe(date.toUTCString());
        })
    })

    describe('when trying to list blobs', () => {
        it('should get the list', async() => {
            let s = new Store();
            await s.post('bunch/test1', { prop: 'val' });
            let val = await s.list('bunch/');
            expect(val).toEqual(['test1']);
        })
    })

    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = defaultTimeout;
    })
})