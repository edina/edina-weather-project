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

//    svg.append("path")
//       .datum(gb)
//       .attr("d", path);
//
//    svg.selectAll(".subunit")
//        .data(topojson.feature(uk, uk.objects.gb).features)
//        .enter().append("path")
//        .attr("class", function(d) { return "gb"; })
//        .attr("d", path);

    var data = [
      { x : 50, y : 50 }
    ];
    //var iconGroup = svg.append("g").append("transform", "translate(50, 50)");
    
    svg.select("#map").data(data).enter()
       .append("line")
       .attr("x1", function(d) {
         return "translate(" + projection(d.x) + ")";
       })
       .attr("y1", function(d) {
         return "translate(" + projection(d.y) + ")";
       })
       .attr("x2", function(d) {
         return "translate(" + projection(d.x + 50) + ")";
       })
       .attr("y2", function(d) {
         return "translate(" + projection(d.y + 50) + ")";
       })
       .attr("stroke-width", 2)
       .attr("stroke", "black");
    
    //var p1 = projection([0, 55]);
//    var p2 = projection([1, 55]);
    /*
    iconGroup.append("line").attr("x1", 0)
                      .attr("y1", 0)
                      .attr("x2", 50)
                      .attr("y2", 50)
                      .attr("stroke-width", 2)
                      .attr("stroke", "black");*/
  });

  var width = 960, height = 800;

  var svg = d3.select("#map").append("svg")
                             .attr("width", width)
                             .attr("height", height);
})();
