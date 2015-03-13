(function() {
  $(function() {
    $( "#slider" ).slider();
  });

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

    var data = [
      { x: 0.5, y: 55, rotation: 20, size: 5 },
      { x: -0.5, y: 56, rotation: 40, size: 10 },
    ];
    
    var symb = svg.selectAll('.symb')
      .data(data)
      .enter().append('path')
        .attr('transform', function(d,i) {
          var coord = projection([d.x, d.y]);
          return 'translate(' + coord[0] + ',' + coord[1] + ') rotate(' + d.rotation + ')';
        })
        .attr('d', function(d) {
          return symbols.getSymbol('wind', 128);
        })
        .attr('fill', '#aaa')
        .attr('stroke', '#333');
    
      }); // end of async json load

      var width = 960, height = 800;

      var svg = d3.select("#map").append("svg")
                                 .attr("width", width)
                                 .attr("height", height);
})();
