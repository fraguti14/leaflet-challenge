// Fetching data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

fetch(url)
  .then(response => response.json())
  .then(data => {
  })
  .catch(error => console.error('Error fetching data:', error));

// Init map
var map = L.map('map').setView([39.8283, -98.5795], 4); // US centered view
// var map = L.map('map').setView([0, 0], 2); // Full view

// Add OpenStreetMap tiles / attributions
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to figure out the marker size based on magnitude
function getMarkerSize(magnitude) {
  return magnitude * 20000; // Setting factor
}

// Function to figure out the marker color based on depth
function getMarkerColor(depth) {
    if (depth < -10) return '#ADD8E6'; // below -10
    else if (depth < 10) return '#00ff00'; // 10 to 30
    else if (depth < 30) return '#ffff00'; // 10 to 30 
    else if (depth < 50) return '#ffae42'; // 30 to 50 
    else if (depth < 70) return '#ff8c00'; // 50 to 70 
    else if (depth < 90) return '#ff4500'; // 70 to 90 
    return '#ff0000'; // 90+ 
  }

// Adding earthquake data to map
fetch(url)
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circle(latlng, {
          radius: getMarkerSize(feature.properties.mag),
          fillColor: getMarkerColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(`Location: ${feature.properties.place}<br>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km`);
      }
    }).addTo(map);
  })
  .catch(error => console.error('Error adding data to map:', error));

  // Adding legend - adjusting for color boxes
  var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [],
        from, to;

    for (var i = 0; i < depths.length; i++) {
        from = depths[i];
        to = depths[i + 1];

        labels.push(
            '<i style="background:' + getMarkerColor(from + (from < 0 ? 0 : 1)) + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7;"></i> ' +
            (from < 0 ? '< ' : '') + from + (to ? '&ndash;' + to : '+')
        );
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);

