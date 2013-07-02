var app = app || {};

app.getStep = function(d) {
  if(d === 0) {
    return 'step0';
  } else if(d < 1) {
    return 'step1';
  } else if (d >= 1 && d < 3) {
    return 'step2';
  } else if (d >= 3 && d < 5) {
    return 'step3';
  } else if (d >= 5 && d < 7) {
    return 'step4';
  } else if (d >= 7) {
    return 'step5';
  }
};

app.months = [
  'Jan.',
  'Feb.',
  'Mar.',
  'Apr.',
  'May',
  'Jun.',
  'Jul.',
  'Aug.',
  'Sep.',
  'Oct.',
  'Nov.',
  'Dec.'
];

app.hours = [
  '12am',
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  '10',
  '11',
  '12pm',
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  '10',
  '11',
  '12'
];

app.run = function() {
  // Dimensions
  var width = 800,
      height = 450,
      cellSize = 30; // cell size

  // Add SVG
  var svg = d3.select("#chart")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g");

  // Get the data
  d3.json('/data/rain.json', function(data) {
    // Add cells for every hour of every month
    var months = svg.selectAll(".month")
          .data(data)
        .enter().append("g")
          .attr('class', 'month')
          .selectAll('.hours')
          .data(function(d, i) { return d;})
        .enter().append("g").append("rect")
          .attr("class", function(d) { return 'hour ' + app.getStep(d); })
          .attr("width", cellSize)
          .attr("height", cellSize)
          .attr("x", function(d, i) { return cellSize * i + 30; })
          .attr("y", function(d, i, j) { return j * cellSize + 20; })
          .on('mouseover', function(d){
            console.log(d);
          });

    // Add labels
    var monthLabels = svg.selectAll(".month")
      .append("text")
      .text(function(d, i) { return app.months[i]; })
      .attr("class", "label month")
      .attr("x", 0)
      .attr("y", function(d, i, j) { return i * cellSize + 40; });

    var hourLabels = svg.select(".month").selectAll('g')
      .append("text")
      .text(function(d, i) { return app.hours[i]; })
      .attr("class", "label hours")
      .attr("x", function(d, i, j) {
        var labelVal = app.hours[i];
        if(typeof labelVal === 'number') {
          return i * cellSize + 27;
        } else {
          return i * cellSize + 22;
        }
      })
      .attr("y", 10);

    // Add annotation
    svg.append("g")
        .attr("class", "annotation")
      .append("rect")
        .attr("x", 495)
        .attr("y", 155)
        .attr("width", function() { return cellSize * 5; })
        .attr("height", function() { return cellSize * 5; });

    d3.select(".annotation")
      .append("line")
        .attr("x1", 525)
        .attr("y1", 305)
        .attr("x2", 525)
        .attr("y2", 390);

    d3.select(".annotation")
      .append("text")
      .attr("x", 495)
      .attr("y", 402)
      .text("The hours with the most intense rain are during the");

    d3.select(".annotation")
      .append("text")
      .attr("x", 495)
      .attr("y", 417)
      .text("summer in the late afternoon into the early evening.");

    // Add Source
    svg.append("g")
        .attr("class", "source")
      .append("text")
        .attr("x", 30)
        .attr("y", 405)
        .text("Source: Philadelphia Water Department, City of Philadelphia");

  });
};