var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//DATABASE
const mongoose = require('mongoose');
//CONFIGURATION FILE
const config = require('./config/config.js');

/* ================ AUTHENTICATION ================ */
const session = require('express-session');
const passport = require('passport');
/* ================================================ */

/* ================ ROUTES ================ */
const index = require('./routes/index');
const issues = require('./routes/issues');
const auth = require('./routes/auth');
/* ======================================== */

//stting up app's root
var app = express();

/* =============================== DATABASE ============================== */
//instancing db connection
mongoose.Promise = global.Promise;
//connecting to db
var db_options = config.get('MONGO_OPTIONS');
var db_path = config.get('MONGO_URL');
mongoose.connect(db_path, db_options).then(
    () => { console.log('DB connected successfully!'); },
    err => { console.error(`Error while connecting to DB: ${err.message}`); }
);
/* ======================================================================== */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// [START session]
// Configure the session and session storage.
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: config.get('SESSION_SECRET'),
  signed: true
}));
// [END session]

// OAuth2
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use(auth.router); //authorization router
app.use('/', index);
app.use('/issues', issues);

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

module.exports = app;
