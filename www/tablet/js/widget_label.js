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

                //set colors according matches for values
                var limits=$(this).data('limits');
                if (limits) {
                    var colors=$(this).data('colors');

                    // if data-colors isn't set, try using #505050 instead
                    if(typeof colors == 'undefined') {
                        colors = new Array('#505050');
                    }

                    // fill up colors and icons to states.length
                    // if an index s isn't set, use the value of s-1
                    for(var s=0; s<limits.length; s++) {
                        if(typeof colors[s] == 'undefined') {
                            colors[s]=colors[s>0?s-1:0];
                        }
                    }

                    var idx=indexOfGeneric(limits,val);
                    console.log('idx',idx,val);
                    if (idx>-1){
                        $(this).css( "color", colors[idx] );
                    }
                }
			 }
		}

	});
   }
			 
};
