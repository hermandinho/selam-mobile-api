const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb', parameterLimit: 50000 }));

//DB setup
if (process.env.ENV === 'dev') {
    mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, { useNewUrlParser: true });
} else {
    mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, { useNewUrlParser: true, user: process.env.DB_USER, pass: process.env.DB_PASS });
}
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));

db.once('open', () => {

});

// mongoose.Promise = global.Promise;

//CORS middleware
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', '*');

   if (req.method.toUpperCase() === 'OPTIONS') {
       res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE');
       return res.status(200).json({});
   }
   next();
});

// Setup routes
const routes = require('./api/routes')(app);

// Routes Error handling
app.use((req, res, next) => {
    const error = new Error('Not found.');
    error.status = 404;
    next(error);
});

// Application Error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: err.message,
        route: req.url
    });
});

app.use((req, res, next) => {
    res.status(200).json({ message: 'Hello world !!' });
});

module.exports = app;
