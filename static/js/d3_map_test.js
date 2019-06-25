{
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "width": 900,
    "height": 560,
    "padding": {"top": 0, "left": 0, "right": 0, "bottom": 0},
    "signals": [
                {
                "name": "hover",
                "value": null,
                "on": [
                  {"events": "symbol:mouseover", "update": "datum"},
                  {"events": "symbol:mouseout", "update": "null"}
                ]
              },
              {
                "name": "title",
                "value": "U.S. Airports, 2008",
                "update": "hover ? hover.name + ' (' + hover.iata + ')' : 'U.S. Airports, 2008'"
              }
              ],
    "data": [
              {
                  "name": "states",
                  "url": "data/us-10m.json",
                  "format": {"type": "topojson", "feature": "states"},
                  "transform": [
                    {
                      "type": "geopath",
                      "projection": "projection"
                    }
                  ]
              },
              {
                "name": "traffic",
                "url": "data/flights-airport.csv",
                "format": {"type": "csv", "parse": "auto"},
                "transform": [
                  {
                    "type": "aggregate",
                    "groupby": ["origin"],
                    "fields": ["count"], "ops": ["sum"], "as": ["flights"]
                  }
                ]
              },
              {
    "name": "airports",
    "url": "data/airports.csv",
    "format": {"type": "csv", "parse": "auto"},
    "transform": [
      {
        "type": "lookup",
        "from": "traffic", "key": "origin",
        "fields": ["iata"], "as": ["traffic"]
      },
      {
        "type": "filter",
        "expr": "datum.traffic != null"
      },
      {
        "type": "geopoint",
        "projection": "projection",
        "fields": ["longitude", "latitude"]
      },
      {
        "type": "filter",
        "expr": "datum.x != null && datum.y != null"
      },
      {
        "type": "collect", "sort": {
          "field": "traffic.flights",
          "order": "descending"
        }
      }
    ]
  }, 
  {
    "name": "routes",
    "url": "data/flights-airport.csv",
    "format": {"type": "csv", "parse": "auto"},
    "transform": [
      
      {
        "type": "lookup",
        "from": "airports", "key": "iata",
        "fields": ["origin", "destination"], "as": ["source", "target"]
      },
      {
        "type": "filter",
        "expr": "datum.source && datum.target"
      },
      {
        "type": "linkpath",
        "shape": "line"
      }
    ]
  }],
    "scales": [
              {
              "name": "size",
              "type": "linear",
              "domain": {"data": "traffic", "field": "flights"},
              "range": [16, 1000]
            }
            ],
    "projections": [{
                  "name": "projection",
                  "type": "albersUsa",
                  "scale": 1200,
                  "translate": [{"signal": "width / 2"}, {"signal": "height / 2"}]
                  }],
    "marks": [  
    {
    "type": "path",
                "from": {"data": "states"},
                "encode": {
                  "enter": {
                    "fill": {"value": "#dedede"},
                    "stroke": {"value": "white"}
                  },
                  "update": {
                    "path": {"field": "path"}
                  }
                }
              },
              {
      "type": "symbol",
              "from": {"data": "airports"},
              "encode": {
                "enter": {
                  "size": {"value": 16},
                  "fill": {"value": "steelblue"},
                  "fillOpacity": {"value": 0.8},
                  "stroke": {"value": "white"},
                  "strokeWidth": {"value": 1.5}
                },
      "update": {
                "x": {"field": "x"},
                "y": {"field": "y"}
              }
    }},
    {
      "type": "text",
      "interactive": false,
      "encode": {
        "enter": {
          "x": {"signal": "width", "offset": -5},
          "y": {"value": 0},
          "fill": {"value": "black"},
          "fontSize": {"value": 20},
          "align": {"value": "right"}
        },
        "update": {
          "text": {"signal": "title"}
        }
      }
    }, 
    {
    "type": "path",
    "interactive": false,
    "from": {"data": "routes"},
    "encode": {
      "enter": {
        "path": {"field": "path"},
        "stroke": {"value": "black"},
        "strokeOpacity": {"value": 0.15}
      }
    }
  }
  ]
  }
  



// var w = 1280,
// h = 800;

// var projection = d3.geo.azimuthal()
// .mode("equidistant")
// .origin([-98, 38])
// .scale(1400)
// .translate([640, 360]);

// var path = d3.geo.path()
// .projection(projection);

// var svg = d3.select("body").insert("svg:svg", "h2")
// .attr("width", w)
// .attr("height", h);

// var states = svg.append("svg:g")
// .attr("id", "states");

// var circles = svg.append("svg:g")
// .attr("id", "circles");

// var cells = svg.append("svg:g")
// .attr("id", "cells");

// d3.select("input[type=checkbox]").on("change", function() {
// cells.classed("voronoi", this.checked);
// });

// d3.json("us-states.json", function(collection) {
// states.selectAll("path")
//   .data(collection.features)
// .enter().append("svg:path")
//   .attr("d", path);
// });

// d3.csv("flights-airport.csv", function(flights) {
// var linksByOrigin = {},
//   countByAirport = {},
//   locationByAirport = {},
//   positions = [];

// var arc = d3.geo.greatArc()
//   .source(function(d) { return locationByAirport[d.source]; })
//   .target(function(d) { return locationByAirport[d.target]; });

