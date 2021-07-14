const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const databaseURL = process.env.DB_URL
mongoose.connect(databaseURL);

const reminders = require('./api/email/reminders');
reminders.start();

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));


const userRouter = require('./api/routes/users');
const userIdRouter = require('./api/routes/user-ids');
const profileRouter = require('./api/routes/profiles');
const bookingRouter = require('./api/routes/bookings');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/user', userRouter);
app.use('/user/id', userIdRouter);
app.use('/profile', profileRouter);
app.use('/session', bookingRouter);
app.route('/', (req, res) => {
    return res.status(200).json({
        message: 'App is running'
    })
});

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        fail: 'error',
        error: {
            message: error.message
        }
    });
    console.log(error);
});

module.exports = app;