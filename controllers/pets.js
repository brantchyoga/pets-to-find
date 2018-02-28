require('dotenv').config();
var express = require('express');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var request = require('request');
var router = express.Router();

function filterImg(array){
  var count = 1;
  var urlArray = array.filter(function(image){
    if((image['@id'] === count.toString()) && (image['@size'] === 'pn')){
      count++;
      return true;
    } else {
      return false;
    }
  });
  return urlArray;
}

router.get('/', function(req, res) {
  //go into db to find there save petslists
  res.render('favorites')
});

router.get('/:id', function(req, res) {
  //when user clicks on pet in the search list. it querys that specific pet to show it
  //with the option of add it to the db
  console.log(req.params.id);
  var url = "http://api.petfinder.com/pet.get?format=json&id="+req.params.id+"&key="+process.env.API_KEY+"";
  console.log(url);
  request(url, function(response, error, body){
    var petInfo = JSON.parse(body).petfinder;
    if(petInfo.header.status.message.$t === 'shelter opt-out' || petInfo.pet.name.$t === 'VOLUNTEERS WANTED') {
      res.render('pets/unavailable');
    } else {
      var imgArray = petInfo.pet.media.photos.photo;
      var imgUrlArray = filterImg(imgArray);
      var breeds = petInfo.pet.breeds.breed;
      var mix = petInfo.pet.mix.$t;
      var age = petInfo.pet.age.$t;
      var sex = petInfo.pet.sex.$t;
      var description = petInfo.pet.description.$t;
      var name = petInfo.pet.name.$t;
      var hasBeenArray = petInfo.pet.options.option;
      console.log(imgArray[0].$t);

      res.render('pets/show', {
        images: imgUrlArray,
        breeds: breeds,
        mix: mix,
        age: age,
        sex: sex,
        description: description,
        name: name,
        hasBeen: hasBeenArray
      });
    }
  });
});
//route should be get (testing currently!!!!!)!!! remember brant
router.post('/', function(req, res) {
  //takes inputs from profile page to find a list of pets in area
  var animal = "dog";
  var breed = "";
  var age = "";
  var sex = req.body.gender;
  var zip = req.body.zipCode;
  var url = "http://api.petfinder.com/pet.find?format=json&location="+zip+"&sex="+sex+"&age="+age+"&breed="+breed+"&animal="+animal+"&key="+process.env.API_KEY+""
  console.log(url);
  request(url, function(response, error, body){
    var pets = JSON.parse(body);
    // console.log(pets.petfinder.pets.pet[0].name);
    res.render('pets/searchlist', {pets: pets.petfinder.pets.pet});
  });
});


module.exports = router;
