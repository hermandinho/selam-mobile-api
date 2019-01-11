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
        /*{ name: 'Yaounde', code: 'yde', country: ctry._id },
        { name: 'Douala', code: 'dla', country: ctry._id },
        { name: 'Bamenda', code: 'dda', country: ctry._id },
        { name: 'Bafoussam', code: 'baf', country: ctry._id },
        { name: 'Kribi', code: 'kri', country: ctry._id },
        { name: 'Limbe', code: 'lim', country: ctry._id },
        { name: 'Dschang', code: 'dsc', country: ctry._id },*/
        { name: "Abong-Mbang", country: ctry._id},
        { name: "Ako", country: ctry._id},
        { name: "Akonolinga", country: ctry._id},
        { name: "Ambam", country: ctry._id},
        { name: "Bafang", country: ctry._id},
        { name: "Bafia", country: ctry._id},
        { name: "Bafoussam", country: ctry._id},
        { name: "Bafut", country: ctry._id},
        { name: "Bagangte", country: ctry._id},
        { name: "Bali", country: ctry._id},
        { name: "Bamenda", country: ctry._id},
        { name: "Bamingie", country: ctry._id},
        { name: "Nkwen", country: ctry._id},
        { name: "Bandjoun", country: ctry._id},
        { name: "Bangem", country: ctry._id},
        { name: "Banyo", country: ctry._id},
        { name: "Batouri", country: ctry._id},
        { name: "Bélabo", country: ctry._id},
        { name: "Bertoua", country: ctry._id},
        { name: "Buea", country: ctry._id},
        { name: "Campo", country: ctry._id},
        { name: "Dimako", country: ctry._id},
        { name: "Dizangue", country: ctry._id},
        { name: "Djoum", country: ctry._id},
        { name: "Douala", country: ctry._id},
        { name: "Dschang", country: ctry._id},
        { name: "Ebolowa", country: ctry._id},
        { name: "Edéa", country: ctry._id},
        { name: "Eyumojock", country: ctry._id},
        { name: "Foumban", country: ctry._id},
        { name: "Foumbot", country: ctry._id},
        { name: "Garoua", country: ctry._id},
        { name: "Goura", country: ctry._id},
        { name: "Guider", country: ctry._id},
        { name: "Idenau", country: ctry._id},
        { name: "Kaélé", country: ctry._id},
        { name: "Kousséri", country: ctry._id},
        { name: "Kribi", country: ctry._id},
        { name: "Kumba", country: ctry._id},
        { name: "Kumbo", country: ctry._id},
        { name: "Limbé", country: ctry._id},
        { name: "Lomié", country: ctry._id},
        { name: "Loum", country: ctry._id},
        { name: "Makénéné", country: ctry._id},
        { name: "Mamfe", country: ctry._id},
        { name: "Maroua", country: ctry._id},
        { name: "Martap", country: ctry._id},
        { name: "Mbalmayo", country: ctry._id},
        { name: "Mbandjock", country: ctry._id},
        { name: "Mbengwi", country: ctry._id},
        { name: "Mbouda", country: ctry._id},
        { name: "Meiganga", country: ctry._id},
        { name: "Melong", country: ctry._id},
        { name: "Menji", country: ctry._id},
        { name: "Minam", country: ctry._id},
        { name: "Mokolo", country: ctry._id},
        { name: "Monatélé", country: ctry._id},
        { name: "Mora", country: ctry._id},
        { name: "Mouloudou", country: ctry._id},
        { name: "Mutengene", country: ctry._id},
        { name: "Ndu", country: ctry._id},
        { name: "Ndop", country: ctry._id},
        { name: "Ngaoundéré", country: ctry._id},
        { name: "Nkambe", country: ctry._id},
        { name: "Nkongsamba", country: ctry._id},
        { name: "Njenacha", country: ctry._id},
        { name: "Sa'a", country: ctry._id},
        { name: "Sangmélima", country: ctry._id},
        { name: "Tibati", country: ctry._id},
        { name: "Tiko", country: ctry._id},
        { name: "Wum", country: ctry._id},
        { name: "Yaoundé", country: ctry._id},
        { name: "Yagoua", country: ctry._id},
        { name: "Yokadouma", country: ctry._id }
    ].filter(t => {
        t.code = slugify(t.name);
        t.slug = slugify(t.name);
        return true;
    });

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
