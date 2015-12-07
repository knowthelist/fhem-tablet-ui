if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_pagebutton = $.extend({}, widget_famultibutton, {
    widgetname : 'pagebutton',
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            var elem = $(this);
            elem.initData('off-color'               ,getStyle('.button.off','color') || '#2A2A2A');
            elem.initData('off-background-color'    ,getStyle('.button.off','background-color')   || '#505050');
            elem.initData('on-color'                ,getClassColor($(this)) || getStyle('.button.on','color')               || '#2A2A2A');
            elem.initData('on-background-color'     ,getStyle('.button.on','background-color')    || '#aa6900');
            elem.initData('background-icon'         ,'fa-circle');
            elem.initData('active-pattern'          ,'.*/'+$(this).data('url'));
            elem.initData('get-warn'                ,-1);

            base.init_attr(elem);
            elem = base.init_ui($(this));
            var elem_url=$(this).data('url');

            elem.bind("toggleOn", function( event ){
               // only set this button to active just before switching page
               base.elements.each(function(index) {
                       $(this).data('famultibutton').setOff();
                });
                elem.data('famultibutton').setOn();
            });

            // is current button detection
            var url = window.location.pathname + ((window.location.hash.length)?'#'+ window.location.hash:'');
            var isActive = url.match(new RegExp('^'+elem.data('active-pattern')+'$'));
            if ( isActive || filename==='' && elem_url==='index.html') {
               elem.setOn();
            }

            // multi state support
            var states=elem.data('states') || elem.data('get-on');
            if ( $.isArray(states)) {
                var idx=indexOfGeneric(states,url);
                base.showMultiStates(elem,states,url,idx);
            }

            $(this).attr('title',$(this).data('url'));
        });
    },
    update_cb : function(elem,state) {
        if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
            this.showOverlay(elem,getPart(state,elem.data('get-warn')));
        else
            this.showOverlay(elem,"");
    },
});
