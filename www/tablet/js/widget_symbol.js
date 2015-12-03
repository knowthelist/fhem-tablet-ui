if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_symbol = $.extend({}, widget_famultibutton, {
    widgetname : 'symbol',
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            var elem = $(this);
            elem.initData('off-color'               ,getStyle('.symbol.off','color') || '#505050');
            elem.initData('off-background-color'    ,getStyle('.symbol.off','background-color')   || '#505050');
            elem.initData('on-color'                ,getClassColor(elem) || getStyle('.symbol.on','color')               || '#aa6900');
            elem.initData('on-background-color'     ,getStyle('.symbol.on','background-color')    || '#aa6900');
            elem.initData('background-icon'         ,null);
            elem.initData('icon'                    ,(( $.isArray($(this).data('icons')) )?$(this).data('icons')[0]:'ftui-window'));
            elem.initData('get-on'                  ,'open');
            elem.initData('get-off'                 ,'closed');
            elem.initData('get-warn'                ,-1);
            elem.data('mode', 'signal');
            base.init_attr(elem);
            base.init_ui(elem);
        });
    },
    update_cb : function(elem,state) {
        $('.fa-stack:has(.zero)').removeClass('fa-stack');
        if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
            this.showOverlay(elem,getPart(state,elem.data('get-warn')));
        else
            this.showOverlay(elem,"");
    },
});
