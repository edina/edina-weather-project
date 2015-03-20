var averageCharts = (function () {
  'use strict';

  var svgTemp;
  var parseDate;

  var tempMaxValue;
  var tempTimeLine;
  var windTimeLine;
  var cloudTimeLine;
  var tempTimeLabel;
  var windTimeLabel;
  var cloudTimeLabel;
  var labelTimeOffset = -15;
  var margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 50
  };
  var width = 500 - margin.left - margin.right;
  var height = 300 - margin.top - margin.bottom;
  var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
  var timelineHeight = height + 10;



  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);



  var y = d3.scale.linear()
    .range([height, 0]);

  function createXAxis(svg) {
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(d3.time.format("%H:%M"));

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

  }

  function createYAxis(svg) {

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left").outerTickSize(6);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Average Temperature");



  }

  function thinTicks(svg) {
    svg.selectAll("g.x.axis g.tick line")
      .attr("y2", function (d) {
        //d for the tick line is the value
        //of that tick 
        //(a number between 0 and 1, in this case)
        if (d.getMinutes() === 0 || d.getMinutes() === 30) {
          return 5;
        } else {
          //hide text
          $(this).next().hide();
          return 0;
        }
      });

  }

  function createMainSvg(id) {
    var svg = d3.select(id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    return svg;

  }

  function createBars(svg, data, yAccessor, hAccessor) {

    svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function (d) {
        return x(d.time);
      })
      .attr("width", x.rangeBand())
      .attr("y", yAccessor)
      .attr("height", hAccessor);

  }

  function createTimeLine(svg) {
    return svg.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", timelineHeight)
      .attr("stroke-width", 3)
      .attr("stroke", "red");

  }

  function createTimeLabel(svg) {

    return svg.append("text")
      .attr("x", labelTimeOffset)
      .attr("y", 0)
      .text("current time")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "red");

  }

  function createTempChart(data) {

    var svg = createMainSvg("#temp_chart");


    tempMaxValue = d3.max(data, function (d) {
      return d.temp;
    });
    y.domain([0, tempMaxValue]);

    x.domain(data.map(function (d) {
      return d.time;
    }));

    createXAxis(svg);

    createYAxis(svg);

    createBars(svg, data, function (d) {
      return y(d.temp);
    }, function (d) {
      return height - y(d.temp);
    });


    thinTicks(svg);



    tempTimeLine = createTimeLine(svg);
    tempTimeLabel = createTimeLabel(svg);


    svg.selectAll("rect")
      .each(function (d, i) {
        // In here, d is the ordinal value associated with each tick
        // and 'this' is the dom element

        var normalisedTempZeroToOne = d3.scale.linear().domain([0, tempMaxValue]).range([0, 1]);
        var h = (1.0 - normalisedTempZeroToOne(d.temp)) * 240
        var color = "hsl(" + h + ", 50%, 50%)";
        var d3this = d3.select(this);

        d3this.style("fill", color)

      });

    svgTemp = svg;

  }


  function createWindChart(data) {

    var svg = createMainSvg("#wind_chart");



    var maxDataValue = d3.max(data, function (d) {
      return d.windspeed;
    });
    y.domain([0, maxDataValue]);



    createXAxis(svg);
    createYAxis(svg);

    createBars(svg, data, function (d) {
      return y(d.windspeed);
    }, function (d) {
      return height - y(d.windspeed);
    });


    thinTicks(svg);

    windTimeLine = createTimeLine(svg);
    windTimeLabel = createTimeLabel(svg);
  }


  function createCloudChart(data) {

    var svg = createMainSvg("#cloud_chart");


    var maxDataValue = d3.max(data, function (d) {
      return d.cloud;
    });
    y.domain([0, maxDataValue]);



    createXAxis(svg);
    createYAxis(svg);


    createBars(svg, data, function (d) {
      return y(d.cloud);
    }, function (d) {
      return height - y(d.cloud);
    });


    thinTicks(svg);

    cloudTimeLine = createTimeLine(svg);
    cloudTimeLabel = createTimeLabel(svg)

    svg.selectAll("rect")
      .each(function (d, i) {
        // In here, d is the ordinal value associated with each tick
        // and 'this' is the dom element

        var color = d3.scale.linear().domain([0, maxDataValue]).range(["white", "black"]);

        var d3this = d3.select(this);

        d3this.style("fill",  color(d.cloud));

      });

  }
  var init = function () {

      var testTempData = "testdata/combined.json";
      $.getJSON(testTempData)
        .done(function (d) {
          var data = d.data;
          data.forEach(function (d) {
            d.time = parseDate(d.time);
            d.cloud = +d.cloud;
            d.windspeed = +d.windspeed;
            d.temp = +d.temp;
          });
          createTempChart(data);
          createWindChart(data);
          createCloudChart(data);
        });

    },
    highlightTime = function (time) {

      //TO do remove hard coding
      var minDate = parseDate("2015-03-20 07:00:00");
      var maxDate = parseDate("2015-03-20 11:00:00");
      var xTimeScale = d3.time.scale()
        .domain([minDate, maxDate])
        .range([0, width]);

      var outputX = xTimeScale(time);

      tempTimeLine
        .attr("x1", outputX)
        .attr("y1", 5)
        .attr("x2", outputX)
        .attr("y2", timelineHeight)
        .attr("stroke-width", 3)
        .attr("stroke", "red");
      windTimeLine.attr("x1", outputX)
        .attr("y1", 5)
        .attr("x2", outputX)
        .attr("y2", timelineHeight)
        .attr("stroke-width", 3)
        .attr("stroke", "red")
      cloudTimeLine.attr("x1", outputX)
        .attr("y1", 5)
        .attr("x2", outputX)
        .attr("y2", timelineHeight)
        .attr("stroke-width", 3)
        .attr("stroke", "red");
      tempTimeLabel.attr("x", outputX + labelTimeOffset)
      windTimeLabel.attr("x", outputX + labelTimeOffset)
      cloudTimeLabel.attr("x", outputX + labelTimeOffset)
    },
    changeToWindSpeed = function () {
      $('#tempBut').css("background-color", "")
      $('#cloudCoverBut').css("background-color", "")
      $('#container_cloud_chart').hide();
      $('#container_temp_chart').hide();
      $('#windSpeedBut').css("background-color", "steelblue")
      $('#container_wind_chart').fadeIn(1000);

    },
    changeToTemperature = function () {
      $('#windSpeedBut').css("background-color", "")
      $('#cloudCoverBut').css("background-color", "")
      $('#container_wind_chart').hide();
      $('#container_cloud_chart').hide();
      $('#tempBut').css("background-color", "steelblue")
      $('#container_temp_chart').fadeIn(1000);


    },
    changeToCloud = function () {
      $('#tempBut').css("background-color", "")
      $('#windSpeedBut').css("background-color", "")
      $('#container_wind_chart').hide();
      $('#cloudCoverBut').css("background-color", "steelblue")
      $('#container_temp_chart').hide();
      $('#container_cloud_chart').fadeIn(1000);


    };
  return {
    init: init,
    highlightTime: highlightTime,
    changeToWindSpeed: changeToWindSpeed,
    changeToTemperature: changeToTemperature,
    changeToCloud: changeToCloud
  }

})();


if (typeof module === "object" && typeof module.exports === "object") {

  module.exports = averageCharts;
} else {
  // Register as a named AMD module
  if (typeof define === "function" && define.amd) {
    define(["average_charts"], function () {
      return averageCharts;
    });
  }
}

// If there is a window object, that at least has a document property,
if (typeof window === "object" && typeof window.document === "object") {
  window.averageCharts = averageCharts;
}


$(document).ready(function () {
  var charts = averageCharts;
  charts.init();
  $('#container_wind_chart').hide();
  $('#container_cloud_chart').hide();
  $('#tempBut').css("background-color", "steelblue")
  $("#windSpeedBut").click(function () {

    charts.changeToWindSpeed();
  });
  $("#tempBut").click(function () {

    charts.changeToTemperature();
  });
  $("#cloudCoverBut").click(function () {

    charts.changeToCloud();
  });
});