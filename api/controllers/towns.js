const Town = require('../models/town');


exports.fetch =(req, res, next) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    Town.paginate({}, { page: page, limit: limit,  populate: ['country'], lean: true})
        //.exec()
        .then(docs => {
            res.status(200).json( docs /*
                count: docs.length,
                town: docs.map(doc => {
                    return {
                        name: doc.name,
                        code: doc.code,
                        country: doc.country,
                        request: {
                            type: "GET",
                            url: "http://localhost:5000/api/v1/town/" + doc._id
                        }
                    };
                })*/
            );
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.find = (req, res, next) => {
    Town.findById(req.params.id)
        .exec()
        .then(town => {
            if (!town) {
                return res.status(404).json({
                    message: "town  not found"
                });
            }
            res.status(200).json({ town });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = (req, res, next) => {
    const town = new Town({
        name: req.body.name,
        code: req.body.code,
        country: req.body.country
    });
    town.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Success",
                data: {
                    _id: result._id,
                    name: result.body.name,
                    code: result.body.code,
                    country: result.country
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
    Town.remove({ _id: req.params.id })
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

    Town.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        code: req.body.code,
        country: req.body.country
    }, {new: true}, function (err) {
        if (err) {
            res.send({state: "erreur update town"})
        }
        res.send({state: "Success"})
    })
};
