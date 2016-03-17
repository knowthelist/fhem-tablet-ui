if(typeof Module_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var Modul_switch = function () {

    function init() {
        var base = this;
        console.log('switchinit',this.area);
        this.elements = $('div[data-type="'+this.widgetname+'"]',this.area);
        this.elements.each(function(index) {
            var elem = $(this);
            elem.initData('off-color'           , getStyle('.switch.off','color') || '#2A2A2A');
            elem.initData('off-background-color', getStyle('.switch.off','background-color')   || '#505050');
            elem.initData('on-color'            , getStyle('.switch.on','color')               || '#2A2A2A');
            elem.initData('on-background-color' , getClassColor(elem) || getStyle('.switch.on','background-color')    || '#aa6900');
            elem.initData('background-icon'     , 'fa-circle');
            elem.initData('icon'                , 'fa-lightbulb-o');
            elem.data('mode', (elem.hasClass('readonly')?'signal':'toggle'));
            base.init_attr.call(base,elem);
            base.init_ui.call(base,elem);
        });
    }

    // public
    // inherit members from base class
    return $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'switch',
        init:init,
    });
};
