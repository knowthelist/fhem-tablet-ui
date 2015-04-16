var widget_select = {
  _select: null,
  elements: null,
  init: function () {
    _select=this;
    _select.elements = $('div[data-type="select"]');
    _select.elements.each(function(index) {

        var device = $(this).data('device');
        $(this).data('get', $(this).data('get') || 'STATE');
        $(this).data('set', $(this).data('set') || ($(this).data('get')!='STATE')?$(this).attr('data-get'): '');
        $(this).data('cmd', $(this).data('cmd') || 'set');
        $(this).data('list', $(this).data('list') || 'setList');

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
        if ( $(this).data('get')==par || $(this).data('list')==par){
			var state = getDeviceValue( $(this), 'get' );
            var items = $(this).data('items')
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
                        select_elem.append('<option value='+items[i]+'>'+items[i]+'</option>');
                    }
                }
            }
            if (state && select_elem)
                select_elem.val(state);
		}
	});
   }
			 
};
