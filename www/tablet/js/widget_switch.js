if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_switch = $.extend({}, widget_famultibutton, {
    widgetname : 'switch',
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            $(this).data('off-color',               $(this).data('off-color')           || getStyle('.switch.off','color')              || '#2A2A2A');
            $(this).data('off-background-color',    $(this).data('off-background-color')|| getStyle('.switch.off','background-color')   || '#505050');
            $(this).data('on-color',                $(this).data('on-color')            || getStyle('.switch.on','color')               || '#2A2A2A');
            $(this).data('on-background-color',     $(this).data('on-background-color') || getStyle('.switch.on','background-color')    || '#aa6900');
            $(this).data('background-icon',         $(this).data('background-icon')     || 'fa-circle');
            $(this).data('icon',                    $(this).data('icon')                || 'fa-lightbulb-o');
            $(this).data('mode', ($(this).hasClass('readonly')?'signal':'toggle'));
            base.init_attr($(this));
            base.init_ui($(this));
        });
    },
});
