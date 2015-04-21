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
		
		var placeHolderSupport = ("placeholder" in document.createElement("input"));
		if (!placeHolderSupport) {
			$.getScript('simobil_assets/script/lib/placeholder.min.js', function() {
				 Placeholder.init();
			});
		}
		
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
		$(document).on('click', function(e){
			var that = $('body');

			if( $(e.target).parents('nav ul.first').length == 0 && that.hasClass('main-menu-opened') ) {
				that.removeClass('main-menu-opened');
				$('li.has-sub-menu').removeClass('active');
			}
		});

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
		var $win = $(window)
	      , $nav = $('#selection .selection')
	      , $navParent = $('#selection')
	      , navTop = $('#selection').length && $('#selection').offset().top
	      , isFixed = 0;
	    
		$win.on('scroll', processScroll);
		
		function processScroll() {
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
		}
		
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
		
		/** Configurator paket selector **/
		$.getScript('simobil_assets/script/paket.selector.js', function() {
			$('.configurator .paket-selector').paketSelector(function(obj) {
				//console.log(obj);
			});
			
		});
		
		/** Configurator options checkbox->radio **/
		$('.configurator .choice input[type=checkbox], .shops input[type=checkbox]').live('change', function(){
			var _el = $(this);
			if ( _el.closest('.choices').hasClass('multiple')) return;
			if (_el.attr('checked')) {
				$('input[type=checkbox]', _el.closest('.choices')).attr('checked', false);
				$(this).attr('checked', true);
			}
		});
		
		/** Configurator options more info **/
		$('.configurator .choice .c4 a').live('click', function(){
			var _info = $('.info', $(this).closest('.choice'));
			if (_info.length) {
				_info.slideToggle('fast');
				return false;
			}
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
		
		/** Form date fields **/
		$.tools.dateinput.localize("si", {
			months: 	  'januar,februar,marec,april,maj,junij,julij,avgust,september,oktober,november,december',
			shortMonths:  'jan,feb,mar,apr,maj,jun,jul,avg,sep,okt,nov,dec',
			days:         'nedelja,ponedeljek,torek,sreda,četrtek,petek,sobota',
			shortDays:    'Ned,Pon,Tor,Sre,Čet,Pet,Sob'
		});
		  
		$('form .field.d input').dateinput({
			lang: 'si',
			format: 'd.m.yyyy',
			firstDay: 1,
			selectors: true,
			offset: [-10, 0]
		});
		
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
						$('body').scrollTop(_ac_group.offset().top);
				}, 300);
			}
		}

		$('.collapse').live('show' , function(e) {
			e.stopPropagation();
			if ($(this).hasClass('stop')) return;
			$(this).parent('.accordion-group').addClass('opened');
			// scroll to current opened item
			scrollToAcGrou($(this));
			
		}).live('hidden', function(e) {
			e.stopPropagation();
			if ($(this).hasClass('stop')) return;
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
		
		$('.eracun .infogram li, .landing-infogram li').on('mouseover', function(e) {
			
			if (!$(this).children('a').length) return;
			
			$('.eracun .infogram li, .landing-infogram li').removeClass('active');
			$(this).addClass('active');

			$_pane = $('.eracun .infogram .pane, .landing-infogram .pane');
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
					var $label = $('.c1 label, .c12 label', _self);
					var lw = $label.innerWidth();
					var sw = $('span', $label).outerWidth();
					
					if (lw < sw || !_self.hasClass('.expand')) {
						if (!_self.hasClass('.expand'))
							_self.addClass('expand');
						setTimeout(function() {
							var $data = $('> .data', _self);
							$('.c3, .c4', _self).css('height', $data.innerHeight());
						}, 500);
					}
				});
			}, 200);
			
		}
		$(window).on('resize', multiline_choices);
		multiline_choices();
		
		var mql = window.matchMedia("(orientation: portrait)");
		mql.addListener(function(m) {
			var sc = $('.combinations .scrollable').data('scrollable');
			sc.seekTo(sc.getIndex());
		});

	});
	
})(jQuery);
