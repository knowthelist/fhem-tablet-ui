var widget_push = {
  _push: null,
  elements: null,
  init: function () {
  	_push=this;
  	_push.elements = $('div[data-type="push"]');
 	_push.elements.each(function(index) {

		var device = $(this).data('device');
		$(this).data('cmd', $(this).data('cmd') || 'set');
		var elem = $(this).famultibutton({
			backgroundIcon: 'fa-circle-thin',
			offColor: '#505050',
			onColor: '#aa6900',
			mode: 'push', 
			
			// Called in toggle on state.
			toggleOn: function( ) {
				var cmd = [$(this).data('cmd'), device, $(this).data('set')].join(' ');
				if(! cmd.match(/^set\s*$/)) {
					setFhemStatus(cmd);
					$.toast(cmd);
				}
			},

	 	 });
	});
  },
  update: function (dev,par) {

	var deviceElements;
	if ( dev == '*' )
		deviceElements= _push.elements;
	else
   		deviceElements= _push.elements.filter('div[data-device="'+dev+'"]');

	deviceElements.each(function(index) {
		if ( $(this).data('get')==par || par =='*'){	
			var value = getDeviceValue( $(this), 'get' );
			if (value){
				var part =  $(this).data('part') || -1;
				var unit = ($(this).data('unit')) ? unescape($(this).data('unit')) : '';
				var fix =  $(this).data('fix');
				fix = ( $.isNumeric(fix) ) ? fix : 1;
				var val = getPart(value,part);
				val = ( $.isNumeric(val) ) ? Number(val).toFixed(fix) : val;
				$(this).html( val + "<span style='font-size: 50%;'>"
													+unit+"</span>" );
			 }
		}
	});
   }
			 
};
