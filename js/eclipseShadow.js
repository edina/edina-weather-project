/* global d3: false */
/* global module: false */
/* global define: false */
var eclipseShadow = function(map, projection, $slider) {
    'use strict';

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

    var loadEclipsePath = $.getJSON('2015_eclipse_path.json');
    loadEclipsePath.done(function(data) {
        renderEclipsePath(map, projection, data);
        renderUmbra(map, projection, 67.0669444444, -2.46861111111, 50);
    });
    loadEclipsePath.error(function(err) {
        console.error(err);
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
