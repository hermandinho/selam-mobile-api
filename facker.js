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
const PHONE_IMAGES = [
    'https://www.android.com/static/2016/img/phones/assistant-ui_1x.jpg', 'https://www.android.com/static/2016/img/phones/phone-1_1x.jpg', 'https://cdn.arstechnica.net/wp-content/uploads/2017/09/8-2.jpg',
    'https://media.4rgos.it/i/Argos/6014265_R_Z001A?$Web$&$DefaultPDP570$', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEmWeTwPdjW_P2IFvDeL7_8Cv7DNSOEa6zfzm5ixE9_3fwwUYa',
    'https://amp.businessinsider.com/images/5b69aa52959f341f2e8b49f6-750-375.jpg', 'https://cdn.vox-cdn.com/uploads/chorus_image/image/58082881/akrales_171129_2164_0217.0.jpg',
    'https://cdn.vox-cdn.com/thumbor/LZTjCyxZAWkXGlq4MAO4bhb-5H8=/0x0:2333x1555/1200x800/filters:focal(981x592:1353x964)/cdn.vox-cdn.com/uploads/chorus_image/image/56572789/Galaxy_Note_8.0.jpg',
    'https://cdn.mos.cms.futurecdn.net/U5KrKvxV275NQZD2URoD3A-768-80.jpg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF0WTn4hnj5ErjMVG6BH7yg7yXcvtoOX7pynHxZIbwR635ui_W',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm-6wYVAupMnOafEWTgK-9xMjnNZKm04C0bOfRbg-xi9cZ9HDb', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8EnpOFdnwT5Crp9RyquIq8-U9s4vwsQVGAdNZ569AxQXwFxVgzA'
];

const LAPTOP_IMAGES = [
    'https://azcd.harveynorman.com.au/media/catalog/product/cache/21/image/992x558/9df78eab33525d08d6e5fb8d27136e95/4/l/4lg38pa.jpg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt3YeWIvsVzqRkKz1fWN2QHi4shT6XNSY8vsHdcN-sWHvASrpXsA',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu3oSuU2wsRzx-xpCh6jtvPqHE3RAiM5Ck3vQ7HZ73nMsSYwfi', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO_j4KBXNbRmyA9X-NQyxlQSJdWncbqhfiLiGqyTJ3iYQYu8SKBA',
    'https://freakadeal.com/wp-content/uploads/2018/09/hp-na-laptop-original-imaff7augnvgmznw.jpeg', 'https://assets.pcmag.com/media/images/545928-microsoft-surface-pro.jpg?thumb=y&width=810&height=456',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ueTKgFqwYyQF1Fr5ZnaCLoXdZUZvLrixs6Xlc8HgIF0i0e3FMw', 'https://img.purch.com/rc/673x433/aHR0cHM6Ly93d3cubGFwdG9wbWFnLmNvbS9pbWFnZXMvd3AvbGFwdG9wLWxhbmRpbmcvdGh1bWIvMzMxMDczLmpwZw==',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjVosi4uMtUcFEje7Cz0_nTI8-CbhH0vnyMMb50Byj0UlKR5gMYw', 'https://assets.pcmag.com/media/images/396774-the-10-best-ultraportables.jpg?width=767&height=431',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWvzIe87_0M5wExYlsFkXoR6ngFFe_T3RXxkbp3FJ7M_Ol9de9', 'https://img.purch.com/o/aHR0cDovL3d3dy5sYXB0b3BtYWcuY29tL2ltYWdlcy93cC9sYXB0b3Atc2xpZGVzaG93LzI5MzM4Ni5qcGc='
];

const getRandomImage = (source, nber) => {
    let images = [];
    for (let i = 0; i <= nber; i++) {
        let rand = Math.floor(Math.random() * source.length -1 );
        images.push(source[rand]);
    }
    return images;
};

const TEXTS = {
    PHONES: [
        {
            title: 'Je vends mon tel',
            description: 'Je vends mon téléphone a un très bon prix',
            category: 'phones',
            images: getRandomImage(PHONE_IMAGES, faker.random.number({min: 2, max: 10}))
        }, {
            title: 'Téléphone a vendre',
            description: 'Je met en vente mon téléphone encore en très bonne état. J`\'attends vos propositions. Merci',
            category: 'phones',
            images: getRandomImage(PHONE_IMAGES, faker.random.number({min: 2, max: 10}))
        }, {
            title: 'Phone',
            description: 'Téléphone propre a vendre',
            category: 'phones',
            images: getRandomImage(PHONE_IMAGES, faker.random.number({min: 2, max: 10}))
        },
    ],
    LAPTOPS: [
        {
            title: 'PC',
            description: 'Je met en vente mon PC encore en très bonne état',
            category: 'laptops',
            images: getRandomImage(LAPTOP_IMAGES, faker.random.number({min: 2, max: 10}))
        }, {
            title: 'Laptop a vendre',
            description: 'Je vends mon laptop a un tres bon prix.',
            category: 'laptops',
            images: getRandomImage(LAPTOP_IMAGES, faker.random.number({min: 2, max: 10}))
        }, {
            title: 'Laptop occasion',
            description: 'Je vends mon laptop a un tres bon prix. Je vous attends.',
            category: 'laptops',
            images: getRandomImage(LAPTOP_IMAGES, faker.random.number({min: 2, max: 10}))
        },
    ]
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
    for (let i = 0; i < 75; i++) {
        let rand = Math.floor(Math.random() * 2);
        let item = null;

        if (rand) {
            item = TEXTS.PHONES[Math.floor(Math.random() * TEXTS.PHONES.length - 1)]
        } else {
            item = TEXTS.LAPTOPS[Math.floor(Math.random() * TEXTS.LAPTOPS.length - 1)]
        }
        if (!item) { continue; }

        articlesData.push({
            title: item.title /*faker.lorem.sentence()*/,
            description: item.description /*faker.lorem.paragraph()*/,
            price: {
                amount: faker.random.number(150000),
                fixed: faker.random.boolean()
            },
            currency: 'CFA',
            pictures: item.images /*[faker.random.image(), faker.random.image(), faker.random.image(), faker.random.image(), faker.random.image()]*/,
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
    }, 10000);
    res.status(200).json({message: 'ALL OK'});
};
