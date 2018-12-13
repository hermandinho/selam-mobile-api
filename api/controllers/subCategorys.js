const SubCategory = require('../models/subCategory');


exports.fetch =(req, res, next) => {
    SubCategory.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                subcategory: docs.map(doc => {
                    return {
                        name: doc.name,
                        code: doc.code,
                        category: doc.category,
                        created_at: doc.created_at,
                        updated_at: doc.updated_at,
                        request: {
                            type: "GET",
                            url: "http://localhost:5000/api/v1/sub-category/" + doc._id
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
    SubCategory.findById(req.params.id)
        .exec()
        .then(subC => {
            if (!subC) {
                return res.status(404).json({
                    message: "SubCategory  not found"
                });
            }
            res.status(200).json({ data: subC });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = (req, res, next) => {
    const subC = new SubCategory({
        name: req.body.name,
        code: req.body.code,
        category: req.body.category
    });
    subC.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Success",
                data: {
                    _id: result._id,
                    name: result.name,
                    code: result.code,
                    category: result.category
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
    SubCategory.remove({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Succes"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.patch = (req, res, next) => {

    SubCategory.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        code: req.body.code,
        category: req.body.category,
        updated_at: req.body.updated_at
    }, {new: true}, function (err) {
        if (err) {
            res.send({state: "erreur update sub-category"})
        }
        res.send({state: "Success"})
    })
};