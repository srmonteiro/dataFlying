//__METADATA_PANEL_________________________________________//   @TODO: Complete the following function that 

function buildMetadata(sample) { //________________________//   builds the metadata panel >>>>>> 
//_________________________________________________________//   circa ln 31 in index.html 
  var metaUrl = "/metadata/" + sample; //__________________//   

    d3.json(metaUrl).then((sample) => { //_________________//   Use `d3.json` to fetch the metadata for a sample
      var sampleMeta = sample; //__________________________// 
      console.log(sampleMeta); //__________________________// 

      var sampleMetaData = d3.select("#sample-metadata.panel-body");  //   Use d3 to select the panel with id of `#sample-metadata`

      sampleMetaData.html(""); //__________________________//   Use `.html("") to clear any existing metadata

      for (let [key, value] of Object.entries(sample)) { //  Use `Object.entries` to add each key and value pair to the panel
        console.log(`${key}: ${value}`); //________________//       
        sampleMetaData.append("div")  //___________________//   Hint: Inside the loop, 
        .text(`${key}: ${value}`)  //______________________//   you will need to use d3 to append new
        .property("key", key)      //______________________//   ags for each key-value in the metadata. 
        .property("value", value); //______________________// 
      }
    });

//____________________NOT__________________________________//   BONUS: Build the Gauge Chart
//___________________TODAY_________________________________//   buildGauge(data.WFREQ);

}

function buildCharts(sample) { //__________________________//   On to the Plots!
//_________________________________________________________//   

  var sample_url = "/samples/" + sample; //________________//   @TODO: Use `d3.json` to 
    d3.json(sample_url).then((sample) => {  //_____________//   fetch the sample data for the plots
      var sampleData = sample; //__________________________// 
      console.log(sampleData);
    
//__BUBBLE_CHART___________________________________________//   @TODO: Build a Bubble Chart using the sample data

    var selector = d3.select("#bubble"); //________________//   Use d3 to select the div-colume with `#bubble` for the plot
    selector.html("");  //_________________________________//   Use `.html("") to clear any existing chart
    //    var max = d3.max(arr);
    //    var scale = d3.scale.linear().domain([0, max]).range([0, 100]);

    var layout = {
      title: `Sample Bubble Chart`,
      showlegend: true,
      height: 600,
      width: 980,
    };

    var bubble_trace = {
      x: sampleData.otu_ids,  //___________________________//   sample_data. Use otu_ids for the x values
      y: sampleData.sample_values,  //_____________________//   Use sample_values for the y values
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,  //________________//   Use sample_values for the marker size
        color: sampleData.otu_ids,  //_____________________//   Use otu_ids for the marker colors
        text: sampleData.otu_labels,  //___________________//   Use otu_labels for the text values
        symbol: "circle"
      }
    };
    
    var sample_bubble = [bubble_trace];

    Plotly.newPlot("bubble", sample_bubble, layout);

//__PIE_CHART______________________________________________//   @TODO: Build a Pie Chart

    var selector = d3.select("#pie");   //_________________//   Use d3 to select the div-colume with `#pie` for the plot
    selector.html("");  //_________________________________//   Use `.html("") to clear any existing chart

    var sampleValues = Object.values(sampleData);

//____LABELS_AND_VALUES____________________________________//   HINT: You will need to use slice() to grab the top 10 sample_values,
    var topToBottom = sampleValues.sort(function(a,b) { //___//   otu_ids, and labels (10 each).  THANK YOU, BRICKEY!!!
      return b.sample_values - a.sample_values;
      
    });
    console.log(topToBottom);

    var samplePieTenSlices = topToBottom[0].slice(-10);    
    console.log(`Top Ten Slices: ` + samplePieTenSlices);

    var labelsPieTenSlices = topToBottom[1].slice(-10);
    var IDsPieTenSlices = topToBottom[2].slice(-10);
    // var pieChartColors = normalized_otu_ids.slice(-10);       //__________________________________ //     *************************   
    console.log(`Pie Chart`+ '\n' +
                `Values: ` + samplePieTenSlices + '\n' +
                `Labels: ` + labelsPieTenSlices + '\n' +
                `IDs: ` + IDsPieTenSlices + '\n' +
                `Colors: `);  // pieChartColors

    var layout = {
      title: "Pie Chart of Top 10 Samples",
      showlegend: true,
      height: 600,
      width: 980,
    };

    var pie_trace = {
      values: samplePieTenSlices,
      labels: samplePieTenSlices,
      text: IDsPieTenSlices,
      hoverinfo: "labels",
      colors: "Earth",   //__________________________________ //     *************************   colors: pieChartColors,
      type: "pie"
    };

    var sample_pie = [pie_trace];

    Plotly.newPlot(pie, sample_pie, layout);

  });
}
    function init() {
      // Grab a reference to the dropdown select element
      var selector = d3.select("#selDataset");
      //console.log(selector)
      // Use the list of sample names to populate the select options
      d3.json("/names").then((sampleNames) => {
        //console.log(sampleNames[0]);
        sampleNames.forEach((sample) => {
          selector
            .append("option")
            .text(sample)
            .property("value", sample);
          
        });
        
        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        console.log(firstSample);
        buildCharts(firstSample);
        buildMetadata(firstSample);
      });
    }
    
    function optionChanged(newSample) {
      // Fetch new data each time a new sample is selected
      buildCharts(newSample);
      buildMetadata(newSample);
    }
    
    // Initialize the dashboard
    init();