if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_label = $.extend({}, widget_widget, {
    widgetname:"label",
    init_attr: function(elem) {
        elem.data('get',            elem.data('get')                    || 'STATE');
        elem.data('part',           elem.data('part')                   || -1);
        elem.data('unit',           unescape(elem.data('unit')          || '' ));
        elem.data('limits',         elem.data('limits')                 || new Array());
        elem.data('colors',         elem.data('colors')                 || new Array('#505050'));
        // fill up colors to limits.length
        // if an index s isn't set, use the value of s-1
        for(var s=0; s<elem.data('limits').length; s++) {
            if(typeof elem.data('colors')[s] == 'undefined') {
                elem.data('colors')[s]=elem.data('colors')[s>0?s-1:0];
            }
        }

        elem.data('fix',            ( $.isNumeric(elem.data('fix')) ) ?  Number(elem.data('fix'))           : -1);
        elem.data('substitution',   elem.data('substitution')           || '');
        readings[$(this).data('get')] = true;
    },
    init: function () {
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            widget_label.init_attr($(this));
        });
    },
    update_fix : function(value, fix) {
        return ( $.isNumeric(value) && fix>=0 ) ? Number(value).toFixed(fix) : value;
    },
    update_substitution : function(value, substitution) {
        DEBUG && console.log(value, substitution);
        if(substitution && substitution.match(/^s/)) {
            var f = substitution.substr(1,1);
            var subst = substitution.split(f);
            return value.replace(new RegExp(subst[1],subst[3]), subst[2]);
        }
        return value;
    },
    update_colorize : function(value, elem) {
        //set colors according matches for values
        var limits = elem.data('limits');
        var colors = elem.data('colors');

        var idx=indexOfGeneric(limits,value);
        if (idx>-1) {
            elem.css( "color", colors[idx] );
        }
    },
    update: function (dev,par) {
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par){
                var value = ($(this).hasClass('timestamp'))
                            ?getReadingDate( $(this), 'get' )
                            :getDeviceValue( $(this), 'get' );
                if (value){
                    var part = $(this).data('part');
                    var val = getPart(value,part);
                    
                    val = widget_label.update_fix(val, $(this).data('fix'));
                    val = widget_label.update_substitution(val, $(this).data('substitution'));
        
                    var unit = $(this).data('unit');
                    $(this).html( val + "<span style='font-size: 50%;'>"+unit+"</span>" );
        
                    widget_label.update_colorize(val, $(this));
                 }
            }
        });
    }
});
