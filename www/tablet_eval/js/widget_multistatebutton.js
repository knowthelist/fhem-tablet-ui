
function depends_multistatebutton (){
    if(typeof Module_famultibutton == 'undefined')
        return ["famultibutton"];
};

var Modul_multistatebutton = function () {

   function toggle (elem) {
        if(this.doubleclicked(elem, 'on')) {
            var device = elem.data('device');
            var set = elem.data('set');
            var state = elem.getReading('get').val;

            var states=elem.data('get-on');
            if($.isArray(states)) {
                var sets =elem.data('set')
                if(!$.isArray(sets)) {
                    sets = new Array(sets);
                }
                var s = states.indexOf(state);
                if(s>=0) {
                    set = typeof sets[s] != 'undefined' ? sets[s] : sets[0];
                } else {
                    set = elem.data('set-default')
                }
            }

            var cmd = [elem.data('cmd'), device, set].join(' ');
            ftui.setFhemStatus(cmd);
            if( device && typeof device != "undefined" && device !== " ") {
                ftui.toast(cmd);
            }
        }
    };

    function init() {
        var me = this;
        me.elements = $('div[data-type="'+me.widgetname+'"]',me.area);
        me.elements.each(function(index) {
            var elem = $(this);
            elem.data('get-on'                      , new Array('on', 'off'));
            var set = elem.data('get-on').slice();
            set.push(set.shift());
            elem.data('set'                         , set);
            elem.data('set-default'                 , elem.data('set')[0]);
            elem.data('icon'                        , 'fa-power-off');
            elem.data('background-icon'             , 'fa-circle');
            elem.data('set'                         , set);

            elem.initData('on-color'                , elem.data('color') || getClassColor(elem) || getStyle('.multistatebutton.on','color')  || '#2A2A2A');
            elem.initData('off-color'               , elem.data('color') || getStyle('.multistatebutton.off','color') || elem.data('on-color'));
            elem.initData('on-background-color'     , elem.data('background-color') || getStyle('.multistatebutton.on', 'background-color')   || '#aa6900');
            elem.initData('off-background-color'    , elem.data('background-color') || getStyle('.multistatebutton.off','background-color')   || elem.data('on-background-color'));

            elem.initData('on-colors'                , elem.data('colors') || new Array(elem.data('on-color')) );
            elem.initData('on-background-colors'     , elem.data('background-colors') || new Array(elem.data('on-background-color')) );
            elem.initData('icons'                    , new Array(elem.data('icon')) );

            me.init_attr(elem);
            me.init_ui(elem);
        });
     };

    function update_cb(elem,state) {
     if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
         this.showOverlay(elem,ftui.getPart(state,elem.data('get-warn')));
     else
         this.showOverlay(elem,"");
    };

    // public
    // inherit members from base class
    return $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'multistatebutton',
        init:init,
        toggleOn:toggle,
        toggleOff:toggle,
        update_cb:update_cb,
    });
};
