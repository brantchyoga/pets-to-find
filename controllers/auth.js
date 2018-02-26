var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();

router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.post('/signup', function(req, res){
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
    //spread and then are the same but spread will take 2 parameters hence with findOrCreate
  }).spread(function(user, created){
    if(created){
      console.log("user created");
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Acount created and logged in'
      })(req, res);
    } else {
      //email already exists in db
      console.log('email already exists');
      req.flash('error', 'Email already exists');
      res.redirect('/auth/signup');
    }
  }).catch(function(error){
    console.log('an error occurred', error.message);
    req.flash('error', error.message);
    res.redirect('/auth/signup');
  });
});

router.get('/login', function(req, res){
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  successFlash: 'You have logged in!',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid Username and/or Password.'
}));

router.get('/logout', function(req, res){
  req.logout();
  console.log('logged out');
  req.flash('success', 'You have logged out!')
  res.redirect('/');
});

module.exports = router;
