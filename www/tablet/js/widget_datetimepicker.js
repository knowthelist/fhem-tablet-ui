if(typeof widget_label == 'undefined') {
    loadplugin('widget_label');
}
if (!$.fn.datetimepicker){
    dynamicload('lib/jquery.datetimepicker.js', null, null, false);
    $('head').append('<link rel="stylesheet" href="'+ dir + '/../lib/jquery.datetimepicker.css" type="text/css" />');
}
var widget_datetimepicker  = $.extend({}, widget_label, {
  widgetname : 'datetimepicker',
  init: function () {
     var base = this;
     this.elements = $('div[data-type="'+this.widgetname+'"]');
     this.elements.each(function(index) {
         var elem = $(this);
         elem.data('cmd',        elem.isValidData('cmd')        ? elem.data('cmd')          : 'set');
         elem.data('set-value',  elem.data('set-value')         || '$v');
         elem.data('unit',       elem.isValidData('unit')       ? elem.data('unit')         : '<span style="font-size: 180%;">&#32;&#9660;</span>');
         elem.data('format',     elem.isValidData('format')     ? elem.data('format')       : 'Y-m-d H:i');
         elem.data('theme',      elem.isValidData('theme')      ? elem.data('theme')        : 'dark');
         elem.data('timepicker', elem.isValidData('timepicker') ? elem.data('timepicker')   : 'true');
         elem.data('datepicker', elem.isValidData('datepicker') ? elem.data('datepicker')   : 'true');
         elem.data('step',       elem.isValidData('step')       ? elem.data('step')         : '60');
         base.init_attr(elem);
         var picker = elem.datetimepicker({
              lang: 'de',
              theme: elem.data('theme'),
              format: elem.data('format'),
              timepicker: elem.data('timepicker'),
              datepicker: elem.data('datepicker'),
              step: elem.data('step'),
              onChangeDateTime:function(dp,$input){
                var val = v = elem.data('set-value').replace('$v',$input.val().toString());
                elem.text(val);
                var command = [elem.data('cmd'), elem.data('device'), elem.data('set'), val ].join(' ');
                setFhemStatus( command );
                TOAST && $.toast(command);
              },
         });
     });
  },
  update_cb : function(elem,val) {
      elem.datetimepicker({ value: val});
  },
});
