// load widget base functions
if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}
	
// widget implementation starts here
// change 'widget_example' to 'widget_mywidgetname'
// and 'widgetname:"example",' to 'widgetname:"mywidgetname",'
var widget_screensaver = $.extend({}, widget_widget, {
    widgetname:"screensaver",
    // privat sub function
    init_attr: function(elem) {
        elem.initData('timeout', '60');
    },
    // mandatory function, get called on start up
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
			var elem = $(this);
						
			elem.attr('id', 'screensaver');
			
			if ($('#screensaver')) {
				$('#screensaver').hide();
				var mousetimeout;
				var screensaver_active = false;
				var idletime = elem.data('timeout');

				mousetimeout = setTimeout(function(){
					show_screensaver();
				}, 1000 * idletime);

				function show_screensaver(){
					$('#screensaver').fadeIn();
					screensaver_active = true;
				}
					function stop_screensaver(){
					$('#screensaver').fadeOut();
					screensaver_active = false;
				}
			
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
    },
    // mandatory function, get called after start up once and on every FHEM poll
    update: function (dev,par) {
    }
});
