var widget_level= {
  _level: null,
  elements: null,
  init: function () {
    _level=this;
    _level.elements = $('div[data-type="level"]');
    _level.elements.each(function(index) {

		var device = $(this).data('device');
		$(this).data('get', $(this).data('get') || 'STATE');
        $(this).data('on', $(this).data('on') || 'on');
        $(this).data('off', $(this).data('off') || 'off');
        $(this).data('part',   $(this).data('part')                   || -1);
		readings[$(this).data('get')] = true;

		var elem =  jQuery('<input/>', {
			type: 'text',
		}).appendTo($(this));

		var pwrng = new Powerange(elem[0], { 
            vertical: !$(this).hasClass('horizontal'),
			hideRange: true,
			'min': $(this).data('min') || 0,
			'max': $(this).data('max') || 100,
            klass: $(this).hasClass('horizontal')?'level_horizontal':'level_vertical',
            start: '5',
		});
		$(this).data('Powerange',pwrng);

        if ($(this).hasClass('horizontal')){
            if ($(this).hasClass('mini'))
                $(this).css({'width': '60px','max-width': '60px','height':'0px'})
            else
                $(this).css({'width': '120px','max-width': '120px','height':'0px'});
        }
        else {
            if ($(this).hasClass('mini'))
                $(this).css({'height': '60px','max-height': '60px'})
            else
                $(this).css({'height': '120px','max-height': '120px'});
        }
		
        $(this).addClass(pwrng.options.klass);
        $(this).children().find('.range-handle').css({'visibility':'hidden','width':'0px','height':'0px'});

	 });
  },
  update: function (dev,par) {

    var deviceElements= _level.elements.filter('div[data-device="'+dev+'"]');
	deviceElements.each(function(index) {

        if ( $(this).data('get')==par){

            var value = getDeviceValue( $(this), 'get' );
            if (value) {
                var pwrng = $(this).data('Powerange');
                var elem = $(this).find('input');
                var part = $(this).data('part');
                var val = getPart(value, part);
                if (val==$(this).data('off')) val=pwrng.options.min;
                if (val==$(this).data('on')) val=pwrng.options.max;
                if ($.isNumeric(val) && pwrng) {

                    var v = $(this).hasClass('negated')
                            ? pwrng.options.max + pwrng.options.min - parseInt(val)
                            : parseInt(val);
                    pwrng.setStart(parseInt(v));

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

                        var idx=indexOfGeneric(limits,state);
                        if (idx>-1){
                            $(this).children().find('.range-quantity').css( "background-color", colors[idx] );
                        }
                    }
				}
				elem.css({visibility:'visible'});
			}
		}
	});
   }
			 
};
