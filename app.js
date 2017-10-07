var map;
var markers = [];
let circles  = [];

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    mapTypeId: 'terrain'
  });

  // This event listener will call addMarker() when the map is clicked.
  // map.addListener('click', function(event) {
  //   addMarker(event.latLng);
  // });

  // Adds a marker at the center of the map.
  // addMarker(haightAshbury);
}

// Adds a marker to the map and push to the array.
function addMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    icon: "iss.png",
    map: map
  });
  markers.push(marker);
  // Add circle overlay and bind to marker
  let circle = new google.maps.Circle({
    map: map,
    radius: 80000,    // 10 miles in metres
    strokeColor: '#009900',
    strokeOpacity: 0.3,
    strokeWeight: 2,
    fillColor: '#005500',
    fillOpacity: 0.15,
  });
  circle.bindTo('center', marker, 'position');
  circles.push(circle);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function removeAllcircles() {
  for(var i in circles) {
    circles[i].setMap(null);
  }
  circles = [];
}

// function moveISS () {
//   $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
//       var lati = data['iss_position']['latitude'];
//       var longi = data['iss_position']['longitude'];
//       var pos = {lat: parseFloat(lati), lng: parseFloat(longi)};
//       deleteMarkers();
//       removeAllcircles();
//       addMarker(pos);
//       map.setCenter(pos);
//   });
//   setTimeout(moveISS, 2000); 
// }


function moveISS () {
  $.getJSON('https://api.wheretheiss.at/v1/satellites/25544', function(data) {
      var lati = data['latitude'];
      var longi = data['longitude'];
      var pos = {lat: parseFloat(lati), lng: parseFloat(longi)};
      deleteMarkers();
      removeAllcircles();
      addMarker(pos);
      map.setCenter(pos);
  });
  getISSInfo();
  setTimeout(moveISS, 2000); 
}

function getISSInfo() {
  $.getJSON('https://api.wheretheiss.at/v1/satellites/25544', function(data) {
    const altitude = data['altitude'].toString().split(".")[0];
    const speed = data['velocity'].toString().split(".")[0];
    const visibility = data['visibility'];
    const infoDiv = document.querySelector(".info");

    infoDiv.innerHTML = "";
    infoDiv.innerHTML += "<p>Altitude: " + altitude + " km</p>";
    infoDiv.innerHTML += "<p>Speed: " + speed + " km/h</p>";
    infoDiv.innerHTML += "<p>Visilibity: " + visibility + "</p>";


  });
}

getISSInfo();
moveISS();

const menuButton = document.getElementById("menu-btn");
const menu = document.getElementById("menu-box");
const passTimesUL = document.getElementById("pass-times");

menuButton.addEventListener("click", openMenu);

function openMenu() {
  menu.classList.toggle("visible");
}
