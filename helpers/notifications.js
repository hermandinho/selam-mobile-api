const FCM = require('./firebase');

const User = require('../api/models/user');
const Device = require('../api/models/device');
const Category = require('../api/models/category');
const SubCategory = require('../api/models/subCategory');

let TITLE = '';
let MESSAGE = '';
let EVENT = '';

const NOTIFICATION_EVENTS = {
    NEW_ARTICLE: 'article',
    NEW_VISIT: 'visit',
    NEW_MESSAGE: 'message',
};

exports.EVENTS = NOTIFICATION_EVENTS;

// data = article object for NEW_ARTICLE
// data = {from: {_id}, to: {_id}} object for NEW_MESSAGE
// data = { user, article } object for NEW_VISIT
exports.trigger = async (event, data) => {
    MESSAGE = '';
    EVENT = event;
    // TODO validate data with the above rules to prevent errors
    let users = [];
    switch (event) {
        case NOTIFICATION_EVENTS.NEW_ARTICLE:
            TITLE = 'Nouvelle annonce';
            let cat_id = null, cat_name = null;
            if (!data.subCategory.category) {
                const subcat = await SubCategory.findOne({_id: data.subCategory }).populate('category', '_id name').exec();
                cat_id = subcat.category._id;
                cat_name = subcat.category.name;
            } else {
                cat_id = data.subCategory.category._id;
            }
            const owner = await User.findOne({ _id: data.user }).exec();
            if (cat_name)
                MESSAGE = `${owner.name} a publié une nouvelle annonce dans la catégorie ${cat_name}`;

            users = await User.find({pushCategories: cat_id, _id: { $ne: data.user }}).exec();
            break;
        case NOTIFICATION_EVENTS.NEW_MESSAGE:
            TITLE = 'Nouveau message';
            const from = await User.findOne({ _id: data.from._id }).exec();
            users = await User.find({ _id: data.to._id, notifyOnNewMessage: true }).exec();
            MESSAGE = `Vous avez un nouveau message de ${from.name}`;
            // users = await User.find({_id: to._id, notifyOnNewMessage: true, }).exec();
            break;
        case NOTIFICATION_EVENTS.NEW_VISIT:
            const visitor = await User.findOne({ _id: data.user.id}).exec();
            TITLE = 'Nouvelle visite';
            MESSAGE = `${visitor.name} a visiter votre article ${data.article.title}`;
            users = await User.find({_id: data.article.user._id, notifyOnArticleVisite: true}).exec();
            break;
    }
    //console.log(users);
    users.map(u => {
       Device.find({ user: u._id, pushToken: { $ne: null } }).exec().then(devices => {
           devices.map(d => {
               FCM.send(d.pushToken, { title: TITLE, body: MESSAGE, event: EVENT });
           })
       });
    });
};
