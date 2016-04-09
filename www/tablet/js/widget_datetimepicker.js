var Modul_datetimepicker= function () {

    if(typeof Module_label == 'undefined')
        ftui.loadplugin('widget_label');

    if (!$.fn.datetimepicker){
        ftui.dynamicload('lib/jquery.datetimepicker.js', null, null, false);
        $('head').append('<link rel="stylesheet" href="'+ ftui.config.dir + '/../lib/jquery.datetimepicker.css" type="text/css" />');
    }

  function init () {
     var me = this;
     me.elements = $('div[data-type="'+me.widgetname+'"]',me.area);
     me.elements.each(function(index) {
         var elem = $(this);
         elem.data('cmd',        elem.isValidData('cmd')        ? elem.data('cmd')          : 'set');
         elem.data('set-value',  elem.data('set-value')         || '$v');
         elem.data('unit',       elem.isValidData('unit')       ? elem.data('unit')         : '<span style="font-size: 180%;">&#32;&#9660;</span>');
         elem.data('format',     elem.isValidData('format')     ? elem.data('format')       : 'Y-m-d H:i');
         elem.data('theme',      elem.isValidData('theme')      ? elem.data('theme')        : 'dark');
         elem.data('timepicker', elem.isValidData('timepicker') ? elem.data('timepicker')   : 'true');
         elem.data('datepicker', elem.isValidData('datepicker') ? elem.data('datepicker')   : 'true');
         elem.data('step',       elem.isValidData('step')       ? elem.data('step')         : '60');
         me.init_attr(elem);
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
                elem.data('value', val);
                elem.transmitCommand();
              },
         });
     });
  };

  function update_cb (elem,val) {
      elem.datetimepicker({ value: val});
  };

    // public
    // inherit members from base class
    return $.extend(new Modul_label(), {
        //override members
        widgetname: 'datetimepicker',
        init:init,
        update_cb:update_cb,
    });
};
