var sevs = db["severity"];

/**
 * Creates a incident element.
 */
function createincidentElement(data) {
  var roads = processRoads(data);
  var html =
    '<div class="incident incident-' + data.Accident_Index + '">' +
    '<div class="date">' + data.Date + ": " + sevs[parseInt(data.Accident_Severity,10)] + ' accident</div>' +
      '<table>' +
          '<tr><td class="descriptor">Speed limit:</td><td> ' + data.Speed_limit + '</td></tr>' +
          '<tr><td class="descriptor">Police force:</td><td> ' + db.police[parseInt(data.Police_Force,10)] + '</td></tr>' +
          '<tr><td class="descriptor"># of vehicles:</td><td> ' + data.Number_of_Vehicles + '</td></tr>' +
          '<tr><td class="descriptor">Roads:</td><td> ' + roads + '</td></tr>' +
          '<tr><td class="descriptor">Lat</td><td> ' + data.Latitude + '</td></tr>' +
          '<tr><td class="descriptor">Long:</td><td> ' + data.Longitude + '</td></tr>' +
      '</table>' + '</div>';

  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;
  var incidentElement = div.firstChild;

  return incidentElement;
}

function processRoads(data){
  var roadclasses = db["1st_Road_Class"], //you know I named the lookup badly when it works for both roads.
  roadClass1 = roadclasses[data["1st_Road_Class"]],
  roadClass2 = roadclasses[data["2nd_Road_Class"]],
  road1, road2, roads;

  if ((roadClass1 == "Unclassified") || (data["1st_Road_Number"] == 0)) {
    return "Name unknown";
  } else {
    road1 = roadClass1 + data["1st_Road_Number"];
    if ((roadClass2 == "Unclassified") || (data["2nd_Road_Number"] == 0)) {
      return road1;
    } else {
      return road1 + " and " + roadClass2 + data["2nd_Road_Number"];
    }
  }
}
