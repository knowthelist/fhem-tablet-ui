
function depends_button (){
    if(typeof Module_famultibutton == 'undefined')
        return ["famultibutton"];
};

var Modul_button = function () {

    function init() {
        var me = this;
        me.elements = $('div[data-type="'+me.widgetname+'"]',me.area);
        me.elements.each(function(index) {
            var elem = $(this);
         elem.initData('off-color'               ,getStyle('.button.off','color') || '#2A2A2A');
         elem.initData('off-background-color'    ,getStyle('.button.off','background-color')   || '#505050');
         elem.initData('on-color'                ,getClassColor($(this)) || getStyle('.button.on','color')               || '#2A2A2A');
         elem.initData('on-background-color'     ,getStyle('.button.on','background-color')    || '#aa6900');
         elem.initData('get-warn'                ,-1);

         me.init_attr(elem);
         elem = me.init_ui($(this));

         if(! elem.data('device')) {
             elem.setOn();
         }
     });
     };
	 
    function update_cb(elem,state) {
     if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
         this.showOverlay(elem,getPart(state,elem.data('get-warn')));
     else
         this.showOverlay(elem,"");
    };

    // public
    // inherit members from base class
    return $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'button',
        init:init,
		update_cb:update_cb,
    });
};
