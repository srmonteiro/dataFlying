//allroutes.csv

Plotly.d3.csv('https://raw.githubusercontent.com/alexkoynoff/AlexNUCHIDATABOOTCAMP/master/allroutes.csv', function (err, rows) {

          function unpack(rows, key) {
            return rows.map(function (row) { return row[key]; });
          }

          var allRoutes = unpack(rows, 'ROUTE'),
            days = unpack(rows, 'DAY'),
            delay = unpack(rows, 'DELAY'),
            listofRoutes = [],
            weekday = [],
            delayminutes = [];

          for (var i = 0; i < allRoutes.length; i++) {
            if (listofRoutes.indexOf(allRoutes[i]) === -1) {
              listofRoutes.push(allRoutes[i]);
            }
          }

          function getRouteData(chosenRoute) {
            weekday = [];
            delayminutes = [];
            for (var i = 0; i < allRoutes.length; i++) {
              if (allRoutes[i] === chosenRoute) {
                weekday.push(days[i]);
                delayminutes.push(delay[i]/60);
              }
            }
          };

          // Default Flight Data
          setBubblePlot('ORD-ATL');

          function setBubblePlot(chosenRoute) {
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
            setBubblePlot(RouteSelector.value);
          }

          RouteSelector.addEventListener('change', updateRoute, false);
        });

        /************************JAVASCRIPT CODE END ************************/