var app = app || {};

app.getStep = function(d) {
  if(d === 0) {
    return 'step0';
  } else if(d < 1) {
    return 'step1';
  } else if (d >= 1 && d < 2) {
    return 'step2';
  } else if (d >= 2 && d < 3) {
    return 'step3';
  } else if (d >= 3 && d < 4) {
    return 'step4';
  } else if (d >= 4 && d < 5) {
    return 'step5';
  } else if (d >= 5 && d < 6) {
    return 'step6';
  } else if (d >= 6 && d < 7) {
    return 'step7';
  } else if (d >= 7) {
    return 'step8';
  }
};

app.months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

app.hours = [
  '12',
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
  '12',
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

app.showTooltip =  function(hourId) {
  var contents = app.getContents(hourId),
      $hourPos = $('#' + hourId).position();

  if ($('#tooltip').length) {
      $('#tooltip').html(contents).show();
    } else {
      $('<div/>', {
        'id': 'tooltip',
        html: contents
      }).appendTo('#chart').show();
    }

  $(document).mousemove(function(e){
    var posX = $hourPos.left - 55;
        posY = $hourPos.top - 60;

    $('#tooltip').css({ left: posX, top: posY });
  });
};

app.hideTooltip = function() {
  $('#tooltip').hide();
  $(document).unbind('mousemove');
};

app.getContents = function(id) {
  var data = $('#' + id).data();

  data.rain = Math.round(data.rain * 100) / 100;

  var template = _.template(
    "<em><%= month %>., <%= starthour %>:00 - <%= endhour %>:00</em><br>" +
    "<strong><%= rain %></strong> inches since 1990"
    );

  return template(data);
};

// Create rain gage map
app.createMap = function() {
  d3.json('/data/city-with-gages-topo.json', function(error, topology) {
    var projection = d3.geo.mercator()
      .center([-75.118, 40.0020])
      .scale(40000)
      .translate([120, 130]);

    var path = d3.geo.path()
      .projection(projection)
      .pointRadius(2);

    var svg = d3.select("#map").append("svg");

    // Add city limits
    svg.append("path")
        .datum(topojson.feature(topology, topology.objects['city-limits']))
        .attr("d", path)
        .attr("class", "map");

    // Add rain gage locations
    svg.append("path")
        .datum(topojson.feature(topology, topology.objects['rain-gages-with-header']))
        .attr("d", path)
        .attr("pointRadis", 40)
        .attr("class", "gage");

    // Add annotation
    svg.append("text")
      .text("PWD Rain Gage Network")
      .attr("x", 45)
      .attr("y", 280)
      .attr("class", "annotation");
  });
};

app.run = function() {
  // Dimensions
  var width = 752,
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
          .attr("id", function(d, i, j) {
            var time = 'pm';
            if (i <= 11) {
              time = 'am';
            }
            return app.months[j] + app.hours[i] + '-' + app.hours[i + 1] + time;
          })
          .attr("data-rain", function(d) { return d; })
          .attr("data-month", function(d, i, j) { return app.months[j]; })
          .attr("data-starthour", function(d, i) { return app.hours[i]; })
          .attr("data-endhour", function(d, i) { return app.hours[i + 1]; })
          .attr("x", function(d, i) { return cellSize * i + 30; })
          .attr("y", function(d, i, j) { return j * cellSize + 20; })
          .on('mouseover', function(d) {
            d3.select(this).classed("selected", true);
            app.showTooltip(d3.select(this)[0][0].id);
          })
          .on('mouseout', function(d){
            d3.select(this).classed("selected", false);
            app.hideTooltip();
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
      .text(function(d, i) { 
        if(i === 0) {
          return app.hours[i] + 'am';
        } else if (i === 12) {
          return app.hours[i] + 'pm';
        } else if (i === 24) {
          return app.hours[i] + 'am';
        } else {
          return app.hours[i];
        }
      })
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

  app.createMap();
};