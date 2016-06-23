var widget_agenda = {
	_agenda: null,
	elements: null,
	init: function () {
		console.log("agenda");
		_agenda=this;
		_agenda.elements = $('div[data-type="agenda"]');
		_agenda.elements.each(function(index) {
			var device = $(this).data('device');
			console.log("device: " + device);
			console.log("max: " + $(this).data('max'));	
			var num;
			var value;
			$(this).data('max', $(this).data('max') || 100);
			value = $(this).data('max');
			$(this).data('c-term', 'c-term');
			readings['c-term'] = true;
			for (i = 1; i <= value; i++) {
				num = "00";
				num = num+i;
				num = num.slice(-3);

				console.log("agenda - init readings for entry " + num);

				$(this).data('t_'+num+'_summary', 't_'+num+'_summary');
				readings['t_'+num+'_summary'] = true;

				$(this).data('t_'+num+'_bdate', 't_'+num+'_bdate');
				readings['t_'+num+'_bdate'] = true;

				$(this).data('t_' + num + '_btime', 't_' + num + '_btime');
				readings['t_' + num + '_btime'] = true;

				$(this).data('t_'+num+'_edate', 't_'+num+'_edate');
				readings['t_'+num+'_edate'] = true;

				$(this).data('t_' + num + '_etime', 't_' + num + '_etime');
				readings['t_' + num + '_etime'] = true;

				$(this).data('t_'+num+'_location', 't_'+num+'_location');
				readings['t_'+num+'_location'] = true;

				$(this).data('t_' + num + '_source', 't_' + num + '_source');
				readings['t_' + num + '_source'] = true;
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
		if ( dev == '*' ) {
			deviceElements = _agenda.elements;
		}
		else { 
			deviceElements = _agenda.elements.filter('div[data-device="'+dev+'"]');
		}

		deviceElements.each(function(index) {
			nullmeldungen = 0;
			termcounter = 0;
			text = "";
			count = getDeviceValue($(this), 'c-term');

			// render container
			text += "<div class=\"container padding\">";

			if (count == 0)	{
				text += "<div data-type=\"label\">Keine Termine</div>";
			}
			else if (count > $(this).data('max')) {
				count = $(this).data('max');
			}

			var getDate = function(obj, datename, timename) {
				var d = getDeviceValue(obj, datename).split('.');
				var t = getDeviceValue(obj, timename).split(':');
				return new Date( d[2], d[1]-1, d[0], t[0], t[1], t[2] );
			};

			var diffDays = function(date1, date2) {
				var diff  = new Date(new Date(date2.getYear(), date2.getMonth(), date2.getDate())
						    - new Date(date1.getYear(), date1.getMonth(), date1.getDate())
						);
				return Math.floor((diff/1000/60/60/24));
			};

			var prettyPrintDate = function(date) {
				var text = "";
				switch (diffDays(new Date(), date)) {
				    case 0: text += "Heute" + ", "; break;
				    case 1: text += "Morgen" + ", "; break;
				};

				text += date.eeee() + ", " + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
				return text;
			};

			var readCalendarConfig = function(obj, source, setting, defaultValue) {
				try {
					var cfg = obj.data('config');
					var val = eval( "cfg." + source + "." + setting );
					if( val && val != "" )
						return val;
					else
						return defaultValue;
				}
				catch(e) {
					console.log(e);
					return defaultValue;
				}
			};

			var currentDate = new Date(2000, 1, 1);
			for( var i = 1; i <= count; i++ ) {
				var num;
				num = "00" + i;
				num = num.slice(-3);

				var summary = getDeviceValue($(this), 't_'+num+'_summary');
				var bdate = getDate($(this), 't_'+num+'_bdate', 't_'+num+'_btime');
				var edate = getDate($(this), 't_'+num+'_edate', 't_'+num+'_etime');
				var source = getDeviceValue($(this), 't_'+num+'_source');

				// check if new day
				if( diffDays(currentDate, bdate) != 0 ) {
					text += "<div class=\"center container padding inline top-narrow-10\">";
					text += "<div class=\"left-align small darker\" style=\"width:100%; border-bottom:1px solid #393939\">";
					text += prettyPrintDate(bdate);
					text += "</div>";
					text += "</div>";

					currentDate = bdate;
				}

				var icon  = readCalendarConfig($(this), source, "icon", "");
				var color = readCalendarConfig($(this), source, "color", "");
				var abbr  = readCalendarConfig($(this), source, "abbreviation", "");

				if( icon != "" ) {
					if( icon.substr(0,3) == "fa-" )
						icon = "fa " + icon;
					abbr = "";
				}


				text += "<div class=\"center container padding inline top-narrow-10\">";
				text += "<div class=\"center large " + icon + "\" style=\"line-height:30px;background-color:" + color + "; min-height:30px; min-width:30px;\">";
				text += abbr;
				text += "</div>";
				text += "<div class=\"bg-gray\" style=\"padding-left:5px; width:100%; min-height:30px\">";
				text += "<div class=\"left-align bold\">" + summary + "</div>";
				text += "<div class=\"left-align small darker\">" + bdate.hhmm() + " - ";
				
				if( diffDays(bdate, edate) == 0 )
					text += edate.hhmm();
				else
					text += prettyPrintDate(edate);

				text += "</div>";
				text += "</div>";
				text += "</div>";
			}

			// close container
			text += "</div>";

			$(this).html( text );
		});
	}
};

