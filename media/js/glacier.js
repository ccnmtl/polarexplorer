var gEaseOut = 1000;
var gEaseIn = 1800;
var gCanvas;

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
  })();

function setCanvasAttributes() {
    jQuery(gCanvas).attr("width", jQuery("img.glacier").width());
    jQuery(gCanvas).attr("height", jQuery("img.glacier").height());
    
    var elt = jQuery("img.glacier.active")[0];
    jQuery(gCanvas).css({
        "top": jQuery(elt).css("top"),
        "left": jQuery(elt).css("left")
    });
}

function setWaterLevel(imgIdx, duration) {
    if (duration === undefined) {
        duration = 0;
    }
    
    var level = 80;
    var increment = .95 * imgIdx;            
    if (getOrientationLabel() == "landscape") {
        level = 78;
        increment = 2 * imgIdx;
    }

    var rise = level - increment;
    jQuery("img.water").animate({"top": rise + "%"},
                                duration,
                                "easeInSine");
}

function drawGlacier(elt, x, opacity) {
    if (x === undefined) {
        x = 0;
    }
    if (opacity === undefined) {
        opacity = 1;
    }
    
    gContext = gCanvas.getContext('2d');
    
    gContext.save();
    gContext.globalAlpha = opacity;
    gContext.drawImage(elt, x, 0, jQuery(elt).width(), jQuery(elt).height());
    gContext.restore();
}

function animateGlaciers(glaciers) {
    var finished = 0;
    
    // clear
    gContext.clearRect(0, 0, gCanvas.width, gCanvas.height);
    
    for (var i=0; i < glaciers.length; i++) {
        var glacier = glaciers[i];
        
        if (glacier.opacity < 0) {
            jQuery(glacier.elt).hide();
        }
        
        if (glacier.x1 > glacier.x2) {
            glacier.x1 -= .2;
        } else {
            jQuery(glacier.elt).css({"left": glacier.x2 + "px"});
        }
        
        glacier.opacity += glacier.changeBy;
        if (glacier.opacity < 0) {
            glacier.opacity = 0;
            finished++;
        } else if (glacier.opacity > 1) {
            glacier.opacity = 1;
            finished++;
        }
        
        drawGlacier(glacier.elt, glacier.x1, glacier.opacity);
    }
    
    if (finished === glaciers.length) {
        return;
    } else {    
        // request new frame
        requestAnimFrame(function() {
            animateGlaciers(glaciers);
        });
    }
}

function swipeGlacier() {
    var elt = jQuery("img.glacier.active")[0];
    var imgIdx = parseInt(jQuery(elt).data("idx"), 10);
    var newIdx = (imgIdx + 1) % (gImageCount + 1);
    
    if (imgIdx < gImageCount && newIdx > 0) {
        crumble(elt, 200, 260);
        setTimeout(function() {
            var left = parseInt(jQuery(elt).css("left"), 10);
            var newElt = jQuery("img.glacier[data-idx='" + newIdx + "']")[0];
            var newLeft = parseInt(jQuery(newElt).css("left"), 10);

            animateGlaciers([
                { "elt": elt,
                  "x1": left,
                  "x2": left - 10,
                  "opacity": 1,
                  "changeBy": -0.03},
                { "elt": newElt,
                  "x1": newLeft,
                  "x2": newLeft - 10,
                  "opacity": 0,
                  "changeBy": 0.01}]);
            
            jQuery(elt).removeClass("active");
            jQuery(newElt).addClass("active");
            
            var macroElt = jQuery("img.inset[data-idx='" + imgIdx + "']")[0];
            var macroNewElt = jQuery("img.inset[data-idx='" + newIdx + "']")[0];
            
            jQuery(macroNewElt).fadeIn(gEaseOut);
            jQuery(macroElt).fadeOut(gEaseIn);
            setWaterLevel(imgIdx, gEaseIn);
        }, 1200);
    }    
}


function reset() {
    jQuery("img.glacier.active").animate({'opacity': 0},
        function() {
            // deactivate active
            jQuery(this).removeClass("active").hide();
            
            // all glacier's should have left: 10px;
            jQuery("img.glacier").css({"left": "10px"});
            
            // except glacier with data-idx='1'
            jQuery("img.glacier[data-idx='1']")
               .addClass("active")
               .show()
               .css({"left": "0px", "opacity": 1});                           
            
            // hide all the insets & show the first one
            jQuery("img.inset").hide();
            jQuery("img.inset[data-idx='1']").show();
            
            // reset water level
            setWaterLevel(0);
            setCanvasAttributes();
            
            var elt = jQuery("img.glacier.active")[0];
            drawGlacier(elt);
    });
}

jQuery(document).on("pageinit", function (event) {
    initInteractive("glacier");
    
    gCanvas = jQuery("div.glacierview canvas")[0];    
    setCanvasAttributes();
    initExplosion(gCanvas);

    jQuery("img.glacier, img.inset").swipeleft(function(event) {
        event.stopImmediatePropagation();
        swipeGlacier();                
        return false;
    });
    
    jQuery("canvas").swipeleft(function(event) {
        event.stopImmediatePropagation();
        swipeGlacier();                
        return false;
    });
    
    jQuery("#reset-button").click(function(event) {
        event.preventDefault();
        reset();
        return false;
    });
    
    jQuery(window).bind("orientationchange", function (e, ui) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        var elt = jQuery("img.glacier.active")[0];
        imgIdx = parseInt(jQuery(elt).data("idx"), 10);
        
        setWaterLevel(imgIdx - 1);
        setCanvasAttributes();
        
        var elt = jQuery("img.glacier.active")[0];
        drawGlacier(elt);

    });
    
    var elt = jQuery("img.glacier[data-idx='1']")[0];
    drawGlacier(elt);
});
