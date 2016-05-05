if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_dimmer = $.extend({}, widget_famultibutton, {
    widgetname : 'dimmer',
    init: function () {
     var base = this;
     this.elements = $('div[data-type="'+this.widgetname+'"]');
     this.elements.each(function(index) {
         var elem = $(this);
         elem.initData('off-color'           , getStyle('.dimmer.off','color') || '#2A2A2A');
         elem.initData('off-background-color', getStyle('.dimmer.off','background-color')   || '#505050');
         elem.initData('on-color'            , getStyle('.dimmer.on','color')               || '#2A2A2A');
         elem.initData('on-background-color' , getClassColor(elem) || getStyle('.dimmer.on','background-color')    || '#aa6900');
         elem.initData('background-icon'     , 'fa-circle');
         elem.initData('icon'                , 'fa-lightbulb-o');
         elem.initData('get-value'           , elem.data('part') || '-1');
         elem.initData('set-on'              , '$v');
         elem.initData('set-value'           , '$v');
         elem.initData('dim'                 , '');
         elem.initData('cmd-value'           , 'set');
         elem.initData('max'                 , 100);
         elem.initData('min'                 , 0);
         elem.initData('mode','dimmer');

         if ( elem.data('dim')  != '')
            elem.addReading('dim');
         base.init_attr(elem);
         base.init_ui(elem);
         var val = localStorage.getItem(base.widgetname+"_"+elem.data('device'));
         if ( val && $.isNumeric(val))
          elem.setDimValue( parseInt(val));
     });
    },
     toggleOn : function(elem) {
         if(this._doubleclicked(elem, 'on')) {
             var v = elem.getValue();
             if (elem.hasClass('FS20')){
                  v = this.FS20.dimmerValue(v);
              }
             elem.data('value', elem.data('set-on').replace('$v',v.toString()));
             elem.transmitCommand();
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
            var valStr = elem.data('set-value').replace('$v',v.toString());
            var reading = (elem.data('dim') !== '') ? elem.data('dim') : elem.data('set');
            var cmd = [elem.data('cmd-value'), device, reading, valStr].join(' ');
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
