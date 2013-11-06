var gEaseOut = 1000;
var gEaseIn = 1800;

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();


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

function swipeGlacier() {
    var elt = jQuery("img.glacier.active")[0];
    var imgIdx = parseInt(jQuery(elt).data("idx"), 10);
    var newIdx = (imgIdx + 1) % (gImageCount + 1);
    
    if (imgIdx < gImageCount && newIdx > 0) {
        explode(150, 150);

        var newElt = jQuery("img.glacier[data-idx='" + newIdx + "']")[0];
        
        var left = parseInt(jQuery(elt).css("left"), 10);
        var newLeft = parseInt(jQuery(newElt).css("left"), 10);
        
        jQuery(newElt).show();
        jQuery(newElt).css({"left": (newLeft - 10) + "px"});
        
        jQuery(elt).removeClass("active");
        jQuery(newElt).addClass("active");
        
        jQuery(elt).animate(
            {"left": (left - 10) + "px",
             "opacity": 0,
             "clip": "rect(0px,0px,0px,0px)"},
            gEaseOut,
            "easeInSine",
            function() {
                jQuery(elt).hide();
                
            });
        jQuery(newElt).animate({
            "opacity": 1},
            gEaseIn,
            "easeInSine",
            function() {});
        
        var macroElt = jQuery("img.inset[data-idx='" + imgIdx + "']")[0];
        var macroNewElt = jQuery("img.inset[data-idx='" + newIdx + "']")[0];
        
        jQuery(macroNewElt).fadeIn(gEaseOut);
        jQuery(macroElt).fadeOut(gEaseIn);
        setWaterLevel(imgIdx, gEaseIn)
        
        var left = parseInt(jQuery("canvas.explosion").css("left"), 10);
        jQuery("canvas.explosion").css({"left": left + (imgIdx * 5)});
    }
}

function drawGlacier(imgIdx, context) {
    var elt = jQuery("img.glacier[data-idx='" + imgIdx + "']");
    context.drawImage(img, 0, 0);
}

function animate(imgIdx, canvas, context, startTime) {
  // update
  var time = (new Date()).getTime() - startTime;

  var linearSpeed = 100;
  // pixels / second
  var newX = linearSpeed * time / 1000;

  if(newX < canvas.width - myRectangle.width - myRectangle.borderWidth / 2) {
    myRectangle.x = newX;
  }

  // clear
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawRectangle(myRectangle, context);

  // request new frame
  requestAnimFrame(function() {
    animate(myRectangle, canvas, context, startTime);
  });
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
    });
}

jQuery(document).on("pageinit", function (event) {
    initInteractive("glacier");
    
    //initExplosion(jQuery("#glacier-chunk")[0],
    //              jQuery("canvas.explosion")[0]);

    jQuery("img.glacier, img.inset").swipeleft(function(event) {
        event.stopImmediatePropagation();
        swipeGlacier();                
        return false;
    });
    
    jQuery("canvas").swipeleft(function(event) {
        event.stopImmediatePropagation();
        animateGlacier();                
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
    });
    
    drawGlacier(1);
});
