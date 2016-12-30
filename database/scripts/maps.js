var mymap = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieW9jaGFubmFoIiwiYSI6Iko5TU1xcW8ifQ.AlR1faR7rfR1CoJRyIPEAg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    minZoom: 8,
    id: 'notsure',
    accessToken: 'pk.eyJ1IjoieW9jaGFubmFoIiwiYSI6Iko5TU1xcW8ifQ.AlR1faR7rfR1CoJRyIPEAg'
}).addTo(mymap);

var bounds = [],
    markers = [];

function addMarker(marker) {
    //assume array of objs with lats and longs and other fun stuff
    var lat = marker.Latitude,
        long = marker.Longitude,
        sev = parseInt(marker.Accident_Severity,10),
        colors = {1: "red",2:"orange",3:"yellow"};


    var circle = L.circle([lat, long], {
        fillColor: colors[sev],
        color:  colors[sev],
        weight:1,
        opacity:0.5,
        fillOpacity: 0.33,
        radius: 500
    }).addTo(mymap);
    circle.bindPopup(createincidentElement(marker));
    bounds.push([lat, long]);
    markers[marker.Accident_Index] = circle;
    console.log(mymap.getZoom());
    mymap.fitBounds(bounds);
}

function removeMarker(marker) {
    mymap.removeLayer(marker);
    delete markers[marker];
}

function removeAllMarkers() {
  console.log("removeing markers");
    for (marker in markers) {
        removeMarker(markers[marker]);
    }
    bounds = [];
}
