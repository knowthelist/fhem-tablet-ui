if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_select= $.extend({}, widget_widget, {
  widgetname:"select",
  init_attr: function(elem) {
        elem.data('get', elem.data('get') || 'STATE');
        elem.data('set', elem.data('set') || ((elem.data('get')!='STATE')?elem.attr('data-get'): ''));
        elem.data('cmd', elem.data('cmd') || 'set');
        elem.data('quote', elem.data('quote') || '');
        elem.data('list', elem.data('list') || 'setList');

        readings[elem.data('get')] = true;
        readings[elem.data('list')] = true;
  },
  init: function () {
      var base=this;
      this.elements = $('div[data-type="'+this.widgetname+'"]');
      this.elements.each(function(index) {
        base.init_attr($(this));
        $(this).addClass('select');
        var select_elem = jQuery('<select/>', { })
        .on('change', function (e) {
            var parent = $(this).parent('div[data-type="select"]');
            var optionSelected = parent.data('quote') + $("option:selected", this).val() + parent.data('quote');
            $(this).blur();
            var cmdl = [parent.data('cmd'),parent.data('device'),parent.data('set'),optionSelected].join(' ');
            setFhemStatus(cmdl);
            $.toast(cmdl);
        })
        .appendTo($(this));

     });
  },
  update: function (dev,par) {

    var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
    deviceElements.each(function(index) {
        if ( $(this).data('get')==par || $(this).data('list')==par){
            var state = getDeviceValue( $(this), 'get' );
            var items = $(this).data('items');
            var alias = $(this).data('alias')||$(this).data('items');
            if (!jQuery.isArray(items)){
                items = getDeviceValue( $(this), 'list' );
                if (items){
                    if ($(this).data('list')=='setList'){
                        var setreading = ($(this).data('set')=='')?'state':$(this).data('set');
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
            }
            var select_elem = $(this).find('select')
            if (items) {
                if (select_elem){
                    select_elem.empty();
                    for (var i=0;i<items.length;i++) {
                        select_elem.append('<option value="'+items[i]+'">'+(alias && alias[i]||items[i])+'</option>');
                    }
                }
            }
            if (state && select_elem)
                select_elem.val(state);
        }
    });
   }

});
