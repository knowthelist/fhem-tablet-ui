
function depends_switch (){
    if(typeof Module_famultibutton == 'undefined' || !$.fn.famultibutton) {
        return ["famultibutton"];
    }
};

var Modul_switch = function () {

    function init() {
        var me = this;
        me.elements = $('div[data-type="'+me.widgetname+'"]',me.area);
        me.elements.each(function(index) {
            var elem = $(this);
            elem.initData('off-color'           , getStyle('.switch.off','color') || '#2A2A2A');
            elem.initData('off-background-color', getStyle('.switch.off','background-color')   || '#505050');
            elem.initData('on-color'            , getStyle('.switch.on','color')               || '#2A2A2A');
            elem.initData('on-background-color' , getClassColor(elem) || getStyle('.switch.on','background-color')    || '#aa6900');
            elem.initData('background-icon'     , 'fa-circle');
            elem.initData('icon'                , 'fa-lightbulb-o');

            elem.data('mode', (elem.hasClass('readonly')?'signal':'toggle'));
            me.init_attr(elem);
            me.init_ui(elem);

        });
    };

    // public
    // inherit members from base class
    return $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'switch',
        init:init,
    });
};
