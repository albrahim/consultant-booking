const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/booking');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));


const userRouter = require('./api/routes/users');
const userIdRouter = require('./api/routes/user-ids');
const profileRouter = require('./api/routes/profiles');

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

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
    console.log(error);
});

module.exports = app;

/*const TimeRange = require('./utility/time-range.js');
const connection = require('./connection.js');

const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
app.use(session({
    secret: 'a',
    resave: false,
    saveUninitialized: false,
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.set('view-engine', 'ejs');
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
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

mongoose.connect("mongodb://localhost:27017/booking");

const requireLogin = require('./requirements/require-login.js');
const renderHeader = require('./pages/shared/header.js');

loadTestDataInConnection(connection);

// PAGES:

const loginRouter = require('./pages/login-router.js');
const studentRouter = require('./pages/student-router.js');
const consultantRouter = require('./pages/consultant-router.js');
const mybookingsRouter = require('./pages/mybookings-router.js');
const bookingRouter = require('./pages/booking-router.js');
app.use('/', loginRouter);
app.use('/student', studentRouter);
app.use('/consultant', consultantRouter);
app.use('/mybookings', mybookingsRouter);
app.use('/booking', bookingRouter);


app.get('/', requireLogin, (req, res) => {
    let str = renderHeader(req);
    res.send(str);
});

// FUNCTIONS:

function loadTestDataInConnection(con) {
    let consultant1 = con.newConsultant("Ahmad");
    let consultant2 = con.newConsultant("Ali");
    let consultant3 = con.newConsultant("Abdullah");
    let student1 = con.newStudent("Mohammad");
    let student2 = con.newStudent("Mustafa");
    let student3 = con.newStudent("Saleh");
    con.newBooking(student1, consultant1, new TimeRange("2020 1:00 PM", "2020 2:00 PM"));
    con.newBooking(student1, consultant1, new TimeRange("2020 1:00 PM", "2020 3:00 PM"));
}

module.exports = app;
*/