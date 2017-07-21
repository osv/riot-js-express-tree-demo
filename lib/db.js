const mongoose = require('mongoose');

// Die if env MONGODB_URI is not exists
class DbConnection {
    constructor() {
        if (!process.env.MONGODB_URI) {
            console.log('Please, setup env MONGODB_URI');
            process.exit(1);
        }
        mongoose.Promise = global.Promise;
        this._db = mongoose.createConnection(process.env.MONGODB_URI);
    }

    get db() {
        return this._db;
    }
}

const dbConnection = new DbConnection();
module.exports = dbConnection;
