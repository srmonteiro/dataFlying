// I really don't know how this works, but cool


// Setting up the initial Binding for our SVG Pane

var w = 1280,
    h = 800;

// Mapping on an azimuthal scale so the map projects "more accurately"

var projection = d3.geo.azimuthal()
  .mode("equidistant")
  .origin([-98, 38])
  .scale(1400)
  .translate([640, 360]);

var path = d3.geo.path()
  .projection(projection);

// Setting Viz attributes, graph size, elements, etc

var svg = d3.select("body").insert("svg:svg", "h2")
  .attr("width", w)
  .attr("height", h);

var states = svg.append("svg:g")
  .attr("id", "states");

var circles = svg.append("svg:g")
  .attr("id", "circles");

var cells = svg.append("svg:g")
  .attr("id", "cells");

// A possible extension if other aspects work. On click, you would see an overlay that maps closest airport

d3.select("input[type=checkbox]").on("change", function () {
  cells.classed("voronoi", this.checked);
});

// A TopoJSON file that contains the shape elements for the US States

d3.json("us-10m.json", function (collection) {

  states.selectAll("path")
    .data(collection.features)
    .enter().append("svg:path")
    .attr("d", path);
});

// Reading in a CSV file containing aggregate flight info from 2015 so that we can
// Scale the circles representing the volume of each flight path, and place the circles in the right place

d3.csv("flights-airport-vega.csv", function (error, flights) {

  if (error) return console.warn(error);
  console.log(flights);

  var linksByOrigin = {},
    countByAirport = {},
    locationByAirport = {},
    positions = [];

  var arc = d3.geo.greatArc()
    .source(function (d) { return locationByAirport[d.source]; })
    .target(function (d) { return locationByAirport[d.target]; });

  // `flights` is an array of indexes for each flight path, e.g. the 5366 of 
  // "5366 : {origin: "YUM", destination: "SLC", count: "440", "": ""}"

  flights.forEach(function (flight) {                                         // Open of flights.forEach

    var origin = flight.origin
    var destination = flight.destination
    var links = linksByOrigin[origin] || (linksByOrigin[origin] = []);

    links.push({ source: origin, target: destination });

    // getting counts of each airport for scaling later

    countByAirport[origin] = (countByAirport[origin] || 0) + 1;
    countByAirport[destination] = (countByAirport[destination] || 0) + 1;

  });                                                                         // Close of flights.forEach


// Reading in a CSV file containing information about each US airport with location data

  d3.csv("airports_vega.csv", function (airports) {

    // Exclude airports with zero flights
    airports = airports.filter(function (airport) {

      if (countByAirport[airport.iata]) {

        // Exclude airports with zero flights
        var location = [+airport.longitude, +airport.latitude];

        locationByAirport[airport.iata] = location;
        positions.push(projection(location));
        console.log(positions);
        return true;

      }

    });                                                                      // Close of airports.csv 
  });
});

// d3.csv("flights-airport-vega.csv", function (error, flights) {

                            //   if (error) return console.warn(error + `\n ` + flights);
                            //   // console.log(flights);

                            //   var linksByOrigin = {},
                            //     countByAirport = {},
                            //     locationByAirport = {},
                            //     positions = [];

                            //   var arc = d3.geo.greatArc()
                            //     .source(function (d) { return locationByAirport[d.source]; })
                            //     .target(function (d) { return locationByAirport[d.target]; });

                            //   flights.nodes().forEach(function (error, flight) {

                            //   var origin = flight.origin,
                            //       destination = flight.destination,
                            //       links = linksByOrigin[origin] || (linksByOrigin[origin] = []);

                            //   links.push({ source: origin, target: destination });
                            //   countByAirport[origin] = (countByAirport[origin] || 0) + 1;
                            //   countByAirport[destination] = (countByAirport[destination] || 0) + 1;

                            //     console.log(links);
                            //     console.log(countByAirport[origin]);
                            //     console.log(countByAirport[destination]);
                            //   });

                            //   d3.csv("airports_vega.csv", function (airports) {

                            //   // Only consider airports with at least one flight.
                            //   airports = airports.filter(function (airport) {
                            //     if (countByAirport[airport.iata]) {
                            //       var location = [+airport.longitude, +airport.latitude];
                            //       locationByAirport[airport.iata] = location;
                            //       positions.push(projection(location));
                            //       return true;
                            //     }
                            //   });

//     // Compute the Voronoi diagram of airports' projected positions.
//     var polygons = d3.geom.voronoi(positions);

//     var g = cells.selectAll("g")
//       .data(airports)
//       .enter().append("svg:g");

//     g.append("svg:path")
//       .attr("class", "cell")
//       .attr("d", function (d, i) { return "M" + polygons[i].join("L") + "Z"; })
//       .on("mouseover", function (d, i) { d3.select("h2 span").text(d.name); });

//     g.selectAll("path.arc")
//       .data(function (d) { return linksByOrigin[d.iata] || []; })
//       .enter()
//       .append("svg:path")
//       .attr("class", "arc")
//       .attr("d", function (d) { return path(arc(d)); });

//     circles.selectAll("circle")
//       .data(airports)
//       .enter()
//       .append("svg:circle")
//       .attr("cx", function (d, i) { return positions[i][0]; })
//       .attr("cy", function (d, i) { return positions[i][1]; })
//       .attr("r", function (d, i) { return Math.sqrt(countByAirport[d.iata]); })
//       .sort(function (a, b) { return countByAirport[b.iata] - countByAirport[a.iata]; });
//   });
// });
