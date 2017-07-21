const mongoose = require('mongoose'),
      db = require('../lib/db.js').db,
      Schema = mongoose.Schema;

var CompanySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    earnings: {required: true, type: Number},
    parentId: { type: Schema.Types.ObjectId, ref: 'Company' }
});

module.exports = db.model('Company', CompanySchema);
