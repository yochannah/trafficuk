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

var db = {_filters:{},
          _config: {"police" : "Police_Force",
                    "severity" : "Severity",
                    "1st_Road_Class" : "1st_Road_Class"}};
var dbFields = ["police","severity","1st_Road_Class"],
fieldRefs = {};
function populateDb() {

  dbFields.map(function(field){
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

function setMultipleConstraints(dbref, options) {
  var argArray = [];
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            dbref = dbref.orderByChild((db._config(key)).equalTo(values[key]));
        }
    }
    return dbref;
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
  var bounds = getBounds();
  var refstring = 'accidents/' + bounds.bucket + "/accidents";
  console.log(refstring);
  var recentincidentsRef = firebase.database().ref(refstring).orderByChild("Latitude").startAt(bounds.startAt).endAt(bounds.endAt);

  var fetchAccidents = function(incidentsRef, sectionElement) {
    incidentsRef.on('child_added', function(data) {
      var containerElement = sectionElement.getElementsByClassName('incidents-container')[0];
      containerElement.insertBefore(
          createincidentElement(data.val()),
          containerElement.firstChild);
          addMarker(data.val());
    });
    incidentsRef.on('child_changed', function(data) {
      console.log('FIX ME');
		var containerElement = sectionElement.getElementsByClassName('incidents-container')[0];
		var incidentElement = containerElement.getElementsByClassName('incident-' + data.key)[0];
    });
    incidentsRef.on('child_removed', function(data) {
      console.log('FIX ME - removed');
      removeMarker(data.val());
		var containerElement = sectionElement.getElementsByClassName('incidents-container')[0];
		var incident = containerElement.getElementsByClassName('incident-' + data.key)[0];
	    incident.parentElement.removeChild(incident);
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
window.addEventListener('load', function() {


}, false);
