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
  setTimeout(moveISS, 2000); 
}

moveISS();

const menuButton = document.getElementById("menu-btn");
const menu = document.getElementById("menu-box");
const passTimesUL = document.getElementById("pass-times");

menuButton.addEventListener("click", openMenu);

function openMenu() {
  // if (menu.style.zIndex != "-1") {
  //   menu.style.zIndex = "-1";
  // } else {
  //   menu.style.zIndex = "1";
  // }
  menu.classList.toggle("visible");
}



function getCurrentPositionPassTimes() {
  // if ("geolocation" in navigator) {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     $.getJSON('http://api.open-notify.org/iss-pass.json?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&alt=20&n=5&callback=?', function(data) {
  //       let dates = [];
  //       data['response'].forEach(function (d) {
  //           var date = new Date(d['risetime']*1000);
  //           console.log(date);
  //           dates.push(date);
  //         });
  //         let items = "";
  //         dates.forEach((el) => {
  //           items += "<li class='list-item'>" + moment(el).format('MMMM Do YYYY, h:mm a') + "</li>";
  //         });
  //         passTimesUL.innerHTML = items;
  //       });
  //     });
  // } else {
    $.getJSON("http://ip-api.com/json", function(data) {
      $.getJSON('http://api.open-notify.org/iss-pass.json?lat=' + data.lat + '&lon=' + data.lon + '&alt=20&n=5&callback=?', function(data) {
        let dates = [];
        data['response'].forEach(function (d) {
            var date = new Date(d['risetime']*1000);
            console.log(date);
            dates.push(date);
          });
          let items = "";
          dates.forEach((el) => {
            items += "<li class='list-item'>" + moment(el).format('MMMM Do YYYY, h:mm a') + "</li>";
          });
          passTimesUL.innerHTML = items;
        });  
    });
  //}
}

function getCurrentAstonauts() {
  $.getJSON('http://api.open-notify.org/astros.json?callback=?', function(data) {
    var number = data['number'];
    $('#spacepeeps').html(number);

    data['people'].forEach(function (d, i) {
      if (i == data['people'].length - 1) {
        $('#astronames').append('<span> and ' + d['name'] + '</span>.');
      } else {
        $('#astronames').append('<span>' + d['name'] + '</span>, ');
      }
    });
  });
}

getCurrentAstonauts();
getCurrentPositionPassTimes();