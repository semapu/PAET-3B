/**
 * Author: VILT GROUP.
 * Version: 1.0
 * Description: Framework of Public Methods
 */

    // Global variables
    var NEOInstances = [];
    var NEOInstancesNum = 0;
    var NEOArticleDropdowns = false;
    var NEOArticleGroupTabs = false;
    var NEOArticleAndFAQGroupTabs = false;
    var NEOArticleGroupTabsMobile = false;
    var NEOpromoDropDowns = false;
	var NEOoverlays = false;
    var pop1 = false;

    // NEO Constructor
    var NEO = function() {

        // Private properties
        var carouselNum;

        // Private methods
        function getAnchor() {
            var dir = document.location.href;
            var pos = dir.indexOf("#");
            var anchor;
            if(pos != -1){
                anchor = dir.substring(pos+1);
				//return anchor;
				if( anchor.length > 0 && ($('#'+ anchor).length > 0 || $('.' + anchor).length > 0 )){
					return anchor;
			    }else{
					document.location.href = document.location.href.split('#')[0];
					return false;
				}                
            }  else {
                return false;
            }

        }
        function ocultarLayer(id) {
            document.getElementById(id).style.display='none';
        }
        function dropdown() {
            if (document.getElementById("caixabank_layer").style.display == 'none') {
                document.getElementById("caixabank_layer").setAttribute('class','header_dropdown_layer active');
                document.getElementById("trigger").setAttribute('class','link dropdown_trigger active');
                document.getElementById("caixabank_layer").style.display='block';
            } else {
                document.getElementById("caixabank_layer").setAttribute('class','header_dropdown_layer');
                document.getElementById("trigger").setAttribute('class','link dropdown_trigger');
                document.getElementById("caixabank_layer").style.display='none';
            }
        }
        function dropdown2() {
            if (document.getElementById("dropdown_bottom").style.display == 'none') {
                document.getElementById("dropdown_bottom").setAttribute('class','dropdown_bottom active');
                document.getElementById("trigger2").setAttribute('class','link link1 main active');
                document.getElementById("dropdown_bottom").style.display='block';
            } else {
                document.getElementById("dropdown_bottom").setAttribute('class','dropdown_bottom');
                document.getElementById("trigger2").setAttribute('class','link link1 main');
                document.getElementById("dropdown_bottom").style.display='none';
            }
        }
        function ocultarMenu() {
            $("#left_menu .linkgroup_content_level2").hide();
        }
		
		// This function is to scroll page to clicked area
		function scrollToElement(selector, time, verticalOffset) {
			time = typeof(time) != 'undefined' ? time : 1000;
			verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
			element = $(selector);
			offset = element.offset();
			offsetTop = offset.top + verticalOffset;
			$('html, body').animate({
				scrollTop: offsetTop
			}, time);
		}


        //This function returns the index of the main class
        function getClassNumber(clases){
            var classNumber = clases.replace(/\D/g,'');
            var selector = ".product_carousel_item.no_link.product" + classNumber;
            var returnValues = {
                st: selector,
                clase: classNumber
            }
            return returnValues;
        }
        
        
        /**
         * Extracts the index of the current tab from the product
         */
        function getClassNumberTabs (cssClasses) {
        	var productIndex = cssClasses.match(/product\d+/).pop().match(/\d+/);
            var selector = ".product_tabs5_item.no_link.product" + productIndex;
            var returnValues = {
                st: selector,
                clase: productIndex
            }
            return returnValues;
        }

        //This function displays the dropdown the carousel items
        function articleDropDown(elem){

            var selector= getClassNumber(elem);
            var clase = selector.clase;
            $(selector.st).toggleClass("active");
            $(".product_carousel_item").not(selector.st).removeClass("active");
            $(".product_carousel .product" + clase + ".dropped").toggleClass("active");
            $(".product_carousel .product.dropped").not(".product_carousel .product" + clase + "").removeClass("active");
            $(".product_carousel .product" + clase + ".dropped").toggleClass("hidden");
            $(".product_carousel .product.dropped").not(".active").addClass("hidden");
			   var temporal = $(".product_carousel .product" + clase).attr('id');
			   $(".product_carousel .product" + clase).attr('id','');
			   document.location.href = document.location.href.replace(document.location.hash,'') + '#' + temporal;
			   $(".product_carousel .product" + clase).attr('id',temporal);
			
            //The carousel scrolls to the active element
            $('.product' + clase).trigger('slideTo', ['.product' + clase, 0]);
            return clase;

        }
        

		
		
		
		//This function displays the dropdown the tabs items
        function articleDropDownTabs(elem){
        	var selector= getClassNumberTabs(elem);
        	var clase = selector.clase;
        	$(selector.st).toggleClass("active");
        	$(".product_tabs5_item").not(selector.st).removeClass("active");
        	$(".product_tabs5 .product" + clase + ".dropped").toggleClass("active");
        	$(".product_tabs5 .product.dropped").not(".product_tabs5 .product" + clase + "").removeClass("active");
        	$(".product_tabs5 .product" + clase + ".dropped").toggleClass("hidden");
        	$(".product_tabs5 .product.dropped").not(".active").addClass("hidden");
        	document.location.hash = $(".product_tabs5 .product" + clase).attr('id');
        	return clase;
        }


        this.productTabs5Dropdown = function () {
        	var clases, clase, values;
        	var elem= String();

        	// all dropdowns are hidden by default
        	$(".product_tabs5 .product.dropped").addClass("hidden");

        	//If the URL contains an identifier #...
        	if (document.location.hash) {
        		clases = $(document.location.hash).attr("class");
        		clase = articleDropDownTabs(clases);
        	} else {
        		//If the carousel elements have no dropdown content
        		if (!$('#tabs5 li').hasClass('no_link')){

        			//Search URL in the DOM
        			var url=document.location.href;
        			var pos = url.lastIndexOf("/");
        			var urlDestino=url.substring(pos+1);
        			var elemHref=$('li.product_tabs5_item a[href*="'+urlDestino+'"]:first').attr('href');

        			//If there is an anchor that contains the url in "href" atribute...
        			if(elemHref!=null){
        				//Drop down the article that matches with url and add the class "active" to the carousel element clicked.
        				clases=$('li.product_tabs5_item a[href*="'+urlDestino+'"]:first').parent().parent().parent().attr('class');
        				values= getClassNumber(clases);
        				clase=values.clase;


        				$(".product_tabs5_item.product" + clase).addClass("active");
        				$(".product_tabs5_item").not(".product_tabs5_item.product" + clase).removeClass("active",true);


        				//Element contents
        				$(".product_tabs5 .product" + clase + ".dropped").toggleClass("active");
        				$(".product_tabs5 .product.dropped").not(".product_tabs5 .product" + clase + ".dropped").removeClass("active");
        				$(".product_tabs5 .product.dropped").not(".product_tabs5 .product" + clase + ".dropped").addClass("hidden");

        				//The carousel scrolls to the active element
        				$('.product' + clase).trigger('slideTo', ['.product' + clase, 0]);

        				//Display Switch on/off
        				$(".product_tabs5_item.product" + clase).click(function(event){
        					event.preventDefault();
        					$(".product_tabs5_item.product" + clase).toggleClass("active");
        					$(".product_tabs5 .product" + clase + ".dropped").toggleClass("active");
        				});

        			}
        			else{
        				//Carousel with external links only: Remove the class ".active" to all the items
        				$(".product_tabs5_item").removeClass("active",true);
        				$(".product_tabs5 article.product.dropped").addClass("hidden");
        			}
        		} else {
        			//Search the 1st dropdown item and active it
        			var first = $('#tabs5 li.no_link:first').attr('class');
        			values= getClassNumberTabs(first);
        			clase=values.clase;
        			$(".product" + clase).addClass("active").removeClass("hidden");
        		}
        	}


        	//CALLBACKS MANAGEMENT BLOCK
        	$('#left_menu .linkgroup_list_content ul li a[href*="#"]').click(function () {
        		var st =new String($(this).attr("href").toString());
        		//If the anchor contains destination identifier from the # ...
        		if(st.length > 1){
        			var id = $(this).attr("href").substr($(this).attr("href").indexOf("#")+1,$(this).attr("href").length);
        			clases=$('#'+ id).attr("class");
        			clase=articleDropDownTabs(clases);
        			scrollToElement(".product_tabs5 .product_tabs5_item.product" + clase );
        		}


        	});

        	$(".product_tabs5_item.no_link").click(function(event){
        		event.preventDefault();
        		elem = $(this).attr("class");
        		articleDropDownTabs(elem);
        		//var currentscroll = $(document).scrollTop() - 500;// jump to the top of the page
        		//$(document).scrollTop(currentscroll);

        		if (typeof o != 'undefined') o.panelOpen($(this).attr("id"));
        	});

        };



        // Public methods
        this.productCarouselDropdown =
            function () {
                var clases, clase, URLparse, values;
                var elem= String();

                $(".product_carousel .product.dropped").addClass("hidden");

                //If the URL contains an identifier #...
                if(URLparse=getAnchor()){
                    clases=$('#'+ URLparse).attr("class");
                    clase=articleDropDown(clases);
                    //scrollToElement(".product_carousel .product_carousel_item.product" + clase );
                    if (typeof o != 'undefined') o.panelOpen($(".product_carousel .product_carousel_item.product" + clase).attr("id"), false);
                }
                else{
                    //If the carousel elements have no dropdown content
                    if (!$('#carousel li').hasClass('no_link')){

                        //Search URL in the DOM
                        var url=document.location.href;
                        var pos = url.lastIndexOf("/");
                        var urlDestino=url.substring(pos+1);
                        var elemHref=$('li.product_carousel_item a[href*="'+urlDestino+'"]:first').attr('href');

                        //If there is an anchor that contains the url in "href" atribute...
                        if(elemHref!=null){
                            //Drop down the article that matches with url and add the class "active" to the carousel element clicked.
                            clases=$('li.product_carousel_item a[href*="'+urlDestino+'"]:first').parent().parent().parent().attr('class');
                            values= getClassNumber(clases);
                            clase=values.clase;

                            $(".product_carousel_item.product" + clase).addClass("active");
                            $(".product_carousel_item").not(".product_carousel_item.product" + clase).removeClass("active",true);

                            //Element contents
                            $(".product_carousel .product" + clase + ".dropped").toggleClass("active");
                            $(".product_carousel .product.dropped").not(".product_carousel .product" + clase + ".dropped").removeClass("active");
                            $(".product_carousel .product.dropped").not(".product_carousel .product" + clase + ".dropped").addClass("hidden");
							
							//The carousel scrolls to the active element
                           	$('.product' + clase).trigger('slideTo', ['.product' + clase, 0]);

                            //Display Switch on/off
                            $(".product_carousel_item.product" + clase).click(function(event){
                                event.preventDefault();
                                $(".product_carousel_item.product" + clase).toggleClass("active");
                                $(".product_carousel .product" + clase + ".dropped").toggleClass("active");
                            });

                        }
                        else{
                            //Carousel with external links only: Remove the class ".active" to all the items
                            $(".product_carousel_item").removeClass("active",true);
                            $(".product_carousel article.product.dropped").addClass("hidden");
                        }

                    }//if Search URL block end
                    else{
                        //Search the 1st dropdown item and active it
                        var first=$('#carousel li[class*="no_link"]:first').attr('class');
                        values= getClassNumber(first);
                        clase=values.clase;
                        $(".product" + clase).addClass("active");
                        $(".product .product" + clase + ".dropped").toggleClass("active");
                        //document.location.href = document.location.href.replace(document.location.hash,'') + '#' + $(".product_carousel .product" + clase).attr('id');
                        //The carousel scrolls to the active element
                        $('.product' + clase).trigger('slideTo', ['.product' + clase, 0]);
                    }

                }//else URLparse=getAnchor() block end

                //CALLBACKS MANAGEMENT BLOCK
                $('#left_menu .linkgroup_list_content ul li a[href*="#"]').click(function () {
                    var st =new String($(this).attr("href").toString());
                    //If the anchor contains destination identifier from the # ...
                    if(st.length > 1){
                        var id = $(this).attr("href").substr($(this).attr("href").indexOf("#")+1,$(this).attr("href").length);
                        clases=$('#'+ id).attr("class");
                        clase=articleDropDown (clases);
                        scrollToElement(".product_carousel .product_carousel_item.product" + clase );
                    }

                });

                $(".product_carousel_item.no_link").click(function(event){
                    event.preventDefault();
                    elem = $(this).attr("class");
                    articleDropDown (elem);
                    //var currentscroll = $(document).scrollTop() - 500; // Jump to the page
                    //$(document).scrollTop(currentscroll);
                    
                    if (typeof o != 'undefined') o.panelOpen($(this).attr("id"), false);
                });

            };
        this.multiHightlight =
            function (){
                $(".sp-vermulti").click(function() {
                    if (!$(".sp-vermulti").hasClass("active")) {
                        $(".sp-vermulti").addClass("active");
                        $(".highlights_widget_content").removeClass().addClass("highlights_widget_content multiview");
                    }
                    $(".sp-verunico").removeClass("active");
                    $(".sp-verlista").removeClass("active");
                });
                $(".sp-verunico").click(function() {
                    if (!$(".sp-verunico").hasClass("active")) {
                        $(".sp-verunico").addClass("active");
                        $(".highlights_widget_content").removeClass().addClass("highlights_widget_content uniqueview");
                    }
                    $(".sp-vermulti").removeClass("active");
                    $(".sp-verlista").removeClass("active");
                });
                $(".sp-verlista").click(function() {
                    if (!$(".sp-verlista").hasClass("active")) {
                        $(".sp-verlista").addClass("active");
                        $(".highlights_widget_content").removeClass().addClass("highlights_widget_content listview");
                    }
                    $(".sp-verunico").removeClass("active");
                    $(".sp-vermulti").removeClass("active");
                });
            };
        this.init =
            function init() {
                ocultarLayer("caixabank_layer");
                ocultarLayer("dropdown_bottom");
                document.getElementById("footer").setAttribute('class','footer landingMedium graybg fixed');
                document.getElementById("trigger").onclick=dropdown;
                document.getElementById("trigger2").onclick=dropdown2;
                ocultarMenu();
                $("#left_menu .linkgroup1 .linkgroup_title h3 a").click(function(){
                    $("#left_menu .linkgroup1 .linkgroup_content_level2").toggle('fast');
                    $("#left_menu .linkgroup1").toggleClass("active");
                })
                $("#left_menu .linkgroup2 .linkgroup_title h3 a").click(function(){
                    $("#left_menu .linkgroup2 .linkgroup_content_level2").toggle('fast');
                    $("#left_menu .linkgroup2").toggleClass("active");
                })
                $("#left_menu .linkgroup3 .linkgroup_title h3 a").click(function(){
                    $("#left_menu .linkgroup3 .linkgroup_content_level2").toggle('fast');
                    $("#left_menu .linkgroup3").toggleClass("active");
                })
                $("#left_menu .linkgroup4 .linkgroup_title h3 a").click(function(){
                    $("#left_menu .linkgroup4 .linkgroup_content_level2").toggle('fast');
                    $("#left_menu .linkgroup4").toggleClass("active");
                })
            };
           this.articleGroupDropdown =
            function articleGroupDropdown() {
                if (!NEOArticleDropdowns){
                    $(".article_group .article:not(.main)").addClass("hidden");
                    $(".article_group .article:not(.main) .article_title").click(function(){						
						tam =  $(this).parent().parent().attr("class").lastIndexOf("article");
                    	clase = $(this).parent().parent().attr("class").substring(tam+7,tam+8);												
                        $(".article_group .article.normal.active .article_intro").not($(this).closest(".article").find(".article_intro")).hide();
                        $(".article_group .article.normal.active .article_text").not($(this).closest(".article").find(".article_text")).hide();
                        $(".article_group .article.normal.active .article_media").not($(this).closest(".article").find(".article_media")).hide();
                        $(".article_group .article.normal.active .article_footer").not($(this).closest(".article").find(".article_footer")).hide();
                        $(".article_group .article.normal.active").not($(this).closest(".article")).removeClass("active").addClass("hidden");
                        $(this).closest(".article").find(".article_intro").slideToggle("fast");
                        $(this).closest(".article").find(".article_text").slideToggle("fast");
                        $(this).closest(".article").find(".article_media").slideToggle("fast");
                        $(this).closest(".article").find(".article_footer").slideToggle("fast");
                        $(this).closest(".article").toggleClass("active");
                        $(this).closest(".article").toggleClass("hidden");
						//document.location.href = document.location.href.replace(document.location.hash,'') + '#' + "article" + clase;						
						scrollToElement(this);	
						if (typeof o != 'undefined') o.panelOpen($(this).find("a").attr("href"), false);
                    });
					
					// anchor links
					var clase;					
					$('a[href*="#article"]').click(function () {												
						clase = $(this).attr("href").substr(-1);						
						$(".article_group .article:not(.main)").removeClass("active").addClass("hidden");
						$(".article_group .article:not(.main) > div").hide();
						$(".article" + clase).removeClass("hidden").addClass("active");						
						$(".article" + clase + " " + ".article_intro").slideDown("fast");
						$(".article" + clase + " " + ".article_text").slideDown("fast");
						$(".article" + clase + " " + ".article_media").slideDown("fast");
						$(".article" + clase + " " + ".article_footer").slideDown("fast");					
						scrollToElement(".article" + clase);
					 });
										
					// scroll page to clicked area by anchor url
					var ancla = getAnchor();
					if(ancla){
						$("#" + ancla + "").removeClass("hidden").addClass("active");
						$("#" + ancla + " .article_intro").slideDown("fast").css('display','block');
						$("#" + ancla + " .article_text").slideDown("fast").css('display','block');
						$("#" + ancla + " .article_media").slideDown("fast").css('display','block');
						$("#" + ancla + " .article_footer").slideDown("fast").css('display','block');
						
						var parentExist = $("#" + ancla).data("parent");
						if (typeof $("#" + ancla).data("parent") !== "undefined" && $("#" + parentExist)[0]) {
							$("#" + parentExist).trigger("click");
						}
						
						scrollToElement("." + ancla + " " + "h2" );
						if (typeof o != 'undefined') o.panelOpen(ancla, false);
					} else {
						//$(".product1").addClass("active");
					}				
										
                    NEOArticleDropdowns = true;
					
                }
            };
        this.articleGroupTabs =
            function articleGroupTabs() {
                if (!NEOArticleGroupTabs){
                    var clase;
                    var tam;
                    var num;
                    $(".article_group .article:not(.main):not(.article2)").addClass("hidden");
                    $(".article_group .article_group_title").click(function(){
                        tam =  $(this).attr("class").length;
                        clase = $(this).attr("class").substr(tam-1);
                        $(this).toggleClass("active");
                        $(this).closest(".article_group.tabs").find(".article_group_title").not(this).removeClass("active");
                        $(this).closest(".article_group.tabs").find(".article" + clase + "").toggleClass("active");
                        $(this).closest(".article_group.tabs").find(".article:not(.main)").not(".article" + clase + "").removeClass("active");
                        $(this).closest(".article_group.tabs").find(".article" + clase + "").toggleClass("hidden");
                        $(this).closest(".article_group.tabs").find(".article:not(.main):not(.active)").addClass("hidden");
                    });
                    NEOArticleGroupTabs = true;
                    
					// scroll page to clicked area by anchor url
					var ancla = getAnchor();
					if(ancla){
						$('.article:not(.article1)').addClass("hidden");
						$("." + ancla + "").removeClass("hidden").addClass("active");
						$(".article_group.tabs .article_group_title.tab" + ancla.substr(-1)).addClass("active");
						scrollToElement(".article_group.tabs .article_group_title" );
					} else {
						 if(typeof(site) !== "undefined") {
							if (site == "particulares" || site == "empresas") {
								if ($(".article_group.tabs").length > 0) {
									$(".article_group.tabs .article_group_title.tab2").addClass("active");
									$(".article_group.tabs .article.article2").removeClass("hidden").addClass("active");
								}
							}
						}
					}
					
                }
            }
        this.articleAndFAQGroupTabs =
            function articleAndFAQGroupTabs() {
                if (!NEOArticleAndFAQGroupTabs){
                    var clase;
                    var tam;
                    var num;
                    $(".article_group .article:not(.main):not(.article2)").addClass("hidden");
                    $(".article_group .faqs:not(.main):not(.article2)").addClass("hidden");
                    $(".article_group .article_group_title").click(function(){
                        tam =  $(this).attr("class").length;
                        clase = $(this).attr("class").substr(tam-1);
                        $(this).toggleClass("active");
                        $(this).closest(".article_group.tabs").find(".article_group_title").not(this).removeClass("active");
                        $(this).closest(".article_group.tabs").find(".article" + clase + "").toggleClass("active");
                        $(this).closest(".article_group.tabs").find(".article:not(.main)").not(".article" + clase + "").removeClass("active");
                        $(this).closest(".article_group.tabs").find(".faqs:not(.main)").not(".article" + clase + "").removeClass("active");
                        $(this).closest(".article_group.tabs").find(".article" + clase + "").toggleClass("hidden");
                        $(this).closest(".article_group.tabs").find(".article:not(.main):not(.active)").addClass("hidden");
                        $(this).closest(".article_group.tabs").find(".faqs:not(.main):not(.active)").addClass("hidden");
						//document.location.href = document.location.href.replace(document.location.hash,'') + '#' + "article" + clase;
						if (typeof o != 'undefined') o.panelOpen($(this).attr("id"), false);
                    });
					
					// anchor links
					$('a[href*="#article"]').click(function () {						
						$(".article_group .article:not(.main)").removeClass("active").addClass("hidden");
						$(".article_group.tabs .article_group_title").removeClass("active");				
						clase = $(this).attr("href").substr(-1);
						$(".article_group.tabs .article" + clase ).removeClass("hidden").addClass("active");
						$(".article_group.tabs .article_group_title.tab" + clase ).addClass("active");
						scrollToElement(".article_group.tabs .article_group_title" );
					 });
					 
					// scroll page to clicked area by anchor url
					var ancla = getAnchor();
					if(ancla){
						var parentExist = $("#" + ancla).data("parent");
						if (typeof $("#" + ancla).data("parent") !== "undefined" && $("#" + parentExist)[0]) {
							$("#" + parentExist).trigger("click");
						}
						$('.article:not(.article1)').addClass("hidden");
						$("." + ancla + "").removeClass("hidden").addClass("active").css('display','block');
						$(".article_group.tabs #" + ancla).addClass("active");
						scrollToElement(".article_group.tabs .article_group_title" );
						if (typeof o != 'undefined') o.panelOpen(ancla, false);
					} else {
						 if(typeof(site) !== "undefined") {
							if (site == "particulares" || site == "empresas") {
								if ($(".article_group.tabs").length > 0) {
									$(".article_group.tabs .article_group_title.tab2").addClass("active");
									$(".article_group.tabs .article2").removeClass("hidden").addClass("active");
								}
							}
						}
					}
					
                    NEOArticleAndFAQGroupTabs = true;
                    
                   
                }
            }
        this.articleGroupTabsMobile =
            function articleGroupTabsMobile() {
                if (!NEOArticleGroupTabsMobile){
                    var clase;
                    var tam;
                    var num;
                    $(".article_group .article:not(.main):not(.article2)").addClass("hidden");
                    $(".article_group .article.article2").removeClass("hidden");
                    $(".article_group .article.article2").addClass("active");
                    $(".article_group .tab2").addClass("active");
                    $(".article_group .article_group_title").click(function(){
                        tam =  $(this).attr("class").length;
                        clase = $(this).attr("class").substr(tam-1);
                        $(this).toggleClass("active");
                        $(this).closest(".article_group.tabs").find(".article_group_title").not(this).removeClass("active");
                        $(this).closest(".article_group.tabs").find(".article" + clase + "").toggleClass("active");
                        $(this).closest(".article_group.tabs").find(".article:not(.main)").not(".article" + clase + "").removeClass("active");
                        $(this).closest(".article_group.tabs").find(".article" + clase + "").toggleClass("hidden");
                        $(this).closest(".article_group.tabs").find(".article:not(.main):not(.active)").addClass("hidden");
                    });
                    NEOArticleGroupTabsMobile = true;
                }
            }
        this.promoDropDown =
            function promoDropDown() {
                if (!NEOpromoDropDowns){
                    $(".promo_intro .columna_derecha img").click(
                        function () {
                            $(this).closest(".promo").find('.promo_text .infotop').slideToggle();
                            $(this).closest(".promo").find('.promo_text .infobox').slideToggle();
                        });
                    NEOpromoDropDowns = true;
                }
            }
		this.overlayLayer =
            function overlayLayer() {
                if (!NEOoverlays){
                    $(".overlay").popup();
                    $("#bottomMenu2 li a").live("touchstart",function(){
                        if(!pop1){
                            var pos = $(this).closest("#bottomMenu2 li").index() + 1;
                            $(".ui-popup").popup("close");
                            $(".overlay" + pos).show();
                            $(".overlay" + pos).popup("open");
                            pop1 = true;
                        }
                    });
                    $("#bottomMenu2 li a").live("touchend",function(){
                        if(pop1){
                            var pos1 = $(this).closest("#bottomMenu2 li").index() + 1;
                            $(".overlay" + pos1).popup('close');
                            pop1 = false;
                            window.location = $(this).attr("href");
                        }
                    });
                    NEOoverlays = true;
                }
            }
        this.alwaysVisible =
            function alwaysVisible(layer) {
                if ($(".central_right_container").length > 0) {					
									
					$('.central_right_container > DIV').wrapAll('<div id="wraperRightDivs"></div>');
					
					// RIGHT CONTAINER FIXED POSITION THREE COLUMNS	
					function fixDiv3() {
					  var $cache = $('.central_right_container.threecolumns #wraperRightDivs');
					  if( $('#l-caixabank').is(':visible') ) {
							var y = 413;			
					  }else{
							var y = 178;
					  } 
					  if ($(window).scrollTop() > y) 
						$cache.css({'position': 'fixed', 'top': '0', 'width': '120px'}); 
					  else
						$cache.css({'position': 'relative', 'top': 'auto', 'width': '120px'});
					}
					$(window).scroll(fixDiv3);
					fixDiv3();
					
					// RIGHT CONTAINER FIXED POSITION TWO COLUMNS					
					function fixDiv2() {
					  var $cache = $('.central_right_container.twocolumns #wraperRightDivs');
					  if( $('#l-caixabank').is(':visible') ) {
							var y = 413;			
					  }else{
							var y = 178;
					  }  
					  if ($(window).scrollTop() > y) 
						$cache.css({'position': 'fixed', 'top': '0', 'width': '180px'}); 
					  else
						$cache.css({'position': 'relative', 'top': 'auto', 'width': '180px'});
					}
					$(window).scroll(fixDiv2);
					fixDiv2();

                    					
                }
            }
        this.footerDropdown =
            function footerDropdown() {
                $("#trigger2").click(function() {
                    if (!$("#dropdown_bottom").hasClass("active")) {
                        $(".dropdown_bottom").removeClass().addClass('dropdown_bottom active');
                        $("#trigger2").removeClass().addClass('link link1 main active');
                        $(".dropdown_bottom").slideToggle();
                    } else {
                        $(".dropdown_bottom").removeClass().addClass('dropdown_bottom');
                        $("#trigger2").removeClass().addClass('link link1 main');
                        $(".dropdown_bottom").slideToggle();
                    }
                });
            }
        this.setHeight =
            function setHeight (elements) {
                var maxHeight = 0;
                $(elements).each(function(){
                    currentHeight = $(this).height();
                    if(currentHeight > maxHeight){
                        maxHeight = currentHeight+10;
                    }
                });
                $(elements).height(maxHeight);
            }
		this.faqsWorkingUrl =
            function faqsWorkingUrl() {
								
				var ancla = getAnchor();
					if(ancla){
						$('#' + ancla + ' .answer').show();
					}
					
            }
    };

    function getNEOInstance(){
        NEOInstancesNum = NEOInstances.length;
        NEOInstances[NEOInstancesNum] = new NEO();
        return NEOInstances[NEOInstancesNum];
    }
    
    (function ($) {  	
    	$.fn.vAlign = function() {
    		if(typeof(site) !== "undefined") {
        		if (site == "particulares" || site == "empresas") {
		    	    return this.each(function(i){
			    	    var ah = $(this).height();
			    	    var ph = $(this).parent().height();
			    	    var mh = Math.ceil((ph-ah) / 2);
			    	    $(this).css('padding-top', mh );
						
						if( $('.article_group_tabs_header ul li').height() < 40) {
							$(this).addClass('line_1');
						}
						else if( $('.article_group_tabs_header ul li').height() > 40) {
							$(this).addClass('line_2');
						}
						else{
							//potato
						}						
						
		    	    });
        		}
        	}
    	};
    })(jQuery);
    
    function initHeight(){
    	if(typeof(site) !== "undefined") {
    		if (site == "particulares" || site == "empresas") {
    			if ($(".article_group_tabs_header ul li").length > 0) {
    				getNEOInstance().setHeight(".article_group_tabs_header ul li");
		        }
            }
    	}
    };
	
	function alignCarouselForTwoOrThreeelements(){
    	if(typeof(site) !== "undefined") {
    		if (site == "particulares" || site == "empresas") {
			    $(".dropdown #carousel").each(function() {
			        var elem = $(this);
			        if (elem.children("li").length == 2 ) {
			            $("#carousel").css("margin-left", "13em");
			            $("#carousel .product2 .product").css("background", "none");						
						//$("#carousel").css("height", "140px");
						//$("#carousel li").css("height", "auto");
			        }
			        else if (elem.children("li").length == 3 ) {
			            $("#carousel").css("margin-left", "7.3em");
			            $("#carousel .product3 .product").css("background", "none");						
						//$("#carousel").css("height", "140px");
						//$("#carousel li").css("height", "auto");
			        }
			    });
    		}
    	}
    };  
	
	//Functions for header search form
    function getIntroduceText(language){
        if (site == "particulares"){

            if(language == 'ca'){
                return 'Què estàs buscant? Escriu-lo aquí.';
            }
            else if(language == 'en'){
                return '¿Qué estás buscando? Escríbelo aquí.';
            }
            else{
                return '¿Qué estás buscando? Escríbelo aquí.';
            }
        }
        else if(site == "empresas"){

            if(language == 'ca'){
                return 'Què està buscant? Escrigui-ho aquí.';
            }
            else if(language == 'en'){
                return '¿Qué está buscando? Escríbalo aquí.';
            }
            else{
                return '¿Qué está buscando? Escríbalo aquí.';
            }

        }
    }


    function validate(language, inputBoxId){
	var INTRODUCE = getIntroduceText(language);
	var inputBox = document.getElementById(inputBoxId);
		if((inputBox.value.toUpperCase() == INTRODUCE.toUpperCase()) || (inputBox.value.length==0)){
			inputBox.value=INTRODUCE;
			return false;
		}
	}
	
	function focused(language, inputBoxId){
	var INTRODUCE = getIntroduceText(language);
	var inputBox = document.getElementById(inputBoxId);
		if(inputBox.value==INTRODUCE){
			inputBox.value="";
		}
		else{inputBox.value=INTRODUCE;}
	}

	// Adds the aria-level attr to all headers
	function addAriaLevels(){
		$(":header").attr('role','heading').attr('aria-level',function() {
			return $(this).prop('tagName').slice(-1);
		});
	}

	// Checks if exists an anchor on the url and uses that anchor to set up the main carrousel
	function checkForAnchorCarrousel(){
		anchor = document.location.hash;
		check = $(".ss-controls ul li a[href='" + anchor + "']").length > 0;
		if(anchor != "" && check){
			carrousel.slideToAnchor(anchor);
		}
	}
	
	// ALIGN TABLE HORIZONTAL "THEAD TH" SIZE
	function tableHorizSizeAlignTH(){
		if ($('article table > thead').length > 0 || $('DIV.products table > thead').length > 0 ){				
				$("table > thead").each(function() {					
					if ($.trim ($(this).find("tr:first-child > th:first-child").text() )=="" ){	
						//true "thead th" is empty
						var sizeWidth = 75;    
						var elCount = $(this).find('tr > th').not(':first-child');				
						$(this).find('tr:first-child > th:first-child').css('width','25%');				
					}else{
						//false "thead th" is NOT empty
						var sizeWidth = 100;
						var elCount = $(this).find('tr > th');
					}			
						var elCountSize = elCount.size();
						var elWidth = sizeWidth / elCountSize + "%";				
						elCount.css('width',elWidth);
				});			
		}else{
			//console.warn('no articles or products');
		}
	} 
	$(document).ready(function() {	
		tableHorizSizeAlignTH();
	});	