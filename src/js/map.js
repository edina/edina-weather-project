var weatherMap = (function(){
    var map, topoLayer;
    
    // Copyright (c) 2013 Ryan Clark
    // https://gist.github.com/rclark/5779673
    L.TopoJSON = L.GeoJSON.extend({
      addData: function(jsonData) {    
        if (jsonData.type === "Topology") {
          for (key in jsonData.objects) {
            geojson = topojson.feature(jsonData, jsonData.objects[key]);
            L.GeoJSON.prototype.addData.call(this, geojson);
          }
        }    
        else {
          L.GeoJSON.prototype.addData.call(this, jsonData);
        }
      }  
    });

    var addTopoData = function(topoData){
        topoLayer.addData(topoData);
        topoLayer.addTo(map);
        topoLayer.eachLayer(handleLayer);
    };

    var enterLayer = function (){
        var countryName = this.feature.properties.name;
        $tooltip.text(countryName).show();
      
        this.bringToFront();
        this.setStyle({
            weight:2,
            opacity: 1
        });
    };

    var handleLayer = function (layer){
        var randomValue = Math.random(),
          fillColor = colorScale(randomValue).hex();
          
        layer.setStyle({
          fillColor : fillColor,
          fillOpacity: 1,
          color:'#555',
          weight:1,
          opacity:.5
        });

        layer.on({
          mouseover : enterLayer,
          mouseout: leaveLayer
        });
    }

    var init = function(){
        // set up the map
        map = new L.Map('map');

        // create the tile layer with correct attribution
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 12, attribution: osmAttrib});

        // start the map in South-East England
        map.setView(new L.LatLng(51.3, 0.7),5);
        map.addLayer(osm);

        topoLayer = new L.TopoJSON();
        $.getJSON('data/gb2.json').done(addTopoData);
    };

    var leaveLayer = function (){
        $tooltip.hide();

        this.bringToBack();
        this.setStyle({
            weight:1,
            opacity:.5
        });
    };

    return {
        "init": init
    }
})();

if ( typeof module === "object" && typeof module.exports === "object" ) {
    // Expose pcapi as module.exports in loaders that implement the Node
    // module pattern (including browserify). Do not create the global, since
    // the user will be storing it themselves locally, and globals are frowned
    // upon in the Node module world.
    module.exports =  weatherMap;
}
else {
    // Register as a named AMD module
    if ( typeof define === "function" && define.amd ) {
        //define( "pcapi", [], function () { console.log('yyyy'); return pcapi; } );
        define( ["weatherMap"], function() {
            return weatherMap;
        });
    }
}

// If there is a window object, that at least has a document property,
if ( typeof window === "object" && typeof window.document === "object" ) {
    window.weatherMap = weatherMap;
}