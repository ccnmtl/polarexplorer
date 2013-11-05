var ignoreChange = false;
var gDefaultLevel = 52;
var sliderLabel =
    '<span class="ui-btn-inner">' + 
    '    <span class="ui-icon ui-icon-arrow-u ui-icon-shadow">&nbsp;</span>' +
    '    <span class="ui-btn-text">Sea Level</span>' +
    '</span>'

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
    imgIdx = parseInt(imgIdx, 10);
    return imgIdx < 1 ? 1 : imgIdx;
}

function setWaterLevel(imgIdx) {
    ignoreChange = true;
    jQuery("#water").attr("value", getWaterLevel(imgIdx));
    jQuery("#water").trigger("change");
    ignoreChange = false;
}

function swapImages(elt, newIdx) {
    var newElt = jQuery("img.inset[data-idx='" + newIdx + "']")[0];
    jQuery(newElt).addClass("active").fadeIn(0, function() {
        jQuery(elt).removeClass("active").fadeOut(0);    
    });
    
    var textElt = jQuery("div.waterview span.ui-btn-text")[0];
    if (newIdx === 1) {
        jQuery(textElt).html("Sea Level");
    } else if (newIdx == gImageCount) {
        jQuery(textElt).html("24 Feet");
    } else {
        jQuery(textElt).html("");
    }
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

    jQuery("a.ui-slider-vertical-handle").html(sliderLabel);
    
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
            swapImages(elt, newIdx)
            setWaterLevel(newIdx);
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
