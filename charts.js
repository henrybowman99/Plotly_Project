function init() {
  // refer to the dropdown select element
  var selector = d3.select("#selDataset");

  // populate select options with list of sample names
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // default the plots to the first sample in the list (940)
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// create buildCharts function.
function buildCharts(sample) {
  //  use d3.json to load and retrieve samples.json file 
  d3.json("samples.json").then((data) => {
    // create a variable that holds the samples array. 
    var samples = data.samples;

    // create variable that filters the samples for the object with the desired sample number.
    var selectedSample = samples.filter(sampleObj => sampleObj.id == sample);
    
    // create a variable that holds the first sample in the array.
    var firstSample = selectedSample[0];
    
    // create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

    // create the yticks for the bar chart using slice, reverse, and map
  
  
    var yticks = otuIDs.slice(0, 10).reverse().map(sample => "OTU " + sample.toString())
    
    // create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      text: otuLabels.slice(0, 10).reverse()
    }
    ];
    // create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }};

  

      
  

     
    
    // plot the bar data and layout using plotly 
    Plotly.newPlot("bar", barData, barLayout);
    
    //create the trace for bubble chart
    var bubbleData = [{
      x:otuIDs,
      y:sampleValues,
      mode:"markers",
      marker: {
        size:sampleValues,
        color:otuIDs,
        colorscale: 'YlGnBu'
        
        
      },
      text:otuLabels

      
    }
   
    ];
    //create the layout for the bubble chart
    var bubbleLayout = {
      title:"Bacteria Cultures Per Sample",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      },
      xaxis:{
        title: "OTU ID"
      },
      hovermode:"closest"
      
      };
//plot bubble chart
Plotly.newPlot("bubble", bubbleData, bubbleLayout);

//gauge chart  construction

    //  create variable that filters the metadata array for the object with the desired sample number
    var metadata = data.metadata;
    var selectedMetadata = metadata.filter(sampleObj => sampleObj.id == sample);
    // create a variable that holds the first sample in the array
    var firstMetadata = selectedMetadata[0];
  

  
    


    //  create  variable that holds the washing frequency
    
    var washingFrequencyDecimal = firstMetadata.wfreq;
    var washingFrequency = parseInt(washingFrequencyDecimal);
   
    
   
    
    // create the trace for the gauge chart.
    var gaugeData = [{
      value: washingFrequency,
      type: "indicator",
      mode:"gauge+number",
      title: { text: "Belly Button Scrubs Per Week" },
      gauge: {
        axis: { range: [null, 10] },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }

        ],
      bar: {color: "black"},

    } 
    }];
    
    // create the layout for the gauge chart.
    var gaugeLayout = {
     width: 500, height: 500, margin: { t: 0, b: 0 } 
    };

    
    //plt the gauge chart
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);




    

    


  });
 
}




    

   
