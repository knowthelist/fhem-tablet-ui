if(typeof widget_widget == 'undefined') {
    dynamicload('js/widget_widget.js');
}

var widget_level= {
  elements: null,
  init: function () {

    if (!$.fn.Powerange){
      dynamicload('lib/powerange.js', null, null, false);
      $('head').append('<link rel="stylesheet" href="'+ dir + '/../lib/powerange.min.css" type="text/css" />');
    }

    this.elements = $('div[data-type="level"]');
    this.elements.each(function(index) {

        var elem = $(this);
        elem.initData('get'             ,'STATE');
        elem.initData('on'              ,'on');
        elem.initData('off'             ,'off');
        elem.initData('part'            ,-1);

        elem.addReading('get');

        var input_elem =  jQuery('<input/>', {
			type: 'text',
		}).appendTo($(this));

        var pwrng = new Powerange(input_elem[0], {
            vertical: !elem.hasClass('horizontal'),
            hideRange: false,
            'min': elem.data('min') || 0,
            'max': elem.data('max') || 100,
            klass: elem.hasClass('horizontal')?'level_horizontal':'level_vertical',
		});
        elem.data('Powerange',pwrng);

        if (elem.hasClass('horizontal')){
            if (elem.data('width')) {
                elem.css({'width': $(this).data('width')+'px','max-width': elem.data('width')+'px','height':'0px'});
            } else {
                if (elem.hasClass('mini'))
                    elem.css({'width': '60px','max-width': '60px','height':'0px'});
                else
                    elem.css({'width': '120px','max-width': '120px','height':'0px'});
            }
            if (elem.data('height')) {
                elem.children().find('.range-bar').css({'height': elem.data('height')+'px',
                                                           'max-height': elem.data('height')+'px',
                                                           'top': '-'+elem.data('height')/2+'px',
                                                          });
            }
        }
        else {
            if (elem.data('height')) {
                elem.css({'height': elem.data('height')+'px','max-height': elem.data('height')+'px'});
            } else {
                if (elem.hasClass('mini'))
                    elem.css({'height': '60px','max-height': '60px'});
                else
                    elem.css({'height': '120px','max-height': '120px'});
            }
            if (elem.data('width')) {
                elem.children().find('.range-bar').css({'width': elem.data('width')+'px',
                                                           'max-width': elem.data('width')+'px',
                                                           'left': '-'+elem.data('width')/4+'px',
                                                          });
            }
        }

        elem.addClass(pwrng.options.klass);
        elem.children().find('.range-handle').css({'visibility':'hidden','width':'0px','height':'0px'});
	 });
  },
  update: function (dev,par) {
      var base = this;
      // update from normal state reading
      this.elements.filterDeviceReading('get',dev,par)
      .each(function(index) {
          var elem = $(this);
          var state = elem.getReading('get').val;
            if (state) {
                var pwrng = elem.data('Powerange');
                var input_elem = elem.find('input');
                var part = elem.data('part');
                var val = getPart(state, part);
                if (val==elem.data('off')) val=pwrng.options.min;
                if (val==elem.data('on')) val=pwrng.options.max;
                if ($.isNumeric(val) && pwrng) {

                    var v = elem.hasClass('negated')
                            ? pwrng.options.max + pwrng.options.min - parseInt(val)
                            : parseInt(val);
                    if ( elem.hasClass('nodelay') ) {
                        pwrng.setStart(parseInt(v));
                    } else {
                      // hack for this.slider.offsetHeight=0 issue
                      setTimeout(function(){
                          pwrng.setStart(parseInt(v));
                      }, 250);
                    }

                    //set colors according matches for values
                    var limits=elem.data('limits');
                    if (limits) {
                        var colors=elem.data('colors');

                        // if data-colors isn't set, try using #505050 instead
                        if(typeof colors == 'undefined') {
                            colors = new Array('#505050');
                        }

                        // fill up colors and icons to states.length
                        // if an index s isn't set, use the value of s-1
                        for(var s=0,len=limits.length; s<len; s++) {
                            if(typeof colors[s] == 'undefined') {
                                colors[s]=colors[s>0?s-1:0];
                            }
                        }

                        var idx=indexOfGeneric(limits,val);
                        if (idx>-1){
                            elem.children().find('.range-quantity').css( "background-color", colors[idx] );
                        }
                    }
                }
                input_elem.css({visibility:'visible'});
            }
    });
   }

};
