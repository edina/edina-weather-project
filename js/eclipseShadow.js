/* global d3: false */
/* global module: false */
/* global define: false */
/* global $: false */
var eclipseShadow = function(map, projection, sliderElement, layerControlElement) {
    'use strict';
    var eclisePathClass = 'eclipsePath';

    var renderEclipsePath = function(map, projection, eclipsePath) {
        var path = d3.geo.path().projection(projection);

        map
            .selectAll('.geojson').data([eclipsePath])
            .enter()
            .append('path')
            .attr('class', eclisePathClass)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('d', path);
    };

    var newUmbra = function(map, projection) {
        var umbra = map.append('svg:circle');

        var translate = function(latitude, longitude, radius) {
            var coordinates = projection([longitude, latitude]);
            umbra
                .attr('r', radius)
                .attr(
                'transform',
                'translate(' + coordinates[0] + ',' + coordinates[1] + ')');
        };

        var hide = function() {
            umbra
                .attr('r', 0);
        };

        return {
            translate: translate,
            hide: hide
        };
    };

    var findValueInRange = function(value, range) {
        for (var i =  1, len = range.length - 1; i < len; i++) {
            if (value >= range[i - 1] && value < range[i]) {
                return i - 1;
            }
        }
        return -1;
    };

    var addLayerControls = function() {
        var checkboxTemplate = (
            '<div class="checkbox disabled">' +
                '<label><input type="checkbox" checked value="path">Eclipse Path</label>' +
            '</div>'
        );

        $(layerControlElement)
            .append(checkboxTemplate)
            .find('input')
            .on('change', function(evt) {
                var checked = evt.currentTarget.checked;
                if (checked) {
                    $('.' + eclisePathClass).show();
                }else {
                    $('.' + eclisePathClass).hide();
                }
            });
    };

    var loadEclipsePath = $.getJSON('data/2015_eclipse_path.json');
    loadEclipsePath.done(function(data) {
        var eclipseData = data;
        var umbra = newUmbra(map, projection);

        // Render the path for the eclipse
        renderEclipsePath(map, projection, data);

        // Bing the translation to the slider
        $(sliderElement).on('slide', function(event, ui) {
            var index;
            var centralTimes = eclipseData.features[2].properties.times;
            var centralCoords = eclipseData.features[2].geometry.coordinates;
            var currentTime = ui.value;

            index = findValueInRange(currentTime, centralTimes);

            if (index > 0) {
                umbra.translate(centralCoords[index][1], centralCoords[index][0], 70);
            }
            else {
                umbra.hide();
            }
        });

        // Add the layer controls
        addLayerControls();
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
