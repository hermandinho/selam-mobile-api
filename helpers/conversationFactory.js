const Conversation = require('../api/models/conversation');

exports.getConversation = async (sender, receiver) => {
    let cv = await Conversation.findOne({
        $or: [
            { $and: [{ sender: sender._id }, { receiver: receiver._id }] },
            { $and: [{ sender: receiver._id }, { receiver: sender._id }] },
        ]
    }).exec();

    if(!cv) {
        cv = await new Conversation({
            sender: sender._id,
            receiver: receiver._id,
            lastMessage: null,
            unreadCount: 0
        }).save();
    }

    return Promise.resolve(cv);
};