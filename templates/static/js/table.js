// pull in tableData from data.js

var ORDtoATL = ORDtoATL;

var ORDtoJFK = ORDtoJFK;
// console.log(ORDtoJFK);

var ORDtoLAX = ORDtoLAX;
// console.log(ORDtoLAX);


// Select the table body
var tbody = d3.select("tbody");

// elements we will have in the table ... 
// timings.departure_airport, timings.arrival_airport, timings.departure_time, timings.arrival_time, price, airline, stops

// Query tableData for each sighting
ORDtoATL.forEach(flight => {

    var stops = flight.stops;
    var price = flight.price;
    var departure = flight.departure;
    var arrival = flight.arrival;
    var airline = flight.airline;
    var departure_time = flight.timings[0].departure_time;
    var arrival_time = flight.timings[0].arrival_time;
    var flightDate = flight.date

    
    var flightKey = [{
        0: flightDate,
        1: departure,
        2: arrival,
        3: departure_time,
        4: arrival_time,
        5: price,
        6: airline,
        7: stops
    }];

    // console.log(flightKey);

    var row = tbody.append("tr");

            flightKey.forEach(selectedFlights => {
                Object.entries(selectedFlights).forEach(function ([key, value]) {
                    var cell = row.append("td");
                    // console.log(value);
                    cell.text(value);
                });
            });
});

var filter_btn = d3.select("#filter-btn");

// On click, generate new table with filter query
filter_btn.on("click", function () {

    // Don't reload the page unless button is clicked 
    d3.event.preventDefault();
    d3.selectAll("tbody td").remove();
    d3.selectAll("tbody tr").remove();

    // Select query terms from the form
    var flightPath = d3.select("#flightPath");
    console.log(flightPath);
    var selectedRoute = flightPath.property("value");

    var queryTerms = [selectedRoute];
    var finalFlight = queryTerms.toString()
    console.log(finalFlight);

    // Remove default dataTable with on last query results


    if (finalFlight == '' || finalFlight == 'ORD-ATL') {
        var queryResults = ORDtoATL;
    }
    else if (finalFlight == 'ORD-JFK') {
        var queryResults = ORDtoJFK;
    }
    else (finalFlight == 'ORD-LAX')
         {
        var queryResults = ORDtoLAX;
    }


    queryResults.forEach(flight => {
        var stops = flight.stops;
    var price = flight.price;
    var departure = flight.departure;
    var arrival = flight.arrival;
    var airline = flight.airline;
    var departure_time = flight.timings[0].departure_time;
    var arrival_time = flight.timings[0].arrival_time;
    var flightDate = flight.date

    
    var flightKey = [{
        0: flightDate,
        1: departure,
        2: arrival,
        3: departure_time,
        4: arrival_time,
        5: price,
        6: airline,
        7: stops
    }];

    var row = tbody.append("tr");

            flightKey.forEach(selectedFlights => {
                Object.entries(selectedFlights).forEach(function ([key, value]) {
                    var cell = row.append("td");
                    // console.log(value);
                    cell.text(value);
                });
            });
    });

    // Clear the query terms
    document.getElementById("flightPath").value = '';

});