var widget_template = {
  _template: null,
  elements: null,
  init: function () {
  	_template=this;
  	_template.elements = $('div[data-type="template"]');
 	_template.elements.each(function(index) {
 		var device = $(this).data('device');
   		// Init the widget here
	 });
  },
  update: function (dev,par) {

    var deviceElements= _template.elements.filter('div[data-device="'+dev+'"]');
	deviceElements.each(function(index) {
        if ( $(this).data('get')==par){
			
			var value = getDeviceValue( $(this), 'get' );
			if (value){
				// Update the widget here
			 }
		}
	});
   }
			 
};
