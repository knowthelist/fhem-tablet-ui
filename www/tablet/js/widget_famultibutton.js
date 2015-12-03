if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

if (!$.fn.famultibutton){
    dynamicload('lib/fa-multi-button.min.js', null, null, false);
}

var widget_famultibutton = $.extend({}, widget_widget, {
    widgetname : 'famultibutton',
    _doubleclicked: function(elem, onoff) {
        if(elem.data('doubleclick')*1>0) {
            if(! elem.data('_firstclick')) {
                elem.data('_firstclick', true);
                if(onoff == 'on') {
                    elem.data('_firstclick_reset', setTimeout(function() {
                        elem.data('_firstclick', false);
                        elem.setOff();
                    }, elem.data('doubleclick')*1));
                    elem.setOff();
                } else {
                    elem.data('_firstclick_reset', setTimeout(function() {
                        elem.data('_firstclick', false);
                        elem.setOn();
                    }, elem.data('doubleclick')*1));
                    elem.setOn();
                }
                elem.children().filter('#bg').css('color', elem.data('firstclick-background-color'));
                elem.children().filter('#fg').css('color', elem.data('firstclick-color'));
                return false;
            } else {
                elem.data('_firstclick', false);
                clearTimeout(elem.data('_firstclick_reset'));
            }
        }
        return true;
    },
    showOverlay : function(elem, value) {
         elem.children().filter('#warn-back').remove();
         elem.children().filter('#warn').remove();
         if (value && value!=""){
             var val = ($.isNumeric(value)&&value<100)?Number(value).toFixed(0):'!';
             jQuery('<i/>', {
                 id: 'warn-back',
                 class: 'fa fa-stack-1x fa-circle'
             }).appendTo(elem);

            jQuery('<i/>', {
                 id: 'warn',
                 class: 'fa fa-stack-1x '
            }).html(val).appendTo(elem);
         }
    },
    showMultiStates : function(elem,states,state,idxOn){

        var icons=elem.data('icons');
        var bgicons=elem.data('background-icons');
        var colors=elem.data('colors') || elem.data('on-colors');
        var bgcolors=elem.data('background-colors') || elem.data('on-background-colors');


        // if data-icons isn't set, try using data-icon or fa-power-off instead
        if(typeof icons == 'undefined') {
            icons = new Array(elem.data('icon')||'fa-power-off');
        }
        // if data-background-icons isn't set, try using data-background-icon or '' instead
        if(typeof bgicons == 'undefined') {
            bgicons = new Array(elem.data('background-icon')||'');
        }
        // if data-colors isn't set, try using data-on-color, data-off-color or #505050 instead
        if(typeof colors == 'undefined') {
            colors = new Array(elem.data('on-color')||elem.data('off-color')||'#505050');
        }
        // if data-background-colors isn't set, try using data-on-background-color, data-off-background-color or #505050 instead
        if(typeof bgcolors == 'undefined') {
            bgcolors = new Array(elem.data('on-background-color')||elem.data('off-background-color')||'#505050');
        }

        // fill up colors and icons to states.length
        // if an index s isn't set, use the value of s-1
        for(var s=0; s<states.length; s++) {
            if(typeof icons[s] == 'undefined') {
                icons[s]=icons[s>0?s-1:0];
            }
            if(typeof bgicons[s] == 'undefined') {
                bgicons[s]=bgicons[s>0?s-1:0];
            }
            if(typeof colors[s] == 'undefined') {
                colors[s]=colors[s>0?s-1:0];
            }
            if(typeof bgcolors[s] == 'undefined') {
                bgcolors[s]=bgcolors[s>0?s-1:0];
            }
        }

        var elm=elem.children().filter('#fg');
        var idx=indexOfGeneric(states,state);
        if (idx>-1){
            var faelem = elem.data('famultibutton');
            if ( faelem ) {
              idxOn = idxOn || 0;
              if ( idx === idxOn ) {
                 faelem.setOn();
              } else {
                 faelem.setOff();
              }
            }
            elm.removeClass()
            .addClass('fa fa-stack-1x')
            .addClass(icons[idx])
            .css( "color", getStyle('.'+colors[idx],'color') || colors[idx] );
            var bgelm=elem.children().filter('#bg');
            bgelm.removeClass()
            .addClass('fa fa-stack-2x')
            .addClass(bgicons[idx])
            bgelm.css( "color", getStyle('.'+bgcolors[idx],'color') || bgcolors[idx] );
            
        }
    },
    toggleOn : function(elem) {
        if(this._doubleclicked(elem, 'on')) {
            this.clicked(elem, 'on');
            elem.trigger("toggleOn");
            var blink = elem.data('blink');
            // blink=on     -> always reset state after 200ms
            // blink=off    -> never reset state after 200ms
            // blink=undef  -> reset state after 200ms if device is not set
            if(blink == 'on' || (! elem.data('device') && blink !='off')) {
                setInterval(function() {elem.setOff()}, 200);
            }
        }
    },
    toggleOff : function(elem) {
        if (elem.data('set-off')===''){
            elem.setOn();
        }
        else if(this._doubleclicked(elem, 'off')) {
            this.clicked(elem, 'off');
            var blink = elem.data('blink');
            if(blink == 'on' || (! elem.data('device') && blink !='off')) {
                setInterval(function() {elem.setOn()}, 200);
            }
        }
    },
    clicked: function(elem, onoff) {
        var target;
        var type;
        var device = elem.data('device');
        
        if(elem.attr('data-url')) {
            target = elem.attr('data-url');
            type = 'url';
        } else if(elem.attr('data-url-xhr')) {
            target = elem.attr('data-url-xhr');
            type = 'url-xhr';
        } else if(elem.attr('data-fhem-cmd')) {
            target = elem.attr('data-fhem-cmd');
            type = 'fhem-cmd';
        } else {
            var sets = elem.data('set-'+onoff);
            if(!$.isArray(sets)) {
                sets = new Array(String(sets));
            }
            var s = localStorage.getItem(this.widgetname+device+'index') || 0;
            var set = typeof sets[s] != 'undefined' ? sets[s] : sets[0];
            s++; if (s >= sets.length) s=0;
            localStorage.setItem(this.widgetname+device+'index',s);
            target = [elem.data('cmd'), device, elem.data('set'), set ].join(' ');
            type = 'fhem-cmd';
        }
        switch(type) {
            case 'url':
                document.location.href = target;
                break;
            case 'url-xhr':
                if( device && typeof device != "undefined" && device !== " ") {
                    TOAST && $.toast(target);
                }
                $.get(target);
                break;
            case 'fhem-cmd':
                if( device && typeof device != "undefined" && device !== " ") {
                    TOAST && $.toast(target);
                }
                setFhemStatus(target);
                break;
        }
    },
    valueChanged: function(elem,v) {
    },
    init_attr : function(elem) {
        elem.initData('get'         ,'STATE');
        elem.initData('set'         ,'');
        elem.initData('cmd'         ,'set');
        elem.initData('get-on'      ,'on');
        elem.initData('get-off'     ,'off');
        elem.initData('set-on'      ,elem.data('get-on'));
        elem.initData('set-off'     ,elem.data('get-off'));
        elem.initData('mode'        ,'toggle');
        elem.initData('doubleclick' ,0);
        elem.initData('firstclick-background-color', '#6F4500');
        elem.initData('firstclick-color'           , null);

        elem.addReading('get');

        elem.initData('off-color'           , getStyle('.'+this.widgetname+'.off','color')              || '#505050');
        elem.initData('off-background-color', getStyle('.'+this.widgetname+'.off','background-color')   || '#505050');
        elem.initData('on-color'            , getStyle('.'+this.widgetname+'.on','color')               || '#aa6900');
        elem.initData('on-background-color' , getStyle('.'+this.widgetname+'.on','background-color')    || '#aa6900');

        if ( elem.isDeviceReading('on-color') ) {elem.addReading('on-color');}
        if ( elem.isDeviceReading('on-background-color') ) {elem.addReading('on-background-color');}
        if ( elem.isDeviceReading('off-color') ) {elem.addReading('off-color');}
        if ( elem.isDeviceReading('off-background-color') ) {elem.addReading('off-background-color');}

    },
    init_ui : function(elem) {
        var base = this;
        elem.famultibutton({
            mode: elem.data('mode'),
            toggleOn: function() { base.toggleOn(elem) },
            toggleOff: function() { base.toggleOff(elem) },
            valueChanged: function(v) { base.valueChanged(elem,v) },
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
    update_cb : function(elem) {},
    update: function (dev,par) {
        var base = this;
        // update from normal statereading
        this.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var state = elem.getReading('get').val;
            if (state) {
                var states=elem.data('states') || elem.data('get-on');
                if ( $.isArray(states)) {
                    base.showMultiStates(elem,states,state);
                } else {
                    var faelem = elem.data('famultibutton');
                    if (faelem){
                        if ( state == elem.data('get-on') )
                             faelem.setOn();
                        else if ( state == elem.data('get-off') )
                             faelem.setOff();
                        else if ( state.match(new RegExp('^' + elem.data('get-on') + '$')) )
                             faelem.setOn();
                        else if ( state.match(new RegExp('^' + elem.data('get-off') + '$')) )
                             faelem.setOff();
                        else if ( elem.data('get-off')=='!on' && state != elem.data('get-on') )
                             faelem.setOff();
                        else if ( elem.data('get-on')=='!off' && state != elem.data('get-off') )
                             faelem.setOn();
                    }
                }
                base.update_cb(elem,state);
            }
        });
        // update from extra reading for colorize
        var oparm = ['offColor','onColor','onBackgroundColor','offBackgroundColor'];
        var selec = ['#fg','#fg','#bg','#bg'];
        var estat = [false,true,true,false];
        $.each(['off-color','on-color','on-background-color','off-background-color' ], function( index, key ) {
            base.elements.filterDeviceReading(key,dev,par)
                .each(function(idx) {
                    var elem = $(this);
                    var val = elem.getReading(key).val;
                    if(val) {
                        val = '#'+val.replace('#','');
                        var faelem = elem.data('famultibutton');
                        if (faelem){
                            // change color in options
                            faelem.o[ oparm[index] ] = val;
                            if ( faelem.getState() === estat[index] ){
                                // it's current state -> change directly
                                elem.children().filter( selec[index] ).css( "color", val );
                            }
                        }
                    }
                });
            });
        },
});
