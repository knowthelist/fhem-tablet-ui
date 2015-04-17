var widget_image = {
  _image: null,
  elements: null,
  init: function () {
  	_image=this;
  	_image.elements = $('div[data-type="image"]');
 	_image.elements.each(function(index) {
 	
	 	$(this).data('get', $(this).data('get') || 'STATE');
	 	readings[$(this).data('get')] = true;
		var elem =  jQuery('<img/>', {
				alt: 'img',
			}).appendTo($(this));
		elem.css({'opacity': 0.8,
				'height':'auto',
				'width': '100%',
				'max-width': $(this).data('size') || '50%',
		});

        //3rd party source refresh
        if ($(this).data('url')){
            var counter=0;
            var url=$(this).data('url');
            var refresh=$(this).data('refresh') || 15 * 60;
            elem.attr('src', url );
            setInterval(function() {
               counter++;
               if(counter == refresh) {
                 counter = 0;
                 elem.attr('src',url);
               }
             }, 1000);
         }
	});
  },
  update: function (dev,par) {

    var deviceElements = _image.elements.filter('div[data-device="'+dev+'"]');
    deviceElements.each(function(index) {
        var img = $(this).find('img');
        if ( $(this).data('get')==par){
			var value = getDeviceValue( $(this), 'get' );
            if (img && value){
                    img.attr('src',value );
            }
        }
	});
   }
			 
};
