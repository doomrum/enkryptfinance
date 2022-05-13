var cron  = require('node-cron')
var createError = require("http-errors");
var express = require("express");
var path = require("path");

var debug = require('debug')('cryptotrade:server');
var session = require("express-session");
var flash = require("connect-flash");
var logger = require("morgan");
const hbs = require("express-handlebars");
const fileUpload = require("express-fileupload");
const cookieChecker = require("./helpers/cookieChecker");
const mongoConnect = require("connect-mongo");
const dbUrl = require("./helpers/dbURI");
const enforce = require("express-sslify");
require("dotenv").config();

// const mailHelper = require('./helpers/nodemailer')

const db = require("./helpers/db");

const socket = require('socket.io')
const axios = require('axios');

//
var indexRouter = require('./routes/index');
var  authRouter = require('./routes/users');
var  clientRouter = require('./routes/client');
var  adminRouter = require('./routes/admin');
const payRouter = require('./routes/payment');
const emailRouter = require('./routes/emailroute');
const postRouter = require('./routes/PostRoutes');
const referralRouter = require('./routes/referall');
var server = express();

var http = require('http');

if (process.env.NODE_ENV === "production") {
  server.use(enforce.HTTPS({ trustProtoHeader: true }));
}
//
// cron.schedule('5  *  *  *  *  *',()=>{
//     console.log('hello from crone')
// })

// view engine setup
server.engine(
  "handlebars",
  hbs({
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: ["views/partials/"],
    // helpers: mailHelper
  })
);
server.set("view engine", "handlebars");

server.use(
  session({
    secret: process.env.Secret,
    resave: false,
    saveUninitialized: true,
    name: "enkryptlogs",
    // expires: 7 * 86400 * 1000,
    // cookie: {
    //   secure: process.env.NODE_ENV !== "dev",
    //   httpOnly: true,
    //   maxAge: 7 * 86400 * 1000,
    // },
    store: mongoConnect.create({
      mongoUrl: dbUrl.dburi(),
    }),
  })
);
server.use(flash());
///Flash Message
server.use((req, res, next) => {
  res.locals.success_message = req.flash("success_message");
  res.locals.failure_message = req.flash("failure_message");
  next();
});

// user is authenticated
server.use((req, res, next) => {
  res.locals.access = req.session.access;
  next();
});

server.use(logger("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(fileUpload());
server.use(express.static(path.join(__dirname, "public")));
server.set("trust proxy", 1);



server.use('/', indexRouter);
server.use('/auth', authRouter);

server.use('/client', cookieChecker, clientRouter);
server.use('/admin',cookieChecker, adminRouter);
server.use('/p',cookieChecker, payRouter);
server.use('/admin/post',cookieChecker, postRouter);
server.use('/e',cookieChecker, emailRouter);
server.use('/r', referralRouter);
server.use(function (req, res, next) {
    res.render('404page')
});


// catch 404 and forward to error handler
server.use(function (req, res, next) {
  next(createError(404));
});

// error handler
server.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page

  // res.status(err.status || 500);
  // res.render('error',{});
});



function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log('Listening  on  port '+ addr.port)
}

var port = normalizePort(process.env.PORT || '4000');
var server = http.createServer(server);
const io = socket(server);


io.on('connection', socket => {
    setInterval(() => {

        const url = "https://api.nomics.com/v1/currencies/ticker?key=873ae0cc86815e29c223f548bcae6cd5&ids=BTC,ETH,BNB,XRP,LINK,DOGE,USDT,USDC,BCH,LTC,ADA&interval=1d,30d&convert=USD&per-page=100&page=1"
        axios.get(url)
            .then(async (result) => {
                socket.emit('liveChat', result.data)

            })

            .catch(err => {
                socket.emit('liveError', 'Error Found')
            });
    }, 1000)

});
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

