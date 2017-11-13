"use strict";

function depends_example() {
    var deps = [];
    return deps;
}

var Modul_gds = function () {
	
    function init () {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {

            var elem = $(this);
			
			elem.initData('max', 10);
			elem.initData('a_count',		'a_count');
			elem.initData('gdsUseAlerts',	'gdsUseAlerts');
			
			me.addReading(elem,'a_count');
		});
	}
	
	function update(dev,par) {
		var me = this;
		var text = "";
        me.elements.filterDeviceReading('a_count',dev,par)
        .each(function(index) {
			var elem = $(this);
			var useAlerts = elem.getReading('gdsUseAlerts').val;
			var count = elem.getReading('a_count').val;
			var max = elem.data('max');
			if (useAlerts == 1) {
				if (count >= 1) {
					if (count > max) {
						count = max;
					}
					for (var i = 0; i <= count - 1; i++) {
						elem.data('eventCode', 'a_'+i+'_eventCode_AREA_COLOR_hex')
						elem.data('event', 'a_'+i+'_event')
						elem.data('description', 'a_'+i+'_description')
						elem.data('onSet', 'a_'+i+'_onset_local')
						elem.data('expires', 'a_'+i+'_expires_local')
						
						text += "<div class=\"cell top-space\">";
						text += "<div class=\"cell\" style=\"min-width:150px;display:inline-block;padding:4px;font-weight:bold;color:#222222;border-radius:4px;background-color:#"+elem.getReading('eventCode').val+";\">"+elem.getReading('event').val+"</div>";
						text += "<div class=\"cell\">"+elem.getReading('description').val+"</div>";
						
						text += "<div class=\"cell\">Von: "+elem.getReading('onSet').val+" bis: "+elem.getReading('expires').val+"</div>";
						text += "</div>";
					}
				}
				else {
					text += "<div class=\"cell top-space\" style=\"min-width:150px;display:inline-block;padding:3px;color:#DDDDDD;border-radius:4px;background-color:#32A054;\">Aktuell keine Warnmeldungen vorhanden.</div>";
				}
			}
			else {
				text += "<div class=\"cell top-space\" style=\"min-width:150px;display:inline-block;padding:3px;color:#DDDDDD;border-radius:4px;background-color:firebrick;\">Attribut \"gdsUseAlerts\" nicht gesetzt!<br />Siehe auch: FHEM commandRef</div>";
			}
			elem.html(text);
		});
	}

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'gds',
        init: init,
        update: update,
    });

    return me;
};