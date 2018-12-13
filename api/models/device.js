const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    os: { type: String, required: true },
    type: { type: String, required: false },
    version: { type: String, required: false },
    pusherChannel: { type: String, required: false },
    enabled: { type: Boolean, required: false, default: true },
    lastOnline: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', deviceSchema);
