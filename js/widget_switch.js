var widget_switch = {
  _switch: null,
  elements: null,
  init: function () {
  	_switch=this;
  	_switch.elements = $('div[data-type="switch"]');
 	_switch.elements.each(function(index) {

		var device = $(this).data('device');
		$(this).data('get', $(this).data('get') || 'STATE');
		$(this).data('get-on', $(this).attr('data-get-on') || $(this).attr('data-on') || 'on');
		$(this).data('get-off', $(this).attr('data-get-off') || $(this).attr('data-off') || 'off');
		$(this).data('set-on', $(this).attr('data-set-on') || $(this).data('get-on'));
		$(this).data('set-off', $(this).attr('data-set-off') || $(this).data('get-off'));
		var elem = $(this).famultibutton({
			icon: 'fa-lightbulb-o',
			backgroundIcon: 'fa-circle',
			offColor: '#2A2A2A',
			onColor: '#2A2A2A',
			
			// Called in toggle on state.
			toggleOn: function( ) {
				 setFhemStatus(device,$(this).data('set-on'));
			},
			toggleOff: function( ) {
				 setFhemStatus(device,$(this).data('set-off'));
			},
		});
	 });
  },
  update: function (dev,par) {

	var deviceElements;
	if ( dev == '*' )
		deviceElements= _switch.elements;
	else
   		deviceElements= _switch.elements.filter('div[data-device="'+dev+'"]');

	deviceElements.each(function(index) {
		if ( $(this).data('get')==par || par =='*'){	
			var state = getDeviceValue( $(this), 'get' );
			if (state) {
				if ( state == $(this).data('get-on') )
					$(this).data('famultibutton').setOn();
				else if ( state == $(this).data('get-off') )
					$(this).data('famultibutton').setOff();
				else if ( state.match(RegExp('^' + $(this).data('get-on') + '$')) )
					$(this).data('famultibutton').setOn();
				else if ( state.match(RegExp('^' + $(this).data('get-off') + '$')) )
					$(this).data('famultibutton').setOff();
			}
		}
	});
   }
			 
};