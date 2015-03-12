// Bounding box of our TMS that define our area of interest
var bbox = [0, 0, 700000, 1300000];
 
// Resolutions of our TMS that the tiles will be displayed at calculated so
// that at resolution 0 the bounds fit one 256x256 tile: (maxx - minx)/256
var res = [1024,512,256,128,64,32,16,8,4,2,1];

console.log('xxxxxx')

var crs = new L.Proj.CRS.TMS(
        'EPSG:27700',
        '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs',
        bbox,
        { resolutions: res }
)


var map = new L.Map('map', {
    crs: crs,
    continuousWorld: true,
    worldCopyJump: false,
    zoomControl: true
});
 
var mapUrl = 'http://dlib-rainbow.edina.ac.uk/mapcache/tms1.0.0/fieldtripgb@BNG/{z}/{x}/{y}.png';
 
var tilelayer = new L.TileLayer(mapUrl, {
    tms: true,
    maxZoom: res.length - 1,
    minZoom: 0,
    continuousWorld: true,
    attribution: 'Copyright 2012'
});
map.addLayer(tilelayer);
 
// Centre on London zoom to the maximum extent
map.setView(new L.LatLng(51.33129296535873, -0.6680291327536106), 0);

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


$.getJSON('data/gb2.json').done(addTopoData);

    function addTopoData(topoData){
      topoLayer.addData(topoData);
      topoLayer.addTo(map);
      topoLayer.eachLayer(handleLayer);
    }

    function handleLayer(layer){
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

    function enterLayer(){
      var countryName = this.feature.properties.name;
      $tooltip.text(countryName).show();
      
      this.bringToFront();
      this.setStyle({
        weight:2,
        opacity: 1
      });
    }

    function leaveLayer(){
      $tooltip.hide();

      this.bringToBack();
      this.setStyle({
        weight:1,
        opacity:.5
      });
    }