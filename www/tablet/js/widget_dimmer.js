if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_dimmer = $.extend({}, widget_famultibutton, {
    widgetname : 'dimmer',
    init: function () {
         var base = this;
         this.elements = $('div[data-type="'+this.widgetname+'"]');
         this.elements.each(function(index) {
             $(this).data('off-color',               $(this).data('off-color')           || getStyle('.'+base.widgetname+'.off','color')              || '#2A2A2A');
             $(this).data('off-background-color',    $(this).data('off-background-color')|| getStyle('.'+base.widgetname+'.off','background-color')   || '#505050');
             $(this).data('on-color',                $(this).data('on-color')            || getStyle('.'+base.widgetname+'.on','color')               || '#2A2A2A');
             $(this).data('on-background-color',     $(this).data('on-background-color') || getStyle('.'+base.widgetname+'.on','background-color')    || '#aa6900');
             $(this).data('background-icon',         $(this).data('background-icon')     || 'fa-circle');
             $(this).data('icon',                    $(this).data('icon')                || 'fa-lightbulb-o');
             $(this).data('get-value',               $(this).data('get-value')           || $(this).data('part')         || '-1');
             $(this).data('set-on',                  $(this).data('set-on')              || '$v');
             $(this).data('set-value',               $(this).data('set-value')           || '$v');
             $(this).data('dim',                     $(this).data('dim')                 || '');
             $(this).data('cmd-value',               $(this).data('cmd-value')           || 'set');
             $(this).data('mode','dimmer');
             var elem=$(this);
             base.init_attr(elem);
             base.init_ui(elem);

             if ( $(this).data('dim')  != '')
                readings[$(this).data('dim')] = true;

             var val = localStorage.getItem(base.widgetname+"_"+elem.data('device'));
             if ( val && $.isNumeric(val))
                 elem.setDimValue( parseInt(val));
         });
     },
     toggleOn : function(elem) {
         if(this._doubleclicked(elem, 'on')) {
             var device = elem.data('device');
             var v = elem.getValue();
             if (elem.hasClass('FS20')){
                  v = this.FS20.dimmerValue(v);
              }
             var seton = elem.data('set-on').replace('$v',v);
             var cmd = [elem.data('cmd'), device, elem.data('set'), seton].join(' ');
             setFhemStatus(cmd);
             if( device && typeof device != "undefined" && device !== " ") {
                 TOAST && $.toast(cmd);
             }
             elem.trigger("toggleOn");
         }
     },
     valueChanged: function(elem,v) {
         var device = elem.data('device');
         localStorage.setItem(this.widgetname+"_"+device, v);
         if ( elem.data('famultibutton').getState() === true || elem.data('dim') !== '' ){
             if (elem.hasClass('FS20')){
                  v = this.FS20.dimmerValue(v);
             }
            var val = elem.data('set-value').replace('$v',v.toString());
            var reading = (elem.data('dim') !== '') ? elem.data('dim') : elem.data('set');
            var cmd = [elem.data('cmd-value'), device, reading, val].join(' ');
            setFhemStatus(cmd);
            TOAST && $.toast(cmd);
         }
     },
     update: function (dev,par) {
         var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
         var base = this;
         deviceElements.each(function(index) {
             if ( $(this).data('get')==par) {
                 var state = getDeviceValue( $(this), 'get' );
                 if (state) {
                     var states=$(this).data('states') || $(this).data('get-on');
                     if ( $.isArray(states)) {
                         base.showMultiStates($(this),states,state);
                     } else {
                         var elem = $(this).data('famultibutton');
                         if (elem){
                             if ( state == $(this).data('get-on') )
                                  elem.setOn();
                             else if ( state == $(this).data('get-off') )
                                  elem.setOff();
                             else if ( state.match(new RegExp('^' + $(this).data('get-on') + '$')) )
                                  elem.setOn();
                             else if ( state.match(new RegExp('^' + $(this).data('get-off') + '$')) )
                                  elem.setOff();
                             else if ( $(this).data('get-off')=='!on' && state != $(this).data('get-on') )
                                  elem.setOff();
                             else if ( $(this).data('get-on')=='!off' && state != $(this).data('get-off') )
                                  elem.setOn();
                         }
                     }
                     base.update_cb($(this),state);
                 }
             }
             if ( $(this).data('dim')
               && $(this).data('dim') == par ) {
                 var part = $(this).data('get-value');
                 var value = getDeviceValue( $(this), 'dim' );
                 var val = getPart(value, part);
                 var elemDim = $(this).data('famultibutton');
                 if (elemDim && $.isNumeric(val)) elemDim.setDimValue( parseInt(val));
             }
         });
     },
     update_cb : function(elem,state) {
         if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
             this.showOverlay(elem,state);
         else
             this.showOverlay(elem,"");
     },
});
