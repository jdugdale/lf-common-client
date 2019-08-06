const request = require('request');

class Store {
    /**
     * The Store object is key/value storage
     * @param {string} baseUrl Can be empty if .env has value of LF_URL
     * @param {string} apiKey Can be empty if .env has value of LF_API_KEY
     * @param {string} clientId Can be empty if .env has value of LF_CLIENT_ID
     */
    constructor(baseUrl, apiKey, clientId) {
        this.baseUrl = baseUrl || process.env.LF_URL;
        this.apiKey = apiKey || process.env.LF_API_KEY;
        this.clientId = clientId || process.env.LF_CLIENT_ID;
        if (!this.apiKey || !this.clientId) throw new Error('You must supply an apiKey and a clientId');
    }

    /**
     * Gets a string value from the store
     * @param {string} key - *Required*
     */
    async get(key) {
        if (!key) throw new Error('Missing required key');
        const options = {
            url: this.baseUrl + 'store?path=' + key,
            headers: {
                'x-functions-key': this.apiKey,
                'x-client-id': this.clientId
            }
        };

        return new Promise((resolve, reject) => {
            request(options, (err, res) => {
                if (err) reject(err);
                else {
                    if (res.statusCode === 401)
                        throw new Error('Invalid key');
                    resolve(res.body);
                }
            });
        });
    }

    async getJSON(key) {
        if (!key) throw new Error('Missing required key');
        const options = {
            url: this.baseUrl + 'store?path=' + key,
            headers: {
                'x-functions-key': this.apiKey,
                'x-client-id': this.clientId
            }
        };

        return new Promise((resolve, reject) => {
            request(options, (err, res) => {
                if (err) reject(err);
                else {
                    if (res.statusCode === 401)
                        throw new Error('Invalid key');

                    resolve(JSON.parse(res.body));
                }
            });
        });
    }

    async list(dir) {
        if (!dir) throw new Error('Missing dir');
        const options = {
            url: this.baseUrl + 'store?list=' + dir,
            headers: {
                'x-functions-key': this.apiKey,
                'x-client-id': this.clientId
            }
        };

        return new Promise((resolve, reject) => {
            request(options, (err, res) => {
                if (err) reject(err);
                else {
                    if (res.statusCode === 401)
                        throw new Error('Invalid key');
                    resolve(JSON.parse(res.body));
                }
            });
        });
    }

    async post(key, value) {
        const options = {
            url: this.baseUrl + 'store?path=' + key,
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
                if (err) reject(err);
                else {
                    if (res.statusCode === 401)
                        throw new Error('Invalid key');
                    if (res.statusCode !== 200)
                        throw new Error(res.statusMessage);
                    resolve(res.body);
                }
            });
        });
    }
}

module.exports = {
    Store
};