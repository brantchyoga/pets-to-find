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

router.get('/', isLoggedIn, function(req, res) {

  //go into db to find there save petslists
  db.pet_interest.findAll({
    where: {userId : req.user.id}
  }).then(function(pets){
    res.render('pets/favorites', {pets: pets});
  });
});

router.get('/:id', isLoggedIn, function(req, res) {
  //when user clicks on pet in the search list. it querys that specific pet to show it
  //with the option of add it to the db

  var url = "http://api.petfinder.com/pet.get?format=json&id="+req.params.id+"&key="+process.env.API_KEY+"";
console.log("get by id");
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
      var contact = petInfo.pet.contact.email.$t;

      db.pet_interest.findOrCreate({
        where: {
          userId: req.user.id,
          petname: name,
          image: imgUrlArray[0].$t,
          petid: req.params.id,
        }
      }).then(function(data){

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
      });
    }
  });
});
//route should be get (testing currently!!!!!)!!! remember brant
router.post('/', isLoggedIn, function(req, res) {
  //takes inputs from profile page to find a list of pets in area
  var offset = 0;
  var animal = "";
  var sex = "";
  var zip = req.body.zipCode;
  var url = "http://api.petfinder.com/pet.find?format=json&location="+zip+"&sex="+sex+"&animal="+animal+"&count=20&offset="+offset+"&key="+process.env.API_KEY+""
  console.log(url);
  request(url, function(response, error, body){
    var pets = JSON.parse(body).petfinder;
    // if(offset !== pets.lastOffSet.$t && zip === pets.pets.pet[0].contact.zip.$t){
    //   offset = pets.lastOffSet;
    // }
    // //fill in logic to filter out pets no longer available and spam
    // if(pets.header.status.message.$t === 'shelter opt-out' || pets.pet.name.$t === 'VOLUNTEERS WANTED') {
    // }
    if(pets.header.status.message.$t === 'invalid arguments' || pets.header.status.message.$t === "Invalid geographical location"){
      res.render('pets/unavailable');
    } else {
      res.render('pets/searchlist', {pets: pets.pets.pet});
    }
  });
});

router.delete('/:id', isLoggedIn, function(req, res){
  console.log("Delete route");
  db.pet_interest.destroy({
    where:
    {userId: req.user.id,
    petid: req.params.id}
  }).then(function(data){
    res.send();
  });
});


module.exports = router;
