// Creating the map object
let myMap = L.map("map", {
    center: [37.3600, -95.5400],
    zoom: 5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

 // Load the GeoJSON data.
  let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define a markerSize() function that will give a different radius based on earthquake intensity.
function markerSize(size) {
  return size * 5;
}

// Get the data with d3.
d3.json(geoData).then(function(response) {

let data = response.features;
//this is working - just can't add to map for some reason
  for(let i=0; i < data.length; i++) {
    let lon = data[i].geometry.coordinates[0];
    let lat = data[i].geometry.coordinates[1];
    let depth = data[i].geometry.coordinates[2];
    let magnitude = data[i].properties.mag;

    let circle = L.circleMarker([lat, lon], {
                                  radius: markerSize(magnitude), 
                                  color: depth
                                
                                }).bindPopup(`<h1>${data[i].properties.place}</h1> <hr> <h3>Time: ${data[i].properties.time.toLocaleString()}</h3>`).addTo(myMap);
    console.log(circle);

  };

  var layer_IMD = L.CircleMarker(geoData, {
    valueProperty: 'IMDRank',
    scale: ['red', 'orange', 'yellow'],
    style: {
        color: '#111111', // border color
        weight: 1,
        fillOpacity: 0.5,
        fillColor: '#ffffff'
    }
}).addTo(map);

});