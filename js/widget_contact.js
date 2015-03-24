var widget_contact = {
  _contact: null,
  elements: null,
  init: function () {
  	_contact=this;
  	_contact.elements = $('div[data-type="contact"]');
 	_contact.elements.each(function(index) {

		var elem = $(this).famultibutton({
			icon: 'fa-windows',
			backgroundIcon: null,
			onColor: '#aa6900',
			onBackgroundColor: '#aa6900',
			offColor: '#505050',
			offBackgroundColor: '#505050',
			mode: 'signal',  //toggle, push, ,
		});
		elem.data('famultibutton',elem);
		//default reading parameter name
		$(this).data('get', $(this).data('get') || 'STATE');
		$(this).data('get-on', $(this).attr('data-get-on') || $(this).attr('data-on') || 'open');
		$(this).data('get-off', $(this).attr('data-get-off') || $(this).attr('data-off') || 'closed');
		readings[$(this).data('get')] = true;
	 });
  },
  update: function (dev,par) {

	var deviceElements;
	if ( dev == '*' )
		deviceElements= _contact.elements;
	else
   		deviceElements= _contact.elements.filter('div[data-device="'+dev+'"]');

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