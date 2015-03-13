(function() {
  var slider = $('#slider');
  // Play button and loop controls
  var isPlaying = false;
  var loop = $("#loop");
  var sliderPlayback = null;
  $("#play").on('click', function(btn) {
    if ( isPlaying ) {
      return;
    }

    isPlaying = true;
    var i = 0;
    sliderPlayback = window.setInterval(function() {

      slider.slider("value", i);
      slider.trigger( 'slide', { value: i } );
      i++;

      if ( i === slider.slider( 'option', 'max' ) + 1 ) {
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
  $("#stop").on('click', function(btn) {
    if ( sliderPlayback != null ) {
      window.clearInterval(sliderPlayback);
    }
    isPlaying = false;
  });
})();
