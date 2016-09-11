
function depends_push (){
    if(typeof Module_famultibutton == 'undefined' || !$.fn.famultibutton) {
        return ["famultibutton"];
    }
};

var Modul_push = function () {

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
            elem.initData('set-on'              , 'on');
            elem.initData('set-off'             , 'off');

            elem.data('mode', 'push');
            me.init_attr(elem);
            me.init_ui(elem);
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
