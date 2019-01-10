const slugify = require('@sindresorhus/slugify');
const Country = require('./api/models/country');
const Town = require('./api/models/town');
const Category = require('./api/models/category');
const SubCategory = require('./api/models/subCategory');
const Article = require('./api/models/article');
const User = require('./api/models/user');
const Conversation = require('./api/models/conversation');
const Message = require('./api/models/message');
const Device = require('./api/models/device');

const CATEGORY_ICONS = {
    'Autre': 'more_horiz',
    'Informatique / Multimedia': 'computer',
    'Vehicules': 'commute',
    'Habillement': 'style',
    'Entreprise': 'format_paint',//location_city
    'Emploie et services': 'next_week',
    'Loisir': 'directions_bike',
};

const CATEGORIES = {
    'Autre': ['Autre'],
    'Informatique / Multimedia': ['Téléphones', 'Images & son', 'Laptops', 'Ecouteurs'],
    'Vehicules': ['Voitures', 'Motos', 'Bateaux'],
    'Habillement': ['Vêtements', 'Chaussures', 'Montres & Bijoux', 'Sacs'],
    'Entreprise': ['Matériels profétionnels'],
    'Emploie et services': ['Offre d\'emploi', 'services', 'Cours et formations'],
    'Loisir': ['Vélos', 'Animaux', 'Films', 'Livres', 'Voyages'],
};

const clearModels = async() => {
    await Country.deleteMany({ name: /[a-zA-Z0-9]/ }, function (err) {});
    await Town.deleteMany({ name: /[a-zA-Z0-9]/ }, function (err) {});
    await SubCategory.deleteMany({ name: /[a-zA-Z0-9]/ }, function (err) {});
    await Category.deleteMany({ name: /[a-zA-Z0-9]/ }, function (err) {});
    await Article.deleteMany({ title: /[a-zA-Z0-9]/ }, function (err) {});
    await Message.deleteMany({ content: /[a-zA-Z0-9]/ }, function (err) {});
    await Device.deleteMany({ uuid: /[a-zA-Z0-9]/ }, function (err) {});
    await Conversation.deleteMany({ messagesCount: { $gte: -1 } }, function (err) {});
    await User.deleteMany({ role: 'faker' }, function (err) {});
    return Promise.resolve();
};

exports.seed = async function (req, res, next) {
    await clearModels();
    const ctry = await new Country({ name: 'Cameroun', code: 'CM', currency: 'CFA' }).save();
    const townsData = [
        { name: 'Yaounde', code: 'yde', country: ctry._id },
        { name: 'Douala', code: 'dla', country: ctry._id },
        { name: 'Bamenda', code: 'dda', country: ctry._id },
        { name: 'Bafoussam', code: 'baf', country: ctry._id },
        { name: 'Kribi', code: 'kri', country: ctry._id },
        { name: 'Limbe', code: 'lim', country: ctry._id },
        { name: 'Dschang', code: 'dsc', country: ctry._id },
    ];

    const twn = await Town.insertMany(townsData);

    let catData = [];
    for (let item in CATEGORIES) {
        catData.push({ name: item, webIcon: CATEGORY_ICONS[item], slug: slugify(item, { customReplacements: [['&', '']] }) });
    }
    const cat = await Category.insertMany(catData);

    let subCatData = [];
    cat.map(c => {
        const items = CATEGORIES[c.name];
        items && items.map(i => {
            subCatData.push({ name: i,
                code: i.substr(0, 3).toLowerCase(),
                category: c._id, slug: slugify(i, {customReplacements: [['&', '']] }) });
        });
    });

    const subCats = await SubCategory.insertMany(subCatData);

    res.status(200).json({
        message: 'OK!',
        ctry, twn, cat, subCats
    })

};
