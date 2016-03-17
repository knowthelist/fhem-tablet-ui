var Modul_label = function () {

    function init_attr(elem) {
        elem.initData('get'         , 'STATE');
        elem.initData('part'        , -1);
        elem.initData('unit'        , '' );
        elem.initData('color'       , '');
        elem.initData('limits'      , []);
        elem.initData('colors'      , ['#505050']);
        elem.initData('limits-get'  , elem.data('device') + ':' + elem.data('get'));
        elem.initData('limits-part' , elem.data('part'));
        elem.initData('substitution'    , '');

        // fill up colors to limits.length
        // if an index s isn't set, use the value of s-1
        for(var s=0, len=elem.data('limits').length; s<len; s++) {
            if(typeof elem.data('colors')[s] == 'undefined') {
                elem.data('colors')[s]=elem.data('colors')[s>0?s-1:0];
            }
        }

        elem.data('fix',            ( $.isNumeric(elem.data('fix')) ) ?  Number(elem.data('fix'))           : -1);

        this.addReading(elem,'get');
        this.addReading(elem,'limits-get');
        if ( elem.isDeviceReading('color') ) {this.addReading(elem,'color');}

    }

    function init_ui(elem) {}

    function update_fix(value, fix) {
        return ( $.isNumeric(value) && fix>=0 ) ? Number(value).toFixed(fix) : value;
    }

    function update_substitution(value, substitution) {
        ftui.log(3,this.widgetname+' - value:'+value+', substitution:'+substitution);
        if(substitution){
            if ($.isArray(substitution)){
                for(var i=0, len=substitution.length; i<len; i+=2) {
                    if(value == substitution[i] && i+1<len)
                        return substitution[i+1];
                }
            }
            else if (substitution.match(/^s/)) {
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
    }

    function update_colorize(value, elem) {
        //set colors according matches for values
        var limits = elem.data('limits');
        var colors = elem.data('colors');
        if(limits && colors) {
            var idx=indexOfGeneric(limits,value);
            if (idx>-1) {
                var layer = (elem.hasClass('bg-limit')?'background':'color');
                elem.css( layer, getStyle('.'+colors[idx],'color') || colors[idx] );
            }
        }
    }

    function update_cb(elem) {}

    function update(dev,par) {
        var base = this;
        // update from normal state reading
        this.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var value = (elem.hasClass('timestamp'))
                        ?elem.getReading('get').date
                        :elem.getReading('get').val;
            // hide element when it's value equals data-hide
            // if data-hideparents is set, it is interpreted als jquery selector to hide elements parents filtered by this selector
            if(elem.data('hide')) {
                if(value == elem.data('hide')) {
                    if(elem.data('hideparents')) {
                        elem.parents(elem.data('hideparents')).hide();
                    } else {
                        elem.hide();
                    }
                } else {
                    if(elem.data('hideparents')) {
                        elem.parents(elem.data('hideparents')).show();
                    } else {
                        elem.show();
                    }
                }
            }

            if (value){
                var part = elem.data('part');
                var val = getPart(value,part);
                var unit = elem.data('unit');

                val = update_substitution(val, elem.data('substitution'));
                val = update_fix(val, elem.data('fix'));
                if (!isNaN(parseFloat(val)) && isFinite(val) && val.indexOf('.')>-1){
                    var vals = val.split('.');
                    val = "<span class='label-precomma'>"+vals[0]+"</span>" +
                          "<span class='label-comma'>.</span>" +
                          "<span class='label-aftercomma'>"+vals[1]+"</span>";
                }

                if ( !elem.hasClass('fixedlabel') ) {
                  if ( unit )
                    elem.html( val + "<span class='label-unit'>"+unescape(unit)+"</span>" );
                  else
                    elem.html(val);
                }
                base.update_cb(elem,val);
            }
            var color = elem.data('color');
            if (color && !elem.isDeviceReading('color'))
                elem.css( "color", getStyle('.'+color,'color') || color );

        });

        //extra reading for dynamic color
        base.elements.filterDeviceReading('color',dev,par)
        .each(function(idx) {
            var elem = $(this);
            var val = elem.getReading('color').val;
            if(val) {
                val = '#'+val.replace('#','');
                elem.css( "color", val );
            }
        });

        //extra reading for colorize
        base.elements.filterDeviceReading('limits-get',dev,par)
        .each(function(idx) {
            var elem = $(this);
            var val = elem.getReading('limits-get').val;
            if(val) {
                var part = elem.data('limits-part');
                var v = getPart(val,part);
                update_colorize(v, elem);
            }
        });
    }

    // public
    // inherit all public members from base class
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'label',
        init_attr: init_attr,
        init_ui:init_ui,
        update: update,
        update_cb: update_cb,
    });
};
