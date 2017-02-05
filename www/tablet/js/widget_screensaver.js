"use strict";

function depends_screensaver() {
    var deps = [];
	
    $('head').append('<link rel="stylesheet" href="lib/screensaver.css" type="text/css" />');
		
    return deps;
}

var Modul_screensaver = function () {
	
    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {

            var elem = $(this);
			
			elem.initData('timeout', '60');
						
			elem.attr('id', 'screensaver');
							
			function show_screensaver(){
				$('#screensaver').fadeIn();
				screensaver_active = true;
			}
			function stop_screensaver(){
				$('#screensaver').fadeOut();
				screensaver_active = false;
			}
			
			if ($('#screensaver')) {
				$('#screensaver').hide();
				var mousetimeout;
				var screensaver_active = false;
				var idletime = elem.data('timeout');

				mousetimeout = setTimeout(function(){
					show_screensaver();
				}, 1000 * idletime);

				var moveEventType=((document.ontouchmove!==null)?'mousemove':'touchstart');
				$(document).bind(moveEventType, function(e) {
					clearTimeout(mousetimeout);

					if (screensaver_active) {
						stop_screensaver();
					}
						mousetimeout = setTimeout(function(){
						show_screensaver();
					}, 1000 * idletime); // 5 secs			
				});
			}
        });
    }
	
    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'screensaver',
        init: init
    });

    return me;
};
