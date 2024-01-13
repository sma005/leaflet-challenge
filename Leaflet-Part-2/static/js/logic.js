//Worked with ccampbelljr from AskBCS for chroma
// Creating the map object
let myMap = L.map("map", {
  center: [0,-40],
  zoom: 3
});

let baseMaps = new L.layerGroup(); 

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(baseMaps);

L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
  //maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
}).addTo(baseMaps);;

// Load the GeoJSON data.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
        //maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
}).addTo(baseMaps);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

L.control.layers(baseMaps).addTo(myMap);

// Define a color scale using chroma
// Get the data with d3.
d3.json(geoData).then(function (response) {

  let data = response.features;

  // Loop through the GeoJSON data and add circles with color
  for (let i = 0; i < data.length; i++) {
    //let lon = data[i].geometry.coordinates[0];
    //let lat = data[i].geometry.coordinates[1];
    //let depth = data[i].geometry.coordinates[2];

    let [lon, lat, depth] = data[i].geometry.coordinates;

    let magnitude = data[i].properties.mag;

    // Get color based on depth
    // let color = colorScale[Math.floor((depth / 700) * 10)];

    let circle = L.circleMarker([lat, lon], {
      radius: magnitude*4,
      color: '#000',
      fillColor:
        depth > 90 ? 'red' :
          depth > 70 ? 'darkorange' :
            depth > 50 ? 'orange' :
              depth > 30 ? 'yellow' :
                depth > 10 ? 'lime' : 'green',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).bindPopup(`<h3>${data[i].properties.place}<hr>Magnitude: ${magnitude}<br>${new Date(data[i].properties.time).toLocaleString()}</h3>`).addTo(myMap);
  }
});


// Create a legend
let legend = L.control({ position: 'bottomright' });

legend.onAdd = () => {
  let div = L.DomUtil.create('div', 'legend');

  div.innerHTML = `
    <div style='padding:3px;background:green;color:white;'>-10 - 10</div>
    <div style='padding:3px;background:lime;'>10 - 30</div>
    <div style='padding:3px;background:yellow;'>30 - 50</div>
    <div style='padding:3px;background:orange;'>50 - 70</div>
    <div style='padding:3px;background:darkorange;'>70 - 90</div>
    <div style='padding:3px;background:red;color:white;'>90 +</div>

  `;

  return div
}

legend.addTo(myMap);