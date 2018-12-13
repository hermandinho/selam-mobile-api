const Country = require('./api/models/country');
const Town = require('./api/models/town');
const Category = require('./api/models/category');
const SubCategory = require('./api/models/subCategory');

const clearModels = async() => {
    await Country.deleteMany({ name: /[a-zA-Z0-9]/ }, function (err) {});
    await Town.deleteMany({ name: /[a-zA-Z0-9]/ }, function (err) {});
    await SubCategory.deleteMany({ name: /[a-zA-Z0-9]/ }, function (err) {});
    await Category.deleteMany({ name: /[a-zA-Z0-9]/ }, function (err) {});
    return Promise.resolve();
};

exports.seed = async function (req, res, next) {

    await clearModels();

    const ctry = await new Country({ name: 'Cameroun', code: 'CM', currency: 'CFA' }).save();

    const twn = await new Town({ name: 'Yaounde', code: 'yde', country: ctry._id }).save();

    const cat = await new Category({ name: 'Multi media', code: 'm-d' }).save();

    const subCat = await new SubCategory({ name: 'Telephones', code: 'tel', category: cat._id }).save();

    res.status(200).json({
        message: 'OK!',
        ctry, twn, cat, subCat
    })

};
