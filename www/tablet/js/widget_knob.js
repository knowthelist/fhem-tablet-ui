


var Modul_knob = function () {

    if (!$.fn.knob){
        dynamicload('lib/jquery.knob.mod.js', null, null, false);
    }

    var isUpdating = false;
    var onChange = null;
    function onRelease (v) {
       if (!isUpdating){
             var device = this.$.data('device');
             if(typeof device!='undefined') {
                 var val = this.o.setValue.replace('$v',v.toString());
                 var cmdl = [this.o.cmd,device,this.o.set,val].join(' ');
                 setFhemStatus(cmdl);
                 ftui.toast(cmdl);
             }
       }
    };

    function onFormat (v) {
      //fix digits count
      var ret = (this.step<1)?Number(v).toFixed(1):v
      return (this.unit)?ret+unescape(this.unit):ret;
    };

    function init_attr(elem) {
        elem.data('get', elem.data('get') || 'STATE');
        elem.data('set',        elem.data('set')        || '');
        elem.data('cmd',        elem.data('cmd')        || 'set');
        elem.data('set-value',  elem.data('set-value')  || '$v');
        
        elem.data('min',    elem.isValidData('min')  ?  elem.data('min')    : 0);
        elem.data('max',    elem.isValidData('max')  ?  elem.data('max')    : 100);

        elem.data('height', elem.isValidData('height')? elem.data('height') :120);
        elem.data('width',  elem.isValidData('width')?  elem.data('width')  :120);
        if(elem.hasClass('bigger')) { elem.data('height', 260); elem.data('width', 260);}
        if(elem.hasClass('big')) { elem.data('height', 210); elem.data('width', 210);}
        if(elem.hasClass('large')) { elem.data('height', 150); elem.data('width', 150);}
        if(elem.hasClass('small')) { elem.data('height', 100); elem.data('width', 100);}
        if(elem.hasClass('mini')) { elem.data('height', 52); elem.data('width', 52);}

        elem.data('initvalue',  elem.isValidData('initvalue')      ? elem.data('initvalue')        :  10);
        elem.data('step',       elem.isValidData('step')           ? elem.data('step')             :  1);
        elem.data('angleoffset',elem.isValidData('angleoffset')    ? elem.data('angleoffset')      :  -120);
        elem.data('anglearc',   elem.isValidData('anglearc')       ? elem.data('anglearc')         :   240);

        elem.data('bgcolor',    elem.data('bgcolor')    ||                           getStyle('.'+this.widgetname,'background-color')    || '#505050');
        elem.data('fgcolor',    elem.data('fgcolor')    || getClassColor(elem) || getStyle('.'+this.widgetname,'color')               || '#666');
        elem.data('inputcolor', elem.data('inputcolor') ||                           getStyle('.'+this.widgetname+'.input','color')      || '#ffffff');
        elem.data('hdcolor',    elem.data('hdcolor')    ||                           getStyle('.'+this.widgetname+'.handle','color')     || '#666');

        elem.data('font',       elem.data('font')       || getStyle('.'+this.widgetname,'font-family')  || '"Helvetica Neue", "Helvetica", "Open Sans", "Arial", sans-serif');
        elem.data('font-weight',elem.data('font-weight')|| getStyle('.'+this.widgetname,'font')         || 'normal');
        elem.initData('unit'    ,'');
        this.addReading(elem,'get');
    };

    function init_ui(elem) {
       var knob_elem =  jQuery('<input/>', {
           type:        'text',
           value:       elem.data('initvalue'),
           disabled :   true,
       }).data(elem.data())
         .appendTo(elem);
       knob_elem.knob({
          'min':        elem.data('min'),
          'max':        elem.data('max'),
          'step':       1*elem.data('step') || 1,
          'height':     elem.data('height'),
          'width':      elem.data('width'),
          'variance':   Math.floor(elem.data('max') / 5),
          'origmax':    elem.data('origmax'),
          'bgColor':    elem.data('bgcolor'),
          'fgColor':    elem.data('fgcolor'),
          'tkColor':    elem.data('tkcolor'),
          'hdColor':    elem.data('hdcolor'),
          'inputColor': elem.data('inputcolor'),
          'minColor':   elem.data('mincolor'),
          'maxColor':   elem.data('maxcolor'),
          'thickness': (elem.hasClass('mini'))?.45:.25,
          'tickdistance': elem.data('tickstep'),
          'lastvalue':  0,
          'displayInput':   elem.data('displayinput'),
          'readOnly' :      elem.hasClass('readonly'),
          'angleOffset':    elem.data('angleoffset'),
          'angleArc':       elem.data('anglearc'),
          'cmd':            elem.data('cmd'),
          'set':            elem.data('set'),
          'mode':           elem.data('mode'),
          'cursor':         elem.data('cursor'),
          'unit':           elem.data('unit'),
          'setValue':       elem.data('set-value'),
          'touchPosition':  elem.data('touchposition') || 'left',
          'draw' :          this.drawDial,
          'readOnly' :      elem.hasClass('readonly'),
          'change' :        this.onChange,
          'release' :       this.onRelease,
          'format' :        this.onFormat,
       });
       return elem;
    };

    function update (dev,par) {
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        isUpdating=true;
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par ){
                var val = getDeviceValue( $(this), 'get' );
                var knob_elem = $(this).find('input');
                if (knob_elem && val){
                     if ( knob_elem.val() != val ){
                        knob_elem.val( val ).trigger('change');
                        ftui.log( this.widgetname + ' dev:'+dev+' par:'+par+' change '+$(this).data('device')+':knob to ' +val );
                    }   
                    knob_elem.css({visibility:'visible'});
                }
            }
        });
        isUpdating=false;
    };

    // public
    // inherit all public members from base class
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'knob',
        init_attr: init_attr,
        init_ui:init_ui,
        update: update,
    });
};
