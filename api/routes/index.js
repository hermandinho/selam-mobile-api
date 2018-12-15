const userRoutes = require('./user');
const  articleRoutes = require('./article');
const  subCategoryRoutes = require('./subCategory');
const  categoryRoutes = require('./category');
const  configurationRoutes = require('./configuration');
const  countryRoutes = require('./country');
const  townRoutes = require('./town');
const  conversationRoutes = require('./conversation');
const  messageRoutes = require('./message');
const CVFactory = require('../../helpers/conversationFactory')
const User = require('../models/user')

const Pusher = require('../../helpers/pusher')

module.exports = (app) => {
    app.use('/api/v1/user', userRoutes);
    app.use('/api/v1/article', articleRoutes);
    app.use('/api/v1/sub-category', subCategoryRoutes);
    app.use('/api/v1/category', categoryRoutes);
    app.use('/api/v1/config', configurationRoutes);
    app.use('/api/v1/country', countryRoutes);
    app.use('/api/v1/town', townRoutes);
    app.use('/api/v1/conversation', conversationRoutes);
    app.use('/api/v1/message', messageRoutes);


    // DB seeding
    app.use('/api/v1/seed', require('../../seeder').seed)

    // PUSHER
    app.post('/api/v1/pusher/auth', (req, res, next) => {
        console.log('CALLED PUSHER AUTH')
        let socketId = req.body.socket_id;
        let channel = req.body.channel_name;
        let presenceData = {
            user_id: 'unique_user_id',
            user_info: {
                name: 'Mr Channels',
                twitter_id: '@pusher'
            }
        };
        let auth = Pusher.instance().authenticate(socketId, channel, presenceData);
        res.send(auth);
    });
    app.use('/api/v1/pusher', (req, res, next) => {
           Pusher.trigger('my-channel', 'my-event', {
            "message": "Message from server"
          });
          res.status(200).json({});
    });

    app.use('/api/v1/factory', async (req, res, next) => {
        const u1 = {_id: "5c0d488dc07af64ca80fdaf4"};
        const u2 = {_id: "5c10242f1e7f4c0844227c9f"};
        const x = await CVFactory.getConversation(u1, u2);
        res.json({x});
    })
};
