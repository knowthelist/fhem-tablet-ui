if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_symbol = $.extend({}, widget_famultibutton, {
    widgetname : 'symbol',
    showOverlay : function(elem, value) {
         elem.children().filter('#warn-back').remove();
         elem.children().filter('#warn').remove();
         if (value && value!=""){
             var val = ($.isNumeric(value)&&value<100)?Number(value).toFixed(0):'!';
             jQuery('<i/>', {
                 id: 'warn-back',
                 class: 'fa fa-stack-1x fa-circle'
             }).appendTo(elem);

            jQuery('<i/>', {
                 id: 'warn',
                 class: 'fa fa-stack-1x '
            }).html(val).appendTo(elem);
         }
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            $(this).data('off-color',               $(this).data('off-color')           || getStyle('.symbol.off','color')              || '#505050');
            $(this).data('off-background-color',    $(this).data('off-background-color')|| getStyle('.symbol.off','background-color')   || '#505050');
            $(this).data('on-color',                $(this).data('on-color')            || getStyle('.symbol.on','color')               || '#aa6900');
            $(this).data('on-background-color',     $(this).data('on-background-color') || getStyle('.symbol.on','background-color')    || '#aa6900');
            $(this).data('background-icon',         $(this).data('background-icon')     || null);
            $(this).data('icon',                    $(this).data('icon')                || (( $.isArray($(this).data('icons')) )?$(this).data('icons')[0]:'ftui-window'));
            $(this).data('get-on',                  $(this).data('get-on')              || 'open');
            $(this).data('get-off',                 $(this).data('get-off')             || 'closed');
            $(this).data('mode', 'signal');
            base.init_attr($(this));
            base.init_ui($(this));
        });
    },
    update_cb : function(elem,state) {
        if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
            this.showOverlay(elem,state);
        else
            this.showOverlay(elem,"");
    },
});
