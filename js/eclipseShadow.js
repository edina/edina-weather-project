/* global d3: false */
/* global module: false */
/* global define: false */
/* global $: false */
var eclipseShadow = function(map, projection, sliderElement) {
    'use strict';
    var eclipseData; // it holds the geojson data

    var renderEclipsePath = function(map, projection, eclipsePath) {
        var path = d3.geo.path().projection(projection);

        map
            .selectAll('.geojson').data([eclipsePath])
            .enter()
            .append('path')
            .attr('class', 'geojson')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('d', path);
    };

    var renderUmbra = function(map, projection, latitude, longitude, radius) {
        var coordinates = projection([longitude, latitude]);

        map
            .append('svg:circle')
            .attr('cx', coordinates[0])
            .attr('cy', coordinates[1])
            .attr('r', radius);
    };

    var findTimeInTimes = function(time, times) {
        for (var i =  1, len = times.length - 1; i < len; i++) {
            if (times[i] > times[i - 1] && times[i] >= times[i + 1]) {
                return i - 1;
            }
        }

        return -1;
    };

    var loadEclipsePath = $.getJSON('2015_eclipse_path.json');
    loadEclipsePath.done(function(data) {
        eclipseData = data;

        renderEclipsePath(map, projection, data);
        //
    });
    loadEclipsePath.error(function(err) {
        console.error(err);
    });

    $(sliderElement).on('slide', function(event, ui) {
        var index;
        var centralTimes = eclipseData.features[1].properties.times;
        var centralCoords = eclipseData.features[1].geometry.coordinates;
        var currentTime = ui.value;

        index = findTimeInTimes(currentTime, centralTimes);

        if (index > 0) {
            renderUmbra(
                map,
                projection,
                centralCoords[index][0],
                centralCoords[index][1],
                50
            );
        }
    });
};

// Modules shim
if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports =  eclipseShadow;
}
else {
    // Register as a named AMD module
    if (typeof define === 'function' && define.amd) {
        define(['eclipseShadow'], function() {
            return eclipseShadow;
        });
    }
}
if (typeof window === 'object' && typeof window.document === 'object') {
    window.eclipseShadow = eclipseShadow;
}
