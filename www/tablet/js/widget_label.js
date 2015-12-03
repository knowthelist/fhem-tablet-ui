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
        elem.data('limits-get',     elem.isValidData('limits-get')  ? elem.data('limits-get')  : elem.data('device') + ':' + elem.data('get'));
        elem.data('limits-part',    elem.isValidData('limits-part') ? elem.data('limits-part') : elem.data('part'));

        // fill up colors to limits.length
        // if an index s isn't set, use the value of s-1
        for(var s=0; s<elem.data('limits').length; s++) {
            if(typeof elem.data('colors')[s] == 'undefined') {
                elem.data('colors')[s]=elem.data('colors')[s>0?s-1:0];
            }
        }

        elem.data('fix',            ( $.isNumeric(elem.data('fix')) ) ?  Number(elem.data('fix'))           : -1);
        elem.data('substitution',   elem.data('substitution')           || '');
        readings[elem.data('get')] = true;

        //add extra reading into collection
        if(!elem.data('limits-get').match(/:/))
            elem.data('limits-get', elem.data('device') + ':' + elem.data('limits-get'))
        initReadingsArray(elem.data('limits-get'));

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
        DEBUG && console.log(this.widgetname,'value',value,'substitution',substitution);
        if(substitution){
            if (substitution.match(/^s/)) {
                var f = substitution.substr(1,1);
                var subst = substitution.split(f);
                return value.replace(new RegExp(subst[1],subst[3]), subst[2]);
            }
            else if (substitution.match(/weekdayshort/))
                  return dateFromString(value).ee();
            else if (substitution.match(/.*\(\)/))
                  return eval('value.'+substitution);
        }
        return value;
    },
    update_colorize : function(value, elem) {
        //set colors according matches for values
        var limits = elem.data('limits');
        var colors = elem.data('colors');
        if(limits && colors) {
            var idx=indexOfGeneric(limits,value);
            if (idx>-1) {
                elem.css( "color", getStyle('.'+colors[idx],'color') || colors[idx] );
            }
        }
    },
    update_cb : function(elem) {},
    update: function (dev,par) {
        var base = this;
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par){
                var value = ($(this).hasClass('timestamp'))
                            ?getReadingDate( $(this), 'get' )
                            :getDeviceValue( $(this), 'get' );
                if (value){
                    var part = $(this).data('part');
                    var val = getPart(value,part);
                    var unit = $(this).data('unit');
                    
                    val = base.update_fix(val, $(this).data('fix'));
                    val = base.update_substitution(val, $(this).data('substitution'));
        
                    if ( ! $(this).hasClass('fixedlabel') ) {
                      if ( unit )
                        $(this).html( val + "<span style='font-size: 50%;'>"+unit+"</span>" );
                      else
                        $(this).html(val);
                    }
                    base.update_cb($(this),val);
                 }
            }
        });
        //extra reading for colorize
        var sideElements= this.elements.filterData('limits-get',dev+':'+par);
        if (sideElements && sideElements.length>0){
            var val = getDeviceValueByName(dev, par);
            if(val) {
                sideElements.each(function(index) {
                    var part = $(this).data('limits-part');
                    var v = getPart(val,part);
                    widget_label.update_colorize(v, $(this));
                });
            }
        }
    }
});
