var mymap = L.map('mapid').setView([53.382121, -1.467878], 12);
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieW9jaGFubmFoIiwiYSI6Iko5TU1xcW8ifQ.AlR1faR7rfR1CoJRyIPEAg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    minZoom: 10,
    id: 'notsure',
    accessToken: 'pk.eyJ1IjoieW9jaGFubmFoIiwiYSI6Iko5TU1xcW8ifQ.AlR1faR7rfR1CoJRyIPEAg'
}).addTo(mymap);

var colors = {
        1: "red",
        2: "orange",
        3: "yellow"
    },
    markers = {};

function addMarker(marker) {
    //assume array of objs with lats and longs and other fun stuff
    var lat = marker.Latitude,
        long = marker.Longitude,
        sev = parseInt(marker.Accident_Severity, 10);
        //only add markers if they haven't already been added.
    if (!markers[marker.Accident_Index]) {
        var circle = L.circle([lat, long], {
            fillColor: colors[sev],
            color: colors[sev],
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.33,
            radius: 200
        }).addTo(mymap);
        circle.bindPopup(createincidentElement(marker));
        markers[marker.Accident_Index] = circle;
    }
}

function removeMarker(marker) {
    mymap.removeLayer(marker);
    delete markers[marker];
}

function removeAllMarkers() {
    for (marker in markers) {
        removeMarker(markers[marker]);
    }
}

function getBounds() {
    var b = mymap.getBounds();
    return {
        startAt: b._southWest.lat,
        endAt: b._northEast.lat,
        bucket: mymap.getCenter().lng.toString().split(".")[0]
    }
}

function centerMap(lat, long) {
    mymap.panTo([lat, long]);
}

mymap.on('zoomend', function() {
    startDatabaseQueries();
});

mymap.on('dragend', function() {
    startDatabaseQueries();
});

mymap.on('viewreset', function() {
    startDatabaseQueries();
});
