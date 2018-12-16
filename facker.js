const faker = require('faker');
const bcrypt = require('bcrypt');
const Article = require('./api/models/article');
const User = require('./api/models/user');
const Country = require('./api/models/country');
const Town = require('./api/models/town');
const Category = require('./api/models/category');
const SubCategory = require('./api/models/subCategory');

const customFakes = {
    CATEGORIES: {
        'Informatique / Multimedia': ['Téléphones', 'Images & son', 'Laptops', 'Ecouteurs'],
        'Vehicules': ['Voitures', 'Motos', 'Bateaux'],
        'Emploie et services': ['Offre d\'emploi', 'services', 'Cours et formations'],
        'Autre': ['Autre'],
        'Entreprise': ['Matériels profétionnels'],
        'Habillement': ['Vêtements', 'Chaussures', 'Montres & Bijoux', 'Sacs'],
        'Loisir': ['Vélos', 'Animaux', 'Films', 'Livres', 'Voyages'],
    }
};

const userIds = [];

const clearModels = async() => {
    await Country.deleteMany({ name: /[a-zA-Z0-9]/ }, function (err) {});
    await Town.deleteMany({ name: /[a-zA-Z0-9]/ }, function (err) {});
    await SubCategory.deleteMany({ name: /[a-zA-Z0-9]/ }, function (err) {});
    await Category.deleteMany({ name: /[a-zA-Z0-9]/ }, function (err) {});
    await Article.deleteMany({ title: /[a-zA-Z0-9]/ }, function (err) {});
    await User.deleteMany({ role: 'faker' }, function (err) {});
    return Promise.resolve();
};

const fakeCategories = async () => {
    let data = [];
    for (let item in customFakes.CATEGORIES) {
        data.push({ name: item });
    }
    const res = await Category.insertMany(data);
    return Promise.resolve(res);
};

const fakeSubCategories = async (cats) => {
    let catIds = [];
    let subCatData = [];
    cats.map(c => {
        const subCats = customFakes.CATEGORIES[c.name];
        subCats.map(sc => {
          subCatData.push({ name: sc, category: c._id });
        })
    });
    const sc = await SubCategory.insertMany(subCatData);
    return Promise.resolve(sc);
};

const fakeUsers = async () => {
    bcrypt.hash('6543210', parseInt(process.env.PASSWORD_SALT), (err, hash) => {
        if (!err) {
            for (let i = 0; i < 150; i++) {
                new User({
                    name: faker.name.firstName() + ' ' + faker.name.lastName(),
                    email: faker.internet.email(),
                    password: hash,
                    phoneNumber: faker.phone.phoneNumber(),
                    picture: faker.random.image(),
                    isProfessional: faker.random.boolean(),
                    role: 'faker',
                    acceptChat: faker.random.boolean(),
                    active: faker.random.boolean(),
                    acceptChats: faker.random.boolean(),
                    acceptPhone: faker.random.boolean(),
                    acceptSMS: faker.random.boolean(),
                }).save().then(u => { userIds.push(u._id) });
            }
        } else {
            console.log(err);
        }
    });
};

const fakeArticles = async (regions, subCats) => {
    const articlesData = [];
    for (let i = 0; i < 500; i++) {
        articlesData.push({
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            price: {
                amount: faker.random.number(50000),
                fixed: faker.random.boolean()
            },
            currency: 'CFA',
            pictures: [faker.random.image(), faker.random.image(), faker.random.image(), faker.random.image(), faker.random.image()],
            region: regions[faker.random.number(regions.length - 1)], // TODO
            user: userIds[faker.random.number(userIds.length - 1)],
            subCategory: subCats[faker.random.number(subCats.length - 1)],
            published: /*faker.random.boolean() || */true,
            available: /*faker.random.boolean()*/ true,
            exchange: faker.random.boolean(),
            updated_at: faker.date.between('2015-01-01', '2018-12-16')
        })
    }
    Article.insertMany(articlesData);
};

const fakeRegions = async () => {
    const regions = ['Yaounde', 'Bafoussam', 'Dschang'];
    const data = [];
    let c = await new Country({name: 'Cameroon', code: 'cm'}).save().then(c => {
        regions.map(r => {
            data.push({ name: r, country: c._id });
        });
        Town.insertMany(data).then(docs => {
            const ids = []
            docs.map(d => {
                ids.push(d._id)
                fakeCategories().then(cats => {
                    fakeSubCategories(cats).then(sc => {
                        const scIds = [];
                        sc.map(s => scIds.push(s._id))
                        fakeArticles(ids, scIds);
                    });
                });
            });
        });
    });
};


exports.fake = async (req, res, next) => {
    await clearModels();
    fakeUsers();
    setTimeout (() => {
        fakeRegions();
    }, 5500);

    res.status(200).json({message: 'ALL OK'});
};
