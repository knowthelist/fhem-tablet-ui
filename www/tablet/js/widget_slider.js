var widget_slider = {
  _slider: null,
  elements: null,
  init: function () {
  	_slider=this;
  	_slider.elements = $('div[data-type="slider"]');
 	_slider.elements.each(function(index) {

		var device = $(this).data('device');
		$(this).data('get', $(this).data('get') || 'STATE');
		$(this).data('set', $(this).data('set') || '');
		$(this).data('cmd', $(this).data('cmd') || 'set');
        $(this).data('on', $(this).data('on') || 'on');
        $(this).data('off', $(this).data('off') || 'off');
		readings[$(this).data('get')] = true;
		//ToDo: more data parameter: color etc. 
		
		var storeval = localStorage.getItem("slider_"+device);
		var elem =  jQuery('<input/>', {
			type: 'text',
		}).appendTo($(this));

		var pwrng = new Powerange(elem[0], { 
            vertical: !$(this).hasClass('horizontal'),
			hideRange: true,
			'min': $(this).data('min') || 0,
			'max': $(this).data('max') || 100,
            klass: $(this).hasClass('horizontal')?'slider_horizontal':'slider_vertical',
			start: (storeval)?storeval:'5',
		});
		$(this).data('Powerange',pwrng);

        if ($(this).hasClass('mini'))
            $(this).css({'height': '60px','max-height': '60px'})
        else
            $(this).css({'height': '100px','max-height': '100px'});

		var releaseEventType=((document.ontouchend!==null)?'mouseup':'touchend');

		$(this).bind(releaseEventType, function(e) {
			var v = $(this).find('input').val();
			var cmdl = $(this).data('cmd')+' '+device+' '+$(this).data('set')+' '+v;
			setFhemStatus(cmdl);
			$.toast(cmdl);
			e.preventDefault();
		});
		
        $(this).addClass(pwrng.options.klass);

	 });
  },
  update: function (dev,par) {

    var deviceElements= _slider.elements.filter('div[data-device="'+dev+'"]');
	deviceElements.each(function(index) {

        if ( $(this).data('get')==par){

			var state = getDeviceValue( $(this), 'get' );
			if (state) {
                var pwrng = $(this).data('Powerange');
				var elem = $(this).find('input');
                if (state==$(this).data('off')) state=pwrng.options.min;
                if (state==$(this).data('on')) state=pwrng.options.max;
				if ($.isNumeric(state) && elem) {
					pwrng.setStart(parseInt(state));
					DEBUG && console.log( 'slider dev:'+dev+' par:'+par+' changed to:'+state );
				}
				elem.css({visibility:'visible'});
			}
		}
	});
   }
			 
};
