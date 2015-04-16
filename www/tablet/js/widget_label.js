var widget_label = {
  _label: null,
  elements: null,
  init: function () {
  	_label=this;
  	_label.elements = $('div[data-type="label"]');
 	_label.elements.each(function(index) {
   		$(this).data('get', $(this).data('get') || 'STATE');
   		readings[$(this).data('get')] = true;
	 });
  },
  update: function (dev,par) {

    var deviceElements= _label.elements.filter('div[data-device="'+dev+'"]');
	deviceElements.each(function(index) {
        if ( $(this).data('get')==par){
            var value = ($(this).hasClass('timestamp'))
                        ?getReadingDate( $(this), 'get' )
                        :getDeviceValue( $(this), 'get' );
			if (value){
				var part =  $(this).data('part') || -1;
				var unit = ($(this).data('unit')) ? unescape($(this).data('unit')) : '';
				var fix =  $(this).data('fix');
				fix = ( $.isNumeric(fix) ) ? fix : -1;
				var val = getPart(value,part);
				val = ( $.isNumeric(val)  && fix>=0 ) ? Number(val).toFixed(fix) : val;

				$(this).html( val + "<span style='font-size: 50%;'>"+unit+"</span>" );

				//set colors according limits for numeric values
				if ($.isNumeric(val)){
					var limits=$(this).data('limits');
					var colors=$(this).data('colors');
					if (limits && colors && limits.length == colors.length){
						for (var i=0;i<limits.length;i++) {
							if (val>limits[i])
								$(this).css("color", colors[i]);
						}
					}
				}
			 }
		}

	});
   }
			 
};
