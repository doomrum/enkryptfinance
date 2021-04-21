var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var flash = require('connect-flash');
var logger = require('morgan');
const hbs = require('express-handlebars');
const fileUpload  = require('express-fileupload');
require('dotenv').config();
// const mailHelper = require('./helpers/nodemailer')

const db = require('./helpers/db');

//
var indexRouter = require('./routes/index');
var  authRouter = require('./routes/users');
var  clientRouter = require('./routes/client');
var  adminRouter = require('./routes/admin');
const payRouter = require('./routes/payment');
const emailRouter = require('./routes/emailTest');
var app = express();



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
    secret: 'Ilovecodingthisistrue1234',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}))
app.use((req,res,next)=>{
    res.locals.msg = req.session.msg;
    delete req.session.msg;
    next()
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(fileUpload())
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/client', clientRouter);
app.use('/admin', adminRouter);
app.use('/p', payRouter);
app.use('/e', emailRouter);



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

