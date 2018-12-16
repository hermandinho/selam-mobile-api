const Pusher = require('pusher');

let _pusher = null;

const getInstance = () => {
    if (_pusher)
        return _pusher;
    _pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: process.env.PUSHER_CLUSTER,
        useTLS: true
    });
    return _pusher;
};

exports.instance = () => {
   return getInstance()
};

exports.init = () => {   
      /*getInstance().trigger('my-channel', 'my-event', {
        "message": "Server On !!"
      });*/
};

exports.Pusher = () => {
  return _pusher || getInstance();
};

exports.trigger = (channel, event, data) => {
    getInstance().trigger(channel, event, data)
};