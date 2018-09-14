function getCurrentDomain() {var index=location.hostname.indexOf("."); if (index==-1) return location.hostname; return location.hostname.substring(index, location.hostname.length);}

function getCookieData() {
    if (jQuery.cookie("cookie_message") == "false" && jQuery.cookie("cookie_aceptacion") == "true") {
        ocultarcapa("acookie");
    }

    $(document).click(function (e) {
        if ($(e.target).closest("#acookie").length > 0) {
            jQuery.removeCookie('cookie_aceptacion');
        } 
        else if($(e.target).closest("#intrusivo").length) {
            jQuery.removeCookie('cookie_aceptacion');
        } else {
            if ($(e.target).closest('a').length) {
               dontShowCookieMsg()
            }
            if ($(e.target).closest('input').length) {
               dontShowCookieMsg()
            }
        }
    });
};

function dontShowCookieMsg() {
    jQuery.cookie('cookie_aceptacion', 'true', {expires: 180,path: '/',domain: getCurrentDomain(), secure:true});
    jQuery.cookie('cookie_message', 'false', {expires: 180,path: '/',domain: getCurrentDomain(), secure:true});
    ocultarcapa("acookie");
}
;
