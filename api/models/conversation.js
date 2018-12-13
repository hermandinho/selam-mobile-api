const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", required: false, default: null },
    messagesCount: { type: Number, required: false, default: 0 },
    unreadCount: { type: Number, required: false, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', conversationSchema);
