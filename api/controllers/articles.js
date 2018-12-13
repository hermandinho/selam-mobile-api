const Article = require('../models/article');

exports.fetch =(req, res, next) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    // TODO add query param to check if to apply available && published filters
    Article.paginate({published: true, available: true}, { page: page, limit: limit })
        // .exec()
        .then(docs => {
            res.status(200).json(docs/*{
                count: docs.length,
                article: docs.map(doc => {
                    return {
                        title: doc.title,
                        description: doc.description,
                        price: doc.price,
                        currency: doc.currency,
                        picture: doc.picture,
                        region: doc.region,
                        displayPhoneNumber: doc.displayPhoneNumber,
                        displayEmail: doc.displayEmail,
                        user: doc.user,
                        subCategory: doc.subCategory,
                        published: doc.published,
                        available: doc.available,
                        created_at: doc.created_at,
                        updated_at: doc.updated_at,
                        request: {
                            type: "GET",
                            url: "http://localhost:5000/api/v1/article/" + doc._id
                        }
                    };
                })
            }*/);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.find = (req, res, next) => {
    Article.findById(req.params.id)
        .exec()
        .then(article => {
            if (!article) {
                return res.status(404).json({
                    message: "article  not found"
                });
            }
            res.status(200).json({ article });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = (req, res, next) => {
    let pictures = req.body.pictures || [];
    if (!pictures.length)
        pictures.push('res://ic_no_image');
    else if (pictures.length === 1 && pictures[0] === '*') {
        // IMAGES TO BE UPLOADED
        pictures = [];
    }
    const article = new Article({
        title: req.body.title,
        description: req.body.description,
        price: {
            amount: req.body.price.amount,
            fixed: req.body.price.fixed
        },
        currency: req.body.currency,
        picture: req.body.picture,
        region: req.body.region,
        //displayPhoneNumber: req.body.displayPhoneNumber, // Moved to user model
        //displayEmail: req.body.displayEmail,  // Moved to user model
        user: req.body.user,
        subCategory: req.body.subCategory,
        exchange: req.body.exchange,
        published: true, //req.body.published, // TODO set to false if articles are to be validated before publishing
        available: true, //req.body.available,
        pictures: pictures

    }).save()
        .then(data => {
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
    Article.remove({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Success",
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.patch = (req, res, next) => {

    Article.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price.amount,
        priceF: req.body.price.fixed,
        unit: req.body.unit,
        picture: req.body.picture,
        region: req.body.region,
        displayPhoneNumber: req.body.displayPhoneNumber,
        displayEmail: req.body.displayEmail,
        user: req.body.user,
        subCategory: req.body.subCategory,
        published: req.body.published,
        available: req.body.available,
        updated_at: req.body.updated_at
    }, {new: true}, function (err) {
        if (err) {
            res.send({state: "erreur update article"})
        }
        res.send({state: "Success"})
    })
}

exports.upload = async (req, res, next) => {
    //console.log(req.file, req.params.id);
    // TODO update path to absolute URL
    let article = await Article.findOneAndUpdate({_id: req.params.id}, { $push: { pictures: process.env.APP_URL + '/' + req.file.path } });
    res.status(200).json({ message: 'Ok' });
};
