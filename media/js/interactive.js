function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin === -1) {
        begin = dc.indexOf(prefix);
        if (begin !== 0) {
            return null;
        }
    } else {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end === -1) {
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
}

function setCookie(name, value, expires, path, domain, secure) {
    document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}


function storeData(name, value, expires, path, domain, secure) {
    if (window.localStorage) {
        localStorage[name] = value;
    } else {
        setCookie(name, value, expires, path, domain, secure);
    }
}

function retrieveData(name) {
    if (window.localStorage) {
        return localStorage.getItem(name);
    } else {
        return getCookie(name);
    }
}

function disableScrolling(evt) {
    if (evt.target.className !== "inset active" &&
        evt.target.parentElement.className !== "ui-btn-inner" &&
            evt.target.nodeName !== "P") {
        evt.preventDefault();
    }
}

function handleOverlay(name) {
    var cookieName = name + "-help-viewed";
    var data = retrieveData(cookieName);
    if (data === "true") {
        jQuery("div.ui-overlay").hide();
    }
    jQuery("div.ui-overlay").bind("tap", function() {
        jQuery("div.ui-overlay").hide();
        storeData(cookieName, "true");
     });
}

function initInteractive(name) {
    document.addEventListener('touchstart', disableScrolling, false);
    document.addEventListener('touchmove', disableScrolling, false);
    
    jQuery("img").on('dragstart', function(event) {
        event.preventDefault();
        return false;
    });
    
    handleOverlay(name);
}

var gOrientation = undefined;

function orientationLabel() {                    
    var rotation = window.hasOwnProperty("orientation") ?
        window.orientation : 90;
    
    return (rotation == 0 || rotation == 180) ?
            "portrait" : "landscape";
}

function orientView(orientation) {
    jQuery("#base-content").fadeOut(0, function() {
        jQuery.mobile.showPageLoadingMsg();                                            
        jQuery("div.pageview").removeClass(gOrientation).addClass(orientation);
        jQuery("div.ui-content").removeClass(gOrientation).addClass(orientation);
        gOrientation = orientation;
        jQuery("#base-content").fadeIn(function() {
            jQuery.mobile.hidePageLoadingMsg();    
        });                        
    });
}

jQuery(document).on("pageinit", function (event) {                    
    gOrientation = orientationLabel();
    orientView(gOrientation);

    jQuery(window).bind("orientationchange", function (e, ui) {
        orientView(e.orientation);
    });
});
