function setTime(value) {
  var hours = Math.floor(value/6);
  var minutes = (value - (hours * 6)) * 10;
  hours += 8;
  if(minutes < 10) {
    minutes = "0" + minutes;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  $("#time").html(hours + ':' + minutes);
}
