var gEaseOut = 1000;
var gEaseIn = 1600;
var ignoreChange = false;

function getWaterLevel(imgIdx) {
    if (imgIdx === undefined) {       
        var elt = jQuery("img.inset.active")[0];
        imgIdx = parseInt(jQuery(elt).data("idx"), 10);
    }
    var defaultLevel = 52;
    var increment = ((100 - defaultLevel) / (gImageCount - 1)) * (imgIdx - 1);            
    return 100 - (defaultLevel + increment);
}

function setWaterLevel(imgIdx, duration) {
    ignoreChange = true;
    jQuery("#water").attr("value", getWaterLevel(imgIdx));
    jQuery("#water").trigger("change");
    ignoreChange = false;
}

function swapImages(elt, newIdx) {
    var newElt = jQuery("img.inset[data-idx='" + newIdx + "']")[0];
    jQuery(newElt).addClass("active").fadeIn(gEaseOut);
    jQuery(elt).removeClass("active").fadeOut(gEaseIn);
}

function adjustMacroMap() {
    var value = jQuery("#water").attr("value");
    
    var elt = jQuery("img.inset.active")[0];
    imgIdx = parseInt(jQuery(elt).data("idx"), 10);
    var currentRise = getWaterLevel(imgIdx);
    
    if (value < currentRise && imgIdx > 1) {
        var newIdx = imgIdx - 1;
        swapImages(elt, newIdx);
    } else if (value > currentRise) {
        var newIdx = (imgIdx + 1) % (gImageCount + 1);
        if (imgIdx < gImageCount && newIdx > 0) {
            var nextRise = getWaterLevel(newIdx);
            if (value >= nextRise) {
                swapImages(elt, newIdx);
            }
        }
    }
}

jQuery(document).on("pageinit", function (event) {
    initInteractive("water");
    
    jQuery("#water").verticalslider();
    setWaterLevel(1);
    
    jQuery("#water").bind("change", function() {
        //if (!ignoreChange) {
        //    adjustMacroMap();
        //}
    });
    
    jQuery("img.inset").click(function(event) {
        event.preventDefault();
        var elt = jQuery("img.inset.active")[0];
        imgIdx = parseInt(jQuery(elt).data("idx"), 10);
        
        var newIdx = (imgIdx + 1) % (gImageCount + 1);
        
        if (imgIdx < gImageCount && newIdx > 0) {
            var newElt = jQuery("img.inset[data-idx='" + newIdx + "']")[0];
            jQuery(newElt).addClass("active").fadeIn(gEaseOut);
            jQuery(elt).removeClass("active").fadeOut(gEaseIn);
            setWaterLevel(newIdx, gEaseIn);
        }
        return false;
    });
    
    jQuery(window).bind("orientationchange", function (e, ui) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        setWaterLevel();             
    });
    
    jQuery("#reset").click(function() {
        jQuery("img.inset").hide().removeClass("active");
        jQuery("img.inset[data-idx='1']").addClass("active").show();
        setWaterLevel(1);
    });
});
