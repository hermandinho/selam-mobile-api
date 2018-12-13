const Category = require('../models/category');


exports.fetch =(req, res, next) => {
    Category.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                category: docs.map(doc => {
                    return {
                        name: doc.name,
                        code: doc.code,
                        created_at: doc.created_at,
                        updated_at: doc.updated_at,
                        request: {
                            type: "GET",
                            url: "http://localhost:5000/api/v1/category/" + doc._id
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
    Category.findById(req.params.id)
        .exec()
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    message: "Category  not found"
                });
            }
            res.status(200).json({ category });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = (req, res, next) => {
    const category = new Category({
        name: req.body.name,
        code: req.body.code
    });
    category.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Success",
                data: {
                    _id: result._id,
                    name: result.body.name,
                    code: result.body.code,
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
    Category.remove({ _id: req.params.id })
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
        updated_at: req.body.updated_at
    }, {new: true}, function (err) {
        if (err) {
            res.send({state: "erreur update category"})
        }
        res.send({state: "Success"})
    })
};