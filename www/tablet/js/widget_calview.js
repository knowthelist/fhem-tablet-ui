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
				for (i = 1; i <= value; i++) {
					console.log("all: " + i);	
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
		if ( dev == '*' ) {deviceElements= _calview.elements;}
		else { deviceElements= _calview.elements.filter('div[data-device="'+dev+'"]');}
		
							
		deviceElements.each(function(index) {
			var get = $(this).data('get');	
				if ($(this).data('get') == 'STATE') {if (getDeviceValue( $(this), 'get' )) {$(this).html( "<div class=\"cell\" data-type=\"label\">"+value+"</div>" );}}
				else if ($(this).data('get') == 'today') {
					nullmeldungen = 0;
					termcounter = 0;
					text =  "";
					for (i = 1; i <= $(this).data('max'); i++) {
						num = "00";
						num = "00"+i;
						num = num.slice(-3);
						if (getDeviceValue($(this), 'today_'+num+'_btime')){
							text += "<div class=\"cell\">";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 'today_'+num+'_btime') + "</div>";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 'today_'+num+'_summary')+ "</div>";
							text += "</div>";
							termcounter ++}
						else {nullmeldungen ++;}
					}
					if (nullmeldungen > 0 && termcounter == 0){text += "<div data-type=\"label\">Heute keine Termine</div>";}
					$(this).html( text );
				}
				else if ($(this).data('get') == 'tomorrow') {
					nullmeldungen = 0;
					termcounter = 0;
					text =  "";					
					for (i = 1; i <= $(this).data('max'); i++) {
						num = "00";
						num = "00"+i;
						num = num.slice(-3);
						if (getDeviceValue($(this), 'tomorrow_'+num+'_btime')){
							text += "<div class=\"cell\">";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 'tomorrow_'+num+'_btime') + "</div>";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 'tomorrow_'+num+'_summary')+ "</div>";
							text += "</div>";
							termcounter ++;}
						else {nullmeldungen ++;}
					}
					if (nullmeldungen > 0 && termcounter == 0){text += "<div data-type=\"label\">Morgen keine Termine</div>";}
					$(this).html( text );
				}
				else if ($(this).data('get') == 'all') {
					nullmeldungen = 0;
					termcounter = 0;
					text =  "";
					var forecastColor = $(this).data('all-forecast-color'); 
					var todayColor = $(this).data('all-today-color');
					console.log("max: " + forecastColor + " " + todayColor );
					
					for (i = 1; i <= $(this).data('max'); i++) {
						num = "00";
						num = "00"+i;
						num = num.slice(-3);
						// alter berechnen, sofern in location die entsprechende Jahreszahl angegeben ist						
						var alter = "";
						now = new Date();
						if (/^[0-9]{4}$/.test(getDeviceValue($(this), 't_'+num+'_location'))) {
							alter = " (" +(now.getFullYear() - getDeviceValue($(this), 't_'+num+'_location')) +")";						
						}
						console.log("Ist heute : " + isToday(getDeviceValue($(this), 't_'+num+'_bdate')));
						console.log("Ist in den nächsten 7 Tagen : " + isEventInThisWeek(getDeviceValue($(this), 't_'+num+'_bdate')));						
						if (getDeviceValue($(this), 't_'+num+'_bdate')){
							if (isToday(getDeviceValue($(this), 't_'+num+'_bdate'))) {
							text += "<div class=\"cell large top-narrow-10 left\" style=\"color:" + todayColor + "\">";
							} else if (isEventInThisWeek(getDeviceValue($(this), 't_'+num+'_bdate'))) {
							text += "<div class=\"cell large top-narrow-10 left\" style=\"color:" + forecastColor +"\">";
							} else {
							text += "<div class=\"cell large top-narrow-10 left\">";
							}
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 't_'+num+'_bdate') + "</div>";
							text += "<div class=\"cell inline\" >" + getDeviceValue($(this), 't_'+num+'_summary') + alter + "</div>";
							text += "</div>";
							termcounter ++}
						else {nullmeldungen ++;}
					}
					if (nullmeldungen > 0 && termcounter == 0){text += "<div data-type=\"label\">Keine Termine</div>";}
					$(this).html( text );
				}
		});
	}
};

/**
* Date to check has to be in format dd.mm.yyyy
**/
function isToday(dateCheck) {
	if (dateCheck != null) {
		var c = dateCheck.split(".");
		var check = new Date(c[2], c[1]-1, c[0]);
		var today = new Date();	
		return today.getFullYear() == check.getFullYear() && today.getMonth() == check.getMonth() && today.getDate() == check.getDate();
	}
	return false;	
	}

function isEventInThisWeek(dateCheck) {
	if (dateCheck != null) {
		var c = dateCheck.split(".");
		var check = new Date(c[2], c[1]-1, c[0]);
		var lastDayOfForecast = new Date();
		lastDayOfForecast.setDate(lastDayOfForecast.getDate() + 7);
		return check >= Date.now() && check <= lastDayOfForecast;
	}
	return false;
}
