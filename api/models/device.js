const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    os: { type: String, required: true },
    type: { type: String, required: false },
    version: { type: String, required: false },
    uuid: { type: String, required: true },
    pusherChannel: { type: String, required: false },
    enabled: { type: Boolean, required: false, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastOnline: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', deviceSchema);
