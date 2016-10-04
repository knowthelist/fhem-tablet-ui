// Initial Version from Chris1284
// Modifications for 2.2 klausw	4.7.2016
// data-get			all|today|tomorrow 
// data-start		none|notoday|notomorrow		(only for data-get="all" -> dont show Entrys from today or today and tomorrow)
// data-max			number how much Entries are maximal listed
// data-color		Text color
// data-detail		Array of details that should be shown default: ["bdate", "btime", "summary", "location"]
// data-showempty	show Text for "no Date" default: true
var Modul_calview = function () {
	var base = this;
	var readings = new Array();
	function init () {
		var me = this;
		this.elements = $('div[data-type="'+this.widgetname+'"]',this.area);
		this.elements.each(function(index) {
			var elem = $(this);
			// Standardwerte fuer Parameter
			elem.initData('max'				, 10);
			elem.initData('get'				, 'STATE');
			elem.initData('start'			, 'all');
			elem.initData('color'       	, '');
			elem.initData('detail'       	, ["bdate", "btime", "summary", "location"]);
			elem.initData('prefix'       	, 'no');
			elem.initData('showempty'      	, 'true');
			
			var device = $(this).data('device');
			console.log("device: " + device + " get: " + $(this).data('get') + " max: " + $(this).data('max'));	
			var num;
			var value;
			elem.initData('c-term', 'c-term');
			elem.initData('c-today', 'c-today');
			elem.initData('c-tomorrow', 'c-tomorrow');
			if ($(this).data('get') == 'today' || $(this).data('get')  == 'tomorrow' || $(this).data('get')  == 'all') {
				value = $(this).data('max');
				wann = $(this).data('get');
				//elem.initData('c-'+wann, 'c-'+wann);
				if ( wann == "all" ) { wann = "term"; }
				me.addReading(elem,'c-'+wann);
				console.log("c-"+wann+": "+elem.getReading('c-'+wann).val);
				if ( wann == "term" ) { wann = "t"; }
				for (i = 1; i <= value; i++) {
					num = "00"+i;
					num = num.slice(-3);
					elem.data('detail').forEach(function(wert) {
						elem.initData(wann+'_'+num+'_'+wert, wann+'_'+num+'_'+wert);
						me.addReading(elem,wann+'_'+num+'_'+wert);
						console.log(wann+'_'+num+'_'+wert+': '+elem.getReading(wann+'_'+num+'_'+wert).val);
					});
				}
			}
		});
	};
	function update (dev,par) {
		var deviceElements;
		var text;
		var num;
		var ct;
		if ( dev == '*' ) {deviceElements= this.elements;}
		else { deviceElements= this.elements.filter('div[data-device="'+dev+'"]');}

		deviceElements.each(function(index) {
			var elem = $(this);
			var get = elem.data('get');
			var color = elem.data('color');
			elem.css( "color", getStyle('.'+color,'color') || color );
			if (elem.data('get') == 'STATE') {
				if (getDeviceValue( elem, 'get' )) {
					elem.html( "<div class=\"cell\" data-type=\"label\">"+value+"</div>" );
				}
			}
			else if (elem.data('get') == 'today' || elem.data('get')  == 'tomorrow' || elem.data('get') == 'all') {
				text =  "";
				beginn = 1;
				var zeitrahmen = { "today": "heute ", "tomorrow": "morgen ", "all": "" }
				wann = elem.data('get');
				ct = elem.getReading('c-'+wann).val;
				
				if ( elem.data('get') == 'all' ) {
					wann = "t";
					ct = elem.getReading('c-term').val;
					if ( elem.data('start') == "notoday" ) {
						beginn = 1 + parseInt(elem.getReading('c-today').val);
					} else if ( elem.data('start') == "notomorrow" ) {
						beginn = 1 + parseInt(elem.getReading('c-today').val) + parseInt(elem.getReading('c-tomorrow').val);
					}
				} 
				if 	(ct == 0){ 
					if (elem.data('showempty') == "true" ) {	
						text += "<div class=\"col-1-2\">";
						text += "<div data-type=\"label\" class=\"left-align\">" +zeitrahmen[wann]+ "</div>";
						text += "</div>";
						text += "<div class=\"col-1-2\">";
						text += "<div data-type=\"label\" class=\"left-align\">keine Termine</div>";
				text += "</div>";}}
				else {
					if ( ct > elem.data('max') ) { ct = elem.data('max'); }
					for (i = beginn; i <= ct; i++) {
						num = "00"+i;
						num = num.slice(-3);
						//text += "<div class=\"row\">";
						colcounter = elem.data('detail').length;
						elem.data('detail').forEach(function(spalte) {
							if ( typeof elem.getReading(wann+'_'+num+'_'+spalte).val != "undefined" ) {
								text += "<div class=\"col-1-"+colcounter+"\" >";
								text += "<div data-type=\"label\" class=\"left-align\">" + elem.getReading(wann+'_'+num+'_'+spalte).val + "</div>";
								text += "</div>";
							}
						});
						//text += "</div>";
					}
				}
				elem.html( text );					
			}
		});
	};
	return $.extend(new Modul_widget(), {
        widgetname: 'calview',
        init: init,
        update: update,
    });
};
