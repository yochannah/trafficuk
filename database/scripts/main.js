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

// Shortcuts to DOM Elements.
var messageForm = document.getElementById('message-form');
var messageInput = document.getElementById('new-incident-message');
var titleInput = document.getElementById('new-incident-title');
var signInButton = document.getElementById('sign-in-button');
var signOutButton = document.getElementById('sign-out-button');
var splashPage = document.getElementById('page-splash');
var addincident = document.getElementById('add-incident');
var addButton = document.getElementById('add');
var recentincidentsSection = document.getElementById('recent-incidents-list');
var userincidentsSection = document.getElementById('user-incidents-list');
var topUserincidentsSection = document.getElementById('top-user-incidents-list');
var recentMenuButton = document.getElementById('menu-recent');
var myincidentsMenuButton = document.getElementById('menu-my-incidents');
var myTopincidentsMenuButton = document.getElementById('menu-my-top-incidents');
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
      console.log('child:', dropdown, ref.val(), thisElem);
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
  console.log(dropdowns);
}

/**
 * Starts listening for new incidents and populates incidents lists.
 */
function startDatabaseQueries() {

    var recentincidentsRef = firebase.database().ref('accidents').orderByChild('Police_Force').limitToLast(100).equalTo(db._filters.police);

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
		incidentElement.getElementsByClassName('mdl-card__title-text')[0].innerText = data.val().title;
		incidentElement.getElementsByClassName('username')[0].innerText = data.val().author;
		incidentElement.getElementsByClassName('text')[0].innerText = data.val().body;
		incidentElement.getElementsByClassName('star-count')[0].innerText = data.val().starCount;
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
  fetchAccidents(recentincidentsRef, recentincidentsSection);

  // Keep track of all Firebase refs we are listening to.

  listeningFirebaseRefs.push(recentincidentsRef);

}


/**
 * Cleanups the UI and removes all Firebase listeners.
 */
function cleanupUi() {

}

populateDropdowns();
startDatabaseQueries();




/**
 * Displays the given section element and changes styling of the given button.
 */
function showSection(sectionElement, buttonElement) {
  recentincidentsSection.style.display = 'none';
  userincidentsSection.style.display = 'none';
  topUserincidentsSection.style.display = 'none';
  addincident.style.display = 'none';
  recentMenuButton.classList.remove('is-active');
  myincidentsMenuButton.classList.remove('is-active');
  myTopincidentsMenuButton.classList.remove('is-active');

  if (sectionElement) {
    sectionElement.style.display = 'block';
  }
  if (buttonElement) {
    buttonElement.classList.add('is-active');
  }
}

// Bindings on load.
window.addEventListener('load', function() {


}, false);
