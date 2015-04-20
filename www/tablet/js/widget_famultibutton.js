if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_famultibutton = $.extend({}, widget_widget, {
    widgetname : 'famultibutton',
    toggleOn : function(elem) {
        var device = elem.data('device');
        var cmd = [elem.data('cmd'), device, elem.data('set-on')].join(' ');
        setFhemStatus(cmd);
        if( device && typeof device != "undefined") {
            TOAST && $.toast(cmd);
        }
    },
    toggleOff : function(elem) {
        var device = elem.data('device');
        var cmd = [elem.data('cmd'), device, elem.data('set-off')].join(' ');
        setFhemStatus(cmd);
        if( device && typeof device != "undefined") {
            TOAST && $.toast(cmd);
        }
    },
    init_attr : function(elem) {
        elem.data('get',        elem.data('get') || 'STATE');
        elem.data('cmd',        elem.data('cmd') || 'set');
        elem.data('get-on',     elem.attr('data-get-on')?elem.data('get-on'):(elem.attr('data-on') || 'on'));
        elem.data('get-off',    elem.attr('data-get-off')?elem.data('get-off'):(elem.attr('data-off') || 'off'));        elem.data('set-on',     elem.attr('data-set-on')    || elem.data('get-on'));
        elem.data('set-off',    elem.attr('data-set-off')   || elem.data('get-off'));
        elem.data('mode',       elem.data('mode')|| 'toggle');
        readings[elem.data('get')] = true;
    },
    init_ui : function(elem) {
        var base = this;
        elem.famultibutton({
            mode: elem.data('mode'),
            toggleOn: function() { base.toggleOn(elem) },
            toggleOff: function() { base.toggleOff(elem) },
        });
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
                            var idx=states.indexOf(state);
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
                        else if ( state.match(RegExp('^' + $(this).data('get-on') + '$')) )
                            $(this).data('famultibutton').setOn();
                        else if ( state.match(RegExp('^' + $(this).data('get-off') + '$')) )
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
