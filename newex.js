(function() {
  var data = [[
    { x: 0.5, y: 55, rotation: 20, size: 1.5 },
    { x: -0.5, y: 56, rotation: 40, size: 1 },
  ],[
    { x: 0.4, y: 54, rotation: 10, size: 2.0 },
    { x: -0.6, y: 57, rotation: 60, size: 0.5 },
  ],[
    { x: 0.3, y: 54, rotation: 0, size: 2.2 },
    { x: -0.8, y: 57, rotation: 70, size: 0.3 },
  ],[
    { x: 0.2, y: 54, rotation: 320, size: 1.6 },
    { x: 1.2, y: 57, rotation: 80, size: 0.4 },
  ],[
    { x: 0.1, y: 54, rotation: 310, size: 1.4 },
    { x: -2.0, y: 57, rotation: 90, size: 0.3 },
  ],[
    { x: 0, y: 54, rotation: 300, size: 1.2 },
    { x: -2.5, y: 57, rotation: 120, size: 0.4 },
  ],[
    { x: -0.5, y: 54, rotation: 260, size: 1.1 },
    { x: -2.3, y: 57, rotation: 20, size: 0.7 },
  ]];    

  d3.json("gb8.json", function(error, uk) {
    if (error) return console.error(error);
    console.log(uk);

    var gb = topojson.feature(uk, uk.objects.gb);

    var projection = d3.geo.mercator()
                          .center([0, 56.0])
                          .scale(2250)
                          .translate([width / 2, height / 2]);
    var path = d3.geo.path().projection(projection);

    svg.append("path")
       .datum(gb)
       .attr("d", path);

    svg.selectAll(".subunit")
        .data(topojson.feature(uk, uk.objects.gb).features)
        .enter().append("path")
        .attr("class", function(d) { return "gb"; })
        .attr("d", path);

    var symb = svg.selectAll('.symb')
      .data(data[0])
      .enter().append('path')
        .attr('transform', function(d,i) {
          var coord = projection([d.x, d.y]);
          return 'translate(' + coord[0] + ',' + coord[1] + ') rotate(' + d.rotation + ') scale(' + d.size + ')';
        })
        .attr('d', function(d) {
          return symbols.getSymbol('wind', d.size);
        })
        .attr('fill', '#aaa')
        .attr('stroke', '#333');

    // Moves the symbols on the map
    function doTransition( value ) {
      symb.transition().attr('transform', function(d, i) {
        var point = data[value][i];
        var coord = projection([point.x, point.y]);
        return 'translate(' + coord[0] + ',' + coord[1] + ') rotate(' + point.rotation + ') scale(' + point.size + ')';
      });
    }
    
    // Timeline slider
    var slider = $( "#slider" ).slider({
      range: "max",
      min: 0,
      max: 6,
      value: 0,
      slide: function( event, ui ) {
        doTransition(ui.value);
      }
    });

    // Play button and loop controls
    var isPlaying = false;
    var loop = $("#loop");
    $("#play").click(function(btn) {
      if ( isPlaying ) {
        return;
      }
      
      isPlaying = true;
      var i = 0;
      var sliderPlayback = window.setInterval(function() {
        
        slider.slider("value", i);
        doTransition(slider.slider("value"));
        i++;
        
        if ( i == data.length ) {
          if ( loop.prop('checked') ) {
            i = 0;
          }
          else {
            window.clearInterval( sliderPlayback );
            isPlaying = false;
          }
        }
      }, 500);
    });
    
  }); // end of async json load

  var width = 960, height = 800;

  var svg = d3.select("#map").append("svg")
                             .attr("width", width)
                             .attr("height", height);
})();
