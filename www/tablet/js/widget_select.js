/* FTUI Plugin
* Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*/

if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_select= $.extend({}, widget_widget, {
    widgetname:"select",
    fillList: function(elem){
        var select_elem = elem.find('select')
        if (select_elem){
            var items = elem.data('items')||'';
            var alias = elem.data('alias')||elem.data('items');
            select_elem.empty();
            for (var i=0;i<items.length;i++) {
                select_elem.append('<option value="'+items[i]+'">'+(alias && alias[i]||items[i])+'</option>');
            }
        }
    },
    setCurrentItem: function(elem){
        var value = elem.getReading('get').val;
        elem.find('select').val(value);
        elem.data('value', value);
    },
  init_attr: function(elem) {
      elem.initData('get'    ,'STATE');
      elem.initData('set'    ,((elem.data('get')!=='STATE')?elem.attr('data-get'): ''));
      elem.initData('cmd'    ,'set');
      elem.initData('quote'  ,'');
      elem.initData('list'   ,'setList');

      elem.addReading('get');
      elem.addReading('list');
  },
  init_ui : function(elem) {
    var base = this;
    // prepare select element
        elem.addClass('select');
        var select_elem = jQuery('<select/>', { })
        .on('change', function (e) {
            var parent = $(this).parent('div[data-type="select"]');
            parent.data('value', parent.data('quote') + $("option:selected", this).val() + parent.data('quote'));
            $(this).blur();
            parent.transmitCommand();
            elem.trigger('changedValue');
        })
        .appendTo(elem);
        base.fillList(elem);
        elem.data('value', elem.data('quote') + $("option:selected", select_elem).val() + elem.data('quote'));
  },
  update: function (dev,par) {
      var base = this;
      // update from normal state reading
      this.elements.filterDeviceReading('get',dev,par)
      .each(function(index) {
          base.setCurrentItem($(this));
      });

      //extra reading for list items
      base.elements.filterDeviceReading('list',dev,par)
      .each(function(idx) {
          var elem = $(this);
          var items = elem.getReading('list').val;
          if (items){
              if (elem.data('list')==='setList'){
                  var setreading = (elem.data('set')==='')?'state':elem.data('set');
                  items = items.split(' ');
                  var founditems = items;
                  $.each( items, function( key, value ) {
                      var tokens = value.split(':');
                      if (tokens && tokens.length>1){
                          if (tokens[0]==setreading)
                              founditems=tokens[1].split(',');
                      }
                    });
                  items = founditems;
              }
              else
                  items = items.split(':');
          }
          elem.data('items',items);
          base.fillList.call(base,elem);
          base.setCurrentItem.call(base,elem);
      });
   }
});
