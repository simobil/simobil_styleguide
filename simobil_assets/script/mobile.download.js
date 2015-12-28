!function($) {
	$(function() {
		function getCookie(name) {
			var regexp = new RegExp("(?:^" + name + "|;\s*"+ name + ")=(.*?)(?:;|$)", "g");
			var result = regexp.exec(document.cookie);
			return (result === null) ? null : result[1];
		}
		
		var cookieShort = 3; // 3 days
		var cookieLong = 4*30; // ~4 months
		
		// message for alert box
		var message = 'Namestite si Si.Info, brezplačno Si.mobilovo aplikacijo, s katero lahko nenehno spremljate svojo porabo.';
		var urls = {
			android: 	'https://play.google.com/store/apps/details?id=si.mobil.info',
			blackberry: 'http://appworld.blackberry.com/webstore/content/43078888/?lang=en&countrycode=SI',
			windows: 	'http://www.windowsphone.com/sl-si/store/app/si-info/7a174bab-82ff-4669-bf79-7ac078db0556'
		}
		var type = window.isMobile();
		if (type && !getCookie('SiInfoNotice')) {
			/* in case of alert box
			if (urls[type]) {
				var d = new Date();
				if (confirm(message)) {
					d.setTime(d.getTime() + (cookieLong*24*60*60*1000));
					document.cookie = "SiInfoNotice=1; expires=" + d.toUTCString() + "; path=/";
					location.href = urls[type];
				} else {
					d.setTime(d.getTime() + (cookieShort*24*60*60*1000));
					document.cookie = "SiInfoNotice=1; expires=" + d.toUTCString() + "; path=/";
				}
			}
			*/
			// In case of lightbox
			$('#mobile-dl .type').not('.'+type).hide();
			$('#mobile-dl').overlay({
				mask: {
			        color: '#333',
			        loadSpeed: 200,
			        opacity: 0.9
			    },
			    closeOnClick: false,
			    fixed: false,
			    onClose: function(event) {
			    	var d = new Date();
			    	
			    	if ($(event.target).attr('rel') == 'permanent') {
			    		d.setTime(d.getTime() + (cookieLong*24*60*60*1000));
			    	} else {
			    		d.setTime(d.getTime() + (cookieShort*24*60*60*1000));
			    	}
			    	document.cookie = "SiInfoNotice=1; expires=" + d.toUTCString();
			    },
			    load: true
			});
		}
	});
}(window.jQuery);