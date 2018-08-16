// widget_uwz last changed 2017-11-17 17:00:00 by chris1284
//-------------------------------------------------------------------
//-------------------------------------------------------------------

"use strict";
function depends_uwz() {
    var deps = ["lib/swiper.jquery.min.js"];
	$('head').append('<link rel="stylesheet" href="lib/swiper.min.css" type="text/css" />');
    return deps;
}

var Modul_uwz = function () {
	
	var colormap = {   
		'orange': 'orange',
		'gelb': 'yellow',
		'rot': 'red',
		'grün': 'green',
		'yellow': 'yellow',
		'red': 'red',
		'green': 'green',
		'0' : '#00ff00',
		'1' : '#45930c',
		'2' : '#ffe818',
		'3' : '#ffb400',
		'4' : '#e00000',
		'5' : '#c210cd'		
    };
	
    function init () {
        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");
            
			elem.initData('max'			, 10);
			elem.initData('detail'		, ["WarnUWZLevel_Color", "uwzLevel", "IconURL", "ShortText", "LongText", "Start", "End", "WarnTime",]);
			elem.initData('fontcolor'	, '#222222');
			elem.initData('hashtxt'		, 'uwzslide');
			elem.initData('imgsize'		, 30);
			elem.initData('lngtxtstyle'	, '');
			elem.initData('shttxtstyle'	, '');
			elem.initData('swiperstyle'	, 'no');
			elem.initData('swipername'	, 'uwzswiper');
			elem.initData('textdivider'	, ' ');
			elem.initData('WarnCount'	, 'WarnCount');

			var device = elem.data('device');
			//alert(device);
			console.log("device: " + device + " max: " + $(me).data('max') + " head: " + $(me).data('detail'));	

			var value = elem.data('max') - 1 ;
		
			me.addReading(elem, 'WarnCount');
			var i;
			var colorneed = 0;
			for (i = 0; i <= value; i++) {
					elem.data('detail').forEach(function(wert) {
						if (wert == 'WarnUWZLevel_Color') {
							colorneed = 1;
						}
						else if (wert == 'WarnTime') {
							elem.initData('Warn_'+i+'_Start_Date', 'Warn_'+i+'_Start_Date');
							me.addReading(elem,'Warn_'+i+'_Start_Date');
							console.log('Warn_'+i+'_Start_Date: '+elem.getReading('Warn_'+i+'_Start_Date').val);
							
							elem.initData('Warn_'+i+'_Start_Time', 'Warn_'+i+'_Start_Time');
							me.addReading(elem,'Warn_'+i+'_Start_Time');
							console.log('Warn_'+i+'_Start_Time: '+elem.getReading('Warn_'+i+'_Start_Time').val);

							elem.initData('Warn_'+i+'_End_Date', 'Warn_'+i+'_End_Date');
							me.addReading(elem,'Warn_'+i+'_End_Date');
							console.log('Warn_'+i+'_End_Date: '+elem.getReading('Warn_'+i+'_End_Date').val);
							
							elem.initData('Warn_'+i+'_End_Time', 'Warn_'+i+'_End_Time');
							me.addReading(elem,'Warn_'+i+'_End_Time');
							console.log('Warn_'+i+'_End_Time: '+elem.getReading('Warn_'+i+'_End_Time').val);
						}
						else {
							elem.initData('Warn_'+i+'_'+wert, 'Warn_'+i+'_'+wert);
							me.addReading(elem,'Warn_'+i+'_'+wert);
							console.log('Warn_'+i+'_'+wert+': '+elem.getReading('Warn_'+i+'_'+wert).val);
						}
					});
					
					if (colorneed == 1){
						var tmpreadingname = 'WarnUWZLevel_Color';
						elem.initData(tmpreadingname, tmpreadingname);
						me.addReading(elem,tmpreadingname);
					}
				}
		});
	}
	
	function update(dev,par) {
		
		me.elements.filter('div[data-device="' + dev + '"]')
        .each(function(index) {
			var elem = $(this);
			var mytext ="";
			var count = elem.getReading('WarnCount').val;
			if (count > 0) {
				var colortranslation;
				colortranslation = colormap[elem.getReading('WarnUWZLevel_Color').val];
				while (typeof mapped != "undefined" && !mapped.match(/^:/)) { colortranslation = colormap[mapped];}				
				if ( count >= elem.data('max') ) { count = elem.data('max') - 1; } 
				else { count = elem.getReading('WarnCount').val - 1;}
				if(elem.data('swiperstyle') == 'no'){
					for (var i = 0; i <= count; i++) {
						if (typeof elem.getReading('WarnUWZLevel_Color').val != "undefined") { 
							var colortranslation;
							colortranslation = colormap[elem.getReading('WarnUWZLevel_Color').val];
							while (typeof mapped != "undefined" && !mapped.match(/^:/)) { colortranslation = colormap[mapped];}
							mytext += "<div class=\"hbox\" style=\"display:inline-block;margin:2px 8px;border-radius:4px;color:"+elem.data('fontcolor')+";background-color:"+colortranslation +";\">"; }
						else if (typeof elem.getReading('Warn_'+i+'_uwzLevel').val != "undefined"){ 
							var colortranslation;
							colortranslation = colormap[elem.getReading('Warn_'+i+'_uwzLevel').val];
							while (typeof mapped != "undefined" && !mapped.match(/^:/)) { colortranslation = colormap[mapped];}				
							mytext += "<div class=\"hbox cell\" style=\"display:inline-block;margin:4px;border-radius:4px;color:"+elem.data('fontcolor')+";background-color:"+colortranslation +";\">"; }
						else { mytext += "<div class=\"hbox\">"; }
										
						elem.data('detail').forEach(function(spalte) {
							if (spalte == 'IconURL'){ mytext += "<div class=\"\" style=\"margin:4px 10px;\"><img src=\"" + elem.getReading('Warn_'+i+'_'+spalte).val + "\" width=\""+elem.data('imgsize')+"\" height=\""+elem.data('imgsize')+"\ class=\"centered\"></div>"; }
							if (spalte == 'ShortText'){ mytext += "<div class=\"left-align " + elem.data('shttxtstyle') + "\" style=\"margin:4px 10px;\"\">" + elem.getReading('Warn_'+i+'_'+spalte).val ;}
							if (spalte == 'LongText'){ mytext += "<div class=\"left-align " + elem.data('lngtxtstyle') + "\" style=\"margin:4px 10px;\"\">" + elem.getReading('Warn_'+i+'_'+spalte).val;}
							if (spalte == 'WarnTime'){ mytext += elem.data('textdivider') + "Gültig vom " + elem.getReading('Warn_'+i+'_Start_Date').val + " " + elem.getReading('Warn_'+i+'_Start_Time').val + " Uhr bis "+ elem.getReading('Warn_'+i+'_End_Date').val + " " + elem.getReading('Warn_'+i+'_End_Time').val + " Uhr.";}				
						});
						mytext += "</div></div></div>";
					}
				}
				else if(elem.data('swiperstyle') == 'yes'){
					mytext += "<div class=\"swiper-container\">";
						mytext += "<div class=\"swiper-wrapper\">";
						for (var i = 0; i <= count; i++) {
							mytext += "<div class=\"swiper-slide\" data-hash=\""+elem.data('hashtxt')+""+i+"\">";
							if (typeof elem.getReading('WarnUWZLevel_Color').val != "undefined") { 
								var colortranslation;
								colortranslation = colormap[elem.getReading('WarnUWZLevel_Color').val];
								while (typeof mapped != "undefined" && !mapped.match(/^:/)) { colortranslation = colormap[mapped];}
								mytext += "<div class=\"hbox\" style=\"display:inline-block;margin:2px 8px;border-radius:4px;color:"+elem.data('fontcolor')+";background-color:"+colortranslation +";\">"; }
							else if (typeof elem.getReading('Warn_'+i+'_uwzLevel').val != "undefined"){ 
								var colortranslation;
								colortranslation = colormap[elem.getReading('Warn_'+i+'_uwzLevel').val];
								while (typeof mapped != "undefined" && !mapped.match(/^:/)) { colortranslation = colormap[mapped];}				
								mytext += "<div class=\"hbox cell\" style=\"display:inline-block;border-radius:4px;color:"+elem.data('fontcolor')+";background-color:"+colortranslation +";\">"; }
							else { mytext += "<div class=\"hbox\">"; }
											
							elem.data('detail').forEach(function(spalte) {
								if (spalte == 'IconURL'){ mytext += "<div class=\"\" style=\"margin:4px 10px;\"><img src=\"" + elem.getReading('Warn_'+i+'_'+spalte).val + "\" width=\""+elem.data('imgsize')+"\" height=\""+elem.data('imgsize')+"\ class=\"centered\"></div>"; }
								if (spalte == 'ShortText'){ mytext += "<div class=\"left-align " + elem.data('shttxtstyle') + "\" style=\"margin:4px 10px;\"\">" + elem.getReading('Warn_'+i+'_'+spalte).val ;}
								if (spalte == 'LongText'){ mytext += "<div class=\"left-align " + elem.data('lngtxtstyle') + "\" style=\"margin:4px 10px;\"\">" + elem.getReading('Warn_'+i+'_'+spalte).val;}
								if (spalte == 'WarnTime'){ mytext += elem.data('textdivider') + "G&uuml;ltig vom " + elem.getReading('Warn_'+i+'_Start_Date').val + " " + elem.getReading('Warn_'+i+'_Start_Time').val + " Uhr bis "+ elem.getReading('Warn_'+i+'_End_Date').val + " " + elem.getReading('Warn_'+i+'_End_Time').val + " Uhr.";}				
							});
							mytext += "</div></div>";//close uwz text-div and hbox
							mytext += "</div>";//close swiper-slide
						}				
						mytext += "</div>";//close swiper-wrapper
						mytext += "<div class=\"swiper-pagination\" style=\"position:static\"></div>";
					mytext += "</div>";
					
					mytext += "<script>\
						var "+elem.data('swipername')+" = new Swiper('.swiper-container', {\
							pagination: '.swiper-pagination',\
							spaceBetween: 30,\
							autoplay: 2500,\
							autoplayDisableOnInteraction: false,\
							hashnav: true,\
							hashnavWatchState: true\
						});\
						</script>";

				}
			}
			else { mytext += "<div class=\"cell top-space\">Aktuell keine Warnmeldungen.</div>"; }		
			elem.html(mytext);
		});
		
	};
    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'uwz',
        init: init,
        update: update,
    });	
	return me;
};
//
//WarnUWZLevel_Color
//Warn_0_AltitudeMax
//Warn_0_AltitudeMin
//Warn_0_Creation
//Warn_0_End
//Warn_0_EventID
//Warn_0_Hail
//Warn_0_IconURL
//Warn_0_LongText
//Warn_0_Severity
//Warn_0_ShortText
//Warn_0_Start
//Warn_0_Type
//Warn_0_levelName
//Warn_0_uwzLevel
