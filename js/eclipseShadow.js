/* global d3: false */
/* global module: false */
/* global define: false */
/* global $: false */
/* global topojson: false */
var eclipseShadow = function(map, projection, sliderElement, layerControlElement) {
    'use strict';
    var eclipsePathClass = 'eclipse-path';
    var eclipsePathLayerClass = 'eclipse-path-layer';
    var eclipseShadowClass = 'eclipse-shadow';
    var eclipseShadowLayerClass = 'eclipse-shadow-layer';
    var eclipseMaxShadowClass = 'eclipse-max-shadow';
    var eclipseMaxShadowLayerClass = 'eclipse-max-shadow-layer';

    var renderEclipsePath = function(map, projection, eclipsePath) {
        var path = d3.geo.path().projection(projection);

        map.append('g')
            .attr('class', eclipsePathLayerClass)
            .selectAll(eclipsePathClass)
            .data([eclipsePath])
            .enter()
            .append('path')
            .attr('class', eclipsePathClass)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('d', path);
    };

    var renderEclipseMaxShadow = function(map, projection, eclipseShadow) {
        var path = d3.geo.path().projection(projection);

        var topology = topojson.feature(eclipseShadow,
                                        eclipseShadow
                                            .objects['2015_eclipse_max_shadow']);

        map.append('g')
            .attr('class', eclipseMaxShadowLayerClass)
            .selectAll(eclipseMaxShadowClass)
            .data(topology.features)
            .enter()
            .append('path')
            .attr('class', eclipseMaxShadowClass)
            .attr('display', 'none')
            .attr('fill', function(d) {
                var maxAlpha = 0.8;
                var magnitude = parseFloat(d.properties['magnitude_max']);
                var alpha = maxAlpha * magnitude;
                var rgba = 'rgba(0,0,0,' + alpha + ')';

                return rgba;
            })
            .attr('d', path);
    };

    var newEclipseShadow = function(map, projection, eclipseShadow) {
        var path = d3.geo.path().projection(projection);

        var topology = topojson.feature(eclipseShadow,
                                        eclipseShadow
                                            .objects['2015_eclipse_times']);

        var g = map.append('g')
                   .attr('class', eclipseShadowLayerClass);
        var polygons = g
                        .selectAll(eclipseShadowClass)
                        .data(topology.features)
                        .enter()
                        .append('path')
                        .attr('class', eclipseShadowClass)
                        .attr('fill', 'rgba(0,0,0,0.1)')
                        .attr('stroke', 'none')
                        .attr('d', path);

        var fmt = d3.time.format('%Y/%m/%d %H:%M:%S.%L');
        var update = function(unixtime) {
            var calculateAlpha = function(d) {
                var maxAlpha = 0.8;
                var alpha = 0;
                var magnitude = parseFloat(d.properties.magnitude);
                var dateMax = fmt.parse(d.properties.date).getTime() / 1000;
                var dateC1 = fmt.parse(d.properties.c1date).getTime() / 1000;
                var dateC4 = fmt.parse(d.properties.c4date).getTime() / 1000;
                var fadeInRatio = magnitude / (dateMax - dateC1);
                var fadeOutRatio = magnitude / (dateC4 - dateMax);

                if (unixtime >= dateC1 && unixtime <= dateMax) {
                    alpha = (unixtime - dateC1) * fadeInRatio * maxAlpha;
                }
                else if (unixtime > dateMax && unixtime <= dateC4) {
                    alpha = (magnitude - ((unixtime - dateMax) * fadeOutRatio)) * maxAlpha;
                }

                return alpha;
            };

            polygons
                .attr('fill', function(d) {
                    var alpha = calculateAlpha(d);
                    var rgba = 'rgba(0,0,0,' + alpha + ')';

                    return rgba;
                });
        };

        return {
            update: update
        };
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
                '<label><input type="checkbox" checked value="' + eclipsePathLayerClass + '">Eclipse Path</label>' +
            '</div>'
        );

        var shadowMaxControlTemplate = (
            '<div class="checkbox">' +
                '<label><input type="checkbox" value="' + eclipseMaxShadowLayerClass + '">Eclipse Maximum Shadow</label>' +
            '</div>'
        );

        var shadowControlTemplate = (
            '<div class="checkbox">' +
                '<label><input type="checkbox" checked value="' + eclipseShadowLayerClass + '">Eclipse Shadow</label>' +
            '</div>'
        );

        $(layerControlElement)
            .find('> div')
            .append(pathControlTemplate)
            .append(shadowMaxControlTemplate)
            .append(shadowControlTemplate)
            .find('input')
            .on('change', function(evt) {
                var control = evt.currentTarget;

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
    var START_DATE = ((new Date(2015, 3 - 1, 20)).getTime() / 1000);
    var END_DATE = ((new Date(2015, 3 - 1, 20, 12)).getTime() / 1000);
    var intervalToUnixTime = function(value) {
        var maxSlider = $(sliderElement).data().uiSlider.max;
        var ratio = (END_DATE - START_DATE) / maxSlider;

        return START_DATE + (value * ratio);
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

    // Load the data for the eclipse max shadow
    var loadEclipseMaxShadow = $.getJSON('data/2015_eclipse_max_shadow.topojson');
    loadEclipseMaxShadow.done(function(data) {
        // console.log(data);
        renderEclipseMaxShadow(map, projection, data);
    });

    loadEclipseMaxShadow.error(function(err, errCode, errText) {
        console.error(errText);
    });

    // Load the data for the eclipse max shadow
    var loadEclipseShadow = $.getJSON('data/2015_eclipse_times.topojson');
    loadEclipseShadow.done(function(data) {
        // console.log(data);
        var shadow = newEclipseShadow(map, projection, data);

        var currentTime = intervalToUnixTime(0);
        shadow.update(currentTime);

        $(sliderElement).on('slide', function(event, ui) {
            var currentTime = intervalToUnixTime(ui.value);
            shadow.update(currentTime);
        });
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
