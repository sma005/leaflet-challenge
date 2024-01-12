//Worked with ccampbelljr from AskBCS for chroma
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

// Define a color scale using chroma
function getColor(magnitude) {
  const colorScale = chroma.scale(["#ffffb2", "#b10026"]).domain([0, 10]);
  return colorScale(magnitude).hex();
}


// Get the data with d3.
d3.json(geoData).then(function (response) {

  let data = response.features;

  // Define color scale using Chroma
  let colorScale = chroma.scale(['#ffffb2', '#b10026']).mode('lab').colors(10);

  // Create a legend
  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
      let div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          labels = [];

      for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + colorScale[i] + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(myMap);

  // Loop through the GeoJSON data and add circles with color
  for (let i = 0; i < data.length; i++) {
      let lon = data[i].geometry.coordinates[0];
      let lat = data[i].geometry.coordinates[1];
      let depth = data[i].geometry.coordinates[2];
      let magnitude = data[i].properties.mag;

      // Get color based on depth
      let color = colorScale[Math.floor((depth / 700) * 10)];

      let circle = L.circleMarker([lat, lon], {
          radius: markerSize(magnitude),
          fillColor: color,
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      }).bindPopup(`<h1>${data[i].properties.place}</h1> <hr> <h3>Time: ${data[i].properties.time.toLocaleString()}</h3>`).addTo(myMap);
  }
});