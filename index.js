require('dotenv').config();
var flash = require('connect-flash');
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/ppConfig');
var isLoggedIn = require('./middleware/isLoggedIn');
var path = require('path');
var request = require('request');

var app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(ejsLayouts);

//Needs env file where you store SESSION_SECRET, random secret word doesn't matter
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  savedUninitialized: true
}));
//flash is messages and has to be after app.use sesions
app.use(flash());

//these app.use passport stuff has to be put in after app.use session
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  //before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));
app.use('/pets', require('./controllers/pets'));

var server = app.listen(process.env.PORT || 3005);

module.exports = server;
