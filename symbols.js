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