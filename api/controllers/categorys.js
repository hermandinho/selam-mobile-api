const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const Article = require('../models/article');


exports.fetch = async (req, res, next) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    const categories = await Category.paginate({}, {page, limit, sort: { name: 1 },});
    const results = JSON.parse(JSON.stringify(categories));
    for (const d of results.docs) {
        let subCats = await SubCategory.find({ category: d._id }).exec();
        d.subCats = d.subCats || {};
        d.subCats.count = subCats.length;
        d.subCats.ids = d.subCats.ids || [];
        for (const s of subCats) {
            let articles = await Article.find({ subCategory: s._id }).exec();
            d.articles = d.articles || {};
            d.articles.count =  d.articles.count || 0;
            d.articles.count += articles.length;
            d.subCats.ids.push(s._id);
        }
    }
    res.status(200).json(results);
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
