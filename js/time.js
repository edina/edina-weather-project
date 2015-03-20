//function setTime(value) {
//  var hours = Math.floor(value/6);
//  var minutes = (value - (hours * 6)) * 10;
//  hours += 8;
//  if(minutes < 10) {
//    minutes = "0" + minutes;
//  }
//  if (hours < 10) {
//    hours = "0" + hours;
//  }
//  $("#time").html(hours + ':' + minutes);
//}

function setTime(value) {
    //not used
    var getUnixTime = function(hours, minutes){
      var date = new Date(2015, 2, 20, 7, 0);
      return date.getTime()/1000|0;
    }
    var getDate = function(hours,minutes){
      return new Date(2015, 2, 20, hours, minutes, 0, 0);
    };
    var hours = Math.floor(value/12);
    var minutes = (value - (hours * 12)) * 5;
    hours += 7;
    var dt = getDate(hours, minutes) ;
    //$("#time").html(getDate(hours, minutes).toString());
    var displayHours = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
    var displayMinutes = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
    $("#time").html(displayHours + ":"+ displayMinutes) ;
    var charts = averageCharts;
    averageCharts.highlightTime(getDate(hours, minutes));
  }