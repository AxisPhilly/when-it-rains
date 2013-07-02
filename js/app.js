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
  '12 - 1',
  '1 - 2',
  '2 - 3',
  '3 - 4',
  '4 - 5',
  '5 - 6',
  '6 - 7',
  '7 - 8',
  '8 - 9',
  '9 - 10',
  '10 - 11',
  '11 - 12',
  '12 - 1',
  '1 - 2',
  '2 - 3',
  '3 - 4',
  '4 - 5',
  '5 - 6',
  '6 - 7',
  '7 - 8',
  '8 - 9',
  '9 - 10',
  '10 - 11',
  '11 - 12'
];

app.run = function() {
  // Dimensions
  var width = 800,
      height = 400,
      cellSize = 30; // cell size

  // Add SVG
  var svg = d3.select("#chart")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g");

  // Add axes
  svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });

  // Add cells for every hour
  d3.json('/data/rain.json', function(data) {
    for(var month=0; month<data.length; month++) {
      var rect = svg.selectAll(".month")
          .data(data[month])
        .enter().append("rect")
          .attr("class", function(d) { return 'hour ' + app.getStep(d); })
          .attr("width", cellSize)
          .attr("height", cellSize)
          .attr("x", function(d, i) { return cellSize * i; })
          .attr("y", function(d) { return month * cellSize; })
          .on('mouseover', function(d){
            console.log(d);
          });
    }
  });
};