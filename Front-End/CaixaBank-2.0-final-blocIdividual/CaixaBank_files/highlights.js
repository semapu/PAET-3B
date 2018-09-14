var slidingHighlights = [];
var scrollingHighlights = [];
var historyHighlights = [];
var favouriteHighlights = [];
var readyForRender = false;

var maxRenditions = 3;
var maxSubstitutions = 100;
var maxFavourites = 10;
var maxHistory = 2;
var favouritePageSize = 3,
	prefix_name_cookie = '';

var carrousel;

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

(function(window) {
	if (typeof site !== 'undefined' && site) {
		window.prefix_name_cookie = '_' + site;
	}
})(window);

// XMLHTTPRequest
function sendRequest(url,callback,postData) {
    var req = createXMLHTTPObject();
    if (!req) return;
    var method = (postData) ? "POST" : "GET";
    req.open(method,url,false); //synchronous
    //req.setRequestHeader('User-Agent','XMLHTTP/1.0');
    if (postData)
        req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    req.onreadystatechange = function () {
        if (req.readyState != 4) return;
        if (req.status != 200 && req.status != 304) {
            return;
        }
        callback(req);
    }
    if (req.readyState == 4) return;
    req.send(postData);
}

var XMLHttpFactories = [
    function () {return new XMLHttpRequest()},
    function () {return new ActiveXObject("Msxml2.XMLHTTP")},
    function () {return new ActiveXObject("Msxml3.XMLHTTP")},
    function () {return new ActiveXObject("Microsoft.XMLHTTP")}
];

function createXMLHTTPObject() {
    var xmlhttp = false;
    for (var i=0;i<XMLHttpFactories.length;i++) {
        try {
            xmlhttp = XMLHttpFactories[i]();
        }
        catch (e) {
            continue;
        }
        break;
    }
    return xmlhttp;
}

// end XMLHTTPRequest

