/*!jQuery FA multi button*/
/**
* Modern toggle, push button or just a signal indicator
*
* Version: 1.0.1
* Requires: jQuery v1.7+
*
* Copyright (c) 2015 Mario Stephan
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* Thanks to phoxoey
*/
(function ( $ ) {
		
$.fn.famultibutton = function(pOptions) {
		
	if (this.length > 1){
		this.each(function() { $(this).famultibutton(pOptions) });
		return this;
	}
	
	// private variables;
	var elem = this;
	var state = false;
	
	// setup options
	var defaultOptions = {
		backgroundIcon: 'fa-circle',
		classes: ['fa-2x'],
		icon: 'fa-power-off',
		offColor: '#2A2A2A',
		offBackgroundColor: '#505050',
		onColor: '#2A2A2A',
		onBackgroundColor: '#aa6900',
		mode: 'toggle',  //toggle, push, signal,
		toggleOn: null,
		toggleOff: null
	};
	
	var options = $.extend({}, defaultOptions, pOptions);
	
	// private functions;
	var intialize = function() {

		options = $.extend({}, options, elem.data());
		
		elem.addClass('fa-stack');
		
		jQuery('<i/>', {
			id: 'bg',
			class: 'fa fa-stack-2x'
		}).addClass(options['backgroundIcon'])
		.appendTo(elem);

		jQuery('<i/>', {
			id: 'fg',
			class: 'fa fa-stack-1x'
		}).addClass(options['icon']).appendTo(elem);
		
		if(options['classes'] && options['classes'].length > 0){
		   for(var i=0;i<options['classes'].length;i++){
				elem.addClass(options['classes'][i]);
		   }
		}

		setOff();
			
return elem;
};

	function setOn() {

			state = true;
			
		  	elem.children().first().css( "color", options['onBackgroundColor'] );
		  	elem.children().last().css( "color", options['onColor'] );
	};
		
	function setOff() {
			
			state = false;

			elem.children().first().css( "color", options['offBackgroundColor'] );
			elem.children().last().css( "color", options['offColor'] );
	};
	
	function fadeOff() {
			
			if(state){
			
				state = false;
	
				$( '<div />' ).animate({ 'width' : 100 }, {
					duration : 700,
					easing : 'swing',
					// Fade the colors in the step function
					step : function( now, fx ) {
					var completion = ( now - fx.start ) / ( fx.end - fx.start );
					elem.children().first().css( 'color', getGradientColor(
						options['onBackgroundColor'],
						options['offBackgroundColor'],
						completion));
					elem.children().last().css( 'color', getGradientColor(
						options['onColor'],
						options['offColor'],
						completion));
					}, 
				});
			}
	};
	
	// helper function for color fade out
	getGradientColor = function(start_color, end_color, percent) {
	   // strip the leading # if it's there
	   start_color = start_color.replace(/^\s*#|\s*$/g, '');
	   end_color = end_color.replace(/^\s*#|\s*$/g, '');
	
	   // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
	   if(start_color.length == 3){
		 start_color = start_color.replace(/(.)/g, '$1$1');
	   }
	
	   if(end_color.length == 3){
		 end_color = end_color.replace(/(.)/g, '$1$1');
	   }
	
	   // get colors
	   var start_red = parseInt(start_color.substr(0, 2), 16),
		   start_green = parseInt(start_color.substr(2, 2), 16),
		   start_blue = parseInt(start_color.substr(4, 2), 16);
	
	   var end_red = parseInt(end_color.substr(0, 2), 16),
		   end_green = parseInt(end_color.substr(2, 2), 16),
		   end_blue = parseInt(end_color.substr(4, 2), 16);
	
	   // calculate new color
	   var diff_red = end_red - start_red;
	   var diff_green = end_green - start_green;
	   var diff_blue = end_blue - start_blue;
	
	   diff_red = ( (diff_red * percent) + start_red ).toString(16).split('.')[0];
	   diff_green = ( (diff_green * percent) + start_green ).toString(16).split('.')[0];
	   diff_blue = ( (diff_blue * percent) + start_blue ).toString(16).split('.')[0];
	
	   // ensure 2 digits by color
	   if( diff_red.length == 1 )
		 diff_red = '0' + diff_red
	
	   if( diff_green.length == 1 )
		 diff_green = '0' + diff_green
	
	   if( diff_blue.length == 1 )
		 diff_blue = '0' + diff_blue
	
	   return '#' + diff_red + diff_green + diff_blue;
	 };
	 
	if (options['mode'] == 'push'){ 
		var clickEventType=((document.ontouchstart!==null)?'mousedown':'touchstart');
		var releaseEventType=((document.ontouchend!==null)?'mouseup':'touchend');
		var leaveEventType=((document.ontouchleave!==null)?'mouseout':'touchleave');
		this.bind(clickEventType, function(e) {
	
			setOn(); 

			if(typeof options['toggleOn'] === 'function'){
				options['toggleOn'].call(this);
			}
			e.preventDefault();
		});
		this.bind(releaseEventType, function(e) {
		
			fadeOff(); 
			e.preventDefault();
		});
		this.bind(leaveEventType, function(e) {
		
			fadeOff(); 
			e.preventDefault();
		});
	}
	else if (options['mode'] == 'toggle'){ 
		var clickEventType=((document.ontouchstart!==null)?'click':'touchstart');
		this.bind(clickEventType, function(e) {

				if(state){
				
					setOff();	
					if(typeof options['toggleOff'] === 'function'){
						options['toggleOff'](this);
					}
				}else{
				
					setOn(); 
					if(typeof options['toggleOn'] === 'function'){
						options['toggleOn'].call(this);
					}
				}
				e.preventDefault();
		});
	}
	
	// public functions;
	this.setOn = function() {
		setOn();	
	};
	this.setOff = function() {
		setOff();	
	};
	this.getState = function() {
		return state;
	};
	
		
return intialize();
}
})( jQuery );


				



			

			
