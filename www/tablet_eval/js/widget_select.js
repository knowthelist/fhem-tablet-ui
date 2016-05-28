/* FTUI Plugin
* Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*/


var Modul_select = function () {

    function fillList(elem){
        var select_elem = elem.find('select')
        if (select_elem){
            var items = elem.data('items')||'';
            var alias = elem.data('alias')||elem.data('items');
            select_elem.empty();
            for (var i=0;i<items.length;i++) {
                select_elem.append('<option value="'+items[i]+'">'+(alias && alias[i]||items[i])+'</option>');
            }
        }
    };

    function setCurrentItem(elem){
        var value = elem.getReading('get').val;
        elem.find('select').val(value);
        elem.data('value', value);
    };

    function init_attr(elem) {
      elem.initData('get'    ,'STATE');
      elem.initData('set'    ,((elem.data('get')!=='STATE')?elem.attr('data-get'): ''));
      elem.initData('cmd'    ,'set');
      elem.initData('quote'  ,'');
      elem.initData('list'   ,'setList');

      this.addReading(elem,'get');
      this.addReading(elem,'list');
      if ( elem.isValidData('alias')  && !$.isArray(elem.data('alias' ))) {
        this.addReading(elem,'alias');
      }
    };

    function init_ui(elem) {
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
        fillList(elem);
        elem.data('value', elem.data('quote') + $("option:selected", select_elem).val() + elem.data('quote'));
     }

     function update(dev,par) {
        // update from normal state reading
        this.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
           setCurrentItem($(this));
        });

        // update alias reading
        this.elements.filterDeviceReading('alias',dev,par)
        .each(function(index) {
            var elem = $(this);
            var items = elem.getReading('alias').val;
            if (items){
                items = items.split(':');
                elem.data('alias',items);
                fillList(elem);
            }
        });

      //extra reading for list items
      this.elements.filterDeviceReading('list',dev,par)
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
          fillList(elem);
          setCurrentItem(elem);
      });
   };

    // public
    // inherit all public members from base class
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'select',
        init_attr: init_attr,
        init_ui:init_ui,
        update: update,
    });
};