function createCookie(name,value,days) {
	var date = new Date();
	if (days) {
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else {
		date.setTime(date.getTime() + (30*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}

	name = name.indexOf(prefix_name_cookie) !== -1 ? name : name.concat(prefix_name_cookie);

	document.cookie = name+"=" + value + expires+"; path=/ ;secure;";
}

function readCookie(name) {
	name = name.indexOf(prefix_name_cookie) !== -1 ? name : name.concat(prefix_name_cookie);
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}


function addJSONObjects(targetArray, objectsJSON) {
	try{
		var objs = eval('(' + objectsJSON + ')');
		if (objs && objs.length>0){
			for(var i=0 ; i<objs.length; i++){
			    targetArray.push(objs[i]);
			}
		}
	} catch(e) {

	}
}

function getHighlightsFromCookie(cookieName){
	var highlightsJSON = readCookie(cookieName);
	var highlights = [];
	addJSONObjects(highlights, highlightsJSON);
	return highlights;
}

function getConfigFromCookie(){
	var configJSON = readCookie('lcconfigcookie');
	
	try {
		var config = eval('(' + configJSON + ')');
	} catch (e) {
		return ({});
	}
	return config;
}

function saveConfigInCookie(config){
	var configJSON = '{',
		sep = '';
	
	if (config.socialNetwork){
		configJSON +='"socialNetwork":"' + config.socialNetwork + '"';
		sep=',';
	}
	if (config.socialNetworkName){
		configJSON += sep + '"socialNetworkName":"' + config.socialNetworkName.clean() + '"';
		sep=',';
	}
	if (config.theme){
		configJSON += sep + '"theme":"' + config.theme + '"';
		sep=',';
	}
	if (config.themebg){
		configJSON += sep + '"themebg":"' + config.themebg + '"';
		sep=',';
	}
	if (config.themeName){
		configJSON += sep + '"themeName":"' + config.themeName + '"'; 
	}
	configJSON += '}';
	createCookie('lcconfigcookie',configJSON);
	return config;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function updateConfig(){
    // get config from cookie
    var config = getConfigFromCookie();
    if (config){
        if (config.socialNetwork){
            $('input[name=user_red]').prop('checked',false);
            $('input#user_red_' + config.socialNetwork).prop('checked',true);
        } else {
        	$('input[name=user_red]').prop('checked',false);
            $('input#user_red_none').prop('checked',true);
        }
        
        if (config.theme){
        	$('a.'+config.theme+' img').css("outline", "1px solid #414141");
        }
    }else {
    	$('input[name=user_red]').prop('checked',false);
        $('input#user_red_none').prop('checked',true);
    }
}

function applyBackground(src){
	$('#fondo').css("background-image",'url('+src+')' );
	$('#fondo').css("filter",'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='+src+', sizingMethod="scale")');
}

function applyConfig(pageLoad){
    var config = getConfigFromCookie();
    if (config){
        if (config.socialNetwork){
        	
        	if (pageLoad && config && config.socialNetworkName) {
            	if (typeof o != 'undefined') o.favsn = omnitureVariable + ':rs:'+config.socialNetworkName;
            	if (typeof o != 'undefined') o.favsnProcessed = true;
                if (typeof o != 'undefined') o.homeLoaded();
            }
        	
            if ((typeof socialViews != 'undefined') && (typeof socialViews[config.socialNetwork] != 'undefined')) {
            	socialViews[config.socialNetwork].open(true, {scroll: pageLoad});
            }
        }
        if (config.themebg){
			applyBackground(config.themebg);
        } 
    }
    else {
    	if (typeof o != 'undefined') o.favsnProcessed = true;
        if (typeof o != 'undefined') o.homeLoaded();
    }
}

$(document).ready(function(e){
	applyConfig(true);
});

// stub zone
/*
createCookie('lcfavouritescookie','[{"code": "K", "renditions": 0},{"code": "L", "renditions": 0},{"code": "M", "renditions": 0},{"code": "N", "renditions": 0}]');
createCookie('lchistorycookie','[{"code": "O", "renditions": 0},{"code": "P", "renditions": 0}]');
*/
// end stub zone
highlights = {};

highlights.increaseHighlightRenditions = function (highlightCode, cookieName){
	var cookieHighlights = getHighlightsFromCookie(cookieName);
	for(var i=0;i<cookieHighlights.length;i++){
		if (cookieHighlights[i].code==highlightCode){
			cookieHighlights[i].renditions++;
			/*if ((cookieHighlights[i].renditions==maxRenditions){
				cookieHighlights.remove(i,i);
				break;
			}*/
		}
	}
	highlights.storeHighlightsInCookie(cookieName, cookieHighlights);
}

highlights.getFavouriteCount = function (highlightCode){
	var favouriteHighlightsCodes = getHighlightsFromCookie('lcfavouritescookie');
	return favouriteHighlightsCodes.length;
}

highlights.addFavouriteFromExternal = function (highlightCode){
	if (highlights.getFavouriteCount()<maxFavourites){
		highlights.addHighlight(highlightCode, 'lcfavouritescookie', 'ext');
		} else {
        alert('No se pudo adicionar el favorito porque el numero de favoritos se ha agotado.')
    }
    return false;
}

highlights.addFavourite = function (highlightCode, side){
	// add the favourite to the favourites list in memory and in the cookie
	if (highlights.getFavouriteCount()<maxFavourites){
        var added = false;
        for(var i=0; i<slidingHighlights.length;i++){
        	var highlight = slidingHighlights[i];
        	if (highlight.code==highlightCode){
        		favouriteHighlights.push(highlight);
        		added = true;
        		break;
        	}
        }
        if (!added){
        	for(var i=0; i<scrollingHighlights.length;i++){
        		var highlight = scrollingHighlights[i];
	        	if (highlight.code==highlightCode){
	        		favouriteHighlights.push(highlight);
	        		added = true;
	        		break;
	        	}
	        }
        }
        if (added){
        	highlights.addHighlight(highlightCode, 'lcfavouritescookie', side);
        	highlights.updateFavoritesStars();
        }
        return added;
    } else {
        alert('No se pudo adicionar el favorito porque el numero de favoritos se ha agotado.')
    }
    return false;
}

highlights.removeFavourite = function (highlightCode){
	var aux = getHighlightsFromCookie('lcfavouritescookie');
	
	if (favouriteHighlights.length > 0 || aux.length > 0) {
		aux = aux.concat(favouriteHighlights);
	    for(var i=0; i<aux.length;i++){
	    	if (aux[i].code==highlightCode){
	    		// remove from memory and from cookie
	        	favouriteHighlights.remove(i,i);
	        	highlights.removeHighlight(highlightCode, 'lcfavouritescookie');
	        	highlights.updateFavoritesStars();
	        	return true;
	        }
	    }
	}
	
    return false;
}

highlights.addHistoryHighlight = function (highlightCode){
	var cookieHighlights = getHighlightsFromCookie('lchistorycookie');
	var found = false;
	for(var i=0;i<cookieHighlights.length;i++){
		if (cookieHighlights[i].code==highlightCode){
			found=true;
			cookieHighlights.remove(i,i);
			cookieHighlights.push({code: highlightCode, renditions: 0, pos:'hist'});
			break;
		}
	}
	if (!found){
		if (cookieHighlights.length==maxHistory){
			cookieHighlights.remove(0,0);
		}
		cookieHighlights.push({code: highlightCode, renditions: 0, pos:'hist'});
	}
	highlights.storeHighlightsInCookie('lchistorycookie', cookieHighlights);
}

highlights.addHighlight = function (highlightCode, cookieName, side){
	var cookieHighlights = getHighlightsFromCookie(cookieName);
	var found = false;
	for(var i=0;i<cookieHighlights.length;i++){
		if (cookieHighlights[i].code==highlightCode){
			cookieHighlights[i].renditions=0;
			found = true;
			break;
		}
	}
	if (!found){
		var newHighlight = {code: highlightCode, renditions: 0, pos: side};
		cookieHighlights.push(newHighlight);
	}
	highlights.storeHighlightsInCookie(cookieName, cookieHighlights);
}

highlights.updateFavoritesStars = function(){
	$('[id^=fav_]').removeClass('is-fav');
	var favouriteHighlightsCodes = getHighlightsFromCookie('lcfavouritescookie');

	$.each(favouriteHighlightsCodes ,function() {
		if($('#fav_' + this.code)){
			var fav = $('#fav_' + this.code);
			var oldTitle = fav.attr('title');
			var oldText = fav.text();
			fav.addClass('is-fav').attr('title', oldText).text(oldTitle);
		}
	});	
}

highlights.removeHighlight = function (highlightCode, cookieName){
	var cookieHighlights = getHighlightsFromCookie(cookieName);
	for(var i=0;i<cookieHighlights.length;i++){
		if (cookieHighlights[i].code==highlightCode){
			cookieHighlights.remove(i,i);
			break;
		}
	}
	highlights.storeHighlightsInCookie(cookieName, cookieHighlights);
}

highlights.storeHighlightsInCookie = function(cookieName, highlightsToStore){
	var highlightString = '[';
	$.each(highlightsToStore, function(idx,elem) {
		if (elem){
			highlightString += '{"code":"' + elem.code.clean() + '","renditions":"' + elem.renditions + '","pos":"' + elem.pos + '"}';
		}
		if (idx!=highlightsToStore.length-1){
			highlightString +=',';
		}
	});
	highlightString += ']';
	createCookie(cookieName, highlightString);
}


highlights.substituteHighlights = function (defaultHighlights, highlight, substitutedCodes, substitutedCategories, substitutionsPerformed) {
	for (var i = 0; i < defaultHighlights.length; i++){
		var defaultHighlight = defaultHighlights[i];
		if ((defaultHighlight.isReplaceable) && 
			(highlight.category == defaultHighlight.category)&&
			(highlight.code != defaultHighlight.code)&&
			($.inArray(defaultHighlight.code, substitutedCodes)==-1)){
			
			// substitute
			if (typeof neoPreviewContext != 'undefined' && neoPreviewContext) {
				console.log('Ignoring substitution of campaign ' + highlight.code);
			} else {
				defaultHighlights[i]=highlight;
				defaultHighlights[i].isReplaceable=true;
				substitutedCodes.push(highlight.code);
				substitutedCategories.push(highlight.category);
				substitutionsPerformed.push(highlight);
			}
			return true;
		}
	}
	return false;
}

highlights.fetchUserHighlights=function() {
	var favouriteHighlightsCodes = getHighlightsFromCookie('lcfavouritescookie');
	var historyHighlightsCodes = getHighlightsFromCookie('lchistorycookie');	
	
	// if there are user (favourited or history) highlights
	// async get info on this highlights from server
	if ((favouriteHighlightsCodes.length>0)||(historyHighlightsCodes.length>0)){
		// AJAX call
		sendRequest(neoCampaignCatalogUrl,function(data) {
			var fetchedHighlightsObj = typeof data.response !== 'undefined' ? eval('(' + data.response + ')') : eval('(' + data.responseText + ')');
		
			var fetchedHighlights = fetchedHighlightsObj.campaigns;
			for (var i=0; i<favouriteHighlightsCodes.length;i++){
				for (var j=0; j<fetchedHighlights.length;j++){
					if (favouriteHighlightsCodes[i].code == fetchedHighlights[j].code){
						fetchedHighlights[j].renditionsf = favouriteHighlightsCodes[i].renditions;
						if(typeof favouriteHighlightsCodes[i].side !== 'undefined'){
							fetchedHighlights[j].side = favouriteHighlightsCodes[i].side;
						}
						else{
							fetchedHighlights[j].side = 'na';
						}
						favouriteHighlights.push(fetchedHighlights[j]);
						break;  
					}
				}
			}

			for (var i=0; i<historyHighlightsCodes.length;i++){
				for (var j=0; j<fetchedHighlights.length;j++){
					if (historyHighlightsCodes[i].code == fetchedHighlights[j].code){
						fetchedHighlights[j].renditionsh = historyHighlightsCodes[i].renditions; 
						fetchedHighlights[j].side = 'hist';
						historyHighlights.push(fetchedHighlights[j]);
						break;  
					}
				}
			}

			if (readyForRender){
				highlights.renderHighlights();
			}
			readyForRender = true;
	
		}, 'TODO');
	} else {
		// if all page has rendered (HERE IT SHOULD NOT BE RENDERED YET)
		if (readyForRender){
			highlights.renderHighlights();
		}
		readyForRender = true;
	}
}

highlights.renderHighlights=function() {
	// perform substitutions
	var substitutedCodes = [];
	var substitutedCategories = [];
	var substitutionsPerformed = [];
	var defaultHighlightsCodes = [];
	
	for ( var i=0; i<slidingHighlights.length; i++) {
		defaultHighlightsCodes.push(slidingHighlights[i].code);
	}
	for ( var i=0; i<scrollingHighlights.length; i++) {
		defaultHighlightsCodes.push(scrollingHighlights[i].code);
	}
	
	// perform substitutions and update number of renditions
	for (var i=0;i<favouriteHighlights.length;i++){
		// only try to perform substitution if the category has not been substituted yet
		// the maximum number of sustitutions was not yet achieved
		// and the highlight has not achieved the maximum number of renditions 
		if ((substitutionsPerformed.length!=maxSubstitutions)&&
			(favouriteHighlights[i].renditionsf<maxRenditions)&&
			($.inArray(favouriteHighlights[i].category, substitutedCategories)==-1)&&
			($.inArray(favouriteHighlights[i].code, defaultHighlightsCodes)==-1)){
			var added = false;
			added = highlights.substituteHighlights(slidingHighlights, favouriteHighlights[i], substitutedCodes, substitutedCategories, substitutionsPerformed);
			if (!added){
				added = highlights.substituteHighlights(scrollingHighlights, favouriteHighlights[i], substitutedCodes, substitutedCategories, substitutionsPerformed);
			}
			if (added){
				highlights.increaseHighlightRenditions(favouriteHighlights[i].code,'lcfavouritescookie');
				highlights.increaseHighlightRenditions(favouriteHighlights[i].code,'lchistorycookie');
			}
		}
	}
	// only use history for substitutions if no favorite substitutions where performed
	if (substitutionsPerformed.length==0){
		for (var i=0;i<historyHighlights.length;i++){
			if ((substitutionsPerformed.length!=maxSubstitutions)&&
				(historyHighlights[i].renditionsh<maxRenditions)&&
				($.inArray(historyHighlights[i].category, substitutedCategories)==-1)){
				var added = false;
				added = highlights.substituteHighlights(slidingHighlights, historyHighlights[i], substitutedCodes, substitutedCategories, substitutionsPerformed);
				if (!added){
					added = highlights.substituteHighlights(scrollingHighlights, historyHighlights[i], substitutedCodes, substitutedCategories, substitutionsPerformed);
				}
				if (added){
					highlights.increaseHighlightRenditions(historyHighlights[i].code,'lchistorycookie');
					highlights.increaseHighlightRenditions(historyHighlights[i].code,'lcfavouritescookie');
				}
			}
		}
	}

	// render highlights
	$.each(slidingHighlights,function() {
		highlights.buildSlidingHighlight(this);
		if (typeof o != 'undefined') o.centrals.push(omnitureVariable + ':c:'+this.code);
	});
	if (typeof o != 'undefined') o.centralsProcessed = true;
	
	$.each(scrollingHighlights,function() {
		highlights.buildScrollingHighlight(this);
		if (typeof o != 'undefined') o.laterals.push(omnitureVariable + ':l:'+this.code);
	});
	if (typeof o != 'undefined') o.lateralsProcessed = true;
	if (typeof o != 'undefined') o.homeLoaded();

	// update favourites highlighting
	highlights.updateFavoritesStars();

	// start slideshow
	carrousel = new lc.w.SlideShow('#home-ss');
    bannerDisplay = new lc.w.BannersDisplay('#home-destacados', '.wg-destacados-vistas');
	
	$('.ss-item .fav').click(lc.t.toggleFavCentral);
	$('.wg-destacados-item .fav').click(lc.t.toggleFavLateral);
	$('.fav').blur(lc.t.hideLayerFav);
	$("body").click(lc.t.hideLayerFav);
}

highlights.buildSlidingHighlight = function(highlightJSON) {

	var highlight = highlightJSON;
	var highlightHTML;
	var add = getTranslation(neoLocale, 'add');
	var remove = getTranslation(neoLocale, 'remove');
	var hashURL = typeof highlight.hashURL !== 'undefined' ? highlight.hashURL : "";
	
	if(highlight.preRender != "")
	{
	    highlightHTML=$("<div />").html(highlight.preRender).text();
		highlightHTML = '<figure class=ss-item data-cid='+highlight.code+'>' + highlightHTML + '<a href="#" id="fav_' + highlight.code + '" class="sp fav" data-title="' + highlight.title + '" title="' + add + highlight.title + '">' + remove + highlight.title + '</a>' + '</figure>';
		highlightHTML = $(highlightHTML).find('div.product_media a').attr({'onclick': 'javascript:if (typeof o != \'undefined\') o.centralBannerClick(\''+highlight.code+'\');'}).end();
		
		highlightHTML.find('img[src="' + highlight.smallMedia + '"]').attr({
			'src': highlight.bigMedia,
			'width': 469,
			'height': 331
		});
	}
	else{
		var href = "",
			aux  = "";
			
		href = highlight.link;
	
		var linkHref = href + aux + hashURL,
			windowObjectReference = "";
		var target = "";
		
		if (highlight.windowPopup !== "") {
			windowObjectReference = highlight.windowPopup.replace("###url###", linkHref);
			windowObjectReference = windowObjectReference.replace("###type###", "_blank");
			windowObjectReference = windowObjectReference + " return false;";
			linkHref = ' href="' + linkHref + '"';
			target = " target='_blank'";
		} else {
			linkHref = ' href="' + linkHref + '"';
		}

		highlightHTML ='<figure class=ss-item data-cid='+highlight.code+'><a ' + linkHref + '' + target + ' onclick="javascript:highlights.followFavouriteLink(\'' + highlight.code + '\', \'central\');if (typeof o != \'undefined\') o.centralBannerClick(\''+highlight.code+'\');' + windowObjectReference + '" class="video" data-rel="1887564667001" title="' + highlight.title + '"><img alt="' + highlight.title + '" class="ss-item-ajax" data-href="' + highlight.bigMedia +'"  src="/deployedfiles/particulares/CSS/img/empty.gif"></a>' +
	'<a href="#" id="fav_' + highlight.code + '" class="sp fav" data-title="' + highlight.title + '" title="' + add + highlight.title + '">' + remove + highlight.title + '</a>' +
	'<p class="slideshow-close"><a href="#" onclick="javascript:return false;"><img alt="Cerrar" src="/deployedfiles/particulares/CSS/img/icons/aspa-video.png"></a></p></figure>';
	}
	 
	$('article#home-ss div.ss-content').append(highlightHTML);
}

highlights.buildScrollingHighlight = function(highlightJSON) {
	var highlight = highlightJSON;
	var highlightHTML ="";
	var add = getTranslation(neoLocale, 'add');
	var remove = getTranslation(neoLocale, 'remove');
	var hashURL = typeof highlight.hashURL !== 'undefined' ? highlight.hashURL : "";

	if(highlight.preRender != "")
	{
	    highlightHTML=$("<div />").html(highlight.preRender);
	    highlightHTML = highlights.scrollingHighlightSwapImage(highlightHTML, highlight.thumbMedia);
	    
	    var index = $('#home-destacados').find('input.campaign-sources').length;
	    $('article#home-destacados ul').prepend('<input class="campaign-sources" id="campaign-flash-' + index + '" type="hidden" data-image-multiview="' + highlight.thumbMedia + '" data-image-uniqueview="' + highlight.smallMedia + '" value="" />');
		
	    highlightHTML = '<li class="wg-destacados-item" data-cid='+highlight.code+'>' 
		 + highlightHTML + 
		'<a href="#" id="fav_' + highlight.code + '" class="sp fav fav-small" data-title="' + highlight.title + '" title="' + add + highlight.title + '">' + remove + highlight.title + '</a>' + '</li>';
	
		highlightHTML = $(highlightHTML).find('div.product_media a').attr({'onclick': 'javascript:if (typeof o != \'undefined\') o.lateralBannerClick(\''+highlight.code+'\');', 'title': highlight.title}).end();
		highlightHTML = $(highlightHTML).find('div.product_media img').attr({'src': highlight.thumbMedia}).end();
		
		highlightHTML.find('img[src="' + highlight.bigMedia + '"]').attr({
			'src': highlight.smallMedia,
			'width': 238,
			'height': 218
		});
	}
	else{
		var href = "",
			aux  = "";
		
			href = highlight.link;
		
		var linkHref = href + aux + hashURL,
			windowObjectReference = "";
		var target = "";
		
		if (highlight.windowPopup !== "") {
			windowObjectReference = highlight.windowPopup.replace("###url###", linkHref);
			windowObjectReference = windowObjectReference.replace("###type###", "_blank");
			windowObjectReference = windowObjectReference + " return false;";
			linkHref = ' href="' + linkHref + '"';
			target = " target='_blank'";
		} else {
			linkHref = ' href="' + linkHref + '"';
		}
		
		 highlightHTML ='<li class="wg-destacados-item" data-cid='+highlight.code+'><a title="' + highlight.title + '"' + linkHref + '' + target + ' onclick="javascript:highlights.followFavouriteLink(\'' + highlight.code + '\', \'lateral\');if (typeof o != \'undefined\') o.lateralBannerClick(\''+highlight.code+'\');' + windowObjectReference + '"><header><h3></h3></header>' +
		'<div class="foto" data-size="multiview" data-image="' + highlight.smallMedia + '"><img src="' + highlight.thumbMedia + '" alt=""></div>' +
		'<div class="texto"><p>' + highlight.description + '</p></div></a>' +
		'<a href="#" id="fav_' + highlight.code + '" class="sp fav fav-small" data-title="' + highlight.title + '" title="' + add + highlight.title + '">' + remove + highlight.title + '</a></li>';
		}
	$('article#home-destacados ul').append(highlightHTML);
}

highlights.scrollingHighlightSwapImage=function(highlightHTML, smallMediaPath){
	var x = $(highlightHTML).find('a img').attr('src', smallMediaPath).end();
	return $("<div />").html(x).text();
}

highlights.buildFavouriteHighlight=function(highlight) {
	// verify if code exists, to prevent errors in edition
	// maybe in cookie exists campaigns that doesn't exist
	if (typeof highlight !== 'undefined' && highlight.hasOwnProperty('code')){
		
		var description = highlight.description==undefined ? highlight.title : highlight.description;
		
		var highlightHTML = '<li><a href="#" onclick="javascript:highlights.removeFavourite(\'' + highlight.code + '\');updateFavourites();"><span class="sp delete-fav ib"></span></a>' +
							'<a href="' + highlight.link + '" onclick="javascript:highlights.followFavouriteLink(\'' + highlight.code + '\',\'' + highlight.side + '\');"><span class="desc bt-arrowright">' + description + '</span></a></li>';
							$('div.a-fav ul').append(highlightHTML);
		
	}
}

highlights.followFavouriteLink = function(highlightCode, side) {
	$.each(favouriteHighlights,function() {
		if (this.code==highlightCode){
			highlights.addHighlight(highlightCode, 'lcfavouritescookie', side);
		}
	});
}

lc.t.toggleFavCentral = function(e) {
	lc.t.toggleFav($(this), e,'central');
	return false;
}
lc.t.toggleFavLateral = function(e) {
	lc.t.toggleFav($(this), e,'lateral');
	return false;
}
lc.t.toggleFav = function($this,e,side) {
	//Quitamos el favorito
	if( $this.hasClass('is-fav') ){
			lc.t.hideLayerFav();
			$this.removeClass('is-fav');
			var add = getTranslation(neoLocale,'add');
			var title = add + $this.attr('data-title');
			$this.attr('title',title).text(title);
			//$this.attr('title', 'Añadir a favoritos el enlace anterior').text('Añadir a favoritos el enlace anterior');
			// get code from favourite being removed
			highlights.removeFavourite($this.attr('id').substring(4).clean());
	}else{
		if(highlights.addFavourite($this.attr('id').substring(4), side)){
			$this.addClass('is-fav');
			var rem = getTranslation(neoLocale,'remove');
			var title = rem + $this.attr('data-title');
			$this.attr('title',title).text(title);
	        lc.t.showLayerFav($this, e);
	        if (side=='central' && typeof o != 'undefined') o.centralFavoriteClick($this.attr('id').substring(4));
	        else if (side=='lateral' && typeof o != 'undefined') o.lateralFavoriteClick($this.attr('id').substring(4));
		}
	}
	updateFavourites();
	return false;
};