
function depends_symbol (){
    if(typeof Module_famultibutton == 'undefined' || !$.fn.famultibutton) {
        return ["famultibutton"];
    }
};

var Modul_symbol = function () {

    function init() {
        var me = this;
        me.elements = $('div[data-type="'+me.widgetname+'"]',me.area);
        me.elements.each(function(index) {
            var elem = $(this);
            elem.initData('off-color'               ,getStyle('.symbol.off','color') || '#505050');
            elem.initData('off-background-color'    ,getStyle('.symbol.off','background-color')   || '#505050');
            elem.initData('on-color'                ,getClassColor(elem) || getStyle('.symbol.on','color')               || '#aa6900');
            elem.initData('on-background-color'     ,getStyle('.symbol.on','background-color')    || '#aa6900');
            elem.initData('background-icon'         ,null);
            elem.initData('icon'                    ,(( $.isArray(elem.data('icons')) ) ? elem.data('icons')[0] : 'ftui-window'));
            elem.initData('get-on'                  ,'open');
            elem.initData('get-off'                 ,'closed');
            elem.initData('get-warn'                ,-1);
            elem.data('mode', 'signal');
            me.init_attr(elem);
            me.init_ui(elem);
        });
    };

    function update_cb(elem,state) {
        $('.fa-stack:has(.zero)').removeClass('fa-stack');
        if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
            this.showOverlay(elem,getPart(state,elem.data('get-warn')));
        else
            this.showOverlay(elem,"");
    };

    // public
    // inherit members from base class
    return $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'symbol',
        init:init,
        update_cb: update_cb,
    });
}
