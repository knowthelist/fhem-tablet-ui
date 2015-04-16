var widget_symbol = {
  _symbol: null,
  elements: null,
  init: function () {
  	_symbol=this;
  	_symbol.elements = $('div[data-type="symbol"]');
 	_symbol.elements.each(function(index) {

		var elem = $(this).famultibutton({
            icon: ( jQuery.isArray($(this).data('icons')) )?$(this).data('icons')[0]:'fa-windows',
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
		$(this).data('get-on', $(this).data('get-on') || $(this).data('on') || 'open');
		$(this).data('get-off', $(this).data('get-off') || $(this).data('off') || 'closed');
		readings[$(this).data('get')] = true;
	 });
  },
  update: function (dev,par) {

    var deviceElements= _symbol.elements.filter('div[data-device="'+dev+'"]');
	deviceElements.each(function(index) {
        if ( $(this).data('get')==par){
			var state = getDeviceValue( $(this), 'get' );
			if (state) {
				var states=$(this).data('get-on');
				if ( jQuery.isArray(states)){
					var icons=$(this).data('icons');
					var colors=$(this).data('on-colors');
					
					if (icons && colors && states
						 && icons.length == colors.length && icons.length == states.length )
						 {
						 var elm=$(this).children().last();
						 var idx=states.indexOf(state);
						 if (idx>-1){ 	elm.removeClass()
						 	.addClass('fa fa-stack-1x')
						 	.addClass(icons[idx])
						 	.css( "color", colors[idx] );
						 }
					}
				}
				else{
					if ( state == $(this).data('get-on') )
						$(this).data('famultibutton').setOn();
					else if ( state == $(this).data('get-off') )
						$(this).data('famultibutton').setOff();
					else if ( state.match(RegExp('^' + $(this).data('get-on') + '$')) )
						$(this).data('famultibutton').setOn();
					else if ( state.match(RegExp('^' + $(this).data('get-off') + '$')) )
						$(this).data('famultibutton').setOff();
					else if ( $(this).data('get-off')=='!on' && state != $(this).data('get-on') )
						$(this).data('famultibutton').setOff();
				}
			}
		}
	});
   }
			 
};
