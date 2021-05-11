var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var flash = require('connect-flash');
var logger = require('morgan');
const hbs = require('express-handlebars');
const fileUpload  = require('express-fileupload');
const cookieChecker = require('./helpers/cookieChecker');
const mongoConnect = require('connect-mongo');
const dbUrl = require('./helpers/dbURI');
const enforce =  require('express-sslify');
require('dotenv').config();
// const mailHelper = require('./helpers/nodemailer')

const db = require('./helpers/db');

//
var indexRouter = require('./routes/index');
var  authRouter = require('./routes/users');
var  clientRouter = require('./routes/client');
var  adminRouter = require('./routes/admin');
const payRouter = require('./routes/payment');
const emailRouter = require('./routes/emailroute');
var app = express();


if (process.env.NODE_ENV==='production'){
   app.use(enforce.HTTPS({ trustProtoHeader: true }));
}


// view engine setup
app.engine('handlebars', hbs(
    {
      defaultLayout: 'main',
        // helpers: mailHelper
    }
));
app.set('view engine', 'handlebars');

app.use(flash());
app.use(session({
    secret: process.env.Secret,
    resave: false,
    saveUninitialized: true,
    name:'enkryptlogs',
    expires:  30 * 86400 * 1000,
    cookie: { secure: process.env.NODE_ENV !== "dev", httpOnly:  true, maxAge: 30 * 86400 * 1000,},
    store: mongoConnect.create({
        mongoUrl: dbUrl.dburi(),
    })

}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(fileUpload())
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1)


app.use('/', indexRouter);
app.use('/auth', authRouter);

app.use('/client', cookieChecker, clientRouter);
app.use('/admin',cookieChecker, adminRouter);
app.use('/p',cookieChecker, payRouter);
app.use('/e',cookieChecker, emailRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page

  // res.status(err.status || 500);
  // res.render('error',{});
});

module.exports = app;

