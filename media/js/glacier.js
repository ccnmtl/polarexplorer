var gEaseOut = 1000;
var gEaseIn = 1000;
var gCanvas;
var gWidth = 84;
var gHeight = 108;
var gSourceY = 270;

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 0);
        };
})();

var gSourceX = [
    200,
    210, /* red */
    210, /* orange */
    210, /* yellow */
    255, /* green */
    315, /* light blue */
    370, /* dark blue */
    390 /* pink */
];

function setCanvasAttributes() {
    jQuery(gCanvas).attr('width', jQuery('img.glacier').width());
    jQuery(gCanvas).attr('height', jQuery('img.glacier').height() + 50);

    var elt = jQuery('img.glacier.active')[0];
    jQuery(gCanvas).css({
        'top': jQuery(elt).css('top'),
        'left': jQuery(elt).css('left')
    });
}

function setWaterLevel(imgIdx, duration) {
    if (duration === undefined) {
        duration = 0;
    }

    var level = 80.5;
    var increment = 0.6 * imgIdx;
    if (orientationLabel() === 'landscape') {
        level = 77.5;
        increment = 1.1 * imgIdx;
    }

    var rise = level - increment;
    jQuery('img.water').animate({'top': rise + '%'},
                                duration,
                                'easeInSine');
}

var gContext;

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

    for (var i = 0; i < glaciers.length; i++) {
        var glacier = glaciers[i];

        if (glacier.opacity < 0) {
            jQuery(glacier.elt).hide();
        }

        if (glacier.x1 > glacier.x2) {
            glacier.x1 -= 0.3;
        }

        glacier.opacity += glacier.changeBy;
        if (glacier.opacity < 0) {
            glacier.opacity = 0;
            finished++;
        }

        if (glacier.opacity > 1) {
            glacier.opacity = 1;
            finished++;
        }

        drawGlacier(glacier.elt, glacier.x1, glacier.opacity);
    }
    crumbleFrame();

    if (finished !== glaciers.length) {
        // request new frame
        requestAnimFrame(function() {
            animateGlaciers(glaciers);
        });
    }
}

function swipeGlacier() {
    var elt = jQuery('img.glacier.active')[0];
    var imgIdx = parseInt(jQuery(elt).data('idx'), 10);
    var newIdx = (imgIdx + 1) % (gImageCount + 1);

    if (imgIdx < gImageCount && newIdx > 0) {
        var sourceX = gSourceX[imgIdx - 1];
        crumbleStart(elt, sourceX, orientationLabel());

        var left = parseInt(jQuery(elt).css('left'), 10);
        var newElt = jQuery('img.glacier[data-idx="' + newIdx + '"]')[0];
        var newLeft = parseInt(jQuery(newElt).css('left'), 10);
        var distance = 10;

        animateGlaciers([
            {
                'elt': elt,
                'x1': left,
                'x2': left - distance,
                'opacity': 1,
                'changeBy': -0.05
            },
            {
                'elt': newElt,
                'x1': newLeft,
                'x2': newLeft - distance,
                'opacity': 0,
                'changeBy': 0.02
            }]);

        jQuery(elt).removeClass('active');
        jQuery(newElt).addClass('active');
        jQuery(elt).css({'left': left - distance + 'px'});
        jQuery(newElt).css({'left': newLeft - distance + 'px'});

        var macroElt = jQuery('img.inset[data-idx="' + imgIdx + '"]')[0];
        var macroNewElt = jQuery('img.inset[data-idx="' + newIdx + '"]')[0];

        jQuery(macroNewElt).fadeIn(gEaseOut);
        jQuery(macroElt).fadeOut(gEaseIn);
        setWaterLevel(imgIdx, 1500);
    }
}

function reset(eltButton) {
    jQuery('img.glacier.active').animate({'opacity': 0},
        function() {
            // deactivate active
            jQuery(this).removeClass('active').hide();

            // all glacier's should have left: 10px;
            jQuery('img.glacier').css({'left': '10px'});

            // except glacier with data-idx='1'
            jQuery('img.glacier[data-idx="1"]')
               .addClass('active')
                .css({'left': '0px', 'opacity': 1});

            // hide all the insets & show the first one
            jQuery('img.inset').hide();
            jQuery('img.inset[data-idx="1"]').show();

            // reset water level
            setWaterLevel(0);
            setCanvasAttributes();

            var elt = jQuery('img.glacier.active')[0];
            drawGlacier(elt);

            if (eltButton) {
                jQuery(eltButton).removeClass('ui-btn-active');
            }
            jQuery.mobile.hidePageLoadingMsg();
        });
}

jQuery(document).on('pageinit', function(event) {
    initInteractive('glacier');

    gCanvas = jQuery('div.glacierview canvas')[0];
    setCanvasAttributes();

    crumbleInit(gCanvas, screenDescriptor(), gSourceY, gWidth, gHeight);

    jQuery('img.glacier, img.inset').swipeleft(function(event) {
        event.stopImmediatePropagation();
        swipeGlacier();
        return false;
    });

    jQuery('canvas').swipeleft(function(event) {
        event.stopImmediatePropagation();
        swipeGlacier();
        return false;
    });

    jQuery('#reset-button').click(function(event) {
        jQuery.mobile.showPageLoadingMsg();
        jQuery(this).addClass('ui-btn-active');
        event.preventDefault();
        reset(this);
        return false;
    });

    jQuery(window).bind('orientationchange', function(e, ui) {
        jQuery.mobile.showPageLoadingMsg();
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        var elt = jQuery('img.glacier.active')[0];
        var imgIdx = parseInt(jQuery(elt).data('idx'), 10);

        setWaterLevel(imgIdx - 1);
        setCanvasAttributes();
        drawGlacier(elt);

        jQuery.mobile.hidePageLoadingMsg();
    });
    reset();
});
