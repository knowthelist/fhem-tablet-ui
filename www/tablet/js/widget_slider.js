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

        if ($(this).hasClass('readonly')){
            $(this).children().find('.range-handle').css({'visibility':'hidden'});
        }
        else
        {
            var releaseEventType=((document.ontouchend!==null)?'mouseup':'touchend');
            $(this).bind(releaseEventType, function(e) {
                var v = $(this).find('input').val();
                var cmdl = $(this).data('cmd')+' '+device+' '+$(this).data('set')+' '+v;
                var pwrng = $(this).data('Powerange');
                if (e.touches) e = e.touches[0];

                if (e.target.className !== 'range-handle') {
                    var offset = 0;
                    var parent = pwrng.handle;
                    while (parent = parent.offsetParent)
                      offset += parent.offsetLeft;
                    pwrng.startX = offset - window.scrollX + pwrng.handle.offsetLeft + pwrng.handle.clientWidth / 2;
                    pwrng.handleOffsetX = pwrng.handle.offsetLeft;
                    pwrng.restrictHandleX = pwrng.slider.offsetWidth - pwrng.handle.offsetWidth;
                    pwrng.unselectable(pwrng.slider, true);
                    pwrng.onmousemove(e);
                }
                else{
                    setFhemStatus(cmdl);
                    $.toast(cmdl);
                }
                e.preventDefault();
            });
        }
		
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
