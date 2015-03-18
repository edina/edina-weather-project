/* global d3: false */
/* global module: false */
/* global define: false */
/* global $: false */
var eclipseAnimation = function(moves, slider) {
    'use strict';

    var eclipseWidth = $(".eclipse").width();
    var step = Math.floor(150/moves);
    var colors = {
        0: "#59BBE5",
        10: "#3B7D99",
        20: "#357089",
        30: "#1E3E4C",
        40: "#000000",
        50: "#1E3E4C",
        60: "#357089",
        70: "#59BBE5"
    }

    var animateEclipse = function(value) {
        var s = eclipseWidth/2 - 75 + (step * value);
        moveMoon(s);
    }

    var moveMoon = function(pos, duration) {
        duration = duration || 500;
        //console.log(duration)
        $(".moon").animate({
            left: pos
        },
        {
            easing: "linear",
            duration: duration,
            step: function( now, fx ) {
                if (now >= eclipseWidth/2 - 50 && now <= eclipseWidth/2 + 25){
                    //console.log(eclipseWidth/2-now+25)
                    var n = Math.round((eclipseWidth/2-now+25)/10)*10;
                    var color = colors[n];
                    $('.eclipse').css({"background-color": color});
                    $('.moon').css({"background-color": color});
                }
                else{
                    $('.eclipse').css({"background-color": "#59BBE5"});
                }
            },
            progress: function(animation, progress, remainingMs){
                //console.log(progress)
            }
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
        $('.moon').css({'animation': 'earth-slider 10s'})
    }

    $(slider).on('slide', function(event, ui) {
        var pos = eclipseWidth/2 + 75;
        if(isPlaying){
            moveMoon(pos, 21422);
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
