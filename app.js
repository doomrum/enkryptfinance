var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('express-handlebars');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
var app = express();
const socketio = require('socket.io');
const formatMessage = require('./helpers/messages');
const port = process.env.PORT | 4000;

const db = require('./helpers/db');
///





const server = http.createServer(app);
//

const io = socketio(server);


io.on('connection',socket=>{
////emit to a single user
    console.log('connected');
    socket.emit('message',formatMessage('Admin', 'hello user'));

////Broadcast to a single chat from the admin chat area
    ///send to all user except the sender
    socket.broadcast.emit('message',formatMessage('Admin','A new user just joined'));

    //listen to user message and send
    socket.on('userMessage',msg=>{
        console.log(socket.id);
        io.emit('message',formatMessage(msg.username,msg.text));
    })
    ///user leaves a chat
    socket.on('disconnect',()=>{

        ///emit to all users
        io.emit('message',formatMessage('Admin','A user just left'));
    });

});



////ROUTES
var indexRouter = require('./routes/index');
var  authRouter = require('./routes/users');
var  clientRouter = require('./routes/client');
var  adminRouter = require('./routes/admin');
// const payRouter = require('./routes/payment');




// view engine setup
app.engine('handlebars', hbs(
    {
      defaultLayout: 'main'
    }
));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));




app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/client', clientRouter);
app.use('/admin', adminRouter);


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


server.listen(port,()=> console.log(`listening on port ${port}`))
