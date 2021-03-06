const Country = require('./api/models/country');
const Town = require('./api/models/town');
const Category = require('./api/models/category');
const SubCategory = require('./api/models/subCategory');

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
        catData.push({ name: item });
    }
    const cat = await Category.insertMany(catData);

    let subCatData = [];
    cat.map(c => {
        const items = CATEGORIES[c.name];
        items && items.map(i => {
            subCatData.push({ name: i, code: i.substr(0, 3).toLowerCase(), category: c._id });
        });
    });

    const subCats = await SubCategory.insertMany(subCatData);

    res.status(200).json({
        message: 'OK!',
        ctry, twn, cat, subCats
    })

};
