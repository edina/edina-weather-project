(function () {
  // from https://github.com/substack/point-in-polygon
  function pointInPolygon(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    var xi, xj, i, intersect,
      x = point[0],
      y = point[1],
      inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      xi = vs[i][0],
        yi = vs[i][1],
        xj = vs[j][0],
        yj = vs[j][1],
        intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // Show/hide layer visibility
  var layers = $('#layers').on('click', function (e) {
    // event handler
    var value = e.target.value;
    var state = e.target.checked;
    var item;
    if (value === 'temperature') {
      item = $('#canvasImage');
    } else if (value === 'wind') {
      item = $('.wind');
    } else if (value === 'cloud') {
      item = $('.clouds');
    }
    if ( state ) {
      item.show();
    }
    else {
      item.hide();
    }
  });

  var windSymbol = {
    halfWidth: 16,
    halfHeight: 16,
    scale: 40,
    orientation: 90
  };

  var width = 580,
    height = 800;
  var ANIMATION_MOVES = 18;

  var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

  svg.append("foreignObject")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "svgForeignObject");

  var projection = d3.geo.mercator()
    .center([-3.5, 55.8])
    .scale(2250)
    .translate([width / 2, height / 2]);

  // Timeline slider
  var slider = $("#slider").slider({
    range: "max",
    min: 0,
    max: ANIMATION_MOVES,
    value: 0
  });

  slider.on('slide', function (event, ui) {
    setTime(ui.value);
  });

  var latLongProj = new Edina.EPSG_27700();

  // Load the data
  d3.json("gb8.json", function (error, uk) {
    if (error) return console.error(error);

    var gb = topojson.feature(uk, uk.objects.gb);

    var path = d3.geo.path().projection(projection);
    var path2 = d3.geo.path().projection(projection);


    svg.append("path")
      .datum(gb)
      .attr("d", path);


    svg.selectAll(".subunit")
      .data(topojson.feature(uk, uk.objects.gb).features)
      .enter().append("path")
      .attr("class", function (d) {
        return "gb";
      })
      .attr("d", path);


    var clipPath = svg.append('clipPath')
      .attr('id', 'ukClipPath');

    clipPath.append('path')
      .datum(gb)
      .attr('d', path2);

    svg.append("image")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("clip-path", "url(#ukClipPath)")
      .attr("id", "canvasImage")
      .attr("xlink:href", "");

    // Load wind data
    d3.json("http://datapoint.metoffice.gov.uk/public/data/val/wxobs/all/json/all?res=hourly&key=76f2c909-4e4b-4239-87fe-b7602605093e", function (error, data) {
      if (error) return console.error(error);

      // Heatmap


      doHeatMap(0);

      var symb = svg.selectAll('.symb')
        .data(data.SiteRep.DV.Location)
        .enter().append('path')
//        .select(function (d, i) {
//          var point = latLongProj.toGlobalLatLong(d.Northing * 70000, d.Easting * 65000);
//          return pointInPolygon([point[1], point[0]], gb_simple) ? this : null;
//        })
        .attr('transform', function (d, i) {
          return transformWind(0, d, i);
        })
        .attr('d', function (d) {
          return symbols.getSymbol('wind', d.size);
        })
        .attr('fill', '#aaa')
        .attr('class', 'wind')
        .attr('stroke', '#333');


      // Moves the symbols on the map
      function doTransition(value) {
        symb.transition().attr('transform', function (d, i) {
          return transformWind(value, d, i);
        });
      };

      function transformWind(value, d, i) {
        var point = d.Period[1].Rep[value];
        var lat = d['lat'];
        var lon = d['lon'];
        var coord = projection([lon, lat]);

        var windDirection = point.D;
        var windStrength = point.S;
        
        // Set some crappy defaults as sometimes data is missing
        // Not great but will do for a test visualisation
        if ( !windDirection ) {
          windDirection = 'N';
        }
        if ( !windStrength ) {
          windStrength = 1;
        }
        
        var scaleFactor = (windStrength / windSymbol.scale) * 5;
        var windAngle = 0;
        switch ( windDirection ) {
          case 'N':
            windAngle = 0;
            break;
          case 'NNE':
            windAngle = 22.5;
            break;
          case 'NE':
            windAngle = 45;
            break;
          case 'ENE':
            windAngle = 67.5;
            break;
          case 'E':
            windAngle = 90;
            break;
          case 'ESE':
            windAngle = 112.5;
            break;
          case 'SE':
            windAngle = 135;
            break;
          case 'SSE':
            windAngle = 157.5;
            break;
          case 'S':
            windAngle = 180;
            break;
          case 'SSW':
            windAngle = 202.5;
            break;
          case 'SW':
            windAngle = 225;
            break;
          case 'WSW':
            windAngle = 247.5
            break;
          case 'W':
            windAngle = 270;
            break;
          case 'WNW':
            windAngle = 292.5;
            break;
          case 'NW':
            windAngle = 315;
            break;
          case 'NNW':
            windAngle = 337.5;
            break;
          default:
            console.log('Unknown wind direction: ' + windDirection );
        }

        var rotationTranslation = [windSymbol.halfWidth * scaleFactor, windSymbol.halfHeight * scaleFactor];
        var rotationOrientation = (windAngle + windSymbol.orientation) % 360;

        coord = [coord[0] - (windSymbol.halfWidth * scaleFactor), coord[1] - (windSymbol.halfHeight * scaleFactor)];
        return 'translate(' + coord[0] + ',' + coord[1] + ') rotate(' + rotationOrientation + ' ' + rotationTranslation[0] + ' ' + rotationTranslation[1] + ') scale(' + scaleFactor + ')';
      }

      slider.on('slide', function (event, ui) {
        doTransition(ui.value);
      });

      // Load cloud data

      var cloudSymb = svg.selectAll('.symb')
        .data(data.SiteRep.DV.Location)
        .enter().append('path')
//        .select(function (d, i) {
//          var point = latLongProj.toGlobalLatLong(d.Northing * 70000, d.Easting * 65000);
//          return pointInPolygon([point[1], point[0]], gb_simple) ? this : null;
//        })
        .attr('transform', function (d, i) {
          return transformCloud(0, d, i);
        })
        .attr('d', function (d, i) { // d is svg path attr
          return transformCloudPath(0, d, i);
        })
//        .attr("clip-path", "url(#ukClipPath);")
        .attr('stroke', '#333')
        .attr('class', 'clouds')
        .attr('style', function (d, i) {
          return transformCloudFill(0, d, i);
        });

      function transformCloud(value, d, i) {
        var point = d.Period[1].Rep[value];
        var lat = d['lat'];
        var lon = d['lon'];
        var coord = projection([lon, lat]);
        
        return 'translate(' + coord[0] + ',' + coord[1] + ')';
      };

      function transformCloudPath(value, d, i) {

        var point = d.Period[1].Rep[value];
        var cover = point.W;
        
        var symbol = null;
        if (cover <= 3) {
          symbol = 'sun';
        } else if (cover === 8) {
          symbol = 'overcast';
        } else if (cover <= 7) {
          symbol = 'cloudy';
        } else {
          symbol = 'rainy';
        }
        return symbols.getSymbol(symbol, 64);
      };

      function transformCloudFill(value, d, i) {
        var point = d.Period[1].Rep[value];
        var cover = point.W;
        if (cover <= 3) {
          return 'fill:yellow';
        } else if (cover === 8) {
          return 'fill:white';
        } else if (cover <= 7) {
          return 'fill:black';
        } else {
          return 'fill:blue';
        }
      };
      // Moves the symbols on the map
      function doTransitionCloud(value) {
        cloudSymb.transition().attr('transform', function (d, i) {
            return transformCloud(value, d, i);
          }).attr('d', function (d, i) {
            return transformCloudPath(value, d, i);
          })
          .attr('stroke', '#333')
          //  .attr('fill', function(d, i) {
          //    return transformCloudFill( value, d, i );
          .attr('style', function (d, i) {
            return transformCloudFill(value, d, i);

          }).duration(1) // hides the messy transform between shapes;
      }

      slider.on('slide', function (event, ui) {
        doTransitionCloud(ui.value);
      });

      function doHeatMap(value) {

        var heatpoints = [];

        d3.select("map")
          .data = data.SiteRep.DV.Location
          .forEach(function (d, i) {
            var point = d.Period[1].Rep[value];
            var lat = d['lat'];
            var lon = d['lon'];
            var coord = projection([lon, lat]);

            var temperature = point.T;
            var heatpoint = {
              x: coord[0],
              y: coord[1],
              value: temperature
            };

            heatpoints.push(heatpoint);
          });

        var newdata = {
          max: 15,
          data: heatpoints
        };

        $(".heatmap-canvas").remove();

        var heatmapInstance2 = h337.create({
          container: document.getElementById('svgForeignObject'),
          radius: 55,
          maxOpacity: 0.4,
          minOpacity: 0,
          blur: .75
        });

        heatmapInstance2.setData(newdata);

        var canvas = $(".heatmap-canvas");
        var canvasdataUrl = canvas[0].toDataURL();
        $(".heatmap-canvas").hide();

        document.getElementById("canvasImage").setAttribute("href", canvasdataUrl);


        // Ensure the animation respects visibility checkbox
        if (!$('#temperature').is(':checked')) {
          $('#canvasImage').hide();
        }
      };

      slider.on('slide', function (event, ui) {
        doHeatMap(ui.value);
        $('.heatmap-canvas').index = 0;
      });

      doHeatMap(0);
    }); // end of async wind data


    // Put the shadow elements in the map
    eclipseShadow(svg, projection, slider, layers);
  }); // end of async map data

  eclipseAnimation(ANIMATION_MOVES, slider);

})();
