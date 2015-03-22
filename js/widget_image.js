var widget_image = {
  _image: null,
  elements: null,
  init: function () {
  	_image=this;
  	_image.elements = $('div[data-type="image"]');
 	_image.elements.each(function(index) {
		var elem =  jQuery('<img/>', {
				alt: 'img',
			}).appendTo($(this));
		elem.css({'opacity': 0.8,
				'height':'auto',
				'width': '100%',
				'max-width': $(this).data('size') || '50%',
		});
	});
  },
  update: function (dev,par) {

	var deviceElements;
	if ( dev == '*' )
		deviceElements= _image.elements;
	else
   		deviceElements= _image.elements.filter('div[data-device="'+dev+'"]');

	deviceElements.each(function(index,elem) {
		if ( $(this).data('get')==par || par =='*'){	
			var value = getDeviceValue( $(this), 'get' );
			if (value){
				var img = $(this).find('img');
				if (img)
					img.attr('src',value );
			 }
		}
	});
   }
			 
};