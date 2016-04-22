var Modul_screensaver = function () {

	$('head').append('<link rel="stylesheet" href="lib/screensaver.css" type="text/css" />');
	
    function init_attr (elem) {
        elem.initData('timeout', '60');
    };
	
    function init () {
        var me = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]',this.area);
        this.elements.each(function(index) {
            me.init_attr($(this));
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
    };

    // public
    // inherit all public members from base class
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'screensaver',
		init_attr: init_attr,
        init: init,
    });
};
