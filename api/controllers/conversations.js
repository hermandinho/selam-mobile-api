const Conversation = require('../models/conversation');
const Factory = require('../../helpers/conversationFactory')


exports.fetch =(req, res, next) => {
    Conversation.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                conversation: docs.map(doc => {
                    return {
                        sender: doc.sender,
                        receiver: doc.receiver,
                        lastMessage: doc.lastMessage,
                        messagesCount: doc.messagesCount,
                        unreadCount: doc.unreadCount,
                        created_at: doc.created_at,
                        updated_at: doc.updated_at,
                        request: {
                            type: "GET",
                            url: "http://localhost:5000/api/v1/conversation/" + doc._id
                        }
                    };
                })
            });
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
            res.status(200).json({ conversation });
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
    Conversation.remove({ _id: req.params.id })
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