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
        sev = parseInt(marker.Accident_Severity, 10),
        bounds = mymap.getBounds(),
        zoomLevel = mymap.getZoom(),
        //only add markers if they haven't already been added
        isNewMarker = (!markers[marker.Accident_Index]),
        //we don't want to waste resources adding markers we can't see anyway.
        isInCurrentView = bounds.contains([lat,long]);
    if (isNewMarker && isInCurrentView) {
        var circle = L.circle([lat, long], {
            fillColor: colors[sev],
            color: colors[sev],
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.33,
            radius: (1000 / mymap.getZoom())
        }).addTo(mymap);
        circle.bindPopup(createincidentElement(marker));
        markers[marker.Accident_Index] = circle;
    }
}

function removeMarker(marker, k) {
    mymap.removeLayer(marker);
    delete markers[k];
}

function removeAllMarkers() {
    for (marker in markers) {
        removeMarker(markers[marker], marker);
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

function centerMap(lat, long, zoomin) {
    mymap.panTo([lat, long]);
    if (zoomin) {
    mymap.setZoom(14);
  } else {
    mymap.setZoom(12);

  }
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

function pruneOldMarkers(maxMarkersToShow){
  var bounds = mymap.getBounds(),
  markerKeys = Object.keys(markers);
  markerKeys.map(function(k) {
    if(!bounds.contains(markers[k].getLatLng())) {
      removeMarker(markers[k],k);
    }
  });
  if(Object.keys(markers).length >= maxMarkersToShow) {
    setStatus("Heavy crash area. Showing first " + maxMarkersToShow + ". Consider zooming in.","Warning");
  }
  console.log('current live markers:', Object.keys(markers).length );
}
