!function($) {
	
	var ContentSlider = function (element) {
		this.$element = $(element);
		this.$options = $.extend({}, $.fn.contentSlider.defaults, this.$element.data());
		this.init();
	};
	
	ContentSlider.prototype = {
		
		constructor: ContentSlider,
		useHistory: false,
		
		init: function() {
			this.$options.parent = this.$options.parent || this.$element.parents('.content-slider').first(); 
			this.$options.container = this.$options.container || $(this.$options.slideContainer, this.$options.parent).first();
			this.$element.click = this.slide;
		},
		
		slide: function () {
			var that = this;
			if (this.$options.type == 'ajax') {
				this.loadContent(this.$element.attr('href'), function() {
					that.go(that.$options.target);
				});
			} else {
				this.go(this.$options.target);
			}
		},
		
		go: function (target) {
			$_target = $(this.$options.target, this.$options.parent).first();
			$_container = this.$options.container;
			$_container.animate({
				scrollLeft: $_container.scrollLeft() + $_target.position().left
			}, 400);
		},
		
		loadContent: function (url, callback) {
			
			$_target = $(this.$options.target, this.$options.parent).first();
			
			if ($.support.pjax) {
				$.pjax({
					url: url,
					container: this.$options.target,
					scrollTo: false
				});
				
				$(document).on('pjax:end', function(event) {
					if (typeof callback == 'function')
						callback();
				}).on('pjax:popstate', function(data) {
					console.log(data);
				});
			} else {
				$.get(url, function(data) {
					$_target.html(data);
					if (typeof callback == 'function')
						callback();
				});
			}
			
		}
	};
	
	$.fn.contentSlider = function(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('content-slider');
			if (!data) $this.data('content-slider', (data = new ContentSlider(this)));
			if (typeof option == 'string') data[option]();
		});
	};
	
	$.fn.contentSlider.defaults = {
		type: 'inline',
		slideNav: '.slide-nav',
		slideContainer: '.slide-container'
	};
	
	$.fn.contentSlider.constructor = ContentSlider;
	
	$(function () {
		
		$('body').on('click.contentSlider', '[data-toggle="slide"]', function (e) {
			e.preventDefault();
			var $this = $(this);
			
			$this.contentSlider('slide');
			
			// history managment?
			
		});
	});
	
}(window.jQuery);