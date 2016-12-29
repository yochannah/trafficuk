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

var dropdownVals = {police : 35};
var db = {_filters:{}};
var dropdowns = ["police","severity"],
dropdownRefs = {};
function populateDropdowns() {

  dropdowns.map(function(dropdown){
    var thisRef, thisElem, newOption;
    thisRef = firebase.database().ref(dropdown);
    thisElem = document.getElementById(dropdown);
    db[dropdown] = {};

    //populate with values
    thisRef.on('child_added', function(ref) {
      newOption = document.createElement('option');
      newOption.innerText = ref.val();
      newOption.setAttribute("value",ref.key);
      thisElem.appendChild(newOption);
      db[dropdown][ref.key] = ref.val();
    });

    //listen for changes:
    thisElem.addEventListener("change",function (e){
      listeningFirebaseRefs.map(function(ref){ ref.off();});
      removeAllMarkers();
//      dropdownVals[dropdown] = parseInt(e.target[e.target.selectedIndex].value,10);
      db._filters[dropdown] = parseInt(e.target[e.target.selectedIndex].value,10)
      startDatabaseQueries();
    });

    dropdownRefs[dropdown] = thisRef;
  });
}

/**
 * Starts listening for new incidents and populates incidents lists.
 */
function startDatabaseQueries() {

//  var recentincidentsRef = firebase.database().ref('accidents').orderByChild('Police_Force').limitToLast(100).equalTo(db._filters.police);
  var recentincidentsRef = firebase.database().ref('accidents').orderByChild('Police_Force').limitToLast(100);

  var fetchAccidents = function(incidentsRef, sectionElement) {
    incidentsRef.on('child_added', function(data) {
      var author = data.val().author || 'Anonymous';
//      console.log(data.val());
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


populateDropdowns();
startDatabaseQueries();

// Bindings on load.
window.addEventListener('load', function() {


}, false);
