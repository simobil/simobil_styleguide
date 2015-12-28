(function($) {
	
	$.fn.paketSelector = function(callback) {
		
		this.each(function() {
			
			var $this = $(this);
			
			$('a.box', $this).each(function(i) {
				
				$(this).data('index', i);
				
				$(this).click(function() {
					return paketSelectorSelect($(this).data('index'));
				});
			});
			
			$('.selection a', $this).click(function(){
				
				var _p = $('a.box', $this);
				var _idx = _p.filter('.selected').data('index');
				
				if ($(this).hasClass('prev')) {
					return paketSelectorSelect(Math.max(_idx-1, 0));
					//return paketSelectorSelect((_idx+_p.length-1)%_p.length); // carusel
				}
				
				if ($(this).hasClass('next')) {
					return paketSelectorSelect(Math.min(_idx+1, _p.length-1));
					//return paketSelectorSelect((_idx+_p.length+1)%_p.length); // carusel
				}
				
			});
			
			function paketSelectorInit() {
				$('a.box.selected', $this).each(function(){
					return paketSelectorSelect($(this).data('index'));
				});
				
				var _resize_to = false;
				
				$(window).resize(function() {
					if (_resize_to) {
						clearTimeout(_resize_to);
					}
					_resize_to = setTimeout(function() {
						paketSelectorInit();	
					}, 500);
				});
			}
				
			function paketSelectorSelect(idx) {
				var _sel = $('.selection', $this);
				var _p = $('a.box', $this);
				var _distance = $('.distance', $this);
				var _scroll = $('.paketi .scroll', $this);
				_p.removeClass('selected');
				$(_p.get(idx)).addClass('selected');
				
				if (_p.length < 2) {
					$('a.prev, a.next', _sel).hide();
					return false;
				}
				
				var _sel_left = Math.max(_distance.width(), $(_p.get(idx)).position().left);
				
				_sel.css('left', _sel_left).show();
					
				c = 0;
				while (true) {
					
					t = testInWindow(idx, $(_p.get(idx)), _scroll, _scroll.parent(), _distance.width());
					
					if (t == 0) break;
					
					_scroll.css('left', parseInt(_scroll.css('left')) - t*_p.width());

					if (c++ > _p.length) break;
				}
				
				_scroll.css('left', Math.min(parseInt(_scroll.css('left')), 0));
				
				a = _scroll.parent().width()-(_p.length*_p.width() + 2*_distance.width());
				b = (_scroll.parent().width()-2*_distance.width()) % _p.width();
				
				_scroll.css('left', Math.max(parseInt(_scroll.css('left')), a-b));
				
				_p.each(function(i){
					if (testInWindow(i, $(this), _scroll, _scroll.parent(), _distance.width()) != 0) {
						$(this).css('visibility', 'hidden');
					} else {
						$(this).css('visibility', 'visible');
					}
				});
				
				if (typeof callback == 'function') callback(_p.get(idx));
				
				return false;
			}
			
			function testInWindow(idx, box, scroll, scrollWindow, distance) {
				absScrollLeft = Math.abs(parseInt(scroll.css('left')));
				
				bl = absScrollLeft + distance;
				br = absScrollLeft + scrollWindow.width() - distance;
				
				pos = idx * box.width() + distance;
				
				if (pos < bl) return -1;
				if ((pos + box.width()) > br) return 1;
				
				return 0;
			}
			
			paketSelectorInit();
			
			$('a[data-toggle="tab"]').on('shown', paketSelectorInit);			
		});
		
	};
	
})(jQuery);