

function depends_dimmer(){
    if(typeof Module_famultibutton == 'undefined' || !$.fn.famultibutton) {
        return ["famultibutton"];
    }
};

var Modul_dimmer = function () {

    function init() {
     var me = this;
     me.elements = $('div[data-type="'+this.widgetname+'"]',me.area);
     me.elements.each(function(index) {
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
            me.addReading(elem,'dim');
         me.init_attr(elem);
         me.init_ui(elem);
         var val = localStorage.getItem(me.widgetname+"_"+elem.data('device'));
         if ( val && $.isNumeric(val))
          elem.setDimValue( parseInt(val));
     });
    };

    function toggleOn (elem) {
         var v = elem.getValue();
         if (elem.hasClass('FS20')){
              v = ftui.FS20.dimmerValue(v);
          }
         elem.data('value', elem.data('set-on').toString().replace('$v',v.toString()));
         elem.transmitCommand();
         elem.trigger("toggleOn");
     };

     function valueChanged (elem,v) {
         var device = elem.data('device');
         localStorage.setItem(this.widgetname+"_"+device, v);
         if ( elem.data('famultibutton').getState() === true || elem.data('dim') !== '' ){
             if (elem.hasClass('FS20')){
                  v = this.FS20.dimmerValue(v);
             }
            var valStr = elem.data('set-value').toString().replace('$v',v.toString());
            var reading = (elem.data('dim') !== '') ? elem.data('dim') : elem.data('set');
            var cmd = [elem.data('cmd-value'), device, reading, valStr].join(' ');
            ftui.setFhemStatus(cmd);
            ftui.toast(cmd);
         }
     };

     function update (dev,par) {
         var me = this;
         // update from desired temp reading
         me.elements.filterDeviceReading('get',dev,par)
         .each(function(index) {
           var elem = $(this);
           var state = elem.getReading('get').val;
           if (state) {
                 var states=$(this).data('states') || $(this).data('get-on');
                 if ( $.isArray(states)) {
                     me.showMultiStates($(this),states,state);
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
                 me.update_cb($(this),state);
             }
           });
           //extra reading for colorize
           me.elements.filterDeviceReading('dim',dev,par)
           .each(function(idx) {
               var elem = $(this);
               var value = elem.getReading('dim').val;
               if(value) {
                   var part = $(this).data('get-value');
                   var val = getPart(value, part);
                   var elemDim = $(this).data('famultibutton');
                   if (elemDim && $.isNumeric(val))
                       elemDim.setDimValue( parseInt(val));

                }
         });
      };

     function update_cb (elem,state) {
         if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
             this.showOverlay(elem,state);
         else
             this.showOverlay(elem,"");
     };

    return $.extend(new Modul_famultibutton(), {
        widgetname: 'dimmer',
        init:init,
        valueChanged:valueChanged,
        toggleOn:toggleOn,
        update:update,
        update_cb:update_cb,
    });
};

