require('dotenv').config({ debug: process.env.DEBUG });
const http = require('http');
const app = require('./app');
const socketManager = require('./helpers/socketManager');
const pusherManager = require('./helpers/pusher');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log('Server up and running on port ' + PORT);
});

//socketManager.init(server);
pusherManager.init();
