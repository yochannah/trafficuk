/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var listeningFirebaseRefs = [];

var db = {
    _filters: {},
    _config: {
        "police": "Police_Force",
        "severity": "Severity",
        "1st_Road_Class": "1st_Road_Class"
    }
};
var dbFields = ["police", "severity", "1st_Road_Class"],
    fieldRefs = {};

function populateDb() {

    dbFields.map(function(field) {
        var thisRef, thisElem, newOption;
        thisRef = firebase.database().ref(field);
        thisElem = document.getElementById(field);
        db[field] = {};

        //populate with values
        thisRef.on('child_added', function(ref) {
            //   newOption = document.createElement('option');
            //   newOption.innerText = ref.val();
            //   newOption.setAttribute("value",ref.key);
            //   thisElem.appendChild(newOption);
            db[field][ref.key] = ref.val();
        });

        //listen for changes:
        //    thisElem.addEventListener("change",function (e){
        //      listeningFirebaseRefs.map(function(ref){ ref.off();});
        //      removeAllMarkers();
        //      fieldVals[field] = parseInt(e.target[e.target.selectedIndex].value,10);
        //      db._filters[field] = parseInt(e.target[e.target.selectedIndex].value,10)
        //      startDatabaseQueries();
        //    });

        //    fieldRefs[field] = thisRef;
    });
}

function longToRef(lat) {
    var lat = lat.toString().split("."),
        lats = [lat[0]
            //  ,lat[1].substr(0,2)
            //  ,lat.substr(5,2)
        ];
    return lats.join("/") + "/accidents";
};
//get by lat:



/**
 * Starts listening for new incidents and populates incidents lists.
 */
function startDatabaseQueries() {
    showLoading();
    var bounds = getBounds(),
    numToShow = 3000,
    refstring = 'accidents/' + bounds.bucket + "/accidents",
    recentincidentsRef = firebase.database().ref(refstring).orderByChild("Latitude").startAt(bounds.startAt).endAt(bounds.endAt).limitToFirst(numToShow);

    var fetchAccidents = function(incidentsRef, sectionElement) {
        incidentsRef.on('child_added', function(data) {
            addMarker(data.val());
            hideLoading();
        });
        incidentsRef.on('child_changed', function(data) {
          removeMarker(data.val());
          addMarker(data.val());
        });
        incidentsRef.on('child_removed', function(data) {
            removeMarker(data.val());
        });
    };

    // Fetching and displaying all incidents of each sections.
    fetchAccidents(recentincidentsRef, document.getElementById('recent-incidents-list'));

    // Keep track of all Firebase refs we are listening to.

    listeningFirebaseRefs.push(recentincidentsRef);

}


populateDb();
startDatabaseQueries();

// Bindings on load.
document.getElementById('locationform').addEventListener('submit', function(e) {
    e.preventDefault();
    var searchFor = e.target.searchFor.value;
    if (searchFor.trim() !== "") {
        showLoading();
        new HttpClient().get("https://maps.googleapis.com/maps/api/geocode/json?address=" + searchFor + ",%20uk&key=AIzaSyD3a2w_kFitqdFEbzFUgPX5rEJQRmh31e8", function(response) {
            response = JSON.parse(response);
            if (response.status === "OK") {
              console.log(response.results[0]);
              var zoomin = (response.results[0].formatted_address.indexOf("London") >= 0),
               location = response.results[0].geometry.location;
                centerMap(location.lat, location.lng, zoomin);
                setStatus("Showing results for '" + searchFor + "'");
                if (response.results.length > 1) {
                    console.log(response.results);
                }
            } else {
                if (response.status === "ZERO_RESULTS") {
                    setStatus("No results returned for '" + searchFor + ", UK'", "error");
                    hideLoading();
                    console.debug(response);
                } else {
                    setStatus("I don't know what happened just there but it wasn't good.", "error");
                    hideLoading();
                    console.error("uhoh, some weird-ass unexpected condition occurred", response);
                }
            }
        });
    } else {
        setStatus("Type something in the searchbox first, silly bear!", "error");
        hideLoading();
    }
});

function showLoading() {
    document.getElementById("loader").className = "loading";
}

function hideLoading() {
    document.getElementById("loader").className = "inactive";
}

function setStatus(theHtml, state) {
    var status = document.getElementById("status");
    status.innerHTML = theHtml;
    if (state) {
        status.className = state;
    } else {
        status.className = "";
    }
}
