const Store = require('./store').Store;
const crypto = require('crypto');

class Accounts {

    async create(userId, userName, password) {
        const salt = makeSalt();
        const hashed = hash(password, salt);

        const s = new Store();
        await s.post('accts-' + userName, {
            userId,
            userName,
            pwd: hashed,
            pwdSalt: salt
        });
    }

    async getUser(userName, password) {
        const s = new Store();
        let user = await s.getJSON('accts-' + userName);
        const hashed = hash(password, user.pwdSalt);
        if (hashed !== user.pwd) throw new Error('Invalid credentials');
        else return {
            userId: user.userId,
            userName: userName
        };
    }
}


function makeSalt() {
    var bytes = Buffer.from(new Date().toJSON(), 'utf16le');
    return crypto.createHash('sha1').update(bytes).digest('base64');
}

function hash(pass, salt) {
    var bytes = Buffer.from(pass || '', 'utf16le');
    var src = Buffer.from(salt || '', 'base64');
    var dst = Buffer.alloc(src.length + bytes.length);
    src.copy(dst, 0, 0, src.length);
    bytes.copy(dst, src.length, 0, bytes.length);

    return crypto.createHash('sha1').update(dst).digest('base64');
}

module.exports = { Accounts };