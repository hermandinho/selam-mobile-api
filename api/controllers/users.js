const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

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
                    const token = jwt.sign({ email: user.email }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRE_DURATION });
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

exports.signup = (req, res, next) => {
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
                            const token = jwt.sign({ email: u.email }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRE_DURATION });
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
        phone: req.body.phone,
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
