const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);
