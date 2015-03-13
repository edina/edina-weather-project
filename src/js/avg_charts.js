var averageCharts = (function () {
    'use strict';


    function createChart(data) {
        var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        };
        var width = 960 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;
        var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(d3.time.minute, 30)
            .tickFormat(d3.time.format("%H:%M"));

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function (d) {
                return x(d.time);
            })
            .y(function (d) {
                return y(d.temp);
            }).interpolate("basis");


        var svg = d3.select("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data.forEach(function (d) {
            d.time = parseDate(d.time);
            d.temp = +d.temp;
        });

        x.domain(d3.extent(data, function (d) {
            return d.time;
        }));
        y.domain(d3.extent(data, function (d) {
            return d.temp;
        }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Temperature C");

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .style("fill", "none")
            .style("stroke", "blue")
            .attr("d", line);


    }
    var init = function () {

        var testdata = "testdata/temp.json";
        $.getJSON(testdata)
            .done(function (d) {
                var data = d.temp;
                createChart(data);
            });


    }
    return {
        init: init
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