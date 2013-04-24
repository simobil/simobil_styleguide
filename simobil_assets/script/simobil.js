
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
		
		function updateScrollableNav(el) {
			var api = el.data('scrollable');
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
		}
		
		$('.scrollable').each(function() {
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
				    }
				    
				}
			}).navigator('.navi');
			
			updateScrollableNav($(this));
		});
		
		$('a[data-toggle="tab"]').on('shown', function (e) {
			$('.scrollable').each(function() {
				updateScrollableNav($(this));
			});
		});
		
		$(window).on('resize', function() {
			$('.scrollable').each(function() {
				updateScrollableNav($(this));
			});
		});
		
		
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
		function equalize(selector, child) {
			$(selector).each(function(idx, el) {
				var _max_height = 0;
				$(child, $(el)).each(function() {
					$(this).css('height','auto');
					_max_height = Math.max(_max_height, $(this).height());
				});
				$(child, $(el)).height(_max_height);
			});
		}
		
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
				equalize($(this).attr('href') + ' .equal-height', '> div .box');
			}
		
		}).first().click();
		
		$('.tabbable-nav a').click(function(e) {
			e.preventDefault();
			
			var _parent = $(this).parents('.tabbable');
			
			var _links = $('a[data-toggle="tab"]', _parent);
			var _next = $('ul.nav-tabs li.active', _parent).index();
			
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
		$('.configurator .paket-selector .tools input, #toggle-free').change(function(){
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
		
		/** Custom file input **/
		$('.custom-file-input input[type=file]').change(function() {
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
		
		$('.custom-file-input .btn').click(function() {
			$('.custom-file-input input[type=file]').val('').trigger('click');
		});
		
		
		/** Accordion **/
		$('.collapse').live('show' , function(e) {
			e.stopPropagation();
			if ($(this).hasClass('stop')) return;
			$(this).parent('.accordion-group').addClass('opened');
		}).live('hidden', function(e) {
			e.stopPropagation();
			if ($(this).hasClass('stop')) return;
			$(this).parent('.accordion-group').removeClass('opened');
		});
		
		
		$('body').on('click', '.accordion-heading a', function(e) { e.preventDefault();});
		
		// Tooltips
		$('[rel="tooltip"]').tooltip();
		
		/** Corpo **/
		function equalize_team_list() {
			if (screen.width > 767) {
				setTimeout(function() {equalize('.corpo .equal-height', '.item');}, 200);
			}
		}
		
		equalize_team_list();
		$(window).on('resize', equalize_team_list);
		
	});
	
})(jQuery);
