const sharp = require('sharp');
const fs = require('fs');
const NotificationManager = require('../../helpers/notifications');

const Article = require('../models/article');

exports.fetch =(req, res, next) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let dateSort = parseInt(req.query.dateSort) || 1;
    let priceSort = parseInt(req.query.priceSort) || -1;
    let regionFilter = req.query.region || '';
    let fixedPrice = req.query.hasOwnProperty('priceFixed') ? req.query.priceFixed : null;
    let exchange = req.query.hasOwnProperty('exchange') ? req.query.exchange : null;
    let query = req.query.search || '';

    let search = {published: true, available: true};
    let sort = {updated_at: -1};

    if (regionFilter.trim().length) {
        // TODO why not $in ?
        search['region'] = { $in: regionFilter.split(',') };
    }
    if (fixedPrice !== null)
        search['price.fixed'] = fixedPrice;
    if (exchange !== null)
        search['exchange'] = exchange;
    if (query.length) {
        query = '.*' + query + '.*';
        search['$or'] = [
            { title: { $regex: query, $options: 'is' } },
            { description: { $regex: query, $options: 'is' } },
        ];
    }

    if (priceSort)
        sort['price.amount'] = priceSort;
    if (dateSort)
        sort['updated_at'] = dateSort;

    Article.paginate(search,
        {
            page: page, limit: limit,
            sort: sort,
            populate: [
                { path: 'user', select: 'name' },
                { path: 'region', populate: { path: 'country', model: 'Country', select: 'name' }  },
            ]
        },
    )
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.find = (req, res, next) => {
    Article.findById(req.params.id)
        .populate([
            { path: 'user', select: '_id name acceptChats acceptPhone phoneNumber acceptSMS' },
            { path: 'subCategory', select: 'name', populate: { path: 'category', model: 'Category', select: 'name' } },
            { path: 'region', populate: { path: 'country', model: 'Country', select: 'name' }  },
        ])
        .exec()
        .then(doc => {
            if (!doc) {
                return res.status(404).json({
                    message: "article  not found"
                });
            }
            if (doc._id !== req.userData.id) {
                NotificationManager.trigger(NotificationManager.EVENTS.NEW_VISIT, { user: req.userData, article: doc });
            }
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.create = (req, res, next) => {
    let pictures = req.body.pictures || [];
    /*if (!pictures.length)
        pictures.push('res://ic_no_image');*/
    if (pictures.length === 1 && pictures[0] === '*') {
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
        //picture: req.body.picture,
        region: req.body.region,
        //displayPhoneNumber: req.body.displayPhoneNumber, // Moved to user model
        //displayEmail: req.body.displayEmail,  // Moved to user model
        user: req.userData.id,
        subCategory: req.body.subCategory,
        exchange: req.body.exchange,
        published: true, //req.body.published, // TODO set to false if articles are to be validated before publishing
        available: true, //req.body.available,
        // pictures: pictures

    }).save()
        .then(data => {
            NotificationManager.trigger(NotificationManager.EVENTS.NEW_ARTICLE, data);
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
    // console.log(req.file);
    let random = req.file.destination.replace('./', '') + '/ok/' + [...Array(60)].map(() => Math.random().toString(36)[3]).join('');
    let ext =  req.file.path.split('.');
    ext = ext[ext.length - 1];
    random += '.' + ext;
    sharp(req.file.path).rotate().resize(1024, 800,{
        kernel: sharp.kernel.nearest,
        fit: sharp.fit.contain,
        position: 'center',
        //background: { r: 255, g: 205, b: 195, alpha: 0.5 }
    }).toFile(random).then(res => {
        Article.findOneAndUpdate({_id: req.params.id}, { $push: { pictures: process.env.APP_URL + '/' + random } }).then(res => {
            // TODO create CRON to unlink files
            setTimeout(() => {
                try {
                    fs.unlinkSync(req.file.path);
                    console.log(req.file.path + ' successfully unlinked !!!');
                } catch (err) {
                    console.log('COULD NOT DELETE FILE ' + req.file.path, err)
                    // handle the error
                }
            }, (1000 * 60 * 1));
        });
    });

    res.status(200).json({ message: 'Ok' });
};
