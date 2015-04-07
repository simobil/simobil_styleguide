if (!window.isMobile) {
	"use strict";
	window.isMobile = function() {
		var checkMobile = {
			Android: function() {
				return navigator.userAgent.match(/Android/i);
			},
			BlackBerry: function() {
				return navigator.userAgent.match(/BlackBerry/i);
			},
			iOS: function() {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},
			Opera: function() {
				return navigator.userAgent.match(/Opera Mini/i);
			},
			Windows: function() {
				return navigator.userAgent.match(/IEMobile/i);
			},
			any: function() {
				return (this.Android() || this.BlackBerry() /*|| this.iOS() || this.Opera()*/ || this.Windows());
			}
		};
		
		if (checkMobile.any()) {
			var type = false;
			if (checkMobile.Android()) type = 'android';
			if (checkMobile.BlackBerry()) type = 'blackberry';
			//if (checkMobile.iOS()) type = 'ios';
			//if (checkMobile.Opera()) type = 'opera';
			if (checkMobile.Windows()) type = 'windows';
			return type;
		} else {
			return false;
		}
	}
}