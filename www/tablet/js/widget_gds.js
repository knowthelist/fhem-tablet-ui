"use strict";

function depends_gds() {
    var deps = [];
    return deps;
}

var Modul_gds = function () {

    function init() {
        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");
            
			elem.initData('max',			10);
			elem.initData('description',	true)
			elem.initData('region',			true)
			elem.initData('instructions',	true)
			elem.initData('timerange',		true)
			elem.initData('a_count',		'a_count');
			elem.initData('gdsUseAlerts',	'gdsUseAlerts');

			// if hide reading is defined, set defaults for comparison
			if (elem.isValidData('hide')) {
				elem.initData('hide-on', 'true|1|on');
			}
			elem.initData('hide', elem.data('a_count'));
			if (elem.isValidData('hide-on')) {
				elem.initData('hide-off', '!on');
			}
			me.addReading(elem, 'hide');
			me.addReading(elem, 'gdsUseAlerts');
			me.addReading(elem, 'a_count');
			
			var useAlerts = elem.getReading('gdsUseAlerts').val;
			var count = elem.getReading('a_count').val;
			if (useAlerts == 1) {
				if (count >= 1) {
					if (count > elem.data('max')) {
						count = elem.data('max');
					}
					for (var i = 0; i <= count - 1; i++) {

						elem.initData('a_' + i + '_eventCode_AREA_COLOR_hex', 'a_' + i + '_eventCode_AREA_COLOR_hex');
						me.addReading(elem, 'a_' + i + '_eventCode_AREA_COLOR_hex');
						elem.initData('a_' + i + '_event', 'a_' + i + '_event');
						me.addReading(elem, 'a_' + i + '_event');
						if (elem.data('region')) {
							elem.initData('a_' + i + '_areaDesc', 'a_' + i + '_areaDesc');
							me.addReading(elem, 'a_' + i + '_areaDesc');
						}
						if (elem.data('description')) {
							elem.initData('a_' + i + '_description', 'a_' + i + '_description');
							me.addReading(elem, 'a_' + i + '_description');
						}
						if (elem.data('instructions')) {
							elem.initData('a_' + i + '_instruction', 'a_' + i + '_instruction');
							me.addReading(elem, 'a_' + i + '_instruction');
						}
						
						if (elem.data('timerange')) {
							elem.initData('a_' + i + '_onset_local', 'a_' + i + '_onset_local');
							me.addReading(elem, 'a_' + i + '_onset_local');
							elem.initData('a_' + i + '_expires_local', 'a_' + i + '_expires_local');
							me.addReading(elem, 'a_' + i + '_expires_local');
						}
						
						elem.initData('a_' + i + '_valid', 'a_' + i + '_valid');
						me.addReading(elem, 'a_' + i + '_valid');
					}
				}
			}
        });
    }
	
	function update(dev,par) {
		
		me.elements.filter('div[data-device="' + dev + '"]')
        .each(function(index) {
			var elem = $(this);
			var html = "";
			var useAlerts = elem.getReading('gdsUseAlerts').val;
			var count = elem.getReading('a_count').val;
			if (useAlerts == 1) {
				if (count >= 1) {
					if (count > elem.data('max')) {
						count = elem.data('max');
					}
					for (var i = 0; i <= count - 1; i++) {
						html += "<div class=\"cell top-space\">";
						
						if (elem.getReading('a_' + i + '_valid').val == 1) {
							html += "<div class=\"cell\" style=\"min-width:150px;display:inline-block;padding:4px;font-weight:bold;color:#222222;border-radius:4px;background-color:#" + elem.getReading('a_' + i + '_eventCode_AREA_COLOR_hex').val + ";\"><i class=\"fa fa-exclamation-triangle firebrick\"></i>&nbsp;" + elem.getReading('a_' + i + '_event').val + "&nbsp;<i class=\"fa fa-exclamation-triangle firebrick\"></i></div>";
						}
						else {
							html += "<div class=\"cell\" style=\"min-width:150px;display:inline-block;padding:4px;font-weight:bold;color:#222222;border-radius:4px;background-color:#" + elem.getReading('a_' + i + '_eventCode_AREA_COLOR_hex').val + ";\">" + elem.getReading('a_' + i + '_event').val + "</div>";
						}
						if (elem.data('region')) {
							html += "<div class=\"cell\">" + elem.getReading('a_' + i + '_areaDesc').val + "</div>";
						}
						
						if (elem.data('description')) {
							html += "<div class=\"cell\">" + elem.getReading('a_' + i + '_description').val + "</div>";
						}
						
						if (elem.data('instructions')) {
							if (elem.getReading('a_' + i + '_instruction').valid) {
								html += "<div class=\"cell\">" + elem.getReading('a_' + i + '_instruction').val + "</div>";
							}
						}
						
						if (elem.data('timerange')) {
							html += "<div class=\"cell\">Von: " + elem.getReading('a_' + i + '_onset_local').val + " bis: " + elem.getReading('a_' + i + '_expires_local').val + "</div>";
						}
						
						html += "</div>";
					}
				}
				else {
					html += "<div class=\"cell top-space\" style=\"min-width:150px;display:inline-block;padding:3px;color:#DDDDDD;border-radius:4px;background-color:#32A054;\">Aktuell keine Warnmeldungen vorhanden.</div>";
				}
			}
			else {
				html += "<div class=\"cell top-space\" style=\"min-width:150px;display:inline-block;padding:3px;color:#DDDDDD;border-radius:4px;background-color:firebrick;\">Attribut \"gdsUseAlerts\" nicht gesetzt!<br />Siehe auch: FHEM commandRef</div>";
			}
			elem.html(html);
			//extra reading for hide
			me.update_hide(dev, par);
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