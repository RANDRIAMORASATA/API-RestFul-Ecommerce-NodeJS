var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const dotenv = require('dotenv').config();

if (dotenv.error) {
  throw dotenv.error;
}

// Use the correct environment variable for the connection string
mongoose.connect(process.env.DATABASE, { })
  .then(() => console.log('connexion mongodb réussie'))
  .catch((error) => console.log('echec de la connexion mongo db', error));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRouter = require('./routes/userRouter');
var productRouter = require('./routes/productRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin', 'Origin, x-Requestes-With, Content, Accept,Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'GET,POST, PUT, DELETE, PATCH, OPTIONS');
  next()
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/products', productRouter); // Corrected the route definition
app.use('/api/users', userRouter); // 

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    'error': err.message
  });
});

module.exports = app;
