const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    live: { type: Boolean, default: true },
    currency: { type: String, default: 'CFA' },
});

module.exports = mongoose.model('Country', countrySchema);
