var gOrientation;

function orientationLabel() {
    var rotation = window.hasOwnProperty('orientation') ?
        window.orientation : 90;

    return (rotation === 0 || rotation === 180) ?
        'portrait' : 'landscape';
}

function orientView(orientation) {
    jQuery('#base-content').fadeOut(0, function() {
        jQuery.mobile.showPageLoadingMsg();
        jQuery('div.pageview').removeClass(gOrientation).addClass(orientation);
        jQuery('div.ui-content')
            .removeClass(gOrientation)
            .addClass(orientation);
        gOrientation = orientation;
        jQuery('#base-content').fadeIn(function() {
            jQuery.mobile.hidePageLoadingMsg();
        });
    });
    if (orientation === 'landscape') {
        jQuery('div.isostaticrebound-content').show();
        jQuery('div.irview-padding').show();
        jQuery('div.ui-overlay').hide();
    } else {
        jQuery('div.ui-overlay').show();
        jQuery('div.isostaticrebound-content').hide();
        jQuery('div.irview-padding').hide();
    }
}

jQuery(document).on('pageinit', function(event) {
    gOrientation = orientationLabel();
    orientView(gOrientation);

    jQuery(window).bind('orientationchange', function(e, ui) {
        orientView(e.orientation);
    });
});

$(window).load(function() {
    jQuery('.ir-loading').fadeOut(10);
});
