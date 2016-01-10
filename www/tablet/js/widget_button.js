if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_button = $.extend({}, widget_famultibutton, {
   widgetname : 'button',
    init: function () {
     var base = this;
     this.elements = $('div[data-type="'+this.widgetname+'"]');
     this.elements.each(function(index) {
         var elem = $(this);
         elem.initData('off-color'               ,getStyle('.button.off','color') || '#2A2A2A');
         elem.initData('off-background-color'    ,getStyle('.button.off','background-color')   || '#505050');
         elem.initData('on-color'                ,getClassColor($(this)) || getStyle('.button.on','color')               || '#2A2A2A');
         elem.initData('on-background-color'     ,getStyle('.button.on','background-color')    || '#aa6900');
         elem.initData('get-warn'                ,-1);

         base.init_attr(elem);
         elem = base.init_ui($(this));

         if(! elem.data('device')) {
             elem.setOn();
         }
     });
     },
    update_cb : function(elem,state) {
     if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
         this.showOverlay(elem,getPart(state,elem.data('get-warn')));
     else
         this.showOverlay(elem,"");
    },
});
