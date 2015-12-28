(function($) {
	$.fn.getHiddenDimensions = function(boolOuter) {
		var $item = this;
		var props = { position: 'absolute', visibility: 'hidden', display: 'block' };
		var dim = { 'w':0, 'h':0 };
		var $hiddenParents = $item.parents().andSelf().not(':visible');
	 
		var oldProps = [];
		$hiddenParents.each(function() {
			var old = {};

			for ( var name in props ) {
				old[ name ] = this.style[ name ];
				this.style[ name ] = props[ name ];
			}

			oldProps.push(old);
		});
		
		dim.w = (boolOuter === true) ? $item.outerWidth() : $item.width();
		dim.h = (boolOuter === true) ? $item.outerHeight() : $item.height();
	 
		$hiddenParents.each(function(i) {
			var old = oldProps[i];
			for ( var name in props ) {
				this.style[ name ] = old[ name ];
			}
		});
		
		return dim;
	};
}(jQuery));