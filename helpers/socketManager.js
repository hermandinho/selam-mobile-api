const socket = require('socket.io');

exports.init = (server) => {
    console.log('Socket Manager On');
    const io = socket(server);
    listeners(io);
};

const listeners = (io) => {
    io.on('connection', (socket) => {
        console.log('New Socket connection ... ' + socket.id);
        socket.emit('message', 'Hello dude');
    });
};
