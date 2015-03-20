/* global d3: false */
/* global module: false */
/* global define: false */
/* global $: false */
var eclipseAnimation = function(slider) {
    'use strict';

    var $moon = $(".moon");
    var $eclipse = $(".eclipse");
    var eclipseWidth = $eclipse.width();

    var MOVES = 36;
    console.log(eclipseWidth/2)
    var sunPosition = $(".sun").position().left;
    var INITIAL_POS = sunPosition - 60;
    var FINAL_POS = sunPosition + 50;
    console.log(INITIAL_POS, FINAL_POS)
    var START_ECLIPSE_STEP = 12;
    var END_ECLIPSE_STEP = 48;
    var sliderValue = 0;
    var EXECUTION_TIME = 18000;

    $moon.css({"left": INITIAL_POS});
    var step = (FINAL_POS - INITIAL_POS)/MOVES;
    var skyColors = {
        12: ["#90dffe", "#38a3d1"],
        13: ["#7EC3DE", "#318FB7"],
        14: ["#6CA7BF","#2A7A9D"],
        15: ["#5A8B9F","#236683"],
        16: ["#48707F","#1C5269"],
        17: ["#36545F","#153D4E"],
        18: ["#243840","#0E2934"],
        19: ["#121C20","#07141A"],
        20: ["#000000","#000000"],
        21: ["#121C20","#07141A"],
        22: ["#243840","#0E2934"],
        23: ["#36545F","#153D4E"],
        24: ["#5A8B9F","#1C5269"],
        25: ["#6CA7BF","#236683"],
        26: ["#7EC3DE","#2A7A9D"],
        27: ["#80C6E2", "#318FB7"],
        28: ["#90dffe", "#38a3d1"]
    };

    var animateEclipse = function(value) {
        if(moonShouldMove(value)){
            value = value - START_ECLIPSE_STEP;
            var pos = INITIAL_POS + (step * value);
            moveMoonWithAnimation(pos, value, undefined);
        }
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
    var moveMoonWithAnimation = function(pos, value, duration) {
        duration = duration || 100;
        $moon.animate({
            left: pos
        },
        {
            easing: "linear",
            duration: duration,
            step: function( now, fx ) {
                if (now >= sunPosition -50 && now <= sunPosition + 100){
                    var v;
                    if(value === undefined){
                        v = 20+Math.round(((now-sunPosition)/50)/0.125);
                    }
                    else{
                        v = value;
                    }
                    var colors = skyColors[v];
                    if(colors){
                        $eclipse.css({"background": "linear-gradient(to bottom, "+colors[0]+" 0%,"+colors[1]+" 100%)"});
                        $moon.css({"background": "linear-gradient(to bottom, "+colors[0]+" -50%,"+colors[1]+" 125%)"});
                    }
                }
                else{
                    resetColors();
                }
            }
        });
    };

    var moonShouldMove = function(s){
        return s >= START_ECLIPSE_STEP && s<=END_ECLIPSE_STEP;
    }

    /**
     * reset colors
     */
    var resetColors = function(){
        $eclipse.css({"background": "linear-gradient(to bottom, #90dffe 0%,#38a3d1 100%)"});
        $moon.css({"background": "linear-gradient(to bottom, #90dffe -50%,#38a3d1 125%)"});
    }

    //NOT-USED
    //var createAnimation = function(){
    //    var rules = [];
    //    var percentageStep = Math.floor(100/moves);
    //    rules.push('@-webkit-keyframes earth-slider {');
    //    rules.push('0% {left: 50px;}');
    //    var pos = 50 + step;
    //    var percentage = 0;
    //    for(var i=0;i<moves; i++){
    //        percentage = percentage + percentageStep;
    //        pos = pos+step;
    //        rules.push(percentage+'% {left: '+pos+'px}');
    //    }
    //    rules.push('}');
    //    //$('body').addClass(rules.join(" "));
    //    console.log(rules.join(" "))
    //    $moon.css({'animation': 'earth-slider 10s'})
    //}

    //EVENTS
    $(slider).on('slide', function(event, ui) {
        sliderValue = ui.value;
        if(isPlaying && moonShouldMove(ui.value)){
            moveMoonWithAnimation(FINAL_POS, undefined, EXECUTION_TIME);
        }
        else{
            animateEclipse(ui.value);
        }
    });

    $("#play").click(function(){
        var $playIcon = $("#play-icon");
        if($playIcon.hasClass("glyphicon-play")){
            $moon.stop(true);
        }
        if($("#play-icon").hasClass("glyphicon-stop")){
            moveEclipse(0);
            resetColors();
            sliderValue = 0;
        }
        if(isPlaying && moonShouldMove(sliderValue)){
            moveMoonWithAnimation(FINAL_POS, undefined, EXECUTION_TIME);
        }
    });
};

// Modules shim
if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports =  eclipseAnimation;
}
else {
    // Register as a named AMD module
    if (typeof define === 'function' && define.amd) {
        define(['eclipseAnimation'], function() {
            return eclipseAnimation;
        });
    }
}
if (typeof window === 'object' && typeof window.document === 'object') {
    window.eclipseAnimation = eclipseAnimation;
}
