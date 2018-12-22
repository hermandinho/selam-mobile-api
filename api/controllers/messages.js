const Message = require('../models/message');
const Device = require('../models/device');
const Factory = require('../../helpers/conversationFactory');
const Conversation = require('../models/conversation');
const Pusher = require('../../helpers/pusher');
const NotificationManager = require('../../helpers/notifications');

exports.fetch = (req, res, next) => {
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

exports.load = async(req, res, next) => {
    const me = req.userData.id;
    const you = req.params.receiver;
    const cv = await Factory.getConversation({ _id: me }, { _id: you});

    Message.find({ conversation: cv._id })
    .then(data => {
        res.status(200).json(data);
        /*res.status(200).json({
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
        });*/
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
            res.status(200).json({message});
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.send = async (req, res, next) => {
    const receiver = {_id: req.params.receiver};
    const sender = {_id: req.userData.id};
    const content = req.body.content;

    const cv = await Factory.getConversation(sender, receiver);
    const devices = await Device.find({user: receiver._id});

    const message = new Message({
        trigger: sender._id,
        content: content.trim(),
        conversation: cv._id,
        //type: req.body.type,
        //status: req.body.status,
        //read_at: req.body.read_at
    });
    message.save()
        .then(data => {
            devices.map(d => {
                Pusher.trigger(d.pusherChannel, 'message', data);
            });
            Conversation.findOneAndUpdate({_id: cv._id}, {lastMessage: data._id, $inc: {messagesCount: 1}}, {new: true}).exec().then(cv => {
                NotificationManager.trigger(NotificationManager.EVENTS.NEW_MESSAGE, { from: sender, to: receiver });
            });

            res.status(201).json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
exports.delete = (req, res, next) => {
    Message.remove({_id: req.params.id})
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
