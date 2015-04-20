if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_symbol = $.extend({}, widget_famultibutton, {
    widgetname : 'symbol',
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            $(this).data('off-color', $(this).data('off-color') || '#505050');
            $(this).data('off-background-color', $(this).data('off-background-color') || '#505050');
            $(this).data('on-color', $(this).data('on-color') || '#aa6900');
            $(this).data('on-background-color', $(this).data('on-background-color') || '#aa6900');
            $(this).data('background-icon', $(this).data('background-icon') || null);
            $(this).data('icon', $(this).data('icon') || (( $.isArray($(this).data('icons')) )?$(this).data('icons')[0]:'fa-windows'));
            $(this).data('mode', 'signal');
            base.init_ui($(this));
        });
    },
});
