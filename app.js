var express = require('express');
var path = require('path');
var logger = require('morgan');
// var utilPath = require('./util/path')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
const csurf = require('csurf');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'documents');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'document/png' || file.mimetype === 'document/jpg' || file.mimetype === 'document/jpe' || file.mimetype === 'document/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

var index = require('./routes/index');
var users = require('./routes/users');
var loanboard = require('./routes/loanboard');
var loanofficer = require('./routes/loanofficer');

mongoose.Promise = global.Promise;
mongoose.connect('localhost:27017/finalproject', {
    useNewUrlParser: true,

    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log('no db connection')
    } else {
        console.log('db is connected')
    }
});

require('./config/passport.js');
var app = express();
const csrfProtection = csurf();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(multer({
    storage: fileStorage

}).single('document'));
// app.use(express.static(path.join(utilPath, 'public')));
app.use('/documents', express.static(path.join(__dirname, 'documents')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//validator should be ater body parser
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    cookie: { maxAge: 180 * 60 * 1000 },
}));
app.use(csrfProtection);;
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrf = req.csrfToken()
    next();
})
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/loanofficer', loanofficer);
app.use('/loanboard', loanboard);


app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.messages = req.flash();
    next();
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
console.log(path.join(require.main.filename + '/../documents/'))
app.listen(7000, (err) => {
    if (err) {
        console.log('server is not started')
    } else {
        console.log('server has started at port 5000')
    }
})

module.exports = app;





// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var multer = require('multer')
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
// var mongoose = require('mongoose');
// var session = require('express-session');
// var passport = require('passport');
// var flash = require('connect-flash');
// var MongoStore = require('connect-mongo')(session);
// var index = require('./routes/index');
// var users = require('./routes/users');
// var loanboard = require('./routes/loanboard');
// var loanofficer = require('./routes/loanofficer');
// var csrf = require('csurf');
// var csrfProtection = csrf({ cookie: true });





// expressValidator = require('express-validator');
// mongoose.Promise = global.Promise;
// mongoose.connect('localhost:27017/finalproject');

// require('./config/passport.js');
// var app = express();


// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'documents');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + file.originalname);
//     }
// })
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'document/png' || file.mimetype === 'document/jpg' || file.mimetype === 'document/jpe' || file.mimetype === 'document/jpeg') {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }
// app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.static(path.join(__dirname, './documents')));
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// //validator should be ater body parser
// app.use(expressValidator());
// app.use(cookieParser());
// // app.use(csrf({
// //     cookie: {

// //         key: '_csrf',
// //         path: '/',
// //         httpOnly: false, // if you want you can use true here
// //         secure: false, // if you are using HTTPS I suggest true here
// //         signed: false, // I don't know if csurf supports signed cookies, so I used false

// //         maxAge: 24 * 60 * 60 * 1000 // 24 hours
// //     }
// // }));
// // app.use((req, res, next) => {
// //     const csrfTokenToSendToFrontEnd = req.csrfToken();
// //     console.log('csrfTokenToSendToFrontEnd: ', csrfTokenToSendToFrontEnd);
// //     res.cookie('XSRF-TOKEN', csrfTokenToSendToFrontEnd);
// //     next();
// // });
// app.use(session({
//     secret: 'mysupersecret',
//     resave: false,
//     saveUninitialized: false,
//     store: new MongoStore({
//         mongooseConnection: mongoose.connection
//     }),
//     // cookie: { maxAge: 180 * 60 * 1000 },
// }));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(csrf());
// // app.use(csrfProtection())
// app.use(function(req, res, next) {
//     var token = req.csrfToken();
//     res.cookie('csrf-token', token);
//     res.locals.csrfToken = token;
//     next();
// });
// app.use('/', index);
// app.use('/users', users);
// app.use('/loanofficer', loanofficer);
// app.use('/loanboard', loanboard);



// app.use(function(req, res, next) {
//     res.locals.login = req.isAuthenticated();
//     res.locals.session = req.session;
//     res.locals.messages = req.flash();
//     res.locals.csrftoken = req.csrfToken();
//     next();
// });
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

// module.exports = app;