const FCM = require('fcm-node');
const serverKey = require('../keys/fb-admin.json');

const fcm = new FCM(serverKey);

const formatMessage = (token, collapseKey, data) => {
    let title = data.title || '';
    let body = data.body || '';
    delete data.title;
    delete data.body;

    return {
        to: token,
        //collapse_key: collapseKey,
        //content_available: true,
        notification: {
            title: title,
            body: body,
            sound: 'default',
            badge: '1',
            // click_action: "GENERAL"
        },
        //data
    }
};

exports.send = (to, data, collapseKey) => {
    let message = formatMessage(to, collapseKey, data);
    fcm.send(message, (err, res) => {
        console.log('NOTIFICATION ERROR', err);
        console.log('Notifications rsponse: ' ,JSON.stringify(res));
    })
};