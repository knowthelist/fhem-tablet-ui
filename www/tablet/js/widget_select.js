var widget_select = {
  _select: null,
  elements: null,
  init: function () {
    _select=this;
    _select.elements = $('div[data-type="select"]');
    _select.elements.each(function(index) {

        var device = $(this).data('device');
        $(this).data('get', $(this).data('get') || 'STATE');
        $(this).data('set', $(this).data('set') || '');
        $(this).data('cmd', $(this).data('cmd') || 'set');
        readings[$(this).data('get')] = true;
        readings[$(this).data('list')] = true;

        $(this).addClass('select');
        var select_elem = jQuery('<select/>', { })
        .on('change', function (e) {
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;
            var parent = $(this).parent('div[data-type="select"]');
            $(this).blur();
            var cmdl = [parent.data('cmd'),device,parent.data('set'),valueSelected].join(' ');
            setFhemStatus(cmdl);
            $.toast(cmdl);
        })
        .appendTo($(this));

	 });
  },
  update: function (dev,par) {

	var deviceElements;
	if ( dev == '*' )
        deviceElements= _select.elements;
	else
        deviceElements= _select.elements.filter('div[data-device="'+dev+'"]');

	deviceElements.each(function(index) {  
		if ( $(this).data('get')==par || par =='*'){	
			var state = getDeviceValue( $(this), 'get' );
            var items = $(this).data('items')
            if (!jQuery.isArray(items)){
                items = getDeviceValue( $(this), 'list' );
                if (items)
                    items = items.split(':');
            }
            if (items) {
                var select_elem = $(this).find('select')
                select_elem.empty();
                for (var i=0;i<items.length;i++) {
                    select_elem.append('<option value='+items[i]+'>'+items[i]+'</option>');
                }
            }
            if (state)
                select_elem.val(state);
		}
	});
   }
			 
};
