if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_push = $.extend({}, widget_famultibutton, {
   widgetname : 'push',
   startTimer: function ($elem,secondes){
        var count = secondes;
        var $elm = $elem.data('famultibutton');
        if ($elm){
          $elm.setProgressValue(1);
          $elm.data('countdown',setInterval(function(){
            if (count-- <= 0) {
              clearInterval($elm.data('countdown'));
            }
            $elm.setProgressValue(count/secondes);
          }, 1000));
        }
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            $(this).data('device',          $(this).data('device')          || ' ');
            $(this).data('off-color',               $(this).data('off-color')                                     || getStyle('.push.off','color')              || '#505050');
            $(this).data('off-background-color',    $(this).data('off-background-color')                          || getStyle('.push.off','background-color')   || '#505050');
            $(this).data('on-color',                $(this).data('on-color')            || getClassColor($(this)) || getStyle('.push.on','color')               || '#aa6900');
            $(this).data('on-background-color',     $(this).data('on-background-color') || getClassColor($(this)) || getStyle('.push.on','background-color')    || '#aa6900');
            $(this).data('background-icon', $(this).data('background-icon') || 'fa-circle-thin');
            $(this).data('set-on',          $(this).data('set-on')          || '');
            $(this).data('set-off',         $(this).data('set-off')         || '');
            $(this).data('mode', 'push');
            base.init_attr($(this));
            base.init_ui($(this));
            var elem = $(this); var secondes;
            $(this).bind("toggleOn", function( event ){
                var seton=elem.data("set-on");
                if (seton && !$.isNumeric(seton) &&!$.isArray(seton)
                        && getPart(seton,1)=="on-for-timer")
                    secondes = getPart(elem.data("set-on"),2);
                if (elem.data("countdown"))
                    secondes = elem.data("countdown");
                if (secondes && $.isNumeric(secondes)){
                     widget_push.startTimer(elem,parseInt(secondes));
                }
            });
        });
    },
    update: function (dev,par) {},
});
