const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    content: String,
});

module.exports = mongoose.model('Document', DocumentSchema);
