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
            $(this).data('off-color',       $(this).data('off-color')       || '#505050');
            $(this).data('on-color',        $(this).data('on-color')        || '#aa6900');
            $(this).data('background-icon', $(this).data('background-icon') || 'fa-circle-thin');
            $(this).data('set-on',          $(this).data('set-on')          || $(this).data('set') || ' '); 
            $(this).data('set-off',         $(this).data('set-off')         || $(this).data('set') || ' ');
            $(this).data('mode', 'push');
            base.init_attr($(this));
            base.init_ui($(this));
            var elem = $(this);

            $(this).bind("toggleOn", function( event ){
                if (getPart(elem.data("set"),1)=="on-for-timer"){
                    var secondes = getPart(elem.data("set"),2);
                    if (secondes && $.isNumeric(secondes)){
                         base.startTimer(elem,parseInt(secondes));
                    }
                }
            });
        });
    },
    update: function (dev,par) {},
});
