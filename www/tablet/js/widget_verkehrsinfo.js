
/* 
Version 0.4

Ein Widget fÃ¼r Modul Verkehrsmeldungen 

Paul79 23.12.2016

paul79@gmx.de

----------------------------------------------------------------------------
HTML
 fÃ¼r maximale Attribute:
 
 <div data-type="verkehrsinfo"  data-device="name in FHEM" data-max="5"  data-color-msg="#CEBCB7" data-color-head="#FD6F3F" data-shadow="true" data-shadow-head="true" data-icon="2" ></div>
				
 fÃ¼r minimale Attribute:
 
  <div data-type="verkehrsinfo"  data-device="name in FHEM" ></div>

ATTRIBUTE:
~~~~~~~~~~
    Attribute (Pflicht):
    ---------------
    data-type="verkehrsinfo" : Widget-Typ
    data-device : FHEM Device Name

	
    Attribute (Optional):
    -----------------
    data-count: maximale Anzahl der EintrÃ¤ge (Default '5').
 	data-icon: '1' Icon links, 'No' kein icon , '2' 2 Icons links und rechts (Default '2')
	date-shadow: 'true' Schatten unter Icons (Default 'true')
	date-shadow-head: 'true' Schatten unter Headtext (Default 'false')	
	data-color-head: Farbe Headtext (Default '#FFE066')
	data-color-mag: Farbe Headtext (Default '#FFFFFF')
*/

