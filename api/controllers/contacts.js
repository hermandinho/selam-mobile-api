const Contact = require('../models/contact');
var nodemailer = require('nodemailer');


exports.find = (req, res, next) => {
    Contact.findById(req.params.id)
        .exec()
        .then(contact => {
            if (!contact) {
                return res.status(404).json({
                    message: "contact  not found"
                });
            }
            res.status(200).json({town});
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = (req, res, next) => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.hostinger.com',
        secure: !true,
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD_EMAIL
        }
    });

    var mailOptions = {
        from: req.body.email,
        to: process.env.EMAIL,
        subject: req.body.title,
        text: req.body.description
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    const contact = new Contact({
        email: req.body.email,
        title: req.body.title,
        description: req.body.description
    });
    contact.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Success",
                data: result
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
    Contact.remove({_id: req.params.id})
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