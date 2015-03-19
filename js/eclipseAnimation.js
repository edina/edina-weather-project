/* global d3: false */
/* global module: false */
/* global define: false */
/* global $: false */
var eclipseAnimation = function(moves, slider) {
    'use strict';

    var $moon = $(".moon");
    var $eclipse = $(".eclipse");
    var eclipseWidth = $eclipse.width();
    var INITIAL_POS = eclipseWidth/2 - 80;
    var FINAL_POS = eclipseWidth/2 + 50;
    //console.log(INITIAL_POS, FINAL_POS)
    var sunPosition = $(".sun").position().left;
    $moon.css({"left": INITIAL_POS});
    var step = Math.floor((FINAL_POS - INITIAL_POS)/moves);
    var skyColors = {
        20: ["#90dffe", "#38a3d1"],
        30: ["#6CA7BF","#59BBE5"],
        40: ["#48707F","#1C5269"],
        50: ["#243840","#0E2934"],
        60: ["#000000","#000000"],
        70: ["#243840","#0E2934"],
        80: ["#48707F","#1C5269"],
        90: ["#48707F","#1C5269"],
        100: ["#90dffe", "#38a3d1"]
    };

    var animateEclipse = function(value) {
        var s = INITIAL_POS + (step * value);
        moveMoonWithAnimation(s);
    };

    /**
     * move eclipse without animation
     * @param value {Number} step
     */
    var moveEclipse = function(value){
        var s = INITIAL_POS + (step * value);
        $moon.css({"left": s});
    };

    /**
     * move eclipse with animation
     * @param pos {Number} x position in px
     * @param duration {Number} duration in ms
     */
    var moveMoonWithAnimation = function(pos, duration) {
        duration = duration || 500;
        pos = pos || FINAL_POS;
        //console.log(duration)
        $moon.animate({
            left: pos
        },
        {
            easing: "linear",
            duration: duration,
            step: $.proxy(function( now, fx ) {
                if (now >= sunPosition -50 && now <= sunPosition + 100){
                    var n = Math.round((50+sunPosition-now)/10)*10;
                    var colors = skyColors[n];
                    if(colors){
                        $eclipse.css({"background": "linear-gradient(to bottom, "+colors[0]+" 0%,"+colors[1]+" 100%)"});
                        $moon.css({"background": "linear-gradient(to bottom, "+colors[0]+" -50%,"+colors[1]+" 125%)"});
                    }
                }
                else{
                    resetColors();
                }
            }, this)
        });
    };

    /**
     * reset colors
     */
    var resetColors = function(){
        $eclipse.css({"background": "linear-gradient(to bottom, #90dffe 0%,#38a3d1 100%)"});
        $moon.css({"background": "linear-gradient(to bottom, #90dffe -50%,#38a3d1 125%)"});
    }

    //NOT-USED
    var createAnimation = function(){
        var rules = [];
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
        $moon.css({'animation': 'earth-slider 10s'})
    }

    //EVENTS
    $(slider).on('slide', function(event, ui) {
        if(isPlaying){
            moveMoonWithAnimation(FINAL_POS, 21422);
        }
        else{
            animateEclipse(ui.value);
        }
    });

    $("#stop").click(function(){
        $moon.stop(true);
    });
    $("#play").click(function(){
        moveEclipse(0);
        resetColors();
        moveMoonWithAnimation(FINAL_POS, 21422);
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
