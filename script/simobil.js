
(function($) {
	
	$(function() {
		
		var placeHolderSupport = ("placeholder" in document.createElement("input"));
		if (!placeHolderSupport) {
			$.getScript('script/lib/placeholder.min.js', function() {
				 Placeholder.init();
			});
		}
		
		/** Login toggle **/
		$('.top-bar li.user a').click(function(event) {
			event.preventDefault();
			$('.login-bar').slideToggle(300, function() {
				$('.cart')[0].className = $('.cart')[0].className; // IE7 force redraw
			});
		});
		
		/** Scrollable **/
		$('.scrollable')
			.scrollable()
			.navigator('.navi');
		
		/** Scrollable big gallery (product detail) **/
		$('.big-gallery')
			.scrollable({
				prev: '.big-gallery .prev',
				next: '.big-gallery .next'
			}).navigator('.thumbnails');
		
		$('.mini-gallery .zoom').click(function() {
			$('.product .data').hide();
			$('.product .big-gallery').show();
		});
		
		$('.big-gallery .close').click(function() {
			$('.product .big-gallery').hide();
			$('.product .data').show();
		});
		
		/** Submenu mobile toggle **/
		$('nav ul.first > li > a').click(function(e) {
			var _submenu = $(this).next('.submenu');
			if (_submenu.length > 0) {
				e.preventDefault();
			} else {
				return true;
			}
			
			if ($('.nav-collapse').hasClass('in')) {
				var _visibleItem = $('.collapse .submenu:visible');
				if (_submenu) {
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
				}
			}
			return false;	
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
		$('.product-listing:not(.no-hover) .item, .extras .listing .item:not(.no-hover)').hover(
			function() {
				$(this).addClass('over');
			},
			function() {
				$(this).removeClass('over');
			}
		).click(function(e) {
			document.location.href = ($('a.more', $(this)).attr('href'));
		});
		
		$('.product-listing .item .btn').hover(
			function(e) {
				e.stopPropagation();
				$(this).closest('.item').removeClass('over');
			},
			function(e) {
				e.stopPropagation();
				$(this).closest('.item').addClass('over');
			}
		);
		
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

		
		/** Lightbox **/
		$('.lightbox-trigger[rel]').overlay({
			mask: {
		        color: '#333',
		        loadSpeed: 200,
		        opacity: 0.9
		    },
		    closeOnClick: false,
		    fixed: false
		});
		
		/** Equal height child elements **/
		function equalize(selector) {
			$(selector).each(function(idx, el) {
				var _max_height = 0;
				$('> div .box', $(el)).each(function() {
					_max_height = Math.max(_max_height, $(this).height());
				});
				$('> div .box', $(el)).height(_max_height);
			});
		}
		
		// product detail combinations selector max height
		if ($('.product-detail .combinations')) {
			_max_height = 0;
			$('.product-detail .combinations .scrollable li').each(function() {
				_max_height = Math.max(_max_height, $(this).height());
			});
			$('.product-detail .combinations .scrollable').height(_max_height);
		}
		
		
		
		// podrobne informacije - product
		$('.product-detail .features .more').click(function (e) {
			e.preventDefault();
			var tab_lastnosti = $('a[href=#lastnosti]');
			tab_lastnosti.click();
			$('html, body').animate({
				scrollTop: tab_lastnosti.offset().top
			});
			
		});
		
		$('a[data-toggle="tab"]').on('shown', function (e) {
			if (screen.width > 480) {
				equalize($(this).attr('href') + ' .equal-height');
			}
			// mobile tab navigation
			if ($('.tabbable-nav').is(':visible') == true) {
				var _target_tab = $(e.target);
				var _parent = _target_tab.parents('.tabbable');
				var _ul = _target_tab.parents('ul');
				_placeholder_width = _parent.width();
				_self_width = _target_tab.outerWidth();
				_self_left = _target_tab.offset().left - parseInt(_ul.css('margin-left'));
				
				var _centered_left = _self_left - ((_placeholder_width - _self_width) / 2);
				
				_ul.animate({
					marginLeft: -_centered_left
				});
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
		
		/** Configurator paket selector **/
		$.getScript('script/paket.selector.js', function() {
			$('.configurator .paket-selector').paketSelector(function(obj) {
				//console.log(obj);
			});
		});
		
		/** Configurator options checkbox->radio **/
		$('.configurator .choice input[type=checkbox], .shops input[type=checkbox]').change(function(){
			var _el = $(this);
			if ( _el.closest('.choices').hasClass('multiple')) return;
			if (_el.attr('checked')) {
				$('input[type=checkbox]', _el.closest('.choices')).attr('checked', false);
				$(this).attr('checked', true);
			}
		});
		
		/** Configurator options more info **/
		$('.configurator .choice .c4 a').click(function(){
			$('.info', $(this).closest('.choice')).slideToggle('fast');
			return false;
		});
		
		/** Configurator disable options **/
		$('.configurator .paket-selector .tools input').change(function(){
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
		
		/** Accordion **/
		$('.collapse').live('show' , function() {
			$(this).parent('.accordion-group').addClass('opened');
		}).live('hidden', function() {
			$(this).parent('.accordion-group').removeClass('opened');
		});
		
		
		$('body').on('click', '.accordion-heading a', function(e) { e.preventDefault();});
		
	});
	
})(jQuery);
