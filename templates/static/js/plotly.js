

// Here's where the Plot.ly Average Delay Bar Chart Begins

// Read-in data stored on Koynoff's github
Plotly.d3.csv('https://raw.githubusercontent.com/alexkoynoff/JSON-files/master/delayALLROUTES.csv', function (err, rows) {

          function unpack(rows, key) {
            return rows.map(function (row) { return row[key]; });
          }

          // Create vars for our Flight Delay Dat
          var allRoutes = unpack(rows, 'ROUTE'),
            days = unpack(rows, 'DAY'),
            delay = unpack(rows, 'DELAY'),
            listofRoutes = [],
            weekday = [],
            delayminutes = [];

          // Loop through dataset to get an array of all the possible flight paths to select from
          for (var i = 0; i < allRoutes.length; i++) {
            if (listofRoutes.indexOf(allRoutes[i]) === -1) {
              listofRoutes.push(allRoutes[i]);
            }
          }
        
          // For the selected route, push filtered arrarys delay data for use in plot 
          function getRouteData(chosenRoute) {
            weekday = [];
            delayminutes = [];
            for (var i = 0; i < allRoutes.length; i++) {
              if (allRoutes[i] === chosenRoute) {
                weekday.push(days[i]);
                delayminutes.push(delay[i]);
              }
            }
          };

          // Default Flight Data
          setBarPlot('ORD-ATL');

          // Plot.ly with chosenRoute
          function setBarPlot(chosenRoute) {
            getRouteData(chosenRoute);

            var trace1 = {
              x: weekday,
              y: delayminutes,
              type: 'bar',
              marker: {
                color: '#1b3146'
              }
            };

            var data = [trace1];

            var layout = {
              title: 'DELAY BY WEEKDAY FOR 2015',
              autosize: true,
              height: 600,

              xaxis: {
                title: "WEEKDAY"
              },
              yaxis: {
                title: "DELAY IN MINUTES FOR 2015"
              },


            };

            Plotly.newPlot('plotdiv', data, layout);
          };

          // creating vars for our RouteSelector function

          var innerContainer = document.querySelector('[data-num="0"'),
            plotEl = innerContainer.querySelector('.plot'),
            RouteSelector = innerContainer.querySelector('.routedata');

          function assignOptions(textArray, selector) {
            for (var i = 0; i < textArray.length; i++) {
              var currentOption = document.createElement('option');
              currentOption.text = textArray[i];
              selector.appendChild(currentOption);
            }
          }

          assignOptions(listofRoutes, RouteSelector);

          function updateRoute() {
            setBarPlot(RouteSelector.value);
          }

          RouteSelector.addEventListener('change', updateRoute, false);
        });


var betaRoutes = ["ORD-ATL", "ORD-JFK", "ORD-LAX"]

// function init() {
//     // Grab a reference to the dropdown select element
//     var selector = d3.select("#selDataset");
//     //console.log(selector);
//     // Use the list of sample names to populate the select options
//     d3.json("/names").then((betaRoutes) => {                                         // THIS NEEDS SOME WORK
//       //console.log(sampleNames[0]);
//       betaRoutes.forEach((route) => {
//         selector
//           .append("option")
//           .text(route)
//           .property("value", route);
        
//       });
      
//       // Use the first sample from the list to build the initial plots
//       const firstRoute = betaRoutes[0];
//       console.log(firstRoute);
//       buildCharts(firstRoute);
//       buildMetadata(firstRoute);
//     });
//   }

//   // Fetch flight route data when new selection is picked and build new charts
//   function optionChanged(newRoute) {
//     buildCharts(newRoute);
//     buildMetadata(newRoute);
//   }
  
//   // Initialize the dashboard
//   init();

        /************************JAVASCRIPT CODE END ************************/