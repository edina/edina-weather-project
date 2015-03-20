var averageCharts = (function () {
  'use strict';

  var svgTemp;
  var parseDate;

  var maxDataValue;
  var minDataValue;
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


  function createTempChart(data) {

    var svg = d3.select("#temp_chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");



    data.forEach(function (d) {
      d.time = parseDate(d.time);
      d.temp = +d.temp;
    });

    x.domain(data.map(function (d) {
      return d.time;
    }));


    minDataValue = d3.min(data, function (d) {
      return d.temp;
    });
    maxDataValue = d3.max(data, function (d) {
      return d.temp;
    });
    y.domain([minDataValue, maxDataValue]);



    createXAxis(svg);

    createYAxis(svg);




    svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function (d) {
        return x(d.time);
      })
      .attr("width", x.rangeBand())
      .attr("y", function (d) {
        return y(d.temp);
      })
      .attr("height", function (d) {
        return height - y(d.temp);
      });


    thinTicks(svg);



    tempTimeLine = svg.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", timelineHeight)
      .attr("stroke-width", 3)
      .attr("stroke", "red");

    tempTimeLabel = svg.append("text")
      .attr("x", labelTimeOffset)
      .attr("y", 0)
      .text("current time")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "red");
    svgTemp = svg;

  }


  function createWindChart(data) {

    var svg = d3.select("#wind_chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");





    data.forEach(function (d) {
      d.time = parseDate(d.time);
      d.windspeed = +d.windspeed;
    });


    x.domain(data.map(function (d) {
      return d.time;
    }));


    minDataValue = d3.min(data, function (d) {
      return d.windspeed;
    });
    maxDataValue = d3.max(data, function (d) {
      return d.windspeed;
    });
    y.domain([minDataValue, maxDataValue]);



    createXAxis(svg);
    createYAxis(svg);

    svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function (d) {
        return x(d.time);
      })
      .attr("width", x.rangeBand())
      .attr("y", function (d) {
        return y(d.windspeed);
      })
      .attr("height", function (d) {
        return height - y(d.windspeed);
      });



    thinTicks(svg);

    windTimeLine = svg.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", timelineHeight)
      .attr("stroke-width", 3)
      .attr("stroke", "red");

    windTimeLabel = svg.append("text")
      .attr("x", labelTimeOffset)
      .attr("y", 0)
      .text("current time")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "red");
  }


  function createCloudChart(data) {

    var svg = d3.select("#cloud_chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");



    data.forEach(function (d) {
      d.time = parseDate(d.time);
      d.cloud = +d.cloud;
    });


    x.domain(data.map(function (d) {
      return d.time;
    }));


    minDataValue = d3.min(data, function (d) {
      return d.cloud;
    });
    maxDataValue = d3.max(data, function (d) {
      return d.cloud;
    });
    y.domain([minDataValue, maxDataValue]);



    createXAxis(svg);
    createYAxis(svg);

    svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function (d) {
        return x(d.time);
      })
      .attr("width", x.rangeBand())
      .attr("y", function (d) {
        return y(d.cloud);
      })
      .attr("height", function (d) {
        return height - y(d.cloud);
      });


    thinTicks(svg);

    cloudTimeLine = svg.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", timelineHeight)
      .attr("stroke-width", 3)
      .attr("stroke", "red");
    cloudTimeLabel = svg.append("text")
      .attr("x", labelTimeOffset)
      .attr("y", 0)
      .text("current time")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "red");


  }
  var init = function () {

      var testTempData = "testdata/temp.json";
      $.getJSON(testTempData)
        .done(function (d) {
          var data = d.temp;
          createTempChart(data);
        });

      var testWindData = "testdata/wind.json";
      $.getJSON(testWindData)
        .done(function (d) {
          var data = d.wind;
          createWindChart(data);
        });
      var testWindData = "testdata/cloud.json";
      $.getJSON(testWindData)
        .done(function (d) {
          var data = d.cloudcover;
          createCloudChart(data);
        });




    },
    highlightTime = function (time) {

      //convert to date
      var minDate = parseDate("2015-03-20 08:00:00");
      var maxDate = parseDate("2015-03-20 12:50:00");
      var xTimeScale = d3.time.scale()
        .domain([minDate, maxDate])
        .range([0, width]);
      svgTemp.selectAll("rect")
        .each(function (d, i) {
          // In here, d is the ordinal value associated with each tick
          // and 'this' is the dom element

          var normalisedTempZeroToOne = d3.scale.linear().domain([minDataValue, maxDataValue]).range([0, 1]);
          var h = (1.0 - normalisedTempZeroToOne(d.temp)) * 240
          var color = "hsl(" + h + ", 50%, 50%)";
          var d3this = d3.select(this);

          d3this.style("fill", color)

        });
      var outputX = xTimeScale(time);
      console.log(outputX);
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