var Modul_gds = function () {
	
    function init () {
        var me = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]',this.area);
        this.elements.each(function(index) {
			var elem = $(this);
			var device = elem.data('device');
			console.log("device: " + device);
			console.log("get: " + elem.data('get'));	
			console.log("max: " + elem.data('max'));	
			elem.data('get', elem.data('get') || 'state');
			elem.data('max', elem.data('max') || 10);
			if (elem.data('get') == 'alert') {
				value = elem.data('max');
				elem.data('a_count', 'a_count');
				me.addReading('a_count');
				for (i = 0; i <= value; i++) {
					elem.data('a_'+i+'_event', 'a_'+i+'_event');
					me.addReading('a_'+i+'_event');
					elem.data('a_'+i+'_description', 'a_'+i+'_description');
					me.addReading('a_'+i+'_description');
					elem.data('a_'+i+'_onset_local', 'a_'+i+'_onset_local');
					me.addReading('a_'+i+'_onset_local');
					elem.data('a_'+i+'_expires_local', 'a_'+i+'_expires_local');
					me.addReading('a_'+i+'_expires_local');
					elem.data('a_'+i+'_eventCode_AREA_COLOR_hex', 'a_'+i+'_eventCode_AREA_COLOR_hex');
					me.addReading('a_'+i+'_eventCode_AREA_COLOR_hex');
				}
			}
		});
	};
	
	function update(dev,par) {
		var elem = $(this);
		var deviceElements;
		var text = "";
		var acounter;
		if ( dev == '*' ) {deviceElements= _gds.elements;}
		else {deviceElements= _gds.elements.filter('div[data-device="'+dev+'"]');}

		deviceElements.each(function(index) {
			var get = elem.data('get');
			if (elem.data('get') == 'state') { elem.html( "<div class=\"cell\">No DATA-GET SET</div>");}
			else if (elem.data('get') == 'alert') {
				acounter = getDeviceValue(elem, 'a_count');
				if ( acounter >= 1 && acounter > elem.data('max')) {
					for (i = 0; i <= (elem.data('max') - 1); i++) {
						text += "<div class=\"cell top-space\">";
						text += "<div class=\"cell\" style=\"color:#" + getDeviceValue(elem, 'a_'+i+'_eventCode_AREA_COLOR_hex')+ ";\">Warnung vor " + getDeviceValue(elem, 'a_'+i+'_event') + ":</div>";
						text += "<div class=\"cell\" >" + getDeviceValue(elem, 'a_'+i+'_description')+ "</div>";
						text += "<div class=\"cell\" >Von: " + getDeviceValue(elem, 'a_'+i+'_onset_local')+ " bis: " + getDeviceValue(elem, 'a_'+i+'_expires_local')+ "</div>";
						text += "</div>";
					}
				}
				else if ( acounter >= 1 && acounter <= elem.data('max') ) {
					for (i = 0; i <= (acounter -1); i++) {
						text += "<div class=\"cell top-space\">";
						text += "<div class=\"cell\" style=\"color:#" + getDeviceValue(elem, 'a_'+i+'_eventCode_AREA_COLOR_hex')+ ";\">Warnung vor " + getDeviceValue(elem, 'a_'+i+'_event') + ":</div>";
						text += "<div class=\"cell\" >" + getDeviceValue(elem, 'a_'+i+'_description')+ "</div>";
						text += "<div class=\"cell\" >Von: " + getDeviceValue(elem, 'a_'+i+'_onset_local')+ " bis: " + getDeviceValue(elem, 'a_'+i+'_expires_local')+ "</div>";
						text += "</div>";
					}
				}
				else {text += "<div class=\"cell top-space\">Es liegen keine Warnungen vor.</div>";}
				elem.html( text );
			}
		});
	};

    // public
    // inherit all public members from base class
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'gds',
        init: init,
        update: update,
    });
};