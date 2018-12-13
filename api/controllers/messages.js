const Message = require('../models/message');
const Factory = require('../../helpers/conversationFactory');
const Conversation = require('../models/conversation');


exports.fetch =(req, res, next) => {
    Message.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                message: docs.map(doc => {
                    return {
                        content: doc.content,
                        type: doc.type,
                        status: doc.status,
                        conversation: doc.conversation,
                        sent_at: doc.sent_at,
                        read_at: doc.read_at,
                        request: {
                            type: "GET",
                            url: "http://localhost:5000/api/v1/message/" + doc._id
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
    Message.findById(req.params.id)
        .exec()
        .then(message => {
            if (!message) {
                return res.status(404).json({
                    message: "Message  not found"
                });
            }
            res.status(200).json({ message });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = async (req, res, next) => {
    const receiver = { _id: req.params.receiver };
    const sender = { _id: req.userData.id };
    const content = req.body.content;

    const cv = await Factory.getConversation(receiver, sender);

    const message = new Message({
        content: content.trim(),
        //type: req.body.type,
        //status: req.body.status,
        conversation: cv._id,
        //read_at: req.body.read_at
    });
    message.save()
        .then(result => {
            console.log(result);
            Conversation.findOneAndUpdate(result.conversation, { lastMessage: result._id, $inc: { messagesCount: 1 } }).exec();
            res.status(201).json({
                message: "Success",
                data: {
                    _id: result._id,
                    content: result.content,
                    type: result.type,
                    status: result.status,
                    conversation: result.conversation,
                    read_at: result.read_at
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
    Message.remove({ _id: req.params.id })
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

    Message.findByIdAndUpdate(req.params.id, {
        content: req.body.content,
        type: req.body.type,
        status: req.body.status,
        conversation: req.body.conversation,
        read_at: req.body.read_at
    }, {new: true}, function (err) {
        if (err) {
            res.send({state: "erreur update message"})
        }
        res.send({state: "Success"})
    })
};