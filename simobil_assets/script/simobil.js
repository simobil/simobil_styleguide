var Simobil = {
	init: function () {
		$('.scrollable:not(.bound)').each(function() {
			$(this).scrollable({
				onSeek: function (event, index) {

					var scrollable = this.getRoot();
					var container_width = scrollable.width();
					var item_width = $('li', scrollable).width();

					if (scrollable.is(':hidden')) {
						container_width = scrollable.parent().getHiddenDimensions().w;
						item_width = $('li', scrollable).getHiddenDimensions().w;
					}

					var items_per_page = Math.floor(container_width/item_width);

					if (this.getIndex() >= (this.getSize() - items_per_page)) {
						$(".next", this.getRoot().parent()).addClass("disabled");
				    } else {
						$(this).data('disable', false);
					}
				},
				onBeforeSeek: function (event, index) {
					if (index > this.getIndex() && $(this).data('disable')) {
						return false;
					}
					var scrollable = this.getRoot();
					var container_width = scrollable.width();
					var item_width = $('li', scrollable).width();

					if (scrollable.is(':hidden')) {
						container_width = scrollable.parent().getHiddenDimensions().w;
						item_width = $('li', scrollable).getHiddenDimensions().w;
				    }

					var items_per_page = Math.floor(container_width/item_width);

					if (index >= (this.getSize() - items_per_page)) {
						$(this).data('disable', true);
				    }
				}
			}).navigator('.navi').addClass('bound');

			Simobil.updateScrollableNav($(this));
		});

		/** Scrollable big gallery (product detail) **/
		$('.big-gallery:not(.bound)')
			.scrollable({
				prev: '.big-gallery .prev',
				next: '.big-gallery .next'
			}).navigator('.thumbnails').addClass('bound');


		/** Lightbox **/

		_opened_lightbox = null;

		$(".lightbox-trigger[rel]:not(.bound)").each(function() {
	        var el = $(this);
	        var target = el.attr('rel');
	        $(target).appendTo('.page-block.page');
	        el.overlay({
	            target: target,
			mask: {
		        color: '#333',
		        loadSpeed: 200,
		        opacity: 0.9
		    },
		    closeOnClick: false,
		    fixed: false,
		    onLoad: function(event) {
		    	Simobil.equalize('.equalize', '.box');
		    	_opened_lightbox = event.target;
		    },
		    onClose: function(event) {
		    	_opened_lightbox = null;
		    }
		});
			el.addClass('bound');
	    });

		/* the old way causes bug
		$('.alightbox-trigger[rel]').overlay({
			mask: {
		        color: '#333',
		        loadSpeed: 200,
		        opacity: 0.9
		    },
		    closeOnClick: false,
		    fixed: false,
		    onLoad: function(event) {
		    	_opened_lightbox = event.target;
		    },
		    onClose: function(event) {
		    	_opened_lightbox = null;
		    }
		}); */

		$('.lightbox [rel*="close"]:not(.bound)').click(function (e) {
			e.preventDefault();
			if (_opened_lightbox != null) {
				$(_opened_lightbox).overlay().close();
			}
		}).addClass('bound');

	},
	updateScrollableNav: function(el) {
		var api = el.data('scrollable');
		if (typeof api == 'undefined') return;

		var scrollable = api.getRoot();
		var container_width = scrollable.width();
		var item_width = $('li', scrollable).width();

		var items_per_page = Math.floor(container_width/item_width);

		if ($('li', scrollable).length <= items_per_page) {
			$(".next", scrollable.parent()).addClass("disabled");
			$(".navi", scrollable.parent()).hide();
		} else {
			$(".next", scrollable.parent()).removeClass("disabled");
		}
	},

	/** Equal height child elements **/
	equalize : function (selector, child) {
		$(selector).each(function(idx, el) {
			setTimeout(function(){
				var _max_height = 0;
				$(child, $(el)).each(function() {
					$(this).css('height','auto');
					_max_height = Math.max(_max_height, $(this).height());
				});
				$(child, $(el)).height(_max_height);
			},200);
		});
	}

};

(function($) {

	$(function() {
                //do not merge this
		$(".package-accordian-top.accordion-group").click(function(e) {
			e.preventDefault();
			$(this).hide();
			$(".package-accordian-bottom.accordion-group").css("display","block");
			$(".package-accordian-bottom.accordion-group").show();
			//$("#hiddenpackages").css("padding-top","28px");
		});

		$(".package-accordian-bottom.accordion-group").click(function(e) {
			e.preventDefault();
			$(this).hide();
			$(".package-accordian-top.accordion-group").show();
		});

		var placeHolderSupport = ("placeholder" in document.createElement("input"));
		if (!placeHolderSupport) {
			$.getScript('simobil_assets/script/lib/placeholder.min.js', function() {
				 Placeholder.init();
			});
		}

		/** Top Menu */
		$('nav ul.first').on('click', 'li.has-sub-menu', function(e) {

			if( $(e.target).parents('.submenu').length == 0 ) {
				e.stopPropagation();

				var that = $(this);
				that.toggleClass('active').siblings('li').removeClass('active');

				if( $('li.has-sub-menu.active').length > 0 ) {
					$('body').addClass('main-menu-opened');
				} else {
					$('body').removeClass('main-menu-opened');
				}
				return false;
			}
		});

		/** Close main menu if clicked elsewhere than on menu */
		$('body').on('click', function(e){
			var that = $(this);

			if( $(e.target).parents('nav ul.first').length == 0 && that.hasClass('main-menu-opened') ) {
				that.removeClass('main-menu-opened');
				$('li.has-sub-menu').removeClass('active');
			}
		});

		/** Close last bought container */
		$('.last-bought').on('click', '.close-last-bought', function(){
			$(this).parent('.last-bought').removeClass('visible');
		});

		/**
		 * Custom search input for device search
		 * @see: http://loopj.com/jquery-tokeninput/
		 */
		$.getScript('simobil_assets/script/lib/jquery.tokeninput.js', function() {
			$('#device-search-input').tokenInput("demo-naprave.json", {

				method:			"GET",
				queryParam:		"q",

				hintText: 		"Vpišite ime naprave",
				noResultsText:	"Ni rezultatov",
				searchingText:	"Iščem...",
				deleteText:		"&times;",
				tokenLimit:		"1",  // allow only one result
				tokenValue:		"id",
				theme:			"simobil",

				onAdd: function(token) {
					console.log(token);
				},

				onDelete: function(token) {
					console.log(token);
				}
			});
		});

		/** Login toggle **/
		$('.top-bar li.user a').click(function(event) {
			event.preventDefault();
			$('.login-bar').slideToggle(300, function() {
				$('.cart')[0].className = $('.cart')[0].className; // IE7 force redraw
			});
		});


		Simobil.init();

		$('a[data-toggle="tab"]').on('shown', function (e) {
			$('.scrollable').each(function() {
				Simobil.updateScrollableNav($(this));
			});
		});

		$(window).on('resize', function() {
			$('.scrollable').each(function() {
				Simobil.updateScrollableNav($(this));
			});
		});



        $( document ).on("click", '.mini-gallery .zoom', (function() {
			$('.product .data').hide();
			$('.product .big-gallery').show();
        }));

        $( document).on("click", '.big-gallery .close', (function() {
			$('.product .big-gallery').hide();
			$('.product .data').show();
        }));

		/** Submenu mobile toggle **/
		$('nav ul.first > li > a').click(function(e) {
			var _submenu = $(this).next('.submenu');
			if (_submenu.length == 0) {
				return true;
			}

			if ($('.nav-collapse').hasClass('in')) {
				var _visibleItem = $('.collapse .submenu:visible');
				if (_submenu) {
					e.preventDefault();
					var _start_height = $('.nav-collapse').height();
					if (_visibleItem.length && _visibleItem.get(0) != _submenu.get(0)) {
						_visibleItem.slideUp();
					}
					_submenu.slideToggle('normal', function() {
						var _end_height = $('.nav-collapse').height();
						if (_start_height == _end_height) {
							$('.nav-collapse').height($('.nav-collapse ul.first').height());
						}
					});
					return false;
				}
			}
		});

		/** Footer navigation phone **/
		$('#footer-nav-select').change(function() {
			document.location.href = $(':selected', $(this)).val();
		});

		/** Firstpage mediascreen **/
		$('.mediascreen .navigation').tabs('.mediascreen .banners > div', {
			current:	'active',
			effect:		'fade',
			rotate:		true
		}).slideshow({
			autoplay: 	true,
			interval: 	5000,
			clickable:	false,
			autopause: true
		});

		var activeToolTip = null;
		var toolTipX = null;
		var toolTipY = null;

		/** White tooltips */
		$('body').on('click', '.open-tooltip', function(e){
			var that = $(this);

			activeToolTip = that;
			toolTipX = that.offset().left;
			toolTipY = that.offset().top;

			/** Close all visible tooltips */
			$('.white-tooltip').removeClass('visible');

			tooltipLocation( that, toolTipX, toolTipY );

			that.next('.white-tooltip').addClass('visible');

		});

		function tooltipLocation( element, xPosition, yPosition ) {
			/** Set the position, show it */
			element.next('.white-tooltip').css({
				left 	: xPosition + 35,
				top 	: ( yPosition - $(document).scrollTop() ) - 15
			});
		}

		$(window).on('scroll', function(){

			if( activeToolTip != null )
				tooltipLocation( activeToolTip, toolTipX, toolTipY );
		});

		/** Close white tooltip when clicked elsewhere */
		$(document).on('click', function(e){
			if( !$(e.target).closest('.white-tooltip').length && !$(e.target).siblings('.white-tooltip').length ) {
				$('.white-tooltip').removeClass('visible');
				activeToolTip = null;
			}
		});
		$(document).on('keyup', function(e){
			if( e.keyCode === 27 ) {
				$('.white-tooltip').removeClass('visible');
				activeToolTip = null;
			}
		});

		/** Products list item hover **/
		var activatable = ".product-listing .item:not(.no-hover), .extras .listing .item:not(.no-hover)";

		$( document ).on( "mouseenter", activatable, function() {
			$(this).addClass('over');
		});

		$( document ).on( "mouseleave", activatable, function() {
			$(this).removeClass('over');
		});

		$( document ).on( 'click', activatable, function(e) {
			$('a.more', $(this)).click();
		});

		var item_buttons = '.product-listing .item:not(.no-hover) .btn, .product-listing .item:not(.no-hover) .favourite'
		$( document ).on( "mouseenter", item_buttons, function(e) {
			e.stopPropagation();
			$(this).closest('.item').removeClass('over');
		});

		$( document ).on( "mouseleave", item_buttons, function(e) {
			e.stopPropagation();
			$(this).closest('.item').addClass('over');
		});

		$( document ).on( "click", '.product-listing .item .favourite, .product-listing .item .btn, .product-listing .item .info .controls .more', function(e) {
			var _parent = $(this).parents('.item');
			setTimeout(function() {
				_parent.removeClass('over');
			}, 200);
			e.stopPropagation();
		});

		$( document ).on( 'click', '.lightbox a.button-close', function(e) {
			$(this).parents('.lightbox').find('a.close').click();
		});

		/** Product list selection floater **/
        window.initScroll = function() {
            var $win = $(window)
                , $nav = $('#selection .selection')
                , $navParent = $('#selection')
                , navTop = $('#selection').length && $('#selection').offset().top
                , isFixed = 0;

            if ($navParent.length > 0 && !$navParent.hasClass('bound')) {
                $navParent.addClass('bound');
                $win.on('scroll', function() {
                    var scrollTop = $win.scrollTop();

                    var toolsHeight = $('.selection .tools').height();
                    var toolsTop = navTop - toolsHeight + $('.selection').height();

                    if ($('.selection .tools .scroll-top').css('display') == 'none') {
                        if (scrollTop >= navTop && !isFixed) {
                            isFixed = 1;

                            $navParent.css('height', $navParent.height());
                            $nav.addClass('fixed');

                        } else if (scrollTop <= navTop && isFixed) {
                            isFixed = 0;
                            $nav.removeClass('fixed');
                            $navParent.css('height', 'auto');
                        }
                    } else {
                        if (scrollTop > toolsTop && !isFixed) {
                            isFixed = 1;

                            $navParent.css('height', $navParent.height());
                            $('.selection .tools').addClass('fixed');

                        } else if (scrollTop <= (toolsTop+toolsHeight) && isFixed) {
                            isFixed = 0;
                            $('.selection .tools').removeClass('fixed');
                            $navParent.css('height', 'auto');
                        }

                    }
                });
            }
        };
        initScroll();

		/** Product list - close selection **/
		$('.close-selection').click(function(e) {
			e.preventDefault();
			closeSelection();
		});

		$('.open-selection').click(function(e) {
			e.preventDefault();
			openSelection();
		});

		$('.close-info').click(function(e) {
			e.preventDefault();
			if ($(this).hasClass('closed')) {
				$('#selection .info').show();
				$(this).removeClass('closed');
			} else {
				$('#selection .info').hide();
				$(this).addClass('closed');
			}

		});

		function openSelection() {
			var _data = $('.selection .container.data');
			_data.removeClass('closed');
			$('.selection .prices, .selection .tools').removeClass('closed');
			$('.open-selection').hide();
			$('.close-selection').show();
			resizeSelection();
		}

		function closeSelection() {
			var _data = $('.selection .container.data');
			if (_data.is(':visible')) {
				_data.addClass('closed');
				$('.selection .prices, .selection .number, .selection .tools').addClass('closed');
				$('.close-selection').hide();
				$('.open-selection').show();
			}
			$('.selection .scroll').height('auto');
		}


		/** bottom nav equal height **/
		Simobil.equalize('.bottom-nav', 'ul');
		Simobil.equalize('.equalize', '.item');
		Simobil.equalize('.equalize', '.pp-paket');

		/** product detail combinations selector max height **/
		if ($('.product-detail .combinations')) {
			_max_height = 0;
			$('.product-detail .combinations .scrollable li').each(function() {
				_max_height = Math.max(_max_height, $(this).height());
			});
			$('.product-detail .combinations .scrollable').height(_max_height);
		}



		/** podrobne informacije - product **/
		$('.product-detail .features .more').click(function (e) {
			e.preventDefault();
			var tab_lastnosti = $('a[href=#lastnosti]');
			tab_lastnosti.click();
			$('html, body').animate({
				scrollTop: tab_lastnosti.offset().top
			});

		});

		/** tabs **/
		$('a[data-toggle="tab"]').on('shown', function (e) {
			if (screen.width > 480) {
				Simobil.equalize($(this).attr('href') + ' .equal-height', '> div .box');
			}

		}).first().click();

		$('.tabbable-nav a').click(function(e) {
			e.preventDefault();
			var _links = $('a[data-toggle="tab"]');
			var _next = $('ul.nav-tabs li.active').index();

			if ($(this).attr('class') == 'next') {
				_next = Math.min(_next + 1, _links.length-1);
			} else {
				_next = Math.max(_next-1, 0);
			}
			$(_links.get(_next)).click();
		});

		$.ajaxSetup ({
		    cache: false
		});

		/** Vertical banner */
		$('.vertical-banner').on('click', '.title', function(){
			var that = $(this),
				banner = that.parents('.vertical-banner'),
				numberOfElements = banner.find('li').length,
				li = that.parent('li'),
				thisIndex = li.index() + 1;

			banner.find('.active').removeClass('active');

			/** Over the half */
			if( numberOfElements / thisIndex < 2 ) {
				li.addClass('below');
			} else {
				banner.find('.below').removeClass('below');
			}

			li.addClass('active');
		});

		/** Rezervacija za webinarje, gumb za prenesi PDF */
		$('body').on('click', '.btn-prijava-na-event, .btn-prenesi-pdf', function(e){
			e.preventDefault();

			var prijavnica = $('.prijavnica') || $('.pdf-download-wrapper'),
				prijavnicaHeight = prijavnica[0].scrollHeight,
				isPdfButton = false;

			/**
			 * Če smo kliknili na prenos PDF-ja gumb, vzami url link
			 * @param  {if} $(this).hasClass('btn-prenesi-pdf')
			 * @return {none}
			 */
			if( $(this).hasClass('btn-prenesi-pdf') ) {
				isPdfButton = true;
				var pdfLink = $(this).attr('data-pdf-link'),
					pdfName = $(this).attr('data-pdf-name');
			}

			if( !prijavnica.is(':animated') ) {
				if( prijavnica.hasClass('opened') && !isPdfButton ) {
					/** Zapri prijavnico */
					prijavnica.css('max-height', 0).removeClass('opened');

					if( isPdfButton ) {
						prijavnica.find('#pdf-url').val('');
					}
				} else {
					/** Odpri prijavnico */
					prijavnica.css('max-height', prijavnicaHeight).addClass('opened');

					$('html, body').animate({
						scrollTop: prijavnica.offset().top - 5
					}, 700);

					if( isPdfButton ) {
						prijavnica.find('#pdf-url').val( pdfLink );
						prijavnica.find('.pdf-name').html( pdfName );
					}
				}
			}
		});

		/** Zapri rezervacijo za webinarje */
		$('.prijavnica').on('click', '.zapri-prijavnico', function(){
			var prijavnica = $('.prijavnica');

			if( !prijavnica.is(':animated') ) {
				prijavnica.css('max-height', 0).removeClass('opened');
			}
		});

		/** Landing rezervacija */
		var marketPlaceOptions = {
			valueNames : ['title', 'address']
		};

		/** List.js */
		//var marketPlaceList = new List('search-market', marketPlaceOptions);

		/** Custom counter for marketplaces */
		$('#search-market').on('load change keyup', '.search', function(e) {
			var that = $(this),
				count = that.siblings('.search-results-wrapper').children().length,
				countSpan = that.siblings('.search-results-name').children('.count');

			countSpan.html( count );
		});

		/** Configurator paket selector **/
		$.getScript('script/paket.selector.js', function() {
			$('.configurator .paket-selector').paketSelector(function(obj) {
				//console.log(obj);
			});
		});

		var extraoffset = 5;

		/** Configurator options checkbox->radio **/
		$('.configurator .choice input[type=checkbox], .shops input[type=checkbox]').on('change', function(){
			var _el = $(this);

			if( $('.collapse.in').length ) {
				if( _el.closest('.choice').offset().top > $('.collapse.in').offset().top ) {
					extraoffset = $('.collapse.in').height();
				} else {
					extraoffset = 5;
				}
			}

			if ( _el.closest('.choices').hasClass('multiple')) return;
			if (_el.attr('checked')) {
				$('input[type=checkbox]', _el.closest('.choices')).attr('checked', false);
				$(this).attr('checked', true);
			}
		});

		$('.configurator').on('click', '.show-all-options', function(e) {
			e.preventDefault();

			if ($(window).width()<768) {
				$('html, body').animate({
					scrollTop: $('.extra-options-title').offset().top - 70
				}, 600);

			} else {
				$('html, body').animate({
					scrollTop: $('.extra-options-title').offset().top - $('.selection').height() - 20
				}, 600);
			}
		});

		/** Configurator options more info **/
		$('.configurator .choice .c4 a').on('click', function(){
			var _info = $('.info', $(this).closest('.choice'));;
			if (_info.length) {
				_info.slideToggle('fast');
				return false;
			}
		});

		/** Configurator search results select **/
		$('.search-results-wrapper').on('change', 'input[type="checkbox"]', function(e){
			var _choices = $('input[type="checkbox"]', $(this).closest('.result').siblings('.result'));
			_choices.prop('checked', false);
			return false;
		});

		/** Elastik Configurator */
		if( $('.elastik-configurator').length ) {

			var EC 				= $('.elastik-configurator'),
				METER 			= $('.meter'),
				totalSpan 		= EC.find('.total'),
				totalPrice 		= EC.find('.total-price'),
				currentConf 	= EC.find('.current-configuration'),
				lockLine 		= EC.find('.locked-wrapper-line'),
				numOfUpdates 	= EC.find('.number-of-updates'),
				mobileConfig 	= EC.find('.mobile-configurator'),
				mobileGB 		= EC.find('.additional-gb-per-month'),
				dodatniGBWord 	= EC.find('.beseda-dodatni-gb'),
				elastikTotal 	= 19.99,
				priceLocked 	= false
				lockedPrice 	= undefined,
				price 			= 0,

				/** Drag offsets */
				dragLeftOffset 	= -88;

			/** Animate the small triangle */
			EC.addClass('no-configuration loaded');

			function moveDragHandle( el, offset, transition ) {
				el.style.webkitTransform = 'translate3d(' + offset + 'px,0,0) scale(.9999)';
				el.style.MozTransform = 'translate3d(' + offset + 'px,0,0) scale(.9999)';
				el.style.msTransform = 'translate3d(' + offset + 'px,0,0) scale(.9999)';
				el.style.OTransform = 'translate3d(' + offset + 'px,0,0) scale(.9999)';
				el.style.transform = 'translate3d(' + offset + 'px,0,0) scale(.9999)';
				el.style.webkitTransition = 'all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.275)';
				el.style.MozTransition = 'all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.275)';
				el.style.msTransition = 'all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.275)';
				el.style.oTransition = 'all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.275)';
				el.style.transition = 'all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.275)';
				if( transition === false ) {
					el.style.webkitTransition = 'none';
					el.style.MozTransition = 'none';
					el.style.msTransition = 'none';
					el.style.oTransition = 'none';
					el.style.transition = 'none';
				}
			}

			/** Drag functionality */
			var drag = new Hammer( currentConf[0], {
				drag_horizontal: true,
				drag_vertical: false
			});

			function setActiveGB(activeNumber) {
				EC.find('.number.active').removeClass('active');
				EC.find('.meter .number').eq( activeNumber - 1 ).addClass('active');
			}

			/**
			 * Calculate the drag handle position after the pan event has stop
			 * @return {none}
			 */
			function calculateDragHandlePosition() {
				var currentDragPosition = currentConf.position().left - ( EC.find('.total-per-month-wrapper').outerWidth() + EC.find('.including').outerWidth() + 3 ),
					oneGBWidth 			= EC.find('.number').first().width(),
					activeNumber 		= Math.ceil( currentDragPosition / oneGBWidth ),
					shouldBePosition	= 0;

				/**
				 * Center position for specific number
				 * @type {}
				 */
				if( currentDragPosition < 0 ) {
					shouldBePosition = dragLeftOffset;
					activeNumber = -1;
					price = 0;
				} else {
					shouldBePosition = ( activeNumber * oneGBWidth ) - ( oneGBWidth / 2 ) - ( currentConf.outerWidth() / 2 );
					price = shouldBePosition;
				}

				/**
				 * Write the position into the element data attribute
				 */
				currentConf.attr('data-current-x', shouldBePosition);

				/**
				 * Set active number
				 */
				setActiveGB( activeNumber );

				/**
				 * Set price value
				 * @type {int}
				 */
				price = activeNumber;

				/**
				 * Move the drag handle
				 */
				moveDragHandle( currentConf[0], shouldBePosition, true );

				/**
				 * Update the total price
				 */
				updateTotalPrice();
			}

			/** Functionality */
			drag.on('panleft panright swipeleft swiperight panend', function( event ){
				var type 			= event.type,
					offset 			= event.deltaX;

				if( currentConf.attr('data-current-x') === undefined ) {

					/** Only on first drag */
					if( ( event.deltaX + dragLeftOffset > -( ( EC.find('.including').outerWidth() + ( currentConf.outerWidth() / 2 ) ) ) ) && ( event.deltaX + dragLeftOffset < ( EC.outerWidth() - ( EC.find('.total-per-month-wrapper').outerWidth() + EC.find('.including').outerWidth() + EC.find('.meter .title').outerWidth() ) - ( currentConf.outerWidth() / 2 ) ) ) ) {
						moveDragHandle( currentConf[0], event.deltaX + dragLeftOffset, false );
					}
				} else {
					if( ( parseInt( currentConf.attr('data-current-x') ) + event.deltaX > -( ( EC.find('.including').outerWidth() + ( currentConf.outerWidth() / 2 ) ) ) ) && ( parseInt( currentConf.attr('data-current-x') ) + event.deltaX < ( EC.outerWidth() - ( EC.find('.total-per-month-wrapper').outerWidth() + EC.find('.including').outerWidth() + EC.find('.meter .title').outerWidth() ) - ( currentConf.outerWidth() / 2 ) ) ) ) {
						moveDragHandle( currentConf[0], parseInt( currentConf.attr('data-current-x') ) + event.deltaX, false );
					}
				}

				if( type === 'panend' ) {
					calculateDragHandlePosition();
				}
			});

			var total = new Odometer({
				el 			: totalSpan[0],
				value 		: 0,
				format 		: '(.ddd),dd',
				duration 	: 2000
			});

			total.update( elastikTotal );

			function updateTotalPrice(el, actualNumber) {

				if( actualNumber ) {
					var that = el;

					/** Remove active classes if clicked on 0 */
					if( that.hasClass('reset') || price === 0 ) {
						EC.addClass('in-reset-state');
						moveDragHandle( currentConf[0], dragLeftOffset );
						METER.find('.active').removeClass('active');
						EC.addClass('no-configuration');
					} else if( that.hasClass('number') ) {
						EC.removeClass('in-reset-state');
						if( priceLocked && ( lockedPrice < price ) ) return false;
						that.addClass('active').siblings('.number').removeClass('active');
						EC.removeClass('no-configuration');

						var leftOffset 	= ( that.index() + 1 ) * ( that.width() ) - ( that.width() / 2 ) - ( currentConf[0].offsetWidth / 2 );

						/** Set the attribute */
						currentConf.attr('data-current-x', leftOffset);

						/** Move the handle */
						moveDragHandle( currentConf[0], leftOffset );
					}
				}

				/** @type {float} if price is locked, add 1 EUR to price */
				elastikTotal = priceLocked ? 20.99 : 19.99;

				if( priceLocked ) {
					if( price < lockedPrice ) {
						elastikTotal += price;
					} else {
						elastikTotal += lockedPrice;
					}
					numOfUpdates.html( lockedPrice );
				} else {
					elastikTotal += price;
					numOfUpdates.html( price );
				}

				elastikTotal = Math.round( elastikTotal * 100 ) / 100;

				var dodatnaGBBeseda = lockedPrice === 1 ? 'dodatni' : lockedPrice === 2 ? 'dodatna' : ( lockedPrice > 2 || lockedPrice === 0 ) ? 'dodatnih' : '';
				dodatniGBWord.html( dodatnaGBBeseda );
				total.update( elastikTotal );
				if( priceLocked ) {
					totalPrice.html( (20.99 + lockedPrice).toString().replace('.', ',') );
				} else {
					totalPrice.html( elastikTotal.toString().replace('.', ',') );
				}
			}

			/** Calculations */
			EC.on('click', '[data-cost]', function(){
				price = $(this).data('cost');

				updateTotalPrice( $(this), true );
			});

			/** Mobile configurator */
			var startingGB = 0;

			EC.on('click', '.mobile-configurator .button', function() {
				var that = $(this),
					operation = that.data('operation');

				if( operation === 'subtract' && startingGB > 0 ) {
					startingGB--;
					price--;
				} else if( operation === 'add' && startingGB < 10 ) {
					if( priceLocked ) {
						if( startingGB < lockedPrice ) {
							startingGB++;
							price++;
						}
					} else {
						startingGB++;
						price++;
					}
				}

				EC.find('.meter-mobile .number').removeClass('active');

				for( var i = 0; i < startingGB; i++ ) {
					EC.find('.meter-mobile .number').eq( i ).addClass('active');
				}

				mobileGB.css({
					'min-width' : startingGB * 10 + '%',
					'max-width' : startingGB * 10 + '%'
				});

				mobileConfig.find('.number .value').html( startingGB );

				updateTotalPrice( '', false );
			});

			/** Animate lock in vertical positions */
			function animatePath(el, input) {
				el.style.webkitTransform = 'matrix(1,0,0,1,0,' + input + ')';
				el.style.MozTransform = 'matrix(1,0,0,1,0,' + input + ')';
				el.style.msTransform = 'matrix(1,0,0,1,0,' + input + ')';
				el.style.OTransform = 'matrix(1,0,0,1,0,' + input + ')';
				el.style.transform = 'matrix(1,0,0,1,0,' + input + ')';
			}

			/** Function to animate the lock lines */
			function animateLockLines(direction) {
				if( direction === 'open' ) {
					var linesWidth;
					if( EC.find('.number.locked').length ) {
						linesWidth = EC.find('.locked').position().left + EC.find('.locked').width() + 3;
					} else {
						linesWidth = EC.find('.total-per-month-wrapper').outerWidth() + EC.find('.including').outerWidth() + 3;
					}
					lockLine.css({
						'min-width' : linesWidth,
						'max-width' : linesWidth
					});

					setTimeout(function(){
						lockLine.addClass('end');
					}, 600);
				} else {
					lockLine.removeClass('end');

					setTimeout(function(){
						lockLine.css({
							'min-width' : 0,
							'max-width' : 0
						});
					}, 200);
				}
			}

			/** Animate lock icon */
			EC.on('click', 'svg', function(e) {
				var svg = $(e.currentTarget),
					path = svg.find('path')[0];

				if( priceLocked ) {
					EC.find('.meter .locked').removeClass('locked');
					svg.attr('class', 'pull-left');
					EC.removeClass('locked');
					EC.find('.meter-mobile .number.last').removeClass('last');
					animatePath( path, -11 );
					priceLocked = false;
					lockedPrice = undefined;
					animateLockLines('close');
				} else {
					EC.find('.meter .active').addClass('locked');
					svg.attr('class', 'pull-left locked');
					EC.addClass('locked');
					if( lockedPrice === undefined ) {
						lockedPrice = price;
						EC.find('.meter-mobile .number').eq( lockedPrice - 1 ).addClass('last');
					}
					animatePath( path, 0 );
					priceLocked = true;
					animateLockLines('open');
				}

				updateTotalPrice( '', false );

			});
		}

		/** Moj.simobil preklapljanje med paketi */
		$('body').on('change', '.paket-selector-table input[type="radio"]', function(){
			var that = $(this),
				thatIndex = that.parent().index(),
				table = that.parents('table'),
				tr = table.find(':not(tfoot) tr');

			table.find('.selected-td').removeClass('selected-td');

			tr.each(function(){
				$(this).children().eq( thatIndex ).addClass('selected-td');
			});
		});

		/** Configurator disable options **/
		$('.configurator .paket-selector .tools input, .configurator .paket-selector-table .tools input,  #toggle-free').change(function(){
			if (this.checked) {
				$('.configurator').addClass('paket-none');
			} else {
				$('.configurator').removeClass('paket-none');
			}
		});

		/** Configurator paket keep **/
		$('.configurator .number input').change(function(){
			if (this.checked) {
				$('.configurator').addClass('paket-keep');
			} else {
				$('.configurator').removeClass('paket-keep');
			}
		});

		/** Configurator choices more options **/
		$(document).on('change', '.with-options .data input[type=checkbox]', function() {
			$('.with-options .data input[type=checkbox]').each(function() {

				var _options = $('.mini-info, .info.inline-form', $(this).closest('.choice'));
				if ($(this).attr('checked')) {
					_options.show();
				} else {
					_options.hide();
				}
			});
		});

		// Toggle input/checkbox based on value
		/*
		$(document).on('change', '.with-options input[type=checkbox][data-toggle]', function() {
			var _obj = $(this);
			if (_obj.is(':checkbox') && !_obj.is(':checked')) {
				$(_obj.data('toggle')).val('');
			}
		});
		*/
		$(document).on('keyup', '.with-options input[type=text][data-toggle]', function() {
			var _obj = $(this);
			if ($.trim(_obj.val()) == '') {
				$(_obj.data('toggle')).removeAttr('checked');
			}/* else {
				$(_obj.data('toggle')).attr('checked', 'checked');
			}*/
		});

		/** Animate moj.simobil monthly internet usage and current day in month */
		if( $('.period-internet-usage').length ) {
			var PIS = $('.period-internet-usage'),
				max 	= parseInt( PIS.data('max') ), 	// Max monthly data for user
				used 	= parseInt( PIS.data('used') ),	// Used data for user
				ratio 	= used / max * 100,				// Calculate used percentage
				USEDNET	= PIS.find('.used'),

				DAY 		= PIS.find('.current-day'),
				VALUE 		= PIS.find('.value'),
				dayPercent 	= parseInt( PIS.data('day-percent') );

			/**
			 * Setup odometerOptions object for number animation
			 * @type {Object}
			 */
			window.odometerOptions = {
				duration 	: 8000
			};

			$(window).on('load', function(){

				/** Animate day width */
				DAY.css('min-width', dayPercent + '%');

				/** Animate usage width */
				USEDNET.css('min-width', ratio + '%');

				/** Animate the number with slight delay */
				setTimeout(function(){

					/** Animation has ended */
					USEDNET.addClass('loaded');

					/** Animate the numbers */
					VALUE.html( used );
				}, 1500);
			});
		}

		/** Form date fields **/
                /** don't merge **/
        if( $.fn.datepicker != undefined ) {
		$.fn.datepicker.dates['sl'] = {
			days: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota", "Nedelja"],
			daysShort: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"],
			daysMin: ["Ne", "Po", "To", "Sr", "Če", "Pe", "So", "Ne"],
			months: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
			today: "Danes"
		}

			$('form .field.d.birthdate1218 input').datepicker({
				format: "d.m.yyyy",
				startView: 2,
				language: "sl",
				forceParse: false,
				autoclose: true
			}).on('changeDate', function(e) {
				var $inputs = $(e.target.parentElement).find('input.third');
				$($inputs[0]).val(e.date.getDate());
				$($inputs[1]).val(e.date.getMonth() + 1);
				$($inputs[2]).val(e.date.getYear() + 1900);

				$(e.target.parentElement).find('input.hidden-important').val($($inputs[0]).val() + '.' + $($inputs[1]).val() + '.' + $($inputs[2]).val());
				$(e.target.parentElement).find('input.hidden-important').change();
			});

		$('form .field.d.birthdate18 input').datepicker({
			format: "d.m.yyyy",
			startView: 2,
			language: "sl",
			forceParse: false,
			autoclose: true
		}).on('changeDate', function(e){
			var $inputs = $(e.target.parentElement).find('input.third');
			$($inputs[0]).val(e.date.getDate());
			$($inputs[1]).val(e.date.getMonth()+1);
			$($inputs[2]).val(e.date.getYear()+1900);

			$(e.target.parentElement).find('input.hidden-important').val($($inputs[0]).val() + '.' + $($inputs[1]).val() + '.' + $($inputs[2]).val());
			$(e.target.parentElement).find('input.hidden-important').change();
		});
        }

		// Validate user text input
		//$('form .field.d input').on('blur', function (e) {
		//	var $this = $(this);
		//	var date = "";
		//	$this.parent().find('input').each(function(e) {
		//		date += $(this).val() + ".";
		//	});
		//	console.log(date);
		//});

		/** Ammount number picker **/
		$('.choice .ammount a').click(function(e) {
			e.preventDefault();
			var _input = $(this).siblings('input');
			if ($(this).hasClass('up')) {
				_input.val(parseInt(_input.val()) + 1);
			} else {
				if (_input.val() > 0) {
					_input.val(parseInt(_input.val()) - 1);
				}
			}
		});

		/** Custom file input **/
		$(document).on('change', '.custom-file-input input[type=file]', function() {
			var _selectedFiles = $(this)[0].files;
			var _output = [];

			if (typeof _selectedFiles == 'undefined') {
				_selectedFiles = Array({name: $(this).val().split(/\\/).pop()});
			}

			for (var i=0; i<_selectedFiles.length; i++) {
				_output.push(_selectedFiles[i].name);
			}

			$(this).siblings('.selection').empty().append(_output.join(', '));
			_output = [];
		});

		$(document).on('click', '.custom-file-input .btn', function() {
			$('.custom-file-input input[type=file]').val('').trigger('click');
		});

		/** Accordion **/
		function scrollToAcGrou($obj) {
			var _ac_group = $obj.parent('.accordion-group.opened');
			if (_ac_group.offset() != null) {
				setTimeout(function() {
					if ($('body').scrollTop() > _ac_group.offset().top)
						$('body').scrollTop(_ac_group.offset().top + 159);
				}, 600);
			}
		}

		function closeOthers() {
			$('.collapse.in').collapse('hide');
		}

		$('.collapse').on('show' , function(e) {
			e.stopPropagation();
			if ($(this).hasClass('stop')) return;
			$(this).parent('.accordion-group').addClass('opened');
			// close other configurator packages
			closeOthers();
			// scroll to current opened item
			scrollToAcGrou($(this));

		}).on('hidden', function(e) {
			e.stopPropagation();
			if ($(this).hasClass('stop')) return;
			closeOthers();
			 scrollToAcGrou($(this));
			$(this).parent('.accordion-group').removeClass('opened');
		});

		$('body').on('click', '.accordion-heading a', function(e) { e.preventDefault();});

		// Tooltips
		$('[rel="tooltip"]').tooltip();

		/** Corpo **/
		function equalize_team_list() {
			if (screen.width > 767) {
				setTimeout(function() {Simobil.equalize('.corpo .equal-height', '.item');}, 200);
			}
		}

		equalize_team_list();
		$(window).on('resize', equalize_team_list);


		// E-racun
		$.getScript('simobil_assets/script/lib/waypoints.min.js', function() {

			$('.eracun .slides .slide').waypoint(function(direction) {
				if (direction == 'down') {
					$(this).addClass('active');
				}
			}, { offset: '50%' });

			$('.eracun .slides .slide').waypoint(function(direction) {
				if (direction == 'up') {
					$(this).removeClass('active');
				}
			}, { offset: '80%' });

		});

		/** Landing Res & Smart Repricing */
		$.getScript('simobil_assets/script/lib/waypoints.min.js', function() {

			$('.landing-res-smart .comparison-table').waypoint(function(direction){
				if (direction == 'down') {
					$(this).parents('.landing-section').addClass('active');
					var i = 0;

					/** Odometer for each price */
					$(this).find('.zdruzi-prihrani-animate-price').each(function(){
						var oldValue = i === 0 ? 9.99 : i === 1 ? 12.99 : i === 2 ? 15.99 : i === 3 ? 20.99 : 99.99;
						var newValue = i === 0 ? 8 : i === 1 ? 10.99 : i === 2 ? 11.99 : i === 3 ? 17.99 : 87.99;
						var newOdoMeter = new Odometer({
							el : $(this).children('span')[0],
							format: '(,dd),dd',
							duration : '200',
							theme : 'default',
							value : oldValue.toFixed(2)
						}); newOdoMeter.update(newValue.toFixed(2));
						i++;
					});
				}
			}, { offset : '90%' });

			$('.landing-res-smart .with-infographics').waypoint(function(direction) {
				if( direction == 'down' ) {
					$(this).parents('.landing-section').addClass('active');
					var i = 0;
					$(this).find('.special-price').each(function(){
						var oldValue = i === 0 ? 12.99 : i === 1 ? 19.99 : i === 2 ? 7.99 : 9.99;
						var newValue = i === 0 ? 10.99 : i === 1 ? 17.99 : i === 2 ? 5.99 : 7.99;
						var newOdoMeter = new Odometer({
							el : $(this).children('span')[0],
							format: '(,dd),dd',
							duration : '200',
							theme : 'default',
							value : oldValue
						});
						setTimeout(function(){
							newOdoMeter.update(newValue);
						}, i * 300);
						i++;
					});

					var startingPrice = 0;
					var endingPrice = 8;

					var skupniZnesekPrihrani = new Odometer({
						el : $(this).find('.total-value span')[0],
						format: '(,dd),dd',
						duration : '200',
						theme : 'default',
						value : startingPrice.toFixed(2)
					});

					setTimeout(function(){
						skupniZnesekPrihrani.update(endingPrice.toFixed(2));
					}, 1500);
				}
			}, { offset : '60%' });

			$('.landing-res-smart .comparison-table').waypoint(function(direction){
				if (direction == 'up') {
					$(this).parents('.landing-section').removeClass('active');

					/** Reset the values */
					var i = 0;

					/** Odometer for each price */
					$(this).find('.zdruzi-prihrani-animate-price').each(function(){
						var oldValue = i === 0 ? 9.99 : i === 1 ? 12.99 : i === 2 ? 15.99 : i === 3 ? 20.99 : 99.99;
						$(this).children('span').html( oldValue.toFixed(2) );
						i++;
					});

				}
			}, { offset: '90%' });

			$('.landing-res-smart .with-infographics').waypoint(function(direction){
				if (direction == 'up') {
					$(this).parents('.landing-section').removeClass('active');

					var i = 0;
					$(this).find('.special-price').each(function(){
						var oldValue = i === 0 ? 12.99 : i === 1 ? 19.99 : i === 2 ? 7.99 : 9.99;
						$(this).children('span').html( oldValue );
						i++;
					});
					$(this).find('.total-value span').html(0);

				}
			}, { offset: '90%' });

		});

		/** Izračun prihranek svoje skupine */
		var packets = [
			{
				'paket' : 'ZAČETNI M',
				'price' : 10, 'discount' : 2
			},
			{
				'paket' : 'SENIOR I',
				'price' : 14.99, 'discount' : 2
			},
			{
				'paket' : 'NAPREDNI S',
				'price' : 10, 'discount' : 2
			},
			{
				'paket' : 'ORTO FANTASTIK',
				'price' : 14.99, 'discount' : 2
			},
			{
				'paket' : 'ORTO BOMBASTIK',
				'price' : 19.99, 'discount' : 2
			},
			{
				'paket' : 'Mobilni internet 3GIGA',
				'price' : 11.99, 'discount' : 2
			},
			{
				'paket' : 'Mobilni internet 15GIGA',
				'price' : 17.99, 'discount' : 2
			},
			{
				'paket' : 'NAPREDNI M',
				'price' : 12.99, 'discount' : 4
			},
			{
				'paket' : 'NAPREDNI L',
				'price' : 15.99, 'discount' : 4
			},
			{
				'paket' : 'ORTO GIGASTIK',
				'price' : 20.99, 'discount' : 4
			},
			{
				'paket' : 'Domači internet 1',
				'price' : 26.90, 'discount' : 4
			},
			{
				'paket' : 'Domači internet 2',
				'price' : 31.90, 'discount' : 4
			},
			{
				'paket' : 'NAPREDNI XL',
				'price' : 20.99, 'discount' : 8
			},
			{
				'paket' : 'ALL INCLUSIVE',
				'price' : 99.99, 'discount' : 12
			},
			{
				'paket' : 'Mobilni internet 45GIGA',
				'price' : 39.99, 'discount' : 8
			},
			{
				'paket' : 'Domači internet 3',
				'price' : 41.90, 'discount' : 8
			}
		];

		var totalMembers = 0;

		/** Show the package chooser */
		$('.combine-and-save.calculator').on('click', '.add-member-wrapper', function(e) {
			var that = $(this);

			/** Increase number or members */
			totalMembers++;

			/** Show package chooser */
			that.parent('.member').addClass('member-active');

			updateMembersTitles( that );
		});

		var totalDiscount = 0;

		if( $('.combine-and-save.calculator').length > 0 ) {
			var totalValueOdometer = new Odometer({
				el : $('.combine-and-save.calculator .total-value .value')[0],
				format: '(,dd),dd',
				duration : '200',
				theme : 'default',
				value : totalDiscount.toFixed(2)
			});
		}

		$('.combine-and-save.calculator').on('click', '.remove-member', function(e) {
			/** Decrease number or members */
			totalMembers--;

			var that = $(this);

			that.parent('.member').removeClass('member-active member-and-package-active');

			/** Remove the discount if package selected */
			if( that.attr('data-discount') != undefined ) {
				totalDiscount = totalDiscount - parseInt( that.attr('data-discount') );
				totalValueOdometer.update( totalDiscount.toFixed(2) );

				that.parent('.member').find('.special-price .value').html('')
			}

			updateMembersTitles( that );
		});

		function updateMembersTitles( element ) {
			/** Update member titles (Član 1, Član 2, ...) */
			var i = 1;
			element.parents('.combine-and-save.calculator').find('.member').each(function() {
				var thatThis = $(this);
				if( thatThis.hasClass('member-active') || thatThis.hasClass('member-and-package-active') ) {
					thatThis.find('.member-title').html('Član ' + i);
					i++;
				}
			});
		}

		/** Show package details */
		$('.combine-and-save.calculator').on('change', 'select', function(e){
			var that = $(this),
				text = that.find('option:selected').html();

			/** User must select an option */
			if( text !== 'Paket...' ) {
				var member = that.parents('.member');
				member.removeClass('member-active').addClass('member-and-package-active');

				/** Find Appropriate Package Object */
				var selectedPackage = $.grep( packets, function(e) {
					return e.paket === text;
				});

				var basicPrice = selectedPackage[0].price.toFixed(2);
				var discountPrice = ( selectedPackage[0].price - selectedPackage[0].discount ).toFixed(2);

				/** Add discount to remove button */
				that.parents('.member').children('.remove-member').attr('data-discount', selectedPackage[0].discount);

				var basicShownPrice = discountPrice < 10 ? (9.99).toFixed(2) : basicPrice;

				odometer = new Odometer({
					el : member.find('.with-discount .special-price .value')[0],
					format: '(,dd),dd',
					duration : '200',
					theme : 'default',
					value : basicShownPrice
				});

				totalDiscount += selectedPackage[0].discount;

				member.find('.title-value').html( selectedPackage[0].paket );
				member.find('.basic .price:not(.special-price)').html( basicPrice.replace( '.', ',' ) + ' €' );

				odometer.update( discountPrice );
				totalValueOdometer.update( totalDiscount.toFixed(2) );

			}
		});

		$('.eracun .infogram li, .landing-promo-page .infogram li, .why-simobil .infogram li, .ponudba-za-velika-podjetja .infogram li').on('mouseover', function(e) {

			if (!$(this).children('a').length) return;

			$('.eracun .infogram li, .landing-promo-page .infogram li, .why-simobil .infogram li, .ponudba-za-velika-podjetja .infogram li').removeClass('active');
			$(this).addClass('active');

			$_pane = $('.eracun .infogram .pane, .landing-promo-page .infogram .pane, .why-simobil .infogram .pane, .ponudba-za-velika-podjetja .infogram .pane');
			$('img', $_pane).attr('src', $(this).data('img'));
			$('h3', $_pane).text($('a span', $(this)).not('.desc').text());
			$('p', $_pane).text($('.desc', $(this)).text());

		});

		$.fn.overlayMask = function (action) {
			var mask = this.find('.overlay-mask');

			// Create the required mask

			if (!mask.length) {
				this.css({
					position: 'relative'
				});
				mask = $('<div class="overlay-mask"></div>');

				var oh = '100%';
				var bg_pos = '50% 50%';
				if(this.prop('tagName') == 'BODY' || this.prop('tagName') == 'HTML') {
					oh = $(document).height();
					loader_pos = $(window).height() / 2;
					loader_pos = Math.max(0, ($(window).height() / 2) + $(window).scrollTop()) + "px";
					bg_pos = '50% ' + loader_pos;
				}
				mask.css({
					position: 'absolute',
					width: '100%',
					height: oh,
					top: '0px',
					left: '0px',
					zIndex: 10000,
					backgroundPosition : bg_pos
				}).hide().appendTo(this).fadeIn();
			}

			if (!action || action === 'show') {
				mask.fadeIn();
			} else if (action === 'hide') {
				mask.hide();
			}

			return this;
		};

		/* mask example
		$('#filter-options input').on('click', function(){
		//$('body').overlayMask();
		$('.product-listing').overlayMask();
		});
         */

		var resizeTimer = null;
		function multiline_choices() {
			var $choices = $('.choices .choice');
			/*
			if ($('body').width() > 768) {
				$choices.removeClass('expand');
				$('.c3, .c4', $choices).css('height', '');
				return;
			}
			*/
			if (resizeTimer) clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function() {
				$choices.each(function() {
					var _self = $(this);
					var $label = $('>.data>.c1 label,>.data>.c12 label', _self);
					var lw = $label.innerWidth();
					var sw = $('span', $label).outerWidth();

					if (lw < sw || !_self.hasClass('.expand')) {
						if (!_self.hasClass('.expand'))
							_self.addClass('expand');
						setTimeout(function() {
                            var $data = $('>.data', _self);
                            if ( $(window).width()>767 ){
                                $('.c3, ', $data).css({'height' : $data.innerHeight(), 'line-height' : $data.innerHeight()+"px"});
                                $('.c3, ', $data).parent().parent().find( ".mini-info" ).css('line-height', $data.innerHeight()+"px");
                                $('.c3, ', $data).parent().parent().find( ".c12").find("label").css({'height' : $data.innerHeight(), 'line-height' : $data.innerHeight()+"px"});
                                $('.c1 > label, ', $data).css({'height' : $data.innerHeight(), 'line-height' : $data.innerHeight()+"px"});
                                $('.c4', _self).css({'height' : $data.innerHeight(), 'line-height' : $data.innerHeight()+"px"});
                                $('.c4 > a', _self).css('line-height', $data.innerHeight()+"px");
                            }
                            else if ($(window).width() < 767) {
                                $('.c3, ', $data).css({height : $data.innerHeight(), 'line-height' : ""});
                                //$('.c3, ', $data).parent().parent().find( ".mini-info" ).css('line-height', "normal");
                                //$('.c3, ', $data).parent().parent().find( ".c12").find("label").css({'height' : 'auto', 'line-height' : "normal"});
                                //$('.c1 > label, ', $data).css({'height' : 'auto', 'line-height' : "normal"});
                                //$('.c4', _self).css({height : $data.innerHeight(), 'line-height' : "normal"});
                                //$('.c4 > a', _self).css('line-height', "normal");
                            }
						}, 500);
					}
				});
			}, 200);
		}

        function highlight_position_fixer() {
            var $highlights = $('.choice > h2');
            $highlights.each(function() {
                    $(this).css("top", ($(this).height() * -1) + "px");
                    if ($(this).parent().index() == 0) {
                        $(this).parent().css("margin-top", $(this).height() + "px");
                    }
                    else {
                        $(this).parent().css("margin-top", $(this).height() + 12 + "px");
                    }
                })
        }
		$(window).on('resize', multiline_choices);
        $(window).load(function() {
            multiline_choices();
            highlight_position_fixer();
        });

        $('.notices').prev().css("margin-bottom","0px");

        // do not merge this
        $('.collapse').on('show', function () {
            if ( $(this).prev().hasClass( "buttler" )){
                var bulterheight = $(this).prev().height();
            }
            else {
                var bulterheight = 0;
            }

            if ($(window).width() < 767) {
                $('html,body').animate({
                    scrollTop: ($(this).offset().top - $(".row.tools.fixed").height() - 175 - extraoffset - bulterheight)
                }, 600);
            }
            else {
                $('html,body').animate({
                    scrollTop: ($(this).offset().top - $(".selection").height() - 60 - extraoffset - bulterheight)
                }, 600);
            }
        });

		if (window.matchMedia) {
			var mql = window.matchMedia("(orientation: portrait)");
			mql.addListener(function(m) {
				var sc = $('.combinations .scrollable').data('scrollable');
				sc.seekTo(sc.getIndex());
			});
		}

		/* Racun na pol */
		var $person = $('.racun-na-pol .visualise .selector .person');
		var $months = $('.racun-na-pol .visualise .months .number .big');
		$person.on( 'hover touchstart', function(e) {
			e.preventDefault();
			var $this = $(this);
			$person.removeClass('active');
			$this.addClass('active');

			//$months.text($this.data('months'));

			jQuery({val: parseInt($months.text())}).animate({val: $this.data('months')}, {
				duration: 500,
				easing: 'linear',
				step: function() {
					if (this.val > 23) {
						$months.text(Math.ceil(this.val));
					} else if (this.val < 7) {
						$months.text(Math.floor(this.val));
					} else {
						$months.text(this.val.toFixed(0));
					}
				}
			});
		});

		$('.racun-na-pol .process .nav-tabs a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
		});

		$('.racun-na-pol #use-code').click(function (e) {
			e.preventDefault();
			$('.racun-na-pol .nav-tabs .has-code a').tab('show');
		});

		$('.racun-na-pol #packages-carousel').carousel({
			interval: 4000
		});

		if( $.fn.bxSlider != undefined) {
		$('.product-listing .product-slider').bxSlider({
			slideMargin: 24,
			moveSlides: 1,
			autoReload: true,
			nextText: '',
			prevText: '',
			parfix: true,
			auto: true,
			pager:false,
			breaks: [{screen:0, slides:1}, {screen:480, slides:2}, {screen: 768, slides:4}]
		});
		}

		/* IE placeholders */
		if( !('placeholder' in document.createElement('input')) ){
			$("[placeholder]").focus(function(){
				if( this.value == $(this).attr("placeholder") )
					this.value = '';
				$(this).removeClass('empty');
			})
				.blur(function(){
					if( this.value == "" )
						this.value = $(this).addClass('empty').attr("placeholder");
					else
						$(this).removeClass('empty');
				})
				.blur();
		}

		// Resize textarea
		var area = $('.resize'),content = null;

		area.each(function() {
			$(this).after('<div class="hiddendiv input"></div>');
		});

		area.on('keyup', function () {
			console.log('keyup');
			content = $(this).val();

			content = content.replace('<', ' ');
			content = content.replace(/\n/g, '<br>');
			content = content.replace('&#13;&#10;', '<br>');
			var hiddenDiv = $(this).next('.hiddendiv');
			hiddenDiv.html(content + '<br class="lbr">');

			$(this).height(hiddenDiv.outerHeight());

		});

		area.trigger('keyup');

		var hash = window.location.hash.substring(1);
		if (hash != 'undefined') {
			hash = $('#' + hash).data('num');
		} else {
			hash = 4
		}


		if( $.fn.bxSlider != undefined ) {
		/* Table slider */
		var $slider = $('#primerjalna-tabela .slider').bxSlider({
			mode: 'vertical',
			slideMargin: 40,
			adaptiveHeight: true,
			nextText:'',
			prevText:'',
			preventDefaultSwipeY: true,
			preventDefaultSwipeX: false,
			startSlide: hash
		});

		if ($slider.length > 0 && $(window).width() < 599 || ($(window).width() < 767 && Math.abs(window.orientation) === 90)) {
			$slider.reloadSlider({
				mode: 'horizontal',
				preventDefaultSwipeY: false,
				preventDefaultSwipeX: true,
				slideMargin: 40,
				adaptiveHeight: true,
				nextText:'',
				prevText:'',
				preventDefaultSwipeY: true,
				preventDefaultSwipeX: false,
				startSlide: hash
			});

			if ($slider.length > 0 && $(window).width() < 599 || ($(window).width() < 767 && Math.abs(window.orientation) === 90)) {
				$slider.reloadSlider({
					mode: 'horizontal',
					preventDefaultSwipeY: false,
					preventDefaultSwipeX: true,
					slideMargin: 40,
					adaptiveHeight: true,
					nextText:'',
					prevText:'',
					startSlide: hash
				});
			}
		}
		}

		/* Address combobox */
                /* do not merge */
        if( $.fn.select2 != undefined ) {
		$("input.combobox").select2({
			placeholder: "Vnesite naslov",
			allowClear: true,
			minimumInputLength: 0,
			dropdownAutoWidth: true,
			loadMorePadding: 100,
			autofocus: false,
			width: '20px',
			keybindSelector: '.address.dump',
			shouldFocusInput: function(){return false;},
			ajax: {
				url: "http://tibcolbt.simobil.net:9442/jquery/autocomplete/street",
				dataType: 'json',
				quietMillis: 250,
				data: function (term, page) { // page is the one-based page number tracked by Select2
					return {
						street: term, //search term
						offsetstart: 30 * (page - 1), // page number
						pagesize: 30
					};
				},
				results: function (data, page) {
					var more = page < data.totalPageCount;
					return { results: data.places, more: more };
				}
			},
			id: function (repo) {
				return repo.STREETNAME + ', ' + parseFloat(repo.POSTNUMBER) + ' ' + repo.CITYNAME;
			},
			formatResult: function (repo) {
				return '<span>' + repo.STREETNAME + ', ' + parseFloat(repo.POSTNUMBER) + ' ' + repo.CITYNAME +'</span>';
			},
			formatSelection: function (repo) {
				// when input selected
				var posts = $(this.element).parents('div.container').find('div.post input');
				$(posts[0]).val(Number(repo.POSTNUMBER));
				$(posts[1]).val(repo.CITYNAME);
				$(this.element).parent().find('input.address.dump').val(repo.STREETNAME);
				$(this.element).parents('div.container').find("div.hne input.numeric.hn").val('');
				$(this.element).parents('div.container').find("div.hne input.alpha").val('');

				return repo.STREETNAME;
			},
			formatAjaxError: function () { return 'Iskanje ni vrnilo rezultatov'; },
			formatLoadMore: function () { return 'Nalagamo več rezultatov...'; },
			formatSearching: function () { return 'Iščemo...'; },
			formatInputTooShort: function (term, minLength) { return 'Prosimo vnesite vsaj ' + minLength + ' znak.'; }
		});
        }

		$('.address.dump').on('keyup', function(event){
			var nonInputKeys = [9, 13, 27, 32, 37, 38, 39, 40, 16, 17, 18, 33, 34, 36, 35];
			if ($.inArray(event.keyCode, nonInputKeys) < 0) {
				$("input.combobox").select2('search', $(this).val());
				$(this).parents('div.container').find('div.post input').val('');
			}
		});

		$('input.numeric.hn').on('keyup', function(event){
			var nonInputKeys = [9, 13, 27, 32, 37, 38, 39, 40, 16, 17, 18, 33, 34, 36, 35];
			if ($.inArray(event.keyCode, nonInputKeys) < 0) {
				$("input.houseno").select2('search', $(this).val());
			}
		});

		/* House number combobox */
		if( $.fn.select2 != undefined ) {
		$("input.houseno").select2({
			placeholder: "Vpišite številko",
			allowClear: true,
			minimumInputLength: 0,
			dropdownAutoWidth: true,
			loadMorePadding: 100,
			z_index: '-1',
			width: 'auto',
			keybindSelector: 'input.numeric.hn',
			ajax: {
				url: "http://tibcolbt.simobil.net:9442/jquery/autocomplete/street",
				dataType: 'json',
				quietMillis: 250,
				data: function (term, page) { // page is the one-based page number tracked by Select2
					return {
						streetnumber: term, //search term
						postnumber: $(this).parents('div.container').find('div.post input:first').val(),
						street: $(this).parents('div.container').find("input.address.dump").val(),
						offsetstart: 30 * (page - 1), // page number
						pagesize: 30
					};
				},
				id: function (repo) {
					if (repo.STREETNUMBERLETTER) {
						return Number(repo.STREETNUMBER) + ' ' + repo.STREETNUMBERLETTER;
					} else {
						return Number(repo.STREETNUMBER);
					}
				},
				formatResult: function (repo) {
					if (repo.STREETNUMBERLETTER) {
						return '<span>' + Number(repo.STREETNUMBER) + ' ' + repo.STREETNUMBERLETTER +'</span>';
					} else {
						return '<span>' + Number(repo.STREETNUMBER) +'</span>';
					}
				},
				formatSelection: function (repo) {
					// when input selected
					$(this.element).parents('div.container').find('div.hne input.numeric.hn').val(Number(repo.STREETNUMBER));
					if (repo.STREETNUMBERLETTER) {
						$(this.element).parents('div.container').find('div.hne input.alpha').val(repo.STREETNUMBERLETTER);
					}
					return Number(repo.STREETNUMBER);
				}
			},
			formatResult: function (repo) {
				if (repo.STREETNUMBERLETTER) {
					return '<span>' + Number(repo.STREETNUMBER) + ' ' + repo.STREETNUMBERLETTER +'</span>';
				} else {
					return '<span>' + Number(repo.STREETNUMBER) +'</span>';
				}
			},
			formatSelection: function (repo) {
				// when input selected
				$(this.element).parents('div.container').find('div.hne input.numeric.hn').val(Number(repo.STREETNUMBER));
				if (repo.STREETNUMBERLETTER) {
					$(this.element).parents('div.container').find('div.hne input.alpha').val(repo.STREETNUMBERLETTER);
				}
				return Number(repo.STREETNUMBER);
			},
			formatAjaxError: function () { return 'Iskanje ni vrnilo rezultatov'; },
			formatLoadMore: function () { return 'Nalagamo več rezultatov...'; },
			formatSearching: function () { return 'Iščemo...'; },
			formatInputTooShort: function (term, minLength) { return 'Prosimo vnesite vsaj ' + minLength + ' znak.'; }
		});
		}
                /** don't merge **/
		$('[data-toggle="tooltip"], div.bithdaydate18.warning').tooltip({
			placement: function() { return 'top'; },
			container: 'body'
		});

		$('[data-toggle="popover"]').popover();

        /* Countdown */
        if ($(window).width()<768){
	        $('#clock').hide();
	        $('#clockbanner').show();
       	}else {
       		initcountdown();
       	}

        function initcountdown(){
       		$('#clock').each(function () {
				var $this = $(this);
	            var countdownText = $this.data('countdown-text');
	            var countdownDate = $this.data('countdown-date').split(" ");

	            endDate = new Date(countdownDate[0], countdownDate[1], countdownDate[2], countdownDate[3], countdownDate[4], countdownDate[5], 0);
	            thisDate  = new Date();
	            thisDate  = new Date(thisDate.getFullYear(), thisDate.getMonth() + 1, thisDate.getDate(), thisDate.getHours(), thisDate.getMinutes(), thisDate.getSeconds(), 0, 0);


	            //Checks if input date is valid (Larger than current date)
	            //Otherwise dont start counter, places null values
	            if (endDate > thisDate){

		            daysLeft = parseInt((endDate-thisDate)/86400000);
		            hoursLeft = parseInt((endDate-thisDate)/3600000);
		            minutesLeft = parseInt((endDate-thisDate)/60000);
		            secondsLeft = parseInt((endDate-thisDate)/1000);

		            seconds = minutesLeft*60;
		            seconds = secondsLeft-seconds;

		            minutes = hoursLeft*60;
		            minutes = minutesLeft-minutes;

		            hours = daysLeft*24;
		            hours = (hoursLeft-hours) < 0 ? 0 : hoursLeft-hours;

		            days = daysLeft;
		            startcountdown();
	            	countdown = setInterval(startcountdown, 1000)
	            }
				else {
		           $('#days,#hours,#minutes,#seconds').css('display','none');
		           $(".clockbox").text('Invalid input');
				}
        	});
		}

		function startcountdown(){
	    	//Checks if timer has reached 0
	    	//else contnue countdown
	    	if (secondsLeft == 0){
	        	clearInterval(countdown);
	        }
	    	else {
		        seconds --;
		        secondsLeft--;
		        if (seconds < 0) {
		            minutes --;
		            seconds = 59;
		        }
		        if (minutes < 0) {
		            hours --;
		            minutes = 59;
		        }
		        if (hours < 0) {
		            days --;
		            hours = 23;
		        }

		        if (days == 0){
		           $("#days").parent().next().css('display','none');//Removes first : from counter
		           $("#days").parent().css('display','none'); //Removes day counter block
		        }

		        $('#days').text(days);
		        $('#hours').text(hours);
		        $('#minutes').text(minutes);
		        $('#seconds').text(seconds);
			}
		}

		function highlight_position_fixer() {

			var resizer = function() {
				var $highlights = $('.choice > h2');
				$highlights.each(function() {
					$(this).css("top", ($(this).height() * -1) + "px");
					if ($(this).parent().index() == 0) {
						$(this).parent().css("margin-top", $(this).height() + "px");
					}
					else {
						$(this).parent().css("margin-top", $(this).height() + 12 + "px");
					}
				});
			}

			$(window).on('resize', resizer);
			resizer();
		}
		highlight_position_fixer();
	});
})(jQuery);
