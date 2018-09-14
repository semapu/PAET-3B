function getTranslation(locale, field) {
	var translations = {
	        'es_ES': {
	        		'add': 'Añadir a favoritos ',
	                'remove': 'Quitar de favoritos '
	        },
	            'ca_ES': {
	            	'add': 'Afegir a preferits ',
	                'remove': 'Treure de preferits '
	        },
	            'fallback': {
	            	'add': 'Añadir a favoritos ',
	                'remove': 'Quitar de favoritos '
	        }
	    };
 
		    t = translations[locale][field];

		    if (typeof t != 'undefined') {
		        return t;
		    }

		    return translations.fallback.field;
		};				

// Add functionalities
var utils = function() {
	var loading = {
			defaults_values: {'class': 'loading', 'text': 'Loading...'},
			normal: '<div class="##CLASS##">##TEXT##</div>'
		},
		videosLoaded = {};
	

	
	function wrapValues(newArray, exceeded) {
		for(var i in newArray) {
			if (newArray.hasOwnProperty(i)) {
				if (Object.prototype.toString.apply(newArray[i]) === '[object Array]') {
					newArray[i] = $.map(newArray[i], function (value, index) {
						return value.toString().slice(0, (value.toString().length - exceeded));
					});
				} else if (typeof newArray[i] === 'string' || typeof newArray[i] === 'number') {
					newArray[i] = newArray[i].toString().slice(0, ( newArray[i].toString().length - exceeded));
				}
			}
		}
		
	}
	
	return {
		/**
		 * Add loading to DOM
		 * 
		 * @param attrs     hash with class and text to be associated in the loading with fallback to defaults_values
		 * 
		 * @return String
		 */
		designLoading: function (attrs) {
			var className = typeof attrs !== 'undefined' && attrs.hasOwnProperty('class') ? attrs['class'] : loading.defaults_values['class'];
				text = typeof attrs !== 'undefined' && attrs.hasOwnProperty('text') ? attrs['text'] : loading.defaults_values['text'];

			return loading.normal.replace(/(.*)(##CLASS##)(.*)(##TEXT##)(.*)/, "$1" + className + "$3" + text + "$5");
		},
		addVideo: function (idVideo, value) {
			if (typeof videosLoaded[idVideo] === 'undefined') {
				videosLoaded[idVideo] = $("#" + idVideo).html();
			}
		},
		pauseAllVideos: function() {
			for(var i in videosLoaded) {
				try{
					if (typeof brightcove !== 'undefined' && brightcove.experienceNum > 0) {
						var videoId = $("#" + i).find('.BrightcoveExperience').attr("id");
						brightcove.getExperience(videoId).getModule('videoPlayer').stop();
					}
				} catch(e){}
			}
		},
		playVideo: function(idVideo) {
			if (typeof videosLoaded[idVideo] !== 'undefined') {
				$("#" + idVideo).html(videosLoaded[idVideo]);
			}
		},
		getAllVideos: function() {
			return videosLoaded;
		},
		onVideoLoaded: function(a) {
			if (! $("#" + a).is(':visible')) {
				setTimeout(function() {
					utils.pauseAllVideos();
				}, 1000);
			}			
		},
		wrapWordOmniture: function(elements, limitCharacters) {
			var numberWords              = 0,
				numberCharacters         = 0,
				newArray 		         = elements,
				minimunCharacters        = 8,
				numberCharactersExceeded = 0;
			
			
			for(var i in elements) {
				if (elements.hasOwnProperty(i)) {
					if (Object.prototype.toString.apply(elements[i]) === '[object Array]') {
						// count number of words and characters
						$.map(elements[i], function (value, index) {
							numberWords += 1;
							numberCharacters += value.toString().length;
						});
					} else if (typeof elements[i] === 'string' || typeof elements[i] === 'number') {
						if (i == 'additional') {
							numberCharacters += elements[i];
						} else {
							numberWords += 1;
							numberCharacters += elements[i].toString().length;
						}
					}
				}
			}
			
			
			// apply the wrap to the words, if necessary
			if (numberCharacters > limitCharacters) {
				var exceeded = Math.ceil((numberCharacters - limitCharacters) / numberWords);
				wrapValues(newArray, exceeded);			}
			
			return newArray;
		}
	}
}();

/** @namespace  */
var lc = {};
/** @namespace  */
lc.re = {};
lc.re.EMPTY = /^\s*$/;
var bgPageHeight;
/**
 * On DOM ready init script.
 */
lc.init = function()
{
	lc.ua = {
		IE : !!document.all,
		oldIE : document.all && !document.getElementsByClassName
	};
	
	$(function() {
		
		if($.browser.msie && parseInt($.browser.version, 10) == 7) {
		
			var zIndexNumber = 1000;
				$("#mid-top div, article").each(function() {
				$(this).css('zIndex', zIndexNumber);
				zIndexNumber -= 10;
       		});
	   } 
	});
	
	var wr = function()
	{
		if($('.bgPage').length){
			bgPageHeight = $('.bgPage').height();
			$('.bgPage').css("height", "100%")
		}
		
	};	

	wr();
		
	// Attach focus/blur handler to inputs with class=togglevalue
	$('INPUT.togglevalue').each(function(){ $(this).on("focus blur", lc.f.toggleValueOnFocus); });
}

/** @namespace  */
lc.w = {};

/**
 * SlideShow widget constructor.
 * @class
 */
lc.w.SlideShow = Class.extend({
	/** @const */
	T : 8000,
	/** Class initialization. */
	init: function(wrapper, time)
	{
		/** @property */
		this.page = 0;
		
		var self = this;
		this.wrapper = wrapper;
		this.time = ( !isNaN(time) && time > 0 ) ? time : this.T;
		this.num_pages = $(wrapper+" .ss-item").length;

		if( this.num_pages > 1 )
		{			
			$(wrapper+" .sp-ss-pause").click($.proxy(this.playPause, this));
				
			if (! $(wrapper + " .ss-controls .sp-ss-dot")[0]){
				// Page buttons	
				var bots = '';
				for(var i=0; i<this.num_pages; i++) {
					var idCampaign = $($(wrapper+" .ss-item a.fav")[i]).attr('id');
					bots += '<li><a href="' + (typeof idCampaign === 'undefined' ? '#' : '#' + idCampaign) + '" class="ss-controls-page" title="Cambiar destacado"><span class="sp sp-ss-dot"></span></a></li>';
				}
				$(wrapper+" .ss-controls ul").append(bots);
			}
			
			if (typeof slidingHighlights !== "undefined" && slidingHighlights.length > 0) {
				$.each($(wrapper + " .ss-controls .sp-ss-dot"), function(i, elem) {
					var idCampaign = $($(wrapper+" .ss-item a.fav")[i]).attr('id');
					$(this).parent().attr("href", "#" + idCampaign).find('img').attr('alt', slidingHighlights[i].title).closest('a').attr('title', slidingHighlights[i].title);
				});
			}
			
			$(wrapper + " .ss-controls").on("click keypress", ".sp-ss-dot, .ss-controls-page", function (event) {				
				if ((event.type == "keypress" && event.key == 13) || event.type == "click") {
					event.preventDefault();
					
					var i = $(wrapper + " .ss-controls .ss-controls-page").index($(this).closest('.ss-controls-page'));
					
					if (typeof o != 'undefined') o.centralBannerRadioClick(i);
					
					self.changePage(i);
					self.playPause(true, true);
					
					return false;
				}
			});
		
			this.interval_id = setInterval($.proxy(this.timeout, this), this.time);	
		}
		else
		{
			$(wrapper+" .ss-controls").remove();
		}
		
		this.changePage(0);
	},
	/** Change current page. */
	changePage : function(page)
	{
		// Remove ballon favourite
		if ($(".bocadillo-fav")[0]) {
			$(".bocadillo-fav").hide(0);
		}
		
		if		( page >= this.num_pages) page = 0;
		else if ( page < 0 ) page = this.num_pages - 1;
	
	
		imgDes = $(this.wrapper+" .ss-item:eq("+page+")").find('.ss-item-ajax');
		isEmpty = false;
		if	(imgDes.length > 0)
			isEmpty = imgDes.attr("data-href").length;
		
		if(isEmpty){
			imgDes.attr("src", imgDes.attr("data-href"));
			 imgDes.attr("data-href", "");
		}		
		
		$(this.wrapper+" .ss-item:eq("+this.page+")").fadeOut(200);
		$(this.wrapper+" .ss-item:eq("+page+")").delay(200).fadeIn(200);
		
		$(this.wrapper+" .ss-controls-page:eq("+this.page+")").removeClass('active').find('img').attr('src', '/deployedfiles/particulares/CSS/img/dot.png');
		$(this.wrapper+" .ss-controls-page:eq("+page+")").addClass('active').find('img').attr('src', '/deployedfiles/particulares/CSS/img/dot_active.png');
		
		this.page = page;
	},
	/** setInterval handler. */
	timeout : function(page)
	{
		this.changePage(this.page+1);
	},
	/** Play pause animations. */
	playPause : function(pause, isRadioPressed)
	{
		
		$bot = $(this.wrapper+" .sp-ss-pause");
		var playing = !$bot.hasClass('sp-ss-play');
		
		if( playing || pause === true )
		{
			clearInterval(this.interval_id);
			$bot.addClass('sp-ss-play').attr('title', 'Reanudar Carrousel').find('img').attr('src', '/deployedfiles/particulares/CSS/img/play.png');
			if (typeof o != 'undefined' && !isRadioPressed) o.centralPlayPauseCentralClick('pause');
		}	
		else
		{
			this.interval_id = setInterval($.proxy(this.timeout, this), this.time);
			$bot.removeClass('sp-ss-play').attr('title', 'Pausar Carrousel').find('img').attr('src','/deployedfiles/particulares/CSS/img/pause.png');
			if (typeof o != 'undefined' && !isRadioPressed) o.centralPlayPauseCentralClick('play');
		}
		
		return false;
	},
	slideToAnchor : function(anchor){
		var index = $(".ss-controls ul li").index($("li:has(a[href='" + anchor + "'])"));
		this.playPause(true, false);
		this.changePage(index-1);
	}
});

/**
 * Simple banners view manager.
 * @class
 */
lc.w.BannersDisplay = Class.extend({
	/** Class initialization. */
	init: function(wrapper, views, height)
	{
		/** @property */
		this.view = 'multiview';
		
		var self = this;
		this.$wrapper = $(wrapper);
		this.$views = $(views+" A");
		
		if(!isNaN(height))
		{
			this.$wrapper[0].style.height = height + 'px';
		}
		
		this.$views.click(function(){
			self.changeView( $(this).attr('data-view') );
			return false;
		});
	/*	$(".wg-destacados-item").mouseenter(function(){
			$(".ss", this)["slideDown"](200);
		});
		$(".wg-destacados-item").mouseleave(function(){
			$(".ss", this)["slideUp"](200);
		});*/
	},
	/** Changes the current view. */
	changeView : function(type)
	{
		this.$views.removeClass('active');
		this.$views.filter('[data-view="'+type+'"]').addClass('active');
		
		this.$wrapper.removeClass(this.view);
		this.$wrapper.addClass(type);
		this.view = type;
		
		//Borramos el bocadillo de fav
		lc.t.hideLayerFav();
		
		if(typeof o != 'undefined') o.lateralViewClick(this.view);
	}
});

/**
 * Move webSite for Accion CaixaBanc
 */
lc.w.movePage = function(a)
{
	var mainSelector = '.bgPage>nav, .bgPage>#top, .bgPage>nav article';
	var hgroupSelector = '.header>hgroup';
	if ($('.bgPage').length==0) {
		mainSelector = '#top, .bgPage>article';
		hgroupSelector = '#header>hgroup';
		
		if ($('#top:visible').length==0) {
			mainSelector = '#main';
		}
	}
	if(a=="open"){
		$(mainSelector).delay(200).animate({marginTop: "260px"}, 200);
		$(hgroupSelector).delay(200).animate({marginTop: "250px"}, 200);
	}else{
		$(mainSelector).delay(200).animate({marginTop: "0"}, 300);
		$(hgroupSelector).delay(200).animate({marginTop: "0"}, 300);
	}
};
/**
 * Tabs system.
 * @class
 */
lc.w.Tabs = Class.extend({
	/** Class initialization. */
	init: function(wrapper)
	{
		var self = this;
		var $wrapper = $(wrapper);
		this.tabs = $wrapper.find('.tabs-content > DIV');
		this.tabs.each(function(){ $(this).css("display", "none");});
		this.current_tab = 0;
		this.bots = $wrapper.find('.tabs-menu A');
		this.bots.each(function(i){
			$(this).live("click", function(e){
				self.changeTab(i);
				e.preventDefault();
			});
		});
		if( this.tabs.length > 0 )
			$(this.tabs[0]).show();
	},
	/** Change current page. */
	changeTab : function(tab, instant)
	{
		if( this.current_tab == tab ) return;
		if( instant === true ){
			$(this.tabs[this.current_tab]).hide();
			$(this.tabs[tab]).show();
		}else{
			$(this.tabs[this.current_tab]).fadeOut(200);
			$(this.tabs[tab]).delay(200).fadeIn(200);
		}
		$(this.bots[this.current_tab]).removeClass('active');
		$(this.bots[tab]).addClass('active');
		this.current_tab = tab;
	}
});
/**
 * Creates a new PageScroll object.
 * @class
 */
lc.w.PageScroll = Class.extend({
	/** Class initialization.  @constructor */
	init: function(wrapper)
	{
		var $wrapper = $(wrapper),
			self = this;
		this.page = 0;
		this.NUM_PAGES = $(wrapper+" .scroll-page").length;
		this.WIDTH = Math.ceil( $(wrapper+" .scroll-page").outerWidth() );
		this.$content = $(wrapper+" .scroll-content").css('width', this.WIDTH*(this.NUM_PAGES+1))
		this.$prev = $(wrapper+" .scroll-prev").addClass('disabled').click($.proxy(this.prev, this));
		this.$next = $(wrapper+" .scroll-next").click($.proxy(this.next, this));
		var idx = 0;
		$(wrapper+' .scroll-menu A').click(function(e){
			e.preventDefault();
			var temp_idx = $(this).index(wrapper+' .scroll-menu A');
			self.scroll( temp_idx );			
			$(wrapper+' .scroll-menu A:eq('+idx+')').removeClass('active');
			$(wrapper+' .scroll-menu A:eq('+temp_idx+')').addClass('active');
			idx = temp_idx;
		});
	},
	/** Scroll to previous page */
	prev : function()
	{
		this.scroll(this.page-1);
		return false;
	},
	/** Scroll to next page */
	next : function()
	{
		this.scroll(this.page+1);
		return false;
	},
	/** Scroll to page */
	scroll : function(page)
	{
		if( page < 0 || page >= this.NUM_PAGES )
			return;
		this.page = page;
		var s = $('.scroll-page');
		if(typeof s[0] != undefined){
		    $('.scroll-page').removeClass('active');
		    $('.scroll-page-' + (this.page+1)).addClass('active');
		}
		this.$content.animate( {'margin-left':this.WIDTH*-this.page}, 500 );
		this.$prev[ page > 0 ? 'removeClass' : 'addClass' ]('disabled');
		this.$next[ page < this.NUM_PAGES-1 ? 'removeClass' : 'addClass' ]('disabled');
	}
});

/**
 * Creates a new LayerGroup object.
 * @class
 */
lc.w.LayerGroup = Class.extend({
	/** Class initialization. */
	init: function()
	{
		/** @property */
		this.members = [];
		this.callbacks = [];
	},
	/** Adds a new layer object to the array. */
	add: function(layer)
	{
		this.members.push(layer);
	},
	/** Closes all other layers in the group. */
	update: function(layer)
	{		
		if( typeof(layer) == 'function' )
		{
			this.callbacks['update'] = [] || this.callbacks['update'];
			this.callbacks['update'].push(layer);
		}
		else
		{
			var l;
			for (var i=0; i<this.members.length; i++)
			{
				l = this.members[i];
				if(l != layer && l.opened)
					l.close(true);
			};
			
			if( this.callbacks['update'] )
				for(i=0; i<this.callbacks['update'].length; i++)
					this.callbacks['update'][0].call(this, layer.$layer);
		}
	}
});

/**
 * Creates a new Layer object.
 * @class
 */
lc.w.Layer = Class.extend({
	/** @const */
	OPEN_FUNC : 'fadeIn',
	CLOSE_FUNC : 'fadeOut',
	T : 100,

	/** Class initialization. */
	init: function(bot, layer, url, config, name)
	{
		// prevent cases that url points to same page or empty url with a ajax call
		if (($.trim(url) && url.indexOf('/') !== -1) || (typeof config !== 'undefined' && config.hasOwnProperty('ajax') && config.ajax === false)) {
			/** @property */
			this.$bot = $(bot);
			this.$layer = $(layer);		
			this.opened = false;
			this.callbacks = [];
			this.loaded = !(config && config.ajax !== false || typeof(config) == 'undefined');
			this.type = config;
			this.openFunc  = config && typeof(this.$layer[config.open])  == 'function' ? config.open : this.OPEN_FUNC;
			this.closeFunc = config && typeof(this.$layer[config.close]) == 'function' ? config.close : this.CLOSE_FUNC;
			
			this.name = name ? name : '';
			this.url = url;
			this.time = config && !isNaN(config.time) && config.time > 0 ? config.time : this.T;
			this.group = config && config.group || null;
			if( this.group ) this.group.add(this);
			if (config.child) this.child = config.child;
			if (config.parent) this.parent = config.parent;
			this.autoclose = config.autoclose;
			var self = this;
			var do_toggle = config && config.toggle === false ? false : true;
			this.$bot.click(function(e){
				e.preventDefault();
				do_toggle ? self.toggle() : self.open();
			});
			if (!(typeof config !== 'undefined' && config.hasOwnProperty("ignoreClose") && config.ignoreClose)) {
				this.$layer.find('.l-close').live("click", function(e){
					e.preventDefault();
					self.close();
				});
			}
		}
	},
	/** Shows the layer. */
	open : function(avoidOmniture)
	{
		utils.pauseAllVideos();
		
		var disableScroll = arguments.length > 1 && typeof arguments[1]['scroll'] !== 'undefined' ? true : false;
		var self = this;
		var inc =250;
		
		if( this.loaded == false )
		{		
			// Add loading
			self.$layer.append(utils.designLoading());
			
			ajax.get(this.url, function(r) {				
				self.$layer.find('.loading').remove();
				self.$layer.append(r);
				if( !self.first_run )
				{
					self.firstRun();
					self.first_run = true;		
				}
				
				var closeTxt = self.$layer.find('#close').html() + " " + self.name;
				self.$layer.find('#close').html(closeTxt);
				self.$layer.find('#close').attr('title', closeTxt);
				
				if (!disableScroll) {
					self.$layer.find('a, :input').first().focus();
				}
					
				if (typeof brightcove != 'undefined')	brightcove.createExperiences();
			});
			this.loaded = true;	
		}
		if(!this.type["bg"])
				inc = 0;
		var delay=0;
		if(this.type["movePage"]){
			new lc.w.movePage("open");
			delay = 200
		}
		var doScroll = this.type["doScroll"]
		
		//Hacemos que se retrase para dar tiempo a la carga
		this.$layer.delay(0+delay)[this.openFunc](this.time, function () {
			
			 if((bgPageHeight+inc)>$(window).height())
				 $('.bgPage').css("height", "850px");
			 // si son layer de abajo hacemos scroll
			 if(doScroll && !disableScroll) {
			  	$(document).delay(0).scrollTo( 1500, 200);
			 }
			  	
			 if (self.opened && !disableScroll) {
				 self.$layer.find('a, :input').first().focus();
			 }
		});
		
		this.$bot.addClass('active');
		
		if (!this.opened && typeof o != 'undefined' && !avoidOmniture) o.panelOpen(this.name, true);
		
		this.opened = true;
		
		if( this.group )
			this.group.update(this);
		
		if (this.autoclose) {
			layer = this;
			$(document).click(function(e) {
				if (layer.opened && layer.$bot.find(e.target).length==0 && layer.$layer.find(e.target).length==0 && !$(e.target).has('delete-fav'))
					layer.close();
			});
		}
		
		var idContainer = self.$layer.find('.flashcontentvid').attr('id');
		utils.playVideo(idContainer);
	},	
	/** Hides the layer. */
	close : function(isSwitch)
	{
		utils.pauseAllVideos();

		if(this.type["movePage"])
			new lc.w.movePage("close");

		this.$layer[this.closeFunc](this.time, function (){
			$('.bgPage').css("height", "100%");
		});
		this.$bot.removeClass('active');
		this.opened = false;
		
		if( this.callbacks['close'] )
			for(var i=0; i<this.callbacks['close'].length; i++)
				this.callbacks['close'][0].call(this);
		
		if (this.child && this.child.members) {
			for(var i=0; i<this.child.members.length; i++) {
				if (this.child.members[i].opened)
				this.child.members[i].close();
			}
		}
		if (this.parent && this.parent.opened && !isSwitch) {
			this.parent.close();
		}
		else {
			if (typeof o != 'undefined' && !isSwitch) o.panelClose();
		}
	},	
	/** Toogle the layer visibilty. */
	toggle : function()
	{
		this.opened ? this.close() : this.open();
	},	
	/** Toogle the layer visibilty. */
	firstRun : function(callback)
	{
		if( typeof(callback) == 'function' ){
			this.callbacks['firstRun'] = [] || this.callbacks['firstRun'];
			this.callbacks['firstRun'].push(callback);
		}else if( this.callbacks['firstRun'] ){
			for(var i=0; i<this.callbacks['firstRun'].length; i++)
				this.callbacks['firstRun'][0].call(this);
			
			delete this.callbacks['firstRun'];
		}
	}
});


/** @namespace  */
lc.f = {};
/**
 * Toggles the value of an input on focus or on blur.
 * The input must have the attribute data-defvalue="[value]" to check against.
 */
lc.f.toggleValueOnFocus = function(e)
{
	var defvalue = $(this).attr('data-defvalue');
	if( defvalue == undefined ) return;  // No default value, no play
	
	if( e.type == "focus" )
	{
		if( this.value == defvalue )
			this.value = "";
	}
	// blur && empty value
	else if( lc.re.EMPTY.test(this.value) )
		this.value = defvalue;
};

/** @namespace  */
lc.t = {};

lc.t.showLayerFav = function(elemento, mouse){
	
	lc.t.hideLayerFav();
	//Seleccionamos el bocadillo fav que corresponde
	var selfBocadillo = elemento.parent().parent().parent().parent().children(".bocadillo-fav");
	var content = elemento.parent().parent().parent();
	var contentZIndex = $("#mid-right");
	//Es el bocadillo del terrat
	if(content.attr('id').search("home-ss")>-1){
		var offsetX = -304;
		contentZIndex = $("#mid-mid");
	}
	//Es el bocadillo del terrat
	if(content.attr('class').search("multiview")>-1){
		var offsetX = 22;
		var offsetY = 58;
	}	
	if(content.attr('class').search("uniqueview")>-1){
		var offsetX = -119;
		var offsetY = 58;
	}	
	if(content.attr('class').search("listview")>-1){
		var offsetX = -129;
		var offsetY = 64;
	}	
	selfBocadillo.css('top', elemento.parent().position().top - offsetY +'px');
	selfBocadillo.css('left', elemento.parent().position().left - offsetX+'px');
	//Sino lo hemos cargado con anterioridad lo cargamos

	var zIndexNumber = 1000;
	contentZIndex.css('zIndex', zIndexNumber);
	$("#mid-mid").css('float', 'left');
//	
	
	if(selfBocadillo.html().length == 0){
		var bocadilloUrl = '/deployedfiles/particulares/Ajax/Home/Favoritos/b-fav.html';
		if (neoLocale == 'ca_ES') bocadilloUrl = '/deployedfiles/particulares/Ajax/Home/Favoritos/b-fav-ca.html';
		
		ajax.get(bocadilloUrl, function(r) {
			selfBocadillo.html(r);
		});
	}
	selfBocadillo.fadeIn(200);
}
lc.t.hideLayerFav = function(){
	
/*	$("#mid-right").css('zIndex', 1);
	$("#mid-mid").css('zIndex', 0);
	$("#mid-mid").css('float', 'left');
	$("#mid-mid").css('position', 'relative');*/

			$('#mid-mid').css('zIndex', 1);
			$('#mid-right').css('zIndex', 0);


	$(".bocadillo-fav").fadeOut(0);
}

// Scripts running on DOM ready
$(document).ready(function(e)
{
	lc.init();
});

// Omniture events registration functions
var o = {};
o.latViews = {multiview:'c',listview:'l',uniqueview:'u'};
o.latViewsDesc = {c:'home:lat:cuadricula:click', l:'home:lat:lista:click', u:'home:lat:unico:click'};
o.centrals = [];
o.centralsProcessed = false;
o.laterals = [];
o.lateralsProcessed = false;
o.favsn = "";
o.favsnProcessed = false;
o.mainPageName = "";

o.homeLoaded = function() {
	o.sendHomeloaded(true);
};
o.sendHomeloaded = function(isToSend){
	if (typeof s != 'undefined') {
		if (o.centralsProcessed && o.lateralsProcessed && o.favsnProcessed) {
			var list2 = [],
				elements = {
					"o.centrals": o.centrals,
					"o.laterals": o.laterals,
					"o.favsn": o.favsn,
					"additional": o.centrals.length * 0 + o.laterals.length * 5 + (o.favsn.length > 0 ? 2 : 0)
				};
			
			elements = utils.wrapWordOmniture(elements, 255);

			$.each(elements["o.centrals"], function(index, value) {
				list2.push(value+":i");
			});
			$.each(elements["o.laterals"], function(index, value) {
				list2.push(value+":c:i");
			});
			if (o.favsn.length>0)
				list2.push(elements["o.favsn"]+":i");
			s.list2=list2.join(',');
			s.events="event36";
			if(isToSend){
				s.t();
				s.events="";
			}
		}
	}
};
o.panelOpen = function(name, isAjax) {
	if (typeof s != 'undefined') {
		if(!isAjax){
			//for tabs for instance
			if(s.prop4 == ""){
				s.prop4 = s.prop5;
			}
		}
		s.prop5=name.clean();
		
		var breadcrumb = [];
		if (s.channel) breadcrumb.push(s.channel);
		if (s.prop1) breadcrumb.push(s.prop1);
		if (s.prop2) breadcrumb.push(s.prop2);
		if (s.prop3) breadcrumb.push(s.prop3);
		if (s.prop4) breadcrumb.push(s.prop4);
		if (s.prop5) breadcrumb.push(s.prop5);
		s.pageName= breadcrumb.join(':');
		s.list2="";
		s.t();
	}
};
o.panelClose = function() {
	if (typeof s != 'undefined') {
		s.pageName= o.mainPageName;
		var breadcrumb = [];
		if(o.mainPageName != null){
			breadcrumb = o.mainPageName.split(':');
			if(breadcrumb != null && breadcrumb.length > 0){
				s.prop5 = breadcrumb[breadcrumb.length -1];
			}
		}
		o.sendHomeloaded(false);
		s.t();
		s.events="";
	}
};
o.centralBannerClick = function(name) {
	if (typeof s != 'undefined') {
		name = name.clean();
		s=s_gi(s_account);
		s.linkTrackVars="list2,events"; 
		s.linkTrackEvents="event35";
		s.events="event35";
		
		var elements = {
			"omnitureVariable": omnitureVariable,
			"name": name,
			"additional": 5
		};
		
		elements = utils.wrapWordOmniture(elements, 255);
		
		s.list2=elements["omnitureVariable"] + ":c:" + elements["name"] + ":c";
		s.tl(this,'o','click banner central home');
		s.events="";
	}
};
o.centralBannerRadioClick = function(idx) {
	if (typeof s != 'undefined') {
		s=s_gi(s_account);
		s.linkTrackVars="list2,events";
		s.linkTrackEvents="event35,event36";
		s.events="event35,event36";
		
		var elements = {
			"omnitureVariable": omnitureVariable,
			"o.centrals[idx]": o.centrals[idx],
			"additional": 6 + idx.toString().length + 3 + 2
		};
		
		elements = utils.wrapWordOmniture(elements, 255);
		
		s.list2= elements["omnitureVariable"] + ":c:rb:"+idx+":c,"+elements["o.centrals[idx]"]+":i";
		s.tl(this,'o','click radio button home');
		s.events="";
	}
};
o.centralPlayPauseCentralClick = function(option) {
	if (typeof s != 'undefined') {
		s=s_gi(s_account);
		s.linkTrackVars="list2,events";
		s.linkTrackEvents="event35";
		s.events="event35";
		
		var elements = {
			"omnitureVariable": omnitureVariable,
			"option": option,
			"additional": 5
		};
		
		elements = utils.wrapWordOmniture(elements, 255);
		
		s.list2=elements["omnitureVariable"] + ":c:"+elements["option"]+":c";
		s.tl(this,'o','click ' + option + ' home');
		s.events="";
	}
};
o.lateralBannerClick = function(name) {
	if (typeof s != 'undefined') {
		name = name.clean();
		var view = bannerDisplay.view;
		view = o.latViews[view];
		
		s=s_gi(s_account);
		s.linkTrackVars="list2,events";
		s.linkTrackEvents="event35";
		s.events="event35";
		
		var elements = {
			"omnitureVariable": omnitureVariable,
			"name": name,
			"view": view,
			"additional": 6
		};
		
		elements = utils.wrapWordOmniture(elements, 255);
		
		s.list2=elements["omnitureVariable"] + ":l:"+elements["name"]+":"+elements["view"]+":c";
		s.tl(this,'o','click creativo lateral home');
		s.events="";
	}
};
o.lateralViewClick = function(view) {
	if (typeof s != 'undefined') {
		var view = o.latViews[view];
		var lats = [];
			
		lats = lats.join();
		
		s=s_gi(s_account);
		s.linkTrackVars="list2,events";
		s.linkTrackEvents="event35";
		s.events="event35";
		
		var elements = {
			"lats": lats,
			"omnitureVariable": omnitureVariable,
			"view": view,
			"additional": 12
		};
		
		elements = utils.wrapWordOmniture(elements, 255);
		
		s.list2=elements["lats"]+"," + elements["omnitureVariable"] + ":l:"+elements["view"]+":c,"+ elements["omnitureVariable"] + ":l:"+elements["view"]+":i";
		s.tl(this,'o',o.latViewsDesc[view]);
		s.events="";
	}
};
o.centralFavoriteClick = function(name) {
	if (typeof s != 'undefined') {
		name = name.clean();
		s=s_gi(s_account);
		s.linkTrackVars="list2,events";
		s.linkTrackEvents="event37";
		s.events="event37";
		
		var elements = {
			"omnitureVariable": omnitureVariable,
			"name": name,
			"additional": 5
		};
		
		elements = utils.wrapWordOmniture(elements, 255);
		
		s.list2=elements["omnitureVariable"] + ":c:"+elements["name"]+":f";
		s.tl(this,'o','favorito banner central home');
		s.events="";
	}
};
o.lateralFavoriteClick = function(name) {
	if (typeof s != 'undefined') {
		name = name.clean();
		var view = bannerDisplay.view;
		view = o.latViews[view];
		
		s=s_gi(s_account);
		s.linkTrackVars="list2,events";
		s.linkTrackEvents="event37";
		s.events="event37";
		
		var elements = {
			"omnitureVariable": omnitureVariable,
			"name": name,
			"view": view,
			"additional": 6
		};
		
		elements = utils.wrapWordOmniture(elements, 255);
		
		s.list2=elements["omnitureVariable"] + ":l:"+elements["name"]+":"+elements["view"]+":f";
		s.tl(this,'o',' favorito creativo lateral home');
		s.events="";
	}
};
o.personalizationSubmit = function(socialNetwork, theme) {
	if (typeof s != 'undefined') {
		var elements   = {},
			additional = 0;
		s.list2="";
		s.events="";
		s.linkTrackEvents="";
		if (socialNetwork) {
			elements = {
				"omnitureVariable": omnitureVariable,
				"socialNetwork": socialNetwork
			};
			additional += 15;
		}
		
		if (theme) {
			elements["omnitureVariable"] = omnitureVariable;
			elements["theme"] = theme;
			additional += 3;
		}
		
		elements["additional"] = additional;
		elements = utils.wrapWordOmniture(elements, 255);
		
		if (socialNetwork) {
			socialNetwork = socialNetwork.cleanHtmlTags().clean();	
			s.list2=elements["omnitureVariable"] + ":p:red social:"+elements["socialNetwork"];
			s.linkTrackEvents="event55";
			s.events="event55";
		}
		if (theme) {
			if (socialNetwork) {
				s.list2 += ",";
				s.linkTrackEvents += ",";
				s.events += ",";
			} else {
				eachSize = Math.ceil(255 / (omnitureVariable.toString().length + theme.length + 3));
			}
			
			theme = theme.clean();
			s.list2+=elements["omnitureVariable"] + ":t:"+elements["theme"];
			s.linkTrackEvents+="event54";
			s.events+="event54";
		}
		
		if (socialNetwork || theme) {
			s=s_gi(s_account);
			s.linkTrackVars="list2,events";
			s.tl(this,'o','click preferencia home');
			s.events="";
		}
	}
};
o.colorboxPlay = function(name) {
	if (typeof s != 'undefined') {
		name = name.clean();
		s=s_gi(s_account);
		s.linkTrackVars="prop45,eVar45,events";
		s.linkTrackEvents="event44";
		s.prop45=name+":reproduccion";
		s.eVar45=s.prop45;
		s.events="event58";
		s.list2="";
		s.tl(this,'o','reproducciones videos');
		s.events="";
	}
};
o.saytClick = function(keyword) {
	if (typeof s != 'undefined') {
		keyword = keyword.clean();
		s=s_gi(s_account);
		s.linkTrackVars="eVar20,prop20";
		s.linkTrackEvents="event33";
		s.eVar20=keyword;
		s.prop20=s.eVar20;
		s.events="event33";
		s.list2="";
		s.tl(this,'o','Click sugerencia SAYT');
		s.events="";
	}
};
o.sendFavorits = function(){
	s.events="event38";
	var favHighlightsCookie = getHighlightsFromCookie('lcfavouritescookie');
	s.eVar49 = "";
	for(var i=0;i<favHighlightsCookie.length;i++){
		if(favHighlightsCookie[i].pos == 'central'){
			s.eVar49 = s.eVar49 + 'home:cent:' + favHighlightsCookie[i].code + '-';
		}
		else if(favHighlightsCookie[i].pos == 'lateral'){
			s.eVar49 = s.eVar49 + 'home:lat:' + favHighlightsCookie[i].code + '-';
		}
		else{
			s.eVar49 = s.eVar49 + 'home:' + favHighlightsCookie[i].pos + ':' + favHighlightsCookie[i].code + '-';
		}
	}
	if(s.eVar49 != null && s.eVar49.length > 1 && s.eVar49[s.eVar49.length -1] == '-'){
		s.eVar49 = s.eVar49.slice(0, s.eVar49.length - 1);
	}
	s.prop49 = s.eVar49;
};

String.prototype.cleanHtmlTags = function(){
	var div = document.createElement("div");
	div.innerHTML = this;
	return div.textContent;
};

//String clean up
latin = {};
latin.map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};
String.prototype.clean=function(){return this.replace(/[^A-Za-z0-9\[\] ]/g,function(a){return latin.map[a]||a;}).replace(/[^a-z0-9_\s]/gi, '');};
    