(function() {
  var slider = $('#slider');
  // Play button and loop controls
  isPlaying = false;
  var loop = $("#loop");
  var sliderPlayback = null;
  $("#play").on('click', function(btn) {
    if ( isPlaying ) {
    $('#play-icon').removeClass('glyphicon-stop');
    $('#play-icon').addClass('glyphicon-play');
      window.clearInterval(sliderPlayback);
      isPlaying = false;
      return;
    }

    isPlaying = true;
    $('#play-icon').removeClass('glyphicon-play');
    $('#play-icon').addClass('glyphicon-stop');
    var i = 0;
    sliderPlayback = window.setInterval(function() {

      slider.slider("value", i);
      slider.trigger( 'slide', { value: i } );
      i++;

      if ( i === slider.slider( 'option', 'max' ) + 1 ) {
        window.clearInterval( sliderPlayback );
        isPlaying = false;
        $('#play-icon').removeClass('glyphicon-stop');
        $('#play-icon').addClass('glyphicon-play');
      }
    }, 500);
  });
})();
