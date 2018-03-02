var initMap = function() {
  console.log("in the initMap function");
  var marker = new google.maps.LatLng(lat, long);

  var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: marker,
      mapTypeId: 'satellite',
      gestureHandling: 'cooperative' //this should in theory fix the zoom/scroll feature when we scroll down the page
    });
    console.log(map);
  // if brower support available, ask user for location data and set the map view
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var initialLocation = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      map.setCenter(initialLocation);
    });
  }

  // for each marker passed through, add it to the map with a popup
  var position = new google.maps.LatLng(lat, long);
  console.log(position);
  console.log(name);
  var googleMarker = new google.maps.Marker({
    position: position,
    title: name,
    map: map
  });
  // Bind a popup to the marker
  googleMarker.addListener('click', function() {
    var infoWindow = new google.maps.InfoWindow({
      content: '<h5>' + name + '</h5>'
    });
    infoWindow.open(map, googleMarker);
  });
};
