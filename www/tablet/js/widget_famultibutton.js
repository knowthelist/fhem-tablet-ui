if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_famultibutton = $.extend({}, widget_widget, {
    widgetname : 'famultibutton',
    _doubleclicked: function(elem, onoff) {
        if(elem.data('doubleclick')*1>0) {
            if(! elem.data('_firstclick')) {
                elem.data('_firstclick', true);
                elem.data('_firstclick_reset', setTimeout(function() {
                    elem.data('_firstclick', false);
                }, elem.data('doubleclick')*1));
                if(onoff == 'on') {
                    elem.setOff();
                } else {
                    elem.setOn();
                }
                elem.children().first().css('color', elem.data('firstclick-background-color'));
                elem.children().last().css('color', elem.data('firstclick-color'));
                return false;
            } else {
                elem.data('_firstclick', false);
                clearTimeout(elem.data('_firstclick_reset'));
            }
        }
        return true;
    },
    toggleOn : function(elem) {
        if(this._doubleclicked(elem, 'on')) {
            var device = elem.data('device');
            var cmd = [elem.data('cmd'), device, elem.data('set-on')].join(' ');
            setFhemStatus(cmd);              
            if( device && typeof device != "undefined" && device !== " ") {
                TOAST && $.toast(typeof device +'+'+cmd);
            }
        }
    },
    toggleOff : function(elem) {
        if(this._doubleclicked(elem, 'off')) {
            var device = elem.data('device');
            var cmd = [elem.data('cmd'), device, elem.data('set-off')].join(' ');
            setFhemStatus(cmd);
            if( device && typeof device != "undefined" && device !== " ") {
                TOAST && $.toast(cmd);
            }
        }
    },
    init_attr : function(elem) {
        elem.data('get',        elem.data('get')        || 'STATE');
        elem.data('cmd',        elem.data('cmd')        || 'set');
        elem.data('get-on',     elem.data('get-on')     || 'on');
        elem.data('get-off',    elem.data('get-off')    || 'off');
        elem.data('set-on',     elem.data('set-on')     || elem.data('get-on'));
        elem.data('set-off',    elem.data('set-off')    || elem.data('get-off'));
        elem.data('mode',       elem.data('mode')       || 'toggle');
        elem.data('doubleclick',                    elem.data('doubleclick')                    || 0);
        elem.data('firstclick-background-color',    elem.data('firstclick-background-color')    ||  '#6F4500');
        elem.data('firstclick-color',               elem.data('firstclick-color')               ||  null);
        readings[elem.data('get')] = true;
    },
    init_ui : function(elem) {
        var base = this;
        elem.famultibutton({
            mode: elem.data('mode'),
            toggleOn: function() { base.toggleOn(elem) },
            toggleOff: function() { base.toggleOff(elem) },
        });
        return elem;
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            base.init_ui($(this));
        });
    },
    update: function (dev,par) {
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par || par =='*') {   
                var state = getDeviceValue( $(this), 'get' );
                if (state) {
                    var states=$(this).data('get-on');
                    if ( $.isArray(states)) {
                        var icons=$(this).data('icons');
                        var colors=$(this).data('on-colors');
                        if (icons && colors && states && icons.length == colors.length && icons.length == states.length ) {
                            var elm=$(this).children().last();
                            var idx=indexOfGeneric(states,state);
                            if (idx>-1){    elm.removeClass()
                                .addClass('fa fa-stack-1x')
                                .addClass(icons[idx])
                                .css( "color", colors[idx] );
                            }
                        }
                    } else {
                        if ( state == $(this).data('get-on') )
                            $(this).data('famultibutton').setOn();
                        else if ( state == $(this).data('get-off') )
                            $(this).data('famultibutton').setOff();
                        else if ( state.match(new RegExp('^' + $(this).data('get-on') + '$')) )
                            $(this).data('famultibutton').setOn();
                        else if ( state.match(new RegExp('^' + $(this).data('get-off') + '$')) )
                            $(this).data('famultibutton').setOff();
                        else if ( $(this).data('get-off')=='!on' && state != $(this).data('get-on') )
                            $(this).data('famultibutton').setOff();
                        else if ( $(this).data('get-on')=='!off' && state != $(this).data('get-off') )
                            $(this).data('famultibutton').setOn();
                    }
                }
            }
        });
    }
});
