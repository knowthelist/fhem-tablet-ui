
var Modul_push = function () {

    if(typeof Module_famultibutton == 'undefined')
        ftui.loadplugin('widget_famultibutton');

    function startTimer (elem){
        var id = elem.data('device')+"_"+elem.data('get');
        var now = new Date();
        var til = new Date(localStorage.getItem("ftui_timer_til_" + id));
        var secondes = localStorage.getItem("ftui_timer_sec_" + id );
        var count = (til-now) / 1000;
        var faelem = elem.data('famultibutton');
        if (faelem){
          faelem.setProgressValue(1);
          elem.data('timer',setInterval(function(){
            if (count-- <= 0) {
              clearInterval(elem.data('timer'));
              localStorage.removeItem("ftui_timer_sec_" + id );
              localStorage.removeItem("ftui_timer_til_" + id );
            }
            faelem.setProgressValue(count/secondes);
          }, 1000));
        }
    };

    function init () {
        var me = this;
        me.elements = $('div[data-type="'+me.widgetname+'"]',me.area);
        me.elements.each(function(index) {
            var elem = $(this);
            elem.initData('device'              , ' ');
            elem.initData('off-color'           , getStyle('.'+me.widgetname+'.off','color')              || '#505050');
            elem.initData('off-background-color', getStyle('.'+me.widgetname+'.off','background-color')   || '#505050');
            elem.initData('on-color'            , getClassColor(elem) || getStyle('.'+me.widgetname+'.on','color')               || '#aa6900');
            elem.initData('on-background-color' , getClassColor(elem) || getStyle('.'+me.widgetname+'.on','background-color')    || '#aa6900');
            elem.initData('background-icon'     , 'fa-circle-thin');
            elem.initData('set-on'              , '');
            elem.initData('set-off'             , '');

            elem.data('mode', 'push');
            me.init_attr(elem);
            me.init_ui(elem);

            var id = elem.data("device")+"_"+elem.data('get');

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
                    localStorage.setItem("ftui_timer_sec_" + id, secondes);
                    localStorage.setItem("ftui_timer_til_" + id, til);
                    startTimer(elem,id);
                }
            });

            // any old on-for-timer still active ?
            if ( localStorage.getItem("ftui_timer_til_" + id) )
                startTimer(elem,id);
        });
    };

    function update (dev,par) {};

    // public
    // inherit members from base class
    return $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'push',
        init:init,
        update:update,
    });
};
