// Version Chris1284 25-11-2015 18:15 V1.0
var widget_calview = {
	_calview: null,
	elements: null,
	init: function () {
		console.log("calview");	
		_calview=this;
		_calview.elements = $('div[data-type="calview"]');
		_calview.elements.each(function(index) {
			var device = $(this).data('device');
			console.log("device: " + device);
			console.log("get: " + $(this).data('get'));	
			console.log("max: " + $(this).data('max'));	
			var num;
			var value;
			$(this).data('get', $(this).data('get') || 'STATE');
			$(this).data('max', $(this).data('max') || 100);
			if ($(this).data('get') == 'today') {
				value = $(this).data('max');
				$(this).data('c-today', 'c-today');
				readings['c-today'] = true;
				for (i = 1; i <= value; i++) {
					num = "00";
					num = num+i;
					num = num.slice(-3);
					$(this).data('today_'+num+'_summary', 'today_'+num+'_summary');
					readings['today_'+num+'_summary'] = true;
					$(this).data('today_'+num+'_btime', 'today_'+num+'_btime');
					readings['today_'+num+'_btime'] = true;
				}
			}
			else if ($(this).data('get')  == 'tomorrow') {
				value = $(this).data('max');
				$(this).data('c-tomorrow', 'c-tomorrow');
				readings['c-tomorrow'] = true;
				for (i = 1; i <= value; i++) {
					num = "00";
					num = num+i;
					num = num.slice(-3);
					$(this).data('tomorrow_'+num+'_summary', 'tomorrow_'+num+'_summary');
					console.log('tomorow_' + num + '_summary'+$(this).data('tomorrow_'+num+'_summary', 'tomorrow_'+num+'_summary'));
					readings['tomorrow_'+num+'_summary'] = true;
					$(this).data('tomorrow_'+num+'_btime', 'tomorrow_'+num+'_btime');
					readings['tomorrow_'+num+'_btime'] = true;
				}
			}
			else if ($(this).data('get')  == 'all') {
				value = $(this).data('max');
				$(this).data('c-term', 'c-term');
				readings['c-term'] = true;
				for (i = 1; i <= value; i++) {
					num = "00";
					num = num+i;
					num = num.slice(-3);
					$(this).data('t_'+num+'_summary', 't_'+num+'_summary');
					readings['t_'+num+'_summary'] = true;
					$(this).data('t_'+num+'_bdate', 't_'+num+'_bdate');
					readings['t_'+num+'_bdate'] = true;
					$(this).data('t_'+num+'_location', 't_'+num+'_location');
					readings['t_'+num+'_location'] = true;
				}
			}
		});
	},
	update: function (dev,par) {
		var deviceElements;
		var nullmeldungen;
		var termcounter;
		var text;
		var num;
		var ctoday;
		var ctommorow;
		var cterm;
		if ( dev == '*' ) {deviceElements= _calview.elements;}
		else { deviceElements= _calview.elements.filter('div[data-device="'+dev+'"]');}

		deviceElements.each(function(index) {
				var get = $(this).data('get');
				if ($(this).data('get') == 'STATE') {if (getDeviceValue( $(this), 'get' )) {$(this).html( "<div class=\"cell\" data-type=\"label\">"+value+"</div>" );}}
				else if ($(this).data('get') == 'today') {
					nullmeldungen = 0;
					termcounter = 0;
					text =  "";
					ctoday = getDeviceValue($(this), 'c-today');
					if 	(ctoday == 0){text += "<div data-type=\"label\">Heute keine Termine</div>";}
					else if (ctoday > $(this).data('max')) {
						for (i = 1; i <= $(this).data('max'); i++) {
							num = "00";
							num = "00"+i;
							num = num.slice(-3);
							text += "<div class=\"cell\">";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 'today_'+num+'_btime') + "</div>";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 'today_'+num+'_summary')+ "</div>";
							text += "</div>";
						}
					}
					else if ( ctoday <= $(this).data('max') && ctoday != 0 ) {
						for (i = 1; i <= ctoday; i++) {
							num = "00";
							num = "00"+i;
							num = num.slice(-3);
							text += "<div class=\"cell\">";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 'today_'+num+'_btime') + "</div>";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 'today_'+num+'_summary')+ "</div>";
							text += "</div>";
						}
					}
					$(this).html( text );
				}
				else if ($(this).data('get') == 'tomorrow') {
					nullmeldungen = 0;
					termcounter = 0;
					text =  "";
					ctommorow = getDeviceValue($(this), 'c-tomorrow');
					if 	(ctommorow == 0){text += "<div data-type=\"label\">Morgen keine Termine</div>";}
					else if (ctommorow > $(this).data('max')) {
						for (i = 1; i <= $(this).data('max'); i++) {
							num = "00";
							num = "00"+i;
							num = num.slice(-3);
							text += "<div class=\"cell\">";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 'tomorrow_'+num+'_btime') + "</div>";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 'tomorrow_'+num+'_summary')+ "</div>";
							text += "</div>";
						}
					}
					else if ( ctommorow <= $(this).data('max') && ctommorow != 0 ) {
						for (i = 1; i <= ctommorow; i++) {
							num = "00";
							num = "00"+i;
							num = num.slice(-3);
							text += "<div class=\"cell\">";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 'tomorrow_'+num+'_btime') + "</div>";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 'tomorrow_'+num+'_summary')+ "</div>";
							text += "</div>";
						}
					}
					$(this).html( text );
				}
				else if ($(this).data('get') == 'all') {
					nullmeldungen = 0;
					termcounter = 0;
					text =  "";
					cterm = getDeviceValue($(this), 'c-term');
					if 	(cterm == 0){text += "<div data-type=\"label\">Morgen keine Termine</div>";}
					else if (cterm > $(this).data('max')) {
						for (i = 1; i <= $(this).data('max'); i++) {
							num = "00";
							num = "00"+i;
							num = num.slice(-3);
							text += "<div class=\"cell\">";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 't_'+num+'_bdate') + "</div>";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 't_'+num+'_summary')+ "</div>";
							text += "</div>";
						}
					}
					else if ( cterm <= $(this).data('max') && cterm != 0 ) {
						for (i = 1; i <= cterm; i++) {
							num = "00";
							num = "00"+i;
							num = num.slice(-3);
							text += "<div class=\"cell\">";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 't_'+num+'_bdate') + "</div>";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 't_'+num+'_summary')+ "</div>";
							text += "</div>";
						}
					}
					$(this).html( text );
				}
		});
	}
};
