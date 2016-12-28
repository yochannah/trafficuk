var mymap = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieW9jaGFubmFoIiwiYSI6Iko5TU1xcW8ifQ.AlR1faR7rfR1CoJRyIPEAg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'notsure',
    accessToken: 'pk.eyJ1IjoieW9jaGFubmFoIiwiYSI6Iko5TU1xcW8ifQ.AlR1faR7rfR1CoJRyIPEAg'
}).addTo(mymap);

var bounds = [];
function addMarker(marker) {
    //assume array of objs with lats and longs and other fun stuff
    var lat = marker.Latitude,
    long = marker.Longitude;
    var circle = L.circle([lat, long], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(mymap);
    bounds.push([lat, long]);
    mymap.fitBounds(bounds);
}
