if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_pagebutton = $.extend({}, widget_famultibutton, {
    widgetname : 'pagebutton',
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));

            $(this).data('off-color',            $(this).data('off-color')           || getStyle('.button.off','color')              || '#2A2A2A');
            $(this).data('off-background-color', $(this).data('off-background-color')|| getStyle('.button.off','background-color')   || '#505050');
            $(this).data('on-color',             $(this).data('on-color')            || getStyle('.button.on','color')               || '#2A2A2A');
            $(this).data('on-background-color',  $(this).data('on-background-color') || getClassColor($(this)) || getStyle('.button.on','background-color')    || '#aa6900');
            $(this).data('background-icon',      $(this).data('background-icon')     || 'fa-circle');

            var elem = base.init_ui($(this));
            var elem_url=$(this).data('url');

            elem.bind("toggleOn", function( event ){
               base.elements.each(function(index) {
                       $(this).data('famultibutton').setOff();
                });
                elem.data('famultibutton').setOn();
            });
            console.log( filename, elem_url);
            if ( filename && elem_url && elem_url.indexOf(filename)>-1
                    ||  filename==='' && elem_url==='index.html') {
               elem.setOn();
            }

            $(this).attr('title',$(this).data('url'));
        });
    },
    update_cb : function(elem,state) {
        if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
            this.showOverlay(elem,state);
        else
            this.showOverlay(elem,"");
    },
});
