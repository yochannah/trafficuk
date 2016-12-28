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
var messageInput = document.getElementById('new-post-message');
var titleInput = document.getElementById('new-post-title');
var signInButton = document.getElementById('sign-in-button');
var signOutButton = document.getElementById('sign-out-button');
var splashPage = document.getElementById('page-splash');
var addPost = document.getElementById('add-post');
var addButton = document.getElementById('add');
var recentPostsSection = document.getElementById('recent-posts-list');
var userPostsSection = document.getElementById('user-posts-list');
var topUserPostsSection = document.getElementById('top-user-posts-list');
var recentMenuButton = document.getElementById('menu-recent');
var myPostsMenuButton = document.getElementById('menu-my-posts');
var myTopPostsMenuButton = document.getElementById('menu-my-top-posts');
var listeningFirebaseRefs = [];

var dropdownVals = {police : 35};
var db = {};


/**
 * Creates a post element.
 */
function createPostElement(postId, numVehicles, speedLimit, date, policeForce) {

  var html =
      '<div class="post post-' + postId + ' mdl-cell mdl-cell--12-col ' +
                  'mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">' +
        '<div class="mdl-card mdl-shadow--2dp">' +
          '<div class="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white">' +
            '<h4 class="mdl-card__title-text"></h4>' +
          '</div>' +
          '<div class="text">Speed limit: ' + speedLimit + '</div>' +
          '<div class="text">Police: ' + db.police[parseInt(policeForce,10)] + '</div>' +
          '<div class="text">Number of vehicles: ' + numVehicles + '</div>' +
        '</div>' +
      '</div>';

  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;

  // Set values.
  postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = date;
  return postElement;
}

var dropdowns = ["police"],
dropdownRefs = {}, thisRef, thisElem, newOption;
function populateDropdowns() {
  dropdowns.map(function(dropdown){
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
      dropdownVals[dropdown] = parseInt(e.target[e.target.selectedIndex].value,10);
      startDatabaseQueries();
    });

    dropdownRefs[dropdown] = thisRef;
  });
}

/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries() {

    var recentPostsRef = firebase.database().ref('accidents').orderByChild('Police_Force').limitToLast(30).equalTo(dropdownVals.police);
    console.log(dropdownVals.police);

  var fetchAccidents = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      var author = data.val().author || 'Anonymous';
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
          createPostElement(data.key, data.val().Number_of_Vehicles, data.val().Speed_limit, data.val().Date,data.val().Police_Force),
          containerElement.firstChild);
          addMarker(data.val());
    });
    postsRef.on('child_changed', function(data) {
      console.log('FIX ME');
		var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
		var postElement = containerElement.getElementsByClassName('post-' + data.key)[0];
		postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = data.val().title;
		postElement.getElementsByClassName('username')[0].innerText = data.val().author;
		postElement.getElementsByClassName('text')[0].innerText = data.val().body;
		postElement.getElementsByClassName('star-count')[0].innerText = data.val().starCount;
    });
    postsRef.on('child_removed', function(data) {
      console.log('FIX ME - removed');
      removeMarker(data.val());
		var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
		var post = containerElement.getElementsByClassName('post-' + data.key)[0];
	    post.parentElement.removeChild(post);
    });
  };

  // Fetching and displaying all posts of each sections.
  fetchAccidents(recentPostsRef, recentPostsSection);

  // Keep track of all Firebase refs we are listening to.

  listeningFirebaseRefs.push(recentPostsRef);

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
  recentPostsSection.style.display = 'none';
  userPostsSection.style.display = 'none';
  topUserPostsSection.style.display = 'none';
  addPost.style.display = 'none';
  recentMenuButton.classList.remove('is-active');
  myPostsMenuButton.classList.remove('is-active');
  myTopPostsMenuButton.classList.remove('is-active');

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
