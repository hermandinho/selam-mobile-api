const User = require('../models/user');
const Device = require('../models/device');
const Conversation = require('../models/conversation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Pusher = require('../../helpers/pusher');

const manageDevice = async (uid, params) => {
    params.user = uid;
    let check = await Device.findOne({ user: uid, uuid: params.uuid }).exec();
    let device;
    if (check && check._id) {
        device = await Device.findOneAndUpdate({ user: uid, uuid: params.uuid }, { $set: { lastOnline: new Date(), updated_at: new Date() } });
    } else {
        device = await new Device(params).save();
    }
    Promise.resolve(device)
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({error: 'Erreur de connexion. Vérifiez vos données.'})
            }
            bcrypt.compare(req.body.password, user.password, (err, r) => {
                if (err) {
                    return res.status(401).json({error: "Erreur de d'authentification"})
                }
                if (r) {
                    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRE_DURATION });
                    manageDevice(user._id, { uuid: req.body.uuid, pusherChannel: req.body.pusherChannel, version: req.body.version, os: req.body.os, type: req.body.type }).then(d => {
                        console.log('DEVICE MANAGED');
                    });
                    return res.status(200).json({
                        token,
                        user
                    })
                } else {
                    return res.status(401).json({error: "Erreur de d'authentification"})
                }
            })
        })
        .catch(err => {
            return res.stat(500).json({ error: 'Une erreur est survenue', message: err})
        });
};

exports.signup = async (req, res, next) => {
    User.find({ email: req.body.email }).exec()
        .then(user => {
            if (user.length >= 1)
                return res.status(409).json({
                    error: "Cette addresse email n'est plus disponible."
                })
            else {
                bcrypt.hash(req.body.password, parseInt(process.env.PASSWORD_SALT), (err, hash) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: err });
                    } else {
                        const user = new User({
                            email: req.body.email,
                            pusherChannel: req.body.pusherChannel || 'channel-' + (new Date).getTime(),
                            deviceUUID: req.body.uuid || 'UUID-'  + (new Date).getTime(),
                            password: hash,
                            name: req.body.name
                        }).save().then(u => {
                            const token = jwt.sign({ email: u.email, id: u._id }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRE_DURATION });
                            manageDevice(u._id, { uuid: req.body.uuid, pusherChannel: req.body.pusherChannel, version: req.body.version, os: req.body.os, type: req.body.type }).then(d => {
                                console.log('DEVICE MANAGED');
                            });
                            res.status(201).json({
                                user: u,
                                token
                            })
                        }).catch(err => {
                            res.status(500).json({
                                error: "Une erreur est survenue lors de votre inscription",
                                message: err
                            })
                        });
                    }
                });
            }
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({
                error: "Une erreur est survenue",
                err: err
            })
        });
};

exports.me = (req, res, next) => {
    User.findById(req.params.id)
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "user  not found"
                });
            }
            res.status(200).json({ user });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};


exports.create = (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {name: req.body.name,
        phoneNumber: req.body.phone,
        picture: req.body.picture,
        isProfessional: req.body.isProfessional,
        role: req.body.role,
        acceptChat: req.body.acceptChat,
        updated_at: req.body.updated_at
    }, {new: true}, function (err) {
        if (err) {
            res.send({state: "erreur update User"})
        }
        res.send({state: "Success"})
    })
};

exports.emitTypingMessage = async (req, res, next) => {
    const status = req.params.status;
    const me = req.userData;
    const devices = await Device.find({user: req.query.to});
    devices.map(d => {
        Pusher.trigger(d.pusherChannel, 'typing', { status: status === 'true', user: me.id });
    });
    res.status(200).json();
};
