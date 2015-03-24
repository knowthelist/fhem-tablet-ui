var widget_label = {
  _label: null,
  elements: null,
  weathermap: {"heiter":"H","wolkig":"N","Regenschauer":"Q","stark bewoelkt":"Y","Regen":"R","bedeckt":"N","sonnig":"B","Schnee":"U"},
  init: function () {
  	_label=this;
  	_label.elements = $('div[data-type="label"]');
 	_label.elements.each(function(index) {
   		$(this).data('get', $(this).data('get') || 'STATE');
   		readings[$(this).data('get')] = true;
	 });
  },
  update: function (dev,par) {

	var deviceElements;
	if ( dev == '*' )
		deviceElements= _label.elements;
	else
   		deviceElements= _label.elements.filter('div[data-device="'+dev+'"]');

	deviceElements.each(function(index) {
	 	if ( $(this).data('get')==par || par =='*'){
			var value = getDeviceValue( $(this), 'get' );
			if (value){
				var part =  $(this).data('part') || -1;
				var unit = ($(this).data('unit')) ? unescape($(this).data('unit')) : '';
				var fix =  $(this).data('fix');
				fix = ( $.isNumeric(fix) ) ? fix : -1;
				var val = getPart(value,part);
				val = ( $.isNumeric(val)  && fix>=0 ) ? Number(val).toFixed(fix) : val;

				if ($(this).hasClass('weather')){
					//wheater icons
					$(this).html('');
					$(this).attr('data-icon',_label.weathermap[val]);
					DEBUG && console.log('Label weather icon:'+ _label.weathermap[val]);
					}
				else
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