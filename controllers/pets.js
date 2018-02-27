require('dotenv').config();
var express = require('express');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var request = require('request');
var router = express.Router();



router.get('/', function(req, res) {
  //go into db to find there save petslists
  res.render('favorites')
});

router.get('/:id', function(req, res) {
  //when clicked from favorites page it show pets info from db
    res.render('show');
});

router.post('/:id', function(req, res) {
  //when user clicks on pet in the search list. it querys that specific pet to show it
  //with the option of add it to the db
    res.render('searchlist');
});
//route should be get (testing currently!!!!!)!!! remember brant
router.post('/', function(req, res) {
  //takes inputs from profile page to find a list of pets in area
  console.log(req.body);
  var animal = "";
  var breed = "";
  var age = "";
  var sex = req.body.gender;
  var zip = req.body.zipCode;
  request("http://api.petfinder.com/pet.find?format=json&location="+zip+"&sex="+sex+"&age="+age+"&breed="+breed+"&animal="+animal+"&key="+process.env.API_KEY+"", function(response, error, body){
    res.send(req.body);
  });
});


module.exports = router;
