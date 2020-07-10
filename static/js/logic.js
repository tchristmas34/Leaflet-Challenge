var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// magnitude size
function markerSize(magnitude) {
    return magnitude * 7;
}


// marker opacity for earthquake magnitude
function markerOpacity(magnitude) {
  if (magnitude > 6) {
    return .99
  } else if (magnitude > 5) {
    return .80
  } else if (magnitude > 4) {
    return .70
  } else if (magnitude > 3) {
    return .60
  } else if (magnitude > 2) {
    return .50
  } else if (magnitude > 1) {
    return .40
  } else {
    return .30
  }
}

// color of the markers 
function markerColor(magnitude) {
  if (magnitude > 6) {
    return 'Red'
  } else if (magnitude > 5) {
    return 'orange'
  } else if (magnitude > 4) {
    return 'orange'
  } else if (magnitude > 3) {
    return 'yellow'
  } else if (magnitude > 2) {
    return 'yellow'
  } else if (magnitude > 1) {
    return 'blue'
  } else {
    return 'green'
  }
}

d3.json(queryUrl, function(data) {
  var earthquakes = L.geoJSON(data.features, {
    onEachFeature : addPopup,
    pointToLayer: addMarker
  });
  createMap(earthquakes);
});

function addMarker(feature, location) {
  var options = {
    stroke: false,
    fillOpacity: markerOpacity(feature.properties.mag),
    color: markerColor(feature.properties.mag),
    fillColor: markerColor(feature.properties.mag),
    radius: markerSize(feature.properties.mag)
  }
  return L.circleMarker(location, options);
}

    // Legent info
function addPopup(feature, layer) {

    return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <h4>Magnitude: ${feature.properties.mag} </h4> <p> ${Date(feature.properties.time)} </p>`);
}

// Create Map Markers
function createMap(earthquakes) {

    var streetmap = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 15,
      id: "mapbox.streets",
    });
  

    var baseMaps = {
      "Street Map": streetmap
    };

    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Display markers for earthquake data
    var myMap = L.map("map", {
      center: [42.00, -115.00],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // placing the legend onto the map 
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend')
        div.innerHTML = "<h3>Magnitude</h3><table><tr><th>6=<</th><td>Crimson Red</td></tr><tr><th>>=4</th><td>Orange</td></tr><tr><th>>=2</th><td>Yellow</td></tr><tr><th>>=1</th><td>Dark Blue</td></tr><th>>=0</th><td>Dark Green</td></tr></table>";
        return div;
    };
    
    //add the legend to the map 
    legend.addTo(myMap);
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  }