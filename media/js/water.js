var gEaseOut = 100;
var gEaseIn = 100;
var ignoreChange = false;
var gDefaultLevel = 52;

function getWaterLevel(imgIdx) {
    if (imgIdx === undefined) {       
        var elt = jQuery("img.inset.active")[0];
        imgIdx = parseInt(jQuery(elt).data("idx"), 10);
    }
    var increment = ((100 - gDefaultLevel) / (gImageCount - 1)) * (imgIdx - 1);            
    return 100 - (gDefaultLevel + increment);
}

function getImageIndex(value) {
    imgIdx = (((value - 100) * -1) - gDefaultLevel) / ((100 - gDefaultLevel) / (gImageCount - 1)) + 1;
    console.log("Image Idx: " + imgIdx);
    
    return imgIdx < 1 ? 1 : imgIdx;
}

function setWaterLevel(imgIdx, duration) {
    ignoreChange = true;
    jQuery("#water").attr("value", getWaterLevel(imgIdx));
    jQuery("#water").trigger("change");
    ignoreChange = false;
}

function swapImages(elt, newIdx) {
    var newElt = jQuery("img.inset[data-idx='" + newIdx + "']")[0];
    jQuery(newElt).addClass("active").fadeIn(gEaseOut, function() {
        jQuery(elt).removeClass("active").fadeOut(gEaseIn);    
    });
    
}

function adjustMacroMap() {
    var newIdx = getImageIndex(jQuery("#water").attr("value"));
    
    var elt = jQuery("img.inset.active")[0];
    imgIdx = parseInt(jQuery(elt).data("idx"), 10);
    
    if (newIdx !== imgIdx) {
        swapImages(elt, newIdx);
    }
}

jQuery(document).on("pageinit", function (event) {
    initInteractive("water");
    
    jQuery("#water").verticalslider();
    setWaterLevel(1);
    
    jQuery("#water").bind("change", function() {
        if (!ignoreChange) {
            adjustMacroMap();
        }
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