// flights.forEach(function(flight) {
// var origin = flight.origin,
//     destination = flight.destination,
//     links = linksByOrigin[origin] || (linksByOrigin[origin] = []);
// links.push({source: origin, target: destination});
// countByAirport[origin] = (countByAirport[origin] || 0) + 1;
// countByAirport[destination] = (countByAirport[destination] || 0) + 1;
// });

// d3.csv("airports.csv", function(airports) {

// // Only consider airports with at least one flight.
// airports = airports.filter(function(airport) {
//   if (countByAirport[airport.iata]) {
//     var location = [+airport.longitude, +airport.latitude];
//     locationByAirport[airport.iata] = location;
//     positions.push(projection(location));
//     return true;
//   }
// });

// // Compute the Voronoi diagram of airports' projected positions.
// var polygons = d3.geom.voronoi(positions);

// var g = cells.selectAll("g")
//     .data(airports)
//   .enter().append("svg:g");

// g.append("svg:path")
//     .attr("class", "cell")
//     .attr("d", function(d, i) { return "M" + polygons[i].join("L") + "Z"; })
//     .on("mouseover", function(d, i) { d3.select("h2 span").text(d.name); });

// g.selectAll("path.arc")
//     .data(function(d) { return linksByOrigin[d.iata] || []; })
//   .enter().append("svg:path")
//     .attr("class", "arc")
//     .attr("d", function(d) { return path(arc(d)); });

// circles.selectAll("circle")
//     .data(airports)
//   .enter().append("svg:circle")
//     .attr("cx", function(d, i) { return positions[i][0]; })
//     .attr("cy", function(d, i) { return positions[i][1]; })
//     .attr("r", function(d, i) { return Math.sqrt(countByAirport[d.iata]); })
//     .sort(function(a, b) { return countByAirport[b.iata] - countByAirport[a.iata]; });
// });
// });

// <div style="position:absolute;bottom:0;font-size:18px;">
//       <input type="checkbox" id="voronoi"> <label for="voronoi">show Voronoi</label>
// </div>


// <script type="text/javascript" src="d3/d3.js"></script>
// <script type="text/javascript" src="d3/d3.csv.js"></script>
// <script type="text/javascript" src="d3/d3.geo.js"></script>
// <script type="text/javascript" src="d3/d3.geom.js"></script>
// <script type="text/javascript">

// var w = 1280,
//     h = 800;

// var projection = d3.geo.azimuthal()
//     .mode("equidistant")
//     .origin([-98, 38])
//     .scale(1400)
//     .translate([640, 360]);

// var path = d3.geo.path()
//     .projection(projection);

// var svg = d3.select("body").insert("svg:svg", "h2")
//     .attr("width", w)
//     .attr("height", h);

// var states = svg.append("svg:g")
//     .attr("id", "states");

// var circles = svg.append("svg:g")
//     .attr("id", "circles");

// var cells = svg.append("svg:g")
//     .attr("id", "cells");

// d3.select("input[type=checkbox]").on("change", function() {
//   cells.classed("voronoi", this.checked);
// });

// d3.json("us-states.json", function(collection) {
//   states.selectAll("path")
//       .data(collection.features)
//     .enter().append("svg:path")
//       .attr("d", path);
// });

// d3.csv("flights-airport.csv", function(flights) {
//   var linksByOrigin = {},
//       countByAirport = {},
//       locationByAirport = {},
//       positions = [];

//   var arc = d3.geo.greatArc()
//       .source(function(d) { return locationByAirport[d.source]; })
//       .target(function(d) { return locationByAirport[d.target]; });

//   flights.forEach(function(flight) {
//     var origin = flight.origin,
//         destination = flight.destination,
//         links = linksByOrigin[origin] || (linksByOrigin[origin] = []);
//     links.push({source: origin, target: destination});
//     countByAirport[origin] = (countByAirport[origin] || 0) + 1;
//     countByAirport[destination] = (countByAirport[destination] || 0) + 1;
//   });

//   d3.csv("airports.csv", function(airports) {

//     // Only consider airports with at least one flight.
//     airports = airports.filter(function(airport) {
//       if (countByAirport[airport.iata]) {
//         var location = [+airport.longitude, +airport.latitude];
//         locationByAirport[airport.iata] = location;
//         positions.push(projection(location));
//         return true;
//       }
//     });

//     // Compute the Voronoi diagram of airports' projected positions.
//     var polygons = d3.geom.voronoi(positions);

//     var g = cells.selectAll("g")
//         .data(airports)
//       .enter().append("svg:g");

//     g.append("svg:path")
//         .attr("class", "cell")
//         .attr("d", function(d, i) { return "M" + polygons[i].join("L") + "Z"; })
//         .on("mouseover", function(d, i) { d3.select("h2 span").text(d.name); });

//     g.selectAll("path.arc")
//         .data(function(d) { return linksByOrigin[d.iata] || []; })
//       .enter().append("svg:path")
//         .attr("class", "arc")
//         .attr("d", function(d) { return path(arc(d)); });

//     circles.selectAll("circle")
//         .data(airports)
//       .enter().append("svg:circle")
//         .attr("cx", function(d, i) { return positions[i][0]; })
//         .attr("cy", function(d, i) { return positions[i][1]; })
//         .attr("r", function(d, i) { return Math.sqrt(countByAirport[d.iata]); })
//         .sort(function(a, b) { return countByAirport[b.iata] - countByAirport[a.iata]; });
//   });
// });

//     </script>

// <div id="coverTemperature" style="background-color: rgb(255, 255, 255); opacity: 0; display: block;"></div>
  