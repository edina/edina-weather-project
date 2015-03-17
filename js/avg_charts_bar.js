var averageCharts = (function () {
  'use strict';

  var svg;
  var parseDate;
  
  var maxDataValue;
  var minDataValue;

  function createChart(data) {
    var margin = {
      top: 20,
      right: 20,
      bottom: 100,
      left: 50
    };
    var width = 500 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;
    parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
    //var x = d3.time.scale()
    //    .range([0, width]);

    svg = d3.select("#temp_chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear()
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(d3.time.format("%H:%M"));


    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left").outerTickSize(6);



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

    

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");
    

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temperature C");

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
  var init = function () {

      var testdata = "testdata/temp.json";
      $.getJSON(testdata)
        .done(function (d) {
          var data = d.temp;
          createChart(data);
        });


    },
    highlightTime = function (time) {
      //convert to date
  
      svg.selectAll("rect")
        .each(function (d, i) {
          // In here, d is the ordinal value associated with each tick
          // and 'this' is the dom element
         
        var normalisedTempZeroToOne = d3.scale.linear().domain([minDataValue, maxDataValue]).range([0, 1]);
         var h = (1.0 - normalisedTempZeroToOne(d.temp) ) * 240
          var color = "hsl(" + h + ", 50%, 50%)";  
          var d3this = d3.select(this);
          if (d.time.getTime() === time.getTime()){
            d3this.style("fill", color)
            d3this.style("stroke", "black");
            d3this.style("stroke-width", 5);
          } else {
            d3this.style("fill", color);
            d3this.style("stroke", "black");
            d3this.style("stroke-width", 1);
          }
        })


    }
  return {
    init: init,
    highlightTime: highlightTime
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
  $("#testHighlight").click(function () {
    var time = "2015-03-20 08:30:00";
    charts.highlightTime(time);
  });
});