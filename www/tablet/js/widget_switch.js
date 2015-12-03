if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_switch = $.extend({}, widget_famultibutton, {
    widgetname : 'switch',
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            var elem = $(this);
            elem.initData('off-color'           , getStyle('.switch.off','color') || '#2A2A2A');
            elem.initData('off-background-color', getStyle('.switch.off','background-color')   || '#505050');
            elem.initData('on-color'            , getStyle('.switch.on','color')               || '#2A2A2A');
            elem.initData('on-background-color' , getClassColor(elem) || getStyle('.switch.on','background-color')    || '#aa6900');
            elem.initData('background-icon'     , 'fa-circle');
            elem.initData('icon'                , 'fa-lightbulb-o');
            elem.data('mode', ($(this).hasClass('readonly')?'signal':'toggle'));
            base.init_attr(elem);
            base.init_ui(elem);
        });
    },
});
