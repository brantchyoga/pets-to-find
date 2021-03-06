require('dotenv').config();
var express = require('express');
var db = require('../models');
var isLoggedIn = require('../middleware/isLoggedIn');
var request = require('request');
var router = express.Router();

//Filters out same pet images to return only the ones at a specific size
//this is an example of middleware brant created
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
//Found that in some cases a dash is represented by the character â, function
//takes â and subsequently replaces it with a dash
function regex(string){
  var expr = /â/g;
  if(string){
    return string.replace(expr, '-');
  }
  return string;
}

//go into db to find there save petslists
router.get('/', isLoggedIn, function(req, res) {
  db.pet_interest.findAll({
    where: {userId : req.user.id}
  }).then(function(pets){
    res.render('pets/favorites', {pets: pets});
  });
});

//Creates saved pet in db and renders favorites
router.post('/favorites', isLoggedIn, function(req,res) {
  db.pet_interest.findOrCreate({
    where: {
      userId: req.user.id,
      petname: req.body.name,
      image: req.body.imgToStore,
      petid: req.body.petid
    }
  }).then(function(pet){
    db.pet_interest.findAll({
      where: {userId : req.user.id}
    }).then(function(pets){
      res.render('pets/favorites', {pets: pets});
    });
  });
});

//when user clicks on pet in the search list. it querys that specific pet to show it
//with the option of add it to the db
router.get('/:id', isLoggedIn, function(req, res) {
  var url = "http://api.petfinder.com/pet.get?format=json&id="+req.params.id+"&key="+process.env.API_KEY+"";
  console.log(url);

  request(url, function(response, error, body){
    var petInfo = JSON.parse(body).petfinder;
    //Condition where animal has been adopted or no longer available
    if(petInfo.header.status.message.$t === 'shelter opt-out') {
      res.render('pets/petunavailable');
    } else {
      //Condition where user clicks on an animal with no picture
      if(petInfo.pet.media.photos === undefined){
        var imgToStore = "/img/noimage.jpg";
      } else {
        var imgArray = petInfo.pet.media.photos.photo;
        var imgUrlArray = filterImg(imgArray);
        var imgToStore = imgUrlArray[0].$t
      }
      var petId = petInfo.pet.id.$t;
      var breeds = petInfo.pet.breeds.breed;
      var mix = petInfo.pet.mix.$t;
      var age = petInfo.pet.age.$t;
      var sex = petInfo.pet.sex.$t;
      var description = regex(petInfo.pet.description.$t);
      var name = petInfo.pet.name.$t;
      var hasBeenArray = petInfo.pet.options.option;
      var contact = petInfo.pet.contact.email.$t;
      var shelterId = petInfo.pet.shelterId.$t;

      var shelterUrl = "http://api.petfinder.com/shelter.get?format=json&id="+shelterId+"&key="+process.env.API_KEY+"";
      console.log(shelterUrl);
      //request data for google maps
        request(shelterUrl, function(response, error, body){
          var shelterInfo = JSON.parse(body).petfinder.shelter;
          // var address = shelterInfo.address1.$t;
          var lat = shelterInfo.latitude.$t;
          var long = shelterInfo.longitude.$t;
          var shelterName = shelterInfo.name.$t;

          res.render('pets/show', {
            image: imgToStore,
            images: imgUrlArray,
            breeds: breeds,
            mix: mix,
            age: age,
            sex: sex,
            description: description,
            name: name,
            hasBeen: hasBeenArray,
            contact: contact,
            petId: petId,
            lat: lat,
            long: long,
            shelterName: shelterName
          });
        });
    }
  });
});

router.post('/', isLoggedIn, function(req, res) {
  //if inputs are left empty sets undefined to empty stings so api call works
  if(req.body.animal === undefined){var animal = ""}else{var animal = req.body.animal};
  if(req.body.gender === undefined){var sex = ""}else{var sex = req.body.gender};
  var zip = req.body.zipCode;
  var url = "http://api.petfinder.com/pet.find?format=json&location="+zip+"&sex="+sex+"&animal="+animal+"&count=20&&key="+process.env.API_KEY+""
  console.log(url);

  request(url, function(response, error, body){
    var pets = JSON.parse(body).petfinder;
    //Filters out api calls I that don't give the information needed
    if(pets.header.status.message.$t === 'invalid arguments' || pets.header.status.message.$t === "Invalid geographical location"){
      res.render('pets/unavailable');
    } else {
      res.render('pets/searchlist', {pets: pets.pets.pet});
    }
  });
});

//Deletes saved pet from favorites
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
