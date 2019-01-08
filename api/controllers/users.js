const uuidv4 = require('uuid/v4');
const User = require('../models/user');
const Device = require('../models/device');
const Conversation = require('../models/conversation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Pusher = require('../../helpers/pusher');

const manageDevice = async (uid, params) => {
    const uuid = params.uuid || 'selam-' + params.email /*+ '-' + uuidv4()*/;
    const pusherChannel = params.pusherChannel || uuid;
    const version = params.version || 'n/a';
    const type = params.uuid ? 'mobile' : 'web';
    const os = params.os || 'web';
    const pushToken = params.pushToken || null;

    if (!uuid) return Promise.reject(false);
    let check = await Device.findOne({user: uid, uuid: uuid}).exec();
    let device;
    if (check && check._id) {
        device = await Device.findOneAndUpdate({
            user: uid,
            uuid: uuid
        }, {
            $set: {
                lastOnline: new Date(),
                updated_at: new Date(),
                pushToken: pushToken || null
            }
        });
    } else {
        device = await new Device({uuid, os, type, version, pusherChannel, user: uid, pushToken}).save();
    }
    return Promise.resolve(device)
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}).exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({error: 'Erreur de connexion. Vérifiez vos données.'})
            }
            bcrypt.compare(req.body.password, user.password, (err, r) => {
                if (err) {
                    return res.status(401).json({error: "Erreur de d'authentification"})
                }
                if (r) {
                    const token = jwt.sign({
                        email: user.email,
                        id: user._id
                    }, process.env.JWT_KEY, {expiresIn: process.env.JWT_EXPIRE_DURATION});

                    manageDevice(user._id, req.body).then(d => {
                        console.log('DEVICE MANAGED');
                    }).catch(err => {
                        console.log('CANNOT MANAGE DEVICE ', err)
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
            return res.stat(500).json({error: 'Une erreur est survenue', message: err})
        });
};

exports.signup = async (req, res, next) => {
    User.find({email: req.body.email}).exec()
        .then(user => {
            if (user.length >= 1)
                return res.status(409).json({
                    error: "Cette addresse email n'est plus disponible."
                })
            else {
                bcrypt.hash(req.body.password, parseInt(process.env.PASSWORD_SALT), (err, hash) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({error: err});
                    } else {
                        const user = new User({
                            email: req.body.email,
                            //pusherChannel: req.body.pusherChannel || 'channel-' + (new Date).getTime(),
                            //deviceUUID: req.body.uuid || 'UUID-'  + (new Date).getTime(),
                            password: hash,
                            name: req.body.name,
                            phoneNumber: req.body.phoneNumber || null,
                            acceptSMS: req.body.phoneNumber && req.body.phoneNumber.length > 0,
                            acceptPhone: req.body.phoneNumber && req.body.phoneNumber.length > 0,
                        }).save().then(u => {
                            const token = jwt.sign({
                                email: u.email,
                                id: u._id
                            }, process.env.JWT_KEY, {expiresIn: process.env.JWT_EXPIRE_DURATION});
                            manageDevice(u._id, req.body).then(d => {
                                console.log('DEVICE MANAGED');
                            }).catch(err => {
                                console.log('CANNOT MANAGE DEVICE ', err)
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
    User.findById(req.userData.id)
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "user  not found"
                });
            }
            manageDevice(user.id, {email: user.email}).then(res => {
                user.device = res;
                res.status(200).json({user});
            }).catch(err => {
                res.status(200).json({user});
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.update = (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, data) {
        if (err) {
            res.send({state: "erreur update User"})
        }
        res.send(data)
    })
};

exports.setDevicePushToken = async (req, res, next) => {
    const device = await Device.findOne({uuid: req.body.uuid, user: req.userData.id}).exec();
    if (device && device.pushToken !== req.body.pushToken) {
        device.pushToken = req.body.pushToken;
        device.save();
    }
    return res.status(200).json({message: 'Push Token set.'});
};

exports.logout = async (req, res, next) => {
    await Device.remove({user: req.userData.id, uuid: req.body.uuid}).exec().then(result => {
        return res.status(200).json({
            message: "Success"
        })
    })
};

exports.emitTypingMessage = async (req, res, next) => {
    const status = req.params.status;
    const me = req.userData;
    const devices = await Device.find({user: req.query.uid});
    devices.map(d => {
        Pusher.trigger(d.pusherChannel, 'typing', {status: status === 'true', user: me.id});
    });
    res.status(200).json();
};

exports.upload = async (req, res, next) => {
    // TODO update path to absolute URL
    let user = await User.findOneAndUpdate({_id: req.params.id}, {picture: process.env.APP_URL + '/' + req.file.path});
    res.status(200).json({message: 'Ok'});
};
