require('dotenv').config();
var express = require('express');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var request = require('request');
var router = express.Router();



// router.get('/', function(req, res) {
//   //go into db to find there save petslists
//   res.render('favorites')
// });

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
router.get('/', function(req, res) {
  //takes inputs from profile page to find a list of pets in area
  var sex = "";
  var zip = 98028;
  request("http://api.petfinder.com/pet.find?format=json&location="+zip+"&sex="+sex+"&key="+process.env.API_KEY+"", function(response, error, body){
    res.send(body);
  });
});


module.exports = router;
