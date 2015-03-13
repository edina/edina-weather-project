var symbols = (function() {
  
    var _symbols = {};
  
    //http://stackoverflow.com/questions/25332120/create-additional-d3-js-symbols

    var customSymbolTypes = d3.map({
      'thin-x': function(size) {
      size = Math.sqrt(size);
      return 'M' + (-size/2) + ',' + (-size/2) +
        'l' + size + ',' + size +
        'm0,' + -(size) + 
        'l' + (-size) + ',' + size;
      },
      'smiley': function(size) {
        size = Math.sqrt(size);
        var pad = size/5;
        var r = size/8;
        return 'M' + ((-size/2)+pad) + ',' + (-size/2) +
        ' m' + (-r) + ',0' +
        ' a' + r + ',' + r + ' 0 1,0' + (r * 2) + ',0' +
        ' a' + r + ',' + r + ' 0 1,0' + (-(r * 2)) + ',0' +

        'M' + ((size/2)-pad) + ',' + (-size/2) +
        ' m' + (-r) + ',0' +
        ' a' + r + ',' + r + ' 0 1,0' + (r * 2) + ',0' +
        ' a' + r + ',' + r + ' 0 1,0' + (-(r * 2)) + ',0' +

        'M' + (-size/2) + ',' + ((size/2)-(2*pad)) +
        'q' + (size/2) + ',' + (pad*2) + ' ' + size + ',0';
      },
      wind: function(size) {
        return 'M25,100 C25,100 25,50 25,50 C25,50 0,50 0,50 C0,50 35,0 35,0 C35,0 65,60 65,60 C65,60 40,60 40,60 C40,60 40,100 40,100 C40,100 25,100 25,100 Z';
      },
      sunny: function(size) {
        return 'M24,14 C24,14 28,0 28,0 C28,0 33,16 33,16 C33,16 44,4 44,4 C44,4 41,18 41,18 C41,18 51,33 51,33 C51,33 35,30 35,30 C35,30 36,48 36,48 C36,48 26,36 26,36 C26,36 13,45 13,45 C13,45 14,31 14,31 C14,31 0,28 0,28 C0,28 15,21 15,21 C15,21 9,1 9,1 C9,1 24,14 24,14 Z';
      },
      overcast: function(size) {
        return 'M69.0382,6.49488 C81.5381,-18.192 123.321,3.44408 114.743,30.55 C103.83,50.0141 65.6623,69.1245 52.1996,47.3886 ';
      },
      cloudy: function(size) {
        return 'M14.393,45.5294 C4.98393,38.2713 -4.35902,25.6048 2.18928,13.6119 C13.2717,6.93232 16.2041,24.2312 19.0868,30.9788 C22.0195,21.0069 15.9225,7.36302 24.2499,0 C36.256,2.6664 36.6315,19.9726 41.1474,28.6319 C42.0138,21.5598 43.4512,13.9784 47.7187,7.97938 C84.3889,-11.2699 76.9988,55.627 43.9637,47.8763 C40.1338,48.8615 36.0905,48.1121 32.1681,48.3457 C25.0648,49.5241 20.1799,44.2149 14.393,45.5294 Z';
      }
    });

    d3.svg.customSymbol = function() {
      var type,
          size = 64;
      function symbol(d,i) {
        return customSymbolTypes.get(type.call(this,d,i))(size.call(this,d,i));
      }
      symbol.type = function(_) {
        if (!arguments.length) return type;
        type = d3.functor(_);
        return symbol;
      };
      symbol.size = function(_) {
        if (!arguments.length) return size;
        size = d3.functor(_);
        return symbol;
      };
      return symbol;
    };

    _symbols.getSymbol = function(type, size) {
      size = size || 64;
      if (d3.svg.symbolTypes.indexOf(type) !== -1) {
        return d3.svg.symbol().type(type).size(size)();
      } else {
        return d3.svg.customSymbol().type(type).size(size)();
      }
    }
    
    return _symbols;
})();