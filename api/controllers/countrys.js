const Country = require('../models/country');


exports.fetch =(req, res, next) => {
    Country.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                country: docs.map(doc => {
                    return {
                        name: doc.name,
                        code: doc.code,
                        currency: doc.currency,
                        request: {
                            type: "GET",
                            url: "http://localhost:5000/api/v1/country/" + doc._id
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
    Country.findById(req.params.id)
        .exec()
        .then(country => {
            if (!country) {
                return res.status(404).json({
                    message: "Country  not found"
                });
            }
            res.status(200).json({ country });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = (req, res, next) => {
    const country = new Country({
        name: req.body.name,
        code: req.body.code,
        currency: req.body.currency
    });
    country.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Success",
                data: {
                    _id: result._id,
                    name: result.body.name,
                    code: result.body.code,
                    currency: result.currency
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
    Country.remove({ _id: req.params.id })
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

    Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        code: req.body.code,
        currency: req.body.currency
    }, {new: true}, function (err) {
        if (err) {
            res.send({state: "erreur update country"})
        }
        res.send({state: "Success"})
    })
};