const request = require('request');
const baseUrl = 'https://lf-common.azurewebsites.net/api/store/';

class Store {
    /**
     * The Store object is key/value storage
     * @param {string} apiKey Can be empty if .env has value of LF_API_KEY
     * @param {string} clientId Can be empty if .env has value of LF_CLIENT_ID
     */
    constructor(apiKey, clientId) {
        this.apiKey = apiKey || process.env.LF_API_KEY;
        this.clientId = clientId || process.env.LF_CLIENT_ID;
        if(!this.apiKey || !this.clientId) throw new Error('You must supply an apiKey and a clientId');
    }

    /**
     * Gets a string value from the store
     * @param {string} key - *Required*
     */
    async get(key) {
        if (!key) throw new Error('Missing required key');
        const options = {
            url: baseUrl + '?path=' + key,
            headers: {
                'x-functions-key': this.apiKey,
                'x-client-id': this.clientId
            }
        };

        return new Promise((resolve, reject) => {
            request(options, (err, res) => {
                if(res.statusCode === 401)
                    throw new Error('Invalid key');
                if (err) reject(err);
                else resolve(res.body);
            });
        });
    }

    async getJSON(key) {
        if (!key) throw new Error('Missing required key');
        const options = {
            url: baseUrl + '?path=' + key,
            headers: {
                'x-functions-key': this.apiKey,
                'x-client-id': this.clientId
            }
        };

        return new Promise((resolve, reject) => {
            request(options, (err, res) => {
                if(res.statusCode === 401)
                    throw new Error('Invalid key');

                if (err) reject(err);
                else resolve(JSON.parse(res.body));
            });
        });
    }

    async list(dir) {
        if(!dir) throw new Error('Missing dir');
        const options = {
            url: baseUrl + '?list=' + dir,
            headers: {
                'x-functions-key': this.apiKey,
                'x-client-id': this.clientId
            }
        };

        return new Promise((resolve, reject) => {
            request(options, (err, res) => {
                if(res.statusCode === 401)
                    throw new Error('Invalid key');

                if (err) reject(err);
                else resolve(JSON.parse(res.body));
            });
        });
    }

    async post(key, value) {
        const options = {
            url: baseUrl + '?path=' + key,
            headers: {
                'x-functions-key': this.apiKey,
                'x-client-id': this.clientId
            },
            method: 'POST',
            body: value,
            json: typeof value === 'object'
        };

        return new Promise((resolve, reject) => {
            request(options, (err, res) => {
                if(res.statusCode === 401)
                    throw new Error('Invalid key');
                if(res.statusCode !== 200)
                    throw new Error(res.statusMessage);
                if (err) reject(err);
                else resolve(res.body);
            });
        });
    }
}

module.exports = {
    Store
};