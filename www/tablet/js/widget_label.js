var Modul_label = function () {

    function init_attr(elem) {
        elem.initData('get'         , 'STATE');
        elem.initData('part'        , -1);
        elem.initData('unit'        , '' );
        elem.initData('color'       , '');
        elem.initData('limits'      , elem.data('states') || []);
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

    };

    function init_ui(elem) {};

    function update_fix(value, fix) {
        return ( $.isNumeric(value) && fix>=0 ) ? Number(value).toFixed(fix) : value;
    };

    function update_factor(value, factor) {
        return ( $.isNumeric(value) && $.isNumeric(factor) ) ? (Number(value) * Number(factor)).toString() : value;
    };

    function update_postfix(value, postfix) {
        return postfix ? value + postfix : value;
    };

    function update_prefix(value, prefix) {
        return prefix ? prefix + value : value;
    };

    function update_substitution(value, substitution) {
        ftui.log(3,me.widgetname+' - value:'+value+', substitution:'+substitution);
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
    };

    function update_colorize(value, elem) {
        //set colors according matches for values
        var limits = elem.data('limits');
        var colors = elem.data('colors');
        var classes = elem.data('classes');
        if(limits) {
            var idx=indexOfGeneric(limits,value);
            if (idx>-1) {
                if(colors) {
                    var layer = (elem.hasClass('bg-limit')?'background':'color');
                    elem.css( layer, getStyle('.'+colors[idx],'color') || colors[idx] );
                }
                if(classes) {
                    for(var i=0,len=classes.length; i<len; i++) {
                        elem.removeClass( classes[i] );
                    }
                    elem.addClass( classes[idx] );
                }
            }
        }
    };

    function update_cb(elem) {};

    function update(dev,par) {

        me = this;
        // update from normal state reading
        me.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var value = (elem.hasClass('timestamp'))
                        ?elem.getReading('get').date
                        :elem.getReading('get').val;
            // hide element when it's value equals data-hide
            // if data-hideparents is set, it is interpreted als jquery selector to hide elements parents filtered by this selector
            if(isValid(elem.data('hide'))) {
                if(value == elem.data('hide')) {
                    if(isValid(elem.data('hideparents'))) {
                        elem.parents(elem.data('hideparents')).hide();
                    } else {
                        elem.hide();
                    }
                } else {
                    if(isValid(elem.data('hideparents'))) {
                        elem.parents(elem.data('hideparents')).show();
                    } else {
                        elem.show();
                    }
                }
            }

            if (value){
                var part = elem.data('part');
                var val = ftui.getPart(value,part);
                var unit = elem.data('unit');

                val = update_substitution(val, elem.data('substitution'));
                val = update_factor(val, elem.data('factor'));
                val = update_fix(val, elem.data('fix'));
                val = update_prefix(val, elem.data('prefix'));
                val = update_postfix(val, elem.data('postfix'));
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
                me.update_cb(elem,val);
            }
            var color = elem.data('color');
            if (color && !elem.isDeviceReading('color'))
                elem.css( "color", getStyle('.'+color,'color') || color );

        });

        //extra reading for dynamic color
        me.elements.filterDeviceReading('color',dev,par)
        .each(function(idx) {
            var elem = $(this);
            var val = elem.getReading('color').val;
            if(val) {
                val = '#'+val.replace('#','');
                elem.css( "color", val );
            }
        });

        //extra reading for colorize
        me.elements.filterDeviceReading('limits-get',dev,par)
        .each(function(idx) {
            var elem = $(this);
            var val = elem.getReading('limits-get').val;
            if(val) {
                var part = elem.data('limits-part');
                var v = ftui.getPart(val,part);
                update_colorize(v, elem);
            }
        });
    };

    // public
    // inherit all public members from base class
    var me = this;
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'label',
        init_attr: init_attr,
        init_ui:init_ui,
        update: update,
        update_cb: update_cb,
        update_substitution:update_substitution,
        update_colorize:update_colorize,
        update_fix:update_fix,
    });
};
