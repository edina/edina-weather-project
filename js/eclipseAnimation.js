/* global d3: false */
/* global module: false */
/* global define: false */
/* global $: false */
var eclipseAnimation = function(moves, slider) {
    'use strict';

    var eclipseWidth = $(".eclipse").width();
    var step = Math.floor((eclipseWidth - 100)/moves);

    var animateEclipse = function(value) {
        var s = 50 + (step * value);
        moveEarth(s);
    }

    var moveEarth = function(pos, duration) {
        duration = duration || 500;
        console.log(duration)
        $(".earth").animate({
            left: pos
        },
        {
            easing: "linear",
            duration: duration
        });
    }

    //$("#animate").click(function(){
    //    $(".earth").addClass("earth-animate");
    //});
    var createAnimation = function(){
        var rules = [];
        
        console.log(eclipseWidth)
        console.log((eclipseWidth - 100)/moves)
        var percentageStep = Math.floor(100/moves);
        rules.push('@-webkit-keyframes earth-slider {');
        rules.push('0% {left: 50px;}');
        var pos = 50 + step;
        var percentage = 0;
        for(var i=0;i<moves; i++){
            percentage = percentage + percentageStep;
            pos = pos+step;
            rules.push(percentage+'% {left: '+pos+'px}');
        }
        rules.push('}');
        //$('body').addClass(rules.join(" "));
        console.log(rules.join(" "))
        $('.earth').css({'animation': 'earth-slider 10s'})
    }

    $(slider).on('slide', function(event, ui) {
        var pos = eclipseWidth - 50;
        if(isPlaying){
            moveEarth(pos, 21422);
        }
        else{
            animateEclipse(ui.value);
        }
    });
};

// Modules shim
if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports =  eclipseShadow;
}
else {
    // Register as a named AMD module
    if (typeof define === 'function' && define.amd) {
        define(['eclipseShadow'], function() {
            return eclipseAnimation;
        });
    }
}
if (typeof window === 'object' && typeof window.document === 'object') {
    window.eclipseAnimation = eclipseAnimation;
}
