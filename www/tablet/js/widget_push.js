if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_push = $.extend({}, widget_famultibutton, {
   widgetname : 'push',
   startTimer: function (elem,timerid){
        var now = new Date();
        var til = new Date(localStorage.getItem("ftui_timer_til_" + timerid));
        var secondes = localStorage.getItem("ftui_timer_sec_" + timerid );
        var count = (til-now) / 1000;
        var faelem = elem.data('famultibutton');
        if (faelem){
          faelem.setProgressValue(1);
          elem.data('countdown',setInterval(function(){
            if (count-- <= 0) {
              clearInterval(elem.data('countdown'));
              localStorage.removeItem("ftui_timer_sec_" + timerid );
              localStorage.removeItem("ftui_timer_til_" + timerid );
            }
            faelem.setProgressValue(count/secondes);
          }, 1000));
        }
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            var elem = $(this);
            elem.initData('device'              , ' ');
            elem.initData('off-color'           , getStyle('.'+this.widgetname+'.off','color')              || '#505050');
            elem.initData('off-background-color', getStyle('.'+this.widgetname+'.off','background-color')   || '#505050');
            elem.initData('on-color'            , getClassColor(elem) || getStyle('.'+this.widgetname+'.on','color')               || '#aa6900');
            elem.initData('on-background-color' , getClassColor(elem) || getStyle('.'+this.widgetname+'.on','background-color')    || '#aa6900');
            elem.initData('background-icon'     , 'fa-circle-thin');
            elem.initData('set-on'              , '');
            elem.initData('set-off'             , '');

            elem.data('mode', 'push');
            base.init_attr(elem);
            base.init_ui(elem);

            var id = elem.data("device")+"_"+$(this).data('get');

            // check for on-for-timer
            elem.bind("toggleOn", function( event ){
                var seton=elem.data("set-on");
                var secondes;
                if (seton && !$.isNumeric(seton) &&!$.isArray(seton)
                        && getPart(seton,1)=="on-for-timer")
                    secondes = getPart(elem.data("set-on"),2);
                if (elem.data("countdown"))
                    secondes = elem.data("countdown");
                if (secondes && $.isNumeric(secondes)){
                    var now = new Date();
                    var til = new Date();
                    til.setTime(now.getTime() + (parseInt(secondes)*1000));
                    console.log(secondes,til);
                    localStorage.setItem("ftui_timer_sec_" + id, secondes);
                    localStorage.setItem("ftui_timer_til_" + id, til);
                    widget_push.startTimer(elem,id);
                }
            });

            // any old on-for-timer still active ?
            if ( localStorage.getItem("ftui_timer_til_" + id) )
                widget_push.startTimer(elem,id);
        });
    },
    update: function (dev,par) {},
});
