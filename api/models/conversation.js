const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const conversationSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", required: false, default: null },
    messagesCount: { type: Number, required: false, default: 0 },
    unreadCount: { type: Number, required: false, default: 0 },
    live: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

conversationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Conversation', conversationSchema);
