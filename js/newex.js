(function() {

    // Show/hide layer visibility
    var layers = $('#layers').on('click', function (e) {
        // event handler
        var value = e.target.value;
        if (value === 'temperature') {
            $('.heatmap-canvas').toggle();
        }
        else if( value === 'wind') {
            $('.wind').toggle();
        }else if(value === 'cloud') {
            $('.clouds').toggle();
        }
    });

  var windSymbol = {
    halfWidth: 16,
    halfHeight: 16,
    scale: 40,
    orientation: 90
  };

  var width = 960, height = 800;

  var svg = d3.select("#map").append("svg")
                             .attr("width", width)
                             .attr("height", height);

  var projection = d3.geo.mercator()
                          .center([0, 56.0])
                          .scale(2250)
                          .translate([width / 2, height / 2]);

  // Timeline slider
  var slider = $( "#slider" ).slider({
    range: "max",
    min: 0,
    max: 18,
    value: 0
  });

  slider.on('slide', function( event, ui ) {
    setTime( ui.value );
  });

  var latLongProj = new Edina.EPSG_27700();

  // Load the data
  d3.json("gb8.json", function(error, uk) {
    if (error) return console.error(error);

    var gb = topojson.feature(uk, uk.objects.gb);

    var path = d3.geo.path().projection(projection);

    svg.append("path")
       .datum(gb)
       .attr("d", path);

    svg.selectAll(".subunit")
        .data(topojson.feature(uk, uk.objects.gb).features)
        .enter().append("path")
        .attr("class", function(d) { return "gb"; })
        .attr("d", path);

    // Load wind data
    d3.json("data/data.json", function(error, data) {
      if (error) return console.error(error);

      var symb = svg.selectAll('.symb')
        .data(data.data[0])
        .enter().append('path')
          .attr('transform', function(d,i) {
            return transformWind( 0, d, i );
          })
          .attr('d', function(d) {
            return symbols.getSymbol('wind', d.size);
          })
          .attr('fill', '#aaa')
          .attr('class', 'wind')
          .attr('stroke', '#333');

      // Moves the symbols on the map
      function doTransition( value ) {
        symb.transition().attr('transform', function(d, i) {
          return transformWind( value, d, i );
        });
      };

      function transformWind( value, d, i ) {
        var point = data.data[value][i];
        var p = latLongProj.toGlobalLatLong(point.Northing * 70000, point.Easting * 65000);
        var scaleFactor = point["Wind Speed"] / windSymbol.scale;
        var rotationTransform = [windSymbol.halfWidth * scaleFactor, windSymbol.halfHeight * scaleFactor];
        var rotation = (point["Wind Direction"] + windSymbol.orientation) % 360;
        var coord = projection([p[1], p[0]]);
        coord = [coord[0] - (windSymbol.halfWidth * scaleFactor), coord[1] - (windSymbol.halfHeight * scaleFactor)];
        return 'translate(' + coord[0] + ',' + coord[1] + ') rotate(' + rotation + ' ' + rotationTransform[0] + ' ' + rotationTransform[1] + ') scale(' + scaleFactor + ')';
      }

      slider.on('slide', function( event, ui ) {
        doTransition(ui.value);
      });

      // Load cloud data

        var cloudSymb = svg.selectAll('.symb')
          .data(data.data[0])
          .enter().append('path')
          .attr('transform', function(d,i) {
            return transformCloud( 0, d, i );
          })
          .attr('d', function(d, i) { // d is svg path attr
            return transformCloudPath( 0, d, i );
          })
          .attr('stroke', '#333')
          .attr('class', 'clouds')
          .attr('fill', function(d, i) {
            return transformCloudFill( 0, d, i );
        });
        
        function transformCloud( value, d, i ) {
          var point = data.data[value][i];
          var p = latLongProj.toGlobalLatLong(point.Northing * 70000, point.Easting * 65000);
          var coord = projection([p[1], p[0]]);
          return 'translate(' + coord[0] + ',' + coord[1] + ')';
        };
        function transformCloudPath( value, d, i ) {
          var point = data.data[value][i];
          var cover = point["Cloud Cover"];
          var symbol = null;
          if ( cover < 2 ) {
            symbol = 'sun';
          }
          else if ( cover < 3 ) {
            symbol = 'overcast';
          }
          else if ( cover < 4 ) {
            symbol = 'cloudy';
          }
          else {
            symbol = 'rainy';
          }
          return symbols.getSymbol(symbol, 64);
        };
        function transformCloudFill( value, d, i ) {
          var point = data.data[value][i];
          if ( point["Cloud Cover"] < 2 ) {
            return '#de0';
          }
          else {
            return '#aaa';
          }
        };
              // Moves the symbols on the map
        function doTransitionCloud( value ) {
          cloudSymb.transition().attr('transform', function(d, i) {
            return transformCloud( value, d, i );
          }).attr('d', function(d, i) {
            return transformCloudPath( value, d, i );
          })
          .attr('stroke', '#333')
          .attr('fill', function(d, i) {
            return transformCloudFill( value, d, i );
          });
        }

        slider.on('slide', function(event, ui) {
          doTransitionCloud(ui.value);
        });


      //}); // end of async cloud data
    }); // end of async wind data

    // Put the shadow elements in the map
    eclipseShadow(svg, projection, slider, layers);
  }); // end of async map data

  $("#animate").click(function(){
      $(".earth").addClass("earth-animate");
  });

  var heatmapInstance = h337.create({
  // only container is required, the rest will be defaults
    container: document.getElementById('map'),
    radius: 50,
    maxOpacity: 0.5,
    minOpacity:0,
    blur: .75
  });

  var points = [];

  var p1 = projection([0, 55]);
  var p2 = projection([1, 55]);

  var point1 = {
    x: p1[0],
    y: p1[1],
    value: 50
  };
  var point2 = {
    x: p2[0],
    y: p2[1],
    value: 30
  };
  points.push(point1);
  points.push(point2);
  var newdata = {
    max: 100,
    data: points
  };

  heatmapInstance.setData(newdata) ;

  function doHeatMap( value ) {
    $(".heatmap-canvas").remove();
    var heatmapInstance2 = h337.create({
        container: document.getElementById('map'),
        radius: value * 10,
        maxOpacity: 0.5,
        minOpacity: 0,
        blur: .75
    });
    heatmapInstance2.setData(newdata) ;

    // Ensure the animation respects visibility checkbox
    if (!$('#temperature').is(':checked')){
        $('.heatmap-canvas').toggle();
    }
  };

  slider.on('slide', function( event, ui ) {
    doHeatMap(ui.value);
  });

  function setTime(value) {
    //not used
    var getUnixTime = function(hours, minutes){
      var date = new Date(2015, 2, 20, 8, 0);
      return date.getTime()/1000|0;
    }
    var getDate = function(hours,minutes){
      return new Date(2015, 2, 20, hours, minutes, 0, 0);
    };
    var hours = Math.floor(value/6);
    var minutes = (value - (hours * 6)) * 10;
    hours += 8;
    $("#time").html(getDate(hours, minutes).toString());
  }

  var eclipseWidth = $(".eclipse").width();
  console.log(eclipseWidth)
  console.log((eclipseWidth - 100)/18)
  var step = Math.floor((eclipseWidth - 100)/18)
  function animateEclipse(value) {
    var s = 100 + (step * value);
    console.log(s)
    $(".earth").animate({right: s})
  }

  slider.on('slide', function( event, ui ) {
    animateEclipse(ui.value);
  });


})();
