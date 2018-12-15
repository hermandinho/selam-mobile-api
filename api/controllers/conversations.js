const Conversation = require('../models/conversation');
const Factory = require('../../helpers/conversationFactory')


exports.fetch = (req, res, next) => {
    const me = req.userData.id;
    Conversation.find({ lastMessage: { $ne: null },
        $or: [
            {sender: me},
            {receiver: me},
        ]
    }).populate([
        { path: 'lastMessage', select: 'type content status trigger sent_at', populate: { path: 'trigger', select: 'name picture' } },
        { path: 'sender', select: 'name picture' },
        { path: 'receiver', select: 'name picture' },
    ])
    .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.find = (req, res, next) => {
    Conversation.findById(req.params.id)
        .exec()
        .then(conversation => {
            if (!conversation) {
                return res.status(404).json({
                    message: "Conversation  not found"
                });
            }
            res.status(200).json({conversation});
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = (req, res, next) => {
    const conversation = new Conversation({
        sender: req.body.sender,
        receiver: req.body.receiver,
        lastMessage: req.body.lastMessage,
        messagesCount: req.body.messagesCount,
        unreadCount: req.body.unreadCount,
    });
    conversation.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Success",
                data: {
                    _id: result._id,
                    sender: result.sender,
                    receiver: result.receiver,
                    lastMessage: result.lastMessage,
                    messagesCount: result.messagesCount,
                    unreadCount: result.unreadCount,
                    created_at: result.created_at,
                    updated_at: result.updated_at
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.delete = (req, res, next) => {
    Conversation.remove({_id: req.params.id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Success"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.patch = (req, res, next) => {

    Conversation.findByIdAndUpdate(req.params.id, {
        sender: req.body.sender,
        receiver: req.body.receiver,
        lastMessage: req.body.lastMessage,
        messagesCount: req.body.messagesCount,
        unreadCount: req.body.unreadCount,
        updated_at: req.body.updated_at
    }, {new: true}, function (err) {
        if (err) {
            res.send({state: "erreur update conversation"})
        }
        res.send({state: "Success"})
    })
};