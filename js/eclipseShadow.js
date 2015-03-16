/* global d3: false */
/* global module: false */
/* global define: false */
/* global $: false */
var eclipseShadow = function(map, projection, sliderElement, layerControlElement) {
    'use strict';
    var eclisePathClass = 'eclipse-path';
    var ecliseShadowClass = 'eclipse-shadow';

    var renderEclipsePath = function(map, projection, eclipsePath) {
        var path = d3.geo.path().projection(projection);

        map
            .selectAll(eclisePathClass)
            .data([eclipsePath])
            .enter()
            .append('path')
            .attr('class', eclisePathClass)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('d', path);
    };

    var renderEclipseShadow = function(map, projection, eclipseShadow) {
        var path = d3.geo.path().projection(projection);
        map
            .selectAll(ecliseShadowClass)
            .data(eclipseShadow.features)
            .enter()
            .append('path')
            .attr('class', ecliseShadowClass)
            .attr('fill', function(d) {
                var maxAlpha = 0.1;
                var magnitude = parseFloat(d.properties['magnitude_max']);
                var alpha = maxAlpha * magnitude;
                var rgba = 'rgba(0,0,0,' + alpha + ')';

                return rgba;
            })
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
        var pathControlTemplate = (
            '<div class="checkbox">' +
                '<label><input type="checkbox" checked value="' + eclisePathClass + '">Eclipse Path</label>' +
            '</div>'
        );

        var shadowControlTemplate = (
            '<div class="checkbox">' +
                '<label><input type="checkbox" checked value="' + ecliseShadowClass + '">Eclipse Maximum Shadow</label>' +
            '</div>'
        );

        $(layerControlElement)
            .append(pathControlTemplate)
            .append(shadowControlTemplate)
            .find('input')
            .on('change', function(evt) {
                var control = evt.currentTarget;
                console.debug(control.val);
                if (control.checked) {
                    $('.' + control.value).show();
                }else {
                    $('.' + control.value).hide();
                }
            });
    };

    /**
      * The slider return steps instead of unix time
      * try to convert them to unix time
    */
    var intervalToUnixTime = function(value) {
        var start = 1426838400;
        var end = 1426849200;
        var maxSlider = $(sliderElement).data().uiSlider.max;
        var ratio = (end - start) / maxSlider;

        console.debug((value * ratio) + start);
        return start + (value * ratio);
    };

    var loadEclipsePath = $.getJSON('data/2015_eclipse_path.geojson');
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
            var currentTime = intervalToUnixTime(ui.value);

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

    loadEclipsePath.error(function(err, errCode, errText) {
        console.error(errText);
    });

    // Load the data for the eclipse shadow
    var loadEclipseShadow = $.getJSON('data/2015_eclipse_max_shadow.geojson');
    loadEclipseShadow.done(function(data) {
        // console.log(data);
        renderEclipseShadow(map, projection, data);
    });

    loadEclipseShadow.error(function(err, errCode, errText) {
        console.error(errText);
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
