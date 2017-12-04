var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var index = require('./routes/index');
var issues = require('./routes/issues');
var nconf = require('nconf');
const session = require('express-session');
const MemcachedStore = require('connect-memcached')(session);
const passport = require('passport');
const config = require('./config');

//stting up app's root
var app = express();

//loading config file into nconf
nconf.file('./config/config.json');

//instancing db connection
mongoose.Promise = global.Promise;
//connecting to db
var db_options = nconf.get('db_options');
var db_path = nconf.get('db_path');
mongoose.connect(db_path, db_options).then(
    () => { console.log('DB connected successfully!'); },
    err => { console.error(`Error while connecting to DB: ${err.message}`); }
);

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
const sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: config.get('SECRET'),
  signed: true
};

// In production use the App Engine Memcache instance to store session data,
// otherwise fallback to the default MemoryStore in development.
if (config.get('NODE_ENV') === 'production' && config.get('MEMCACHE_URL')) {
  sessionConfig.store = new MemcachedStore({
    hosts: [config.get('MEMCACHE_URL')]
  });
}

app.use(session(sessionConfig));
// [END session]


// OAuth2
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./routes/auth').router);

//routes
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

/*
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
*/

module.exports = app;