"use strict";
var Modul_verkehrsinfo = function () {
	
    function init () {
        var me = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]',this.area);
        this.elements.each(function(index) {
			var elem = $(this);
			var device = $(this).data('device');			
			elem.initData('max', 5);
			elem.data('count', 'count');
			elem.initData('icon', 2);
			elem.initData('get', 'STATE');
			elem.initData('shadow', true)
			elem.initData('shadow-head', false);
			elem.initData('color-head', '#FFE066');
			elem.initData('color-msg', '#FFFFFF');
			me.addReading(elem,'count');
			console.log("device: " + device + " icon: " + $(this).data('icon') + " max a: " + $(this).data('max') + " count: " + $(this).initData('count'));	
		});
	};


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

		
	function update(dev,par) {
		var deviceElements;
		var me = this;
		var text = "";
			console.log('wait... ' + new Date);
			sleep(1000);
			console.log('ok... ' + new Date);

		 
        if (dev == '*') {
            deviceElements = me.elements;
        } else {
            deviceElements = me.elements.filter('div[data-device="' + dev + '"]');
        }


		var count = "";
		var max = "";
		var shadow = "";
		var shadowinfo = "";
		var shadowhead = "";				
		
        deviceElements.each(function (index) {
			var elem = $(this);
			elem.data('count', 'count');
			var count = elem.getReading('count').val;
			var max = elem.data('max');
			var icon = elem.data('icon');
			var color_head = elem.data('color-head');
			var color_msg = elem.data('color-msg');
			
			if (elem.data('shadow') == true)         { var shadow = 'box-shadow:0 5px 10px rgba(0,0,0,0.5),inset 0 5px 5px rgba(255,255,255,0.2),inset 0 -9px 10px rgba(0,0,0,0.4);width:45px;-moz-transform: translate(-1px, -5px);-o-transform: translate(-1px, -5px);-ms-transform: translate(-1px, -5px);transform: translate(-1px, -5px);' } else { var shadow = 'width:50px;'};
			if (elem.data('shadow') == true)     { var shadowinfo = 'box-shadow:0 5px 10px rgba(0,0,0,0.5),inset 0 5px 5px rgba(255,255,255,0.2),inset 0 -9px 10px rgba(0,0,0,0.4);width:90px;-moz-transform: translate(-1px, -5px);-o-transform: translate(0px, 0px);-ms-transform: translate(0px, 0px);transform: translate(0px, 0px);' } else { var shadowinfo = 'width:90px;'};
			if (elem.data('shadow') == true)     { var shadowleer = 'box-shadow:0 5px 10px rgba(0,0,0,0.5),inset 0 5px 5px rgba(255,255,255,0.2),inset 0 -9px 10px rgba(0,0,0,0.4);min-width:150px;-moz-transform: translate(-1px, -5px);-o-transform: translate(0px, 0px);-ms-transform: translate(0px, 0px);transform: translate(0px, 0px);' } else { var shadowinfo = 'min-width:150px;'};
			//		if (elem.data('shadow-head') == true) { var shadowhead = 'box-shadow:0 5px 10px rgba(0,0,0,0.5),inset 0 5px 5px rgba(255,255,255,0.2),inset 0 -5px 10px rgba(0,0,0,0.4);min-width:150px;-moz-transform: translate(-1px, -5px);-o-transform: translate(-1px, -5px);-ms-transform: translate(-1px, -5px);transform: translate(-1px, -5px);' } else { var shadowhead = 'min-width:150px;'};
			if (elem.data('shadow-head') == true) { var shadowhead = 'text-shadow: 2px 0px 2px rgba(0,0,0,0.6), 0px 2px 2px rgba(255,255,255,0.4);min-width:150px;-moz-transform: translate(-1px, -5px);-o-transform: translate(-1px, -5px);-ms-transform: translate(-1px, -5px);transform: translate(-1px, -5px);' } else { var shadowhead = 'min-width:150px;'};
						
				if (count >= 1) {
					if (count > max) {
						count = max;

						}

					for (var i = 1; i <= count - 0; i++) {
						elem.data('head', 'e_'+i+'_head');
						elem.data('msg', 'e_'+i+'_msg');
						elem.data('road', 'e_'+i+'_road');
						
						if (typeof elem.getReading('head').val !== "undefined") {

						console.log("road: " + elem.getReading('road').val + " head: " + elem.getReading('head').val + " i = e_: " + i + " data-icon=" + icon);	
							
							text += "<div class=\" \">";
							if (icon == '2')
							{
								if  (elem.getReading('road').val.substring(0, 1) == 'A')
								{	
									text += "<table border=\"0px\" style=\"width:100%\"><tr><th align=\"center\" width=\"15%\"><div class=\"cell\" style=\"" + shadow + "height:18px;padding:0;border-radius:4px;background-color: rgba(0,0,0,0.1);background:#004284;color:#FFFFFF;text-align:center;font-size:14px;margin:0 0 5px 0;border:1px solid #ccc;line-height:18px;\">" + elem.getReading('road').val + "</div></th>";
									text += "<th><div class=\"cell\" style=\"" + shadowhead + "display:inline-block;padding:4px;font-weight:bold;color:" + color_head + ";border-radius:4px;\">" + elem.getReading('head').val + "</div></th>";
									text += "<th align=\"center\" width=\"15%\"><div class=\"cell\" style=\"" + shadow + "height:18px;padding:0;border-radius:4px;background-color: rgba(0,0,0,0.1);background:#004284;color:#FFFFFF;text-align:center;font-size:14px;margin:0 0 5px 0;border:1px solid #ccc;line-height:18px;\">" + elem.getReading('road').val + "</div></th>";	
									text += "</tr><tr><td colspan=\"3\"><div class=\"cell top-narrow-10\" style=\"color:" + color_msg + ";\">" + elem.getReading('msg').val + "</div></td></tr></table>";
									text += "</div>";	
									
								} else if  (elem.getReading('road').val.substring(0, 1) == 'B') 
								{
									text += "<table border=\"0px\" style=\"width:100%\"><tr><th align=\"center\" width=\"15%\"><div class=\"cell\" style=\"" + shadow + "height:18px;padding:0;border-radius:4px;background-color: rgba(0,0,0,0.1);background:#FFFF00;color:#000000;text-align:center;font-size:14px;margin:0 0 5px 0;border:1px solid #ccc;border-color:#000000;line-height:18px;\">" + elem.getReading('road').val + "</div></th>";
									text += "<th><div class=\"cell\" style=\"" + shadowhead + "display:inline-block;padding:4px;font-weight:bold;color:" + color_head + ";border-radius:4px;\">" + elem.getReading('head').val + "</div></th>";
									text += "<th align=\"center\" width=\"15%\"><div class=\"cell\" style=\"" + shadow + "height:18px;padding:0;border-radius:4px;background-color: rgba(0,0,0,0.1);background:#FFFF00;color:#000000;text-align:center;font-size:14px;margin:0 0 5px 0;border:1px solid #ccc;border-color:#000000;line-height:18px;\">" + elem.getReading('road').val + "</div></th>";	
									text += "</tr><tr><td colspan=\"3\"><div class=\"cell top-narrow-10\" style=\"color:" + color_msg + ";\">" + elem.getReading('msg').val + "</div></td></tr></table>";
									text += "</div>";	
									
								} else if  (elem.getReading('road').val.substring(0, 1) == 'L' || elem.getReading('road').val.substring(0, 1) == 'S') 
								{
									text += "<table border=\"0px\" style=\"width:100%\"><tr><th align=\"center\" width=\"15%\"><div class=\"cell\" style=\"" + shadow + "height:18px;padding:0;border-radius:4px;background-color: rgba(0,0,0,0.1);background:#FFFFFF;color:#000000;text-align:center;font-size:14px;margin:0 0 5px 0;border:1px solid #ccc;border-color:#000000;line-height:18px;\">" + elem.getReading('road').val + "</div></th>";
									text += "<th><div class=\"cell\" style=\"" + shadowhead + "display:inline-block;padding:4px;font-weight:bold;color:" + color_head + ";border-radius:4px;\">" + elem.getReading('head').val + "</div></th>";
									text += "<th align=\"center\" width=\"15%\"><div class=\"cell\" style=\"" + shadow + "height:18px;padding:0;border-radius:4px;background-color: rgba(0,0,0,0.1);background:#FFFFFF;color:#000000;text-align:center;font-size:14px;margin:0 0 5px 0;border:1px solid #ccc;border-color:#000000;line-height:18px;\">" + elem.getReading('road').val + "</div></th>";	
									text += "</tr><tr><td colspan=\"3\"><div class=\"cell top-narrow-10\" style=\"color:" + color_msg + ";\">" + elem.getReading('msg').val + "</div></td></tr></table>";
									text += "</div>";	
									
								} else  if(elem.getReading('head').val == 'Information') 
								{						
									text += "<table border=\"0px\" style=\"width:100%\"><tr><th align=\"center\" width=\"15%\"><div class=\"cell\" style=\"" + shadowinfo + "display:inline-block;height:18px;padding:0;border-radius:4px;background-color: rgba(0,0,0,0.1);background:#0099cc;color:#FFFFFF;text-align:center;font-size:14px;margin:0 0 5px 0;border:1px solid #ccc;border-color:#FFFFFF;line-height:18px;\">" + elem.getReading('head').val + "</div></th>";
									text += "</tr><tr><td><div class=\"cell \" style=\"color:" + color_msg + ";\">" + elem.getReading('msg').val + "</div></td></tr>";
									text += "</div>";
								} else   
								{						
									text += "<table border=\"0px\" style=\"width:100%\"><th><div class=\"cell\" style=\"min-width:150px;display:inline-block;padding:4px;font-weight:bold;color:" + color_head + ";border-radius:4px;\">" + elem.getReading('head').val + "</div></th>";
									text += "</tr><tr><td><div class=\"cell top-narrow\" style=\"color:" + color_msg + ";\">" + elem.getReading('msg').val + "</div></td></tr></table>";
									text += "</div>";
								} 
								}
							}
							if  (icon == '1')
							{
								if  (elem.getReading('road').val.substring(0, 1) == 'A')
								{
									text += "<table border=\"0px\" style=\"width:100%\"><tr><th rowspan=\"2\" align=\"center\" width=\"10%\"><div class=\"cell\" style=\"" + shadow + "height:18px;padding:0;border-radius:4px;background-color: rgba(0,0,0,0.1);background:#004284;color:#FFFFFF;text-align:center;font-size:14px;float:left;margin:0 0 5px 0;border:1px solid #ccc;line-height:18px;\">" + elem.getReading('road').val + "</div></th>";
									text += "<th><div class=\"cell\" style=\"" + shadowhead + "display:inline-block;padding:4px;font-weight:bold;color:" + color_head + ";border-radius:4px;\">" + elem.getReading('head').val + "</div></th>";
									text += "</tr><tr><td><div class=\"cell top-narrow\" style=\"color:" + color_msg + ";\">" + elem.getReading('msg').val + "</div></td></tr></table>";
									text += "</div>";							

								} else if  (elem.getReading('road').val.substring(0, 1) == 'B')  
								{
									text += "<table border=\"0px\" style=\"width:100%\"><tr><th rowspan=\"2\" align=\"center\" width=\"10%\"><div class=\"cell\" style=\"" + shadow + "height:18px;padding:0;border-radius:4px;background-color: rgba(0,0,0,0.1);background:#FFFF00;color:#000000;text-align:center;font-size:14px;float:left;margin:0 0 5px 0;border:1px solid #ccc;border-color:#000000;line-height:18px;\">" + elem.getReading('road').val + "</div></th>";
									text += "<th><div class=\"cell\" style=\"" + shadowhead + "display:inline-block;padding:4px;font-weight:bold;color:" + color_head + ";border-radius:4px;\">" + elem.getReading('head').val + "</div></th>";
									text += "</tr><tr><td><div class=\"cell top-narrow\" style=\"color:" + color_msg + ";\">" + elem.getReading('msg').val + "</div></td></tr></table>";
									text += "</div>";
									
								} else if  (elem.getReading('road').val.substring(0, 1) == 'L' || elem.getReading('road').val.substring(0, 1) == 'S')  
								{
									text += "<table border=\"0px\" style=\"width:100%\"><tr><th rowspan=\"2\" align=\"center\" width=\"10%\"><div class=\"cell\" style=\"" + shadow + "height:18px;padding:0;border-radius:4px;background-color: rgba(0,0,0,0.1);background:#FFFFFF;color:#000000;text-align:center;font-size:14px;float:left;margin:0 0 5px 0;border:1px solid #ccc;border-color:#000000;line-height:18px;\">" + elem.getReading('road').val + "</div></th>";
									text += "<th><div class=\"cell\" style=\"" + shadowhead + "display:inline-block;padding:4px;font-weight:bold;color:" + color_head + ";border-radius:4px;\">" + elem.getReading('head').val + "</div></th>";
									text += "</tr><tr><td><div class=\"cell top-narrow\" style=\"color:" + color_msg + ";\">" + elem.getReading('msg').val + "</div></td></tr></table>";
									text += "</div>";
									
								} else  if(elem.getReading('head').val == 'Information') 
								{						
									text += "<table border=\"0px\" style=\"width:100%\"><tr><th align=\"center\" width=\"15%\"><div class=\"cell\" style=\"" + shadowinfo + "display:inline-block;height:18px;padding:0;border-radius:4px;background-color: rgba(0,0,0,0.1);background:#0099cc;color:#FFFFFF;text-align:center;font-size:14px;margin:0 0 5px 0;border:1px solid #ccc;border-color:#FFFFFF;line-height:18px;\">" + elem.getReading('head').val + "</div></th>";
									text += "</tr><tr><td><div class=\"cell\" style=\"color:" + color_msg + ";\">" + elem.getReading('msg').val + "</div></td></tr></table>";
									text += "</div>";
								} else 
								{						
									text += "<table border=\"0px\" style=\"width:100%\"><th><div class=\"cell\" style=\"min-width:150px;display:inline-block;padding:4px;font-weight:bold;color:" + color_head + ";border-radius:4px;\">" + elem.getReading('head').val + "</div></th>";
									text += "</tr><tr><td><div class=\"cell top-narrow-10\" style=\"color:" + color_msg + ";\">" + elem.getReading('msg').val + "</div></td></tr></table>";
									text += "</div>";
								}						
							}
							
							if (elem.data('icon') == "no") 
							{
								if  (elem.getReading('road').val.substring(0, 1) == '-')
								{
									text += "<table border=\"0px\" style=\"width:100%\"><tr><th rowspan=\"2\" align=\"center\" width=\"1%\"></th>";
									text += "<th><div class=\"cell\" style=\"" + shadowhead + "display:inline-block;padding:4px;font-weight:bold;color:" + color_head + ";border-radius:4px;\">" + elem.getReading('head').val + "</div></th>";
									text += "</tr><tr><td><div class=\"cell top-narrow-10\" style=\"color:" + color_msg + ";\">" + elem.getReading('msg').val + "</div></td></tr></table>";
									text += "</div>";								

								}  else 
								{						
									text += "<table border=\"0px\" style=\"width:100%\"><tr><th rowspan=\"2\" align=\"center\" width=\"1%\"></th>";
									text += "<th><div class=\"cell\" style=\"" + shadowhead + "display:inline-block;padding:4px;font-weight:bold;color:" + color_head + ";border-radius:4px;\">" + elem.getReading('road').val + " - " + elem.getReading('head').val + "</div></th>";
									text += "</tr><tr><td><div class=\"cell top-narrow-10\" style=\"color:" + color_msg + ";\">" + elem.getReading('msg').val + "</div></td></tr></table>";
									text += "</div>";	
								}						
							}
						}
					}


				else {
					text += "<div class=\"cell\">";
					text += "<div class=\"cell top-space\" style=\"" + shadowleer + "display:inline-block;padding:3px;color:#DDDDDD;border-radius:4px;background-color:#32A054;\">Aktuell keine Verkehrsmeldungen vorhanden.</div>";
					text += "</div>";
					}

			elem.html(text);
		});
		
	};

    // public
    // inherit all public members from base class
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'verkehrsinfo',
        init: init,
        update: update,
    });
    return me;	

};
1;
