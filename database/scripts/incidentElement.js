/**
 * Creates a incident element.
 */
function createincidentElement(data) {
  var roads = "";
  var html =
    '<div class="incident incident-' + data.Accident_Index + '">' +
    '<div class="date">' + data.Date +'</div>' +
      '<table>' +
          '<tr><td class="descriptor">Speed limit:</td><td> ' + data.Speed_limit + '</td></tr>' +
          '<tr><td class="descriptor">Police force:</td><td> ' + db.police[parseInt(data.Police_Force,10)] + '</td></tr>' +
          '<tr><td class="descriptor"># of vehicles:</td><td> ' + data.Number_of_Vehicles + '</td></tr>' +
          '<tr><td class="descriptor">Roads:</td><td> ' + roads + '</td></tr>' +
      '</table>' + '</div>';

  // Create the DOM element from the HTML.
  var div = document.createElement('div');
  div.innerHTML = html;
  var incidentElement = div.firstChild;

  return incidentElement;
}
