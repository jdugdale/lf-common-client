require('dotenv').config();

module.exports = {
    Store: require('./lib/store').Store,
    Accounts: require('./lib/accounts').Accounts
};