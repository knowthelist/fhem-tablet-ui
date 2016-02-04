if(typeof widget_widget == 'undefined') {
    dynamicload('js/widget_widget.js');
}

var widget_slider= $.extend({}, widget_widget, {
  widgetname: 'slider',
  init: function () {

    if (!$.fn.Powerange){
        dynamicload('lib/powerange.min.js', null, null, false);
        $('head').append('<link rel="stylesheet" href="'+ dir + '/../lib/powerange.min.css" type="text/css" />');
    }
    var base=this;
    this.elements = $('div[data-type="'+this.widgetname+'"]');
    this.elements.each(function(index) {

        var elem = $(this);

        elem.initData('get'         ,'STATE');
        elem.initData('set'         ,'');
        elem.initData('cmd'         ,'set');
        elem.initData('on'          ,'on');
        elem.initData('off'         ,'off');
        elem.initData('width'       ,null);
        elem.initData('height'      ,null);
        elem.initData('value'       ,false);
        elem.initData('set-value'   ,'$v');
        elem.initData('get-value'   ,elem.data('part') || -1);

        elem.addReading('get');

        var id = elem.data("device")+"_"+elem.data('get');

        var storeval = localStorage.getItem("slider_"+id);
        storeval = (storeval)?storeval:'5';
        var input_elem =  jQuery('<input/>', {
            type: 'text',
        }).appendTo(elem);


        elem.data('selection',0);
        var pwrng = new Powerange(input_elem[0], {
            vertical: !elem.hasClass('horizontal'),
            'min': elem.data('min') || 0,
            'max': elem.data('max') || 100,
            'tap': elem.hasClass('tap') || false,
            klass: elem.hasClass('horizontal')?'slider_horizontal':'slider_vertical',
            callback: (function() {
              var pwrng = elem.data('Powerange');
              var selMode = elem.data('selection');
              var v = 0, sliVal = 0;
              var isunsel = 1;
              if ( pwrng ) {
                isunsel = $( pwrng.slider ).hasClass('unselectable');
                if ( isunsel ) {
                  elem.data('selection',1);
                }
                sliVal = pwrng.element.value;
                v = elem.hasClass('negated')? pwrng.options.max + pwrng.options.min - sliVal:sliVal;
              }

              if ( elem.data('value') ) {
                elem.find( '#slidervalue' ).text( v );
              }

              // isunsel == false (0) means drag is over
              if ( ( ! isunsel ) && ( selMode ) ) {
                v = elem.data('set-value').replace('$v',v.toString());
                if (elem.hasClass('FS20')){
                    v = base.FS20.dimmerValue(v);
                }
                var cmdl = [elem.data('cmd'),elem.data('device'),elem.data('set'),v].join(' ');

                // write visible value (from pwrng) to local storage NOT the fhem exposed value)
                localStorage.setItem("slider_"+id, sliVal);
                setFhemStatus(cmdl);
                TOAST && $.toast(cmdl);

                elem.data('selection',0);

              }
              }).bind(this),
        });
        elem.data('Powerange',pwrng);

        if (elem.hasClass('negated')){
          var rangeQuantity = elem.find('.range-quantity');
          var rangeBar = elem.find('.range-bar');
          var rangeBarColor = rangeBar.css('background-color');
          rangeBar.css({'background-color':rangeQuantity.css('background-color')});
          rangeQuantity.css({'background-color':rangeBarColor});
        }

        localStorage.setItem("slider_"+id, storeval );

        if (elem.hasClass('horizontal')){
            if (elem.data('width')) {
                elem.css({'width': elem.data('width')+'px','max-width': elem.data('width')+'px','height':'0px'});
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

        if ( elem.data('value') ) {
         var lbl =  jQuery('<div/>', {
             id : 'slidervalue',
             class : 'slidertext normal',
         }).appendTo(elem.find('.range-container'));
       }

       if (elem.hasClass('readonly'))
            elem.children().find('.range-handle').css({'visibility':'hidden'});

       elem.addClass(pwrng.options.klass);
       pwrng.setStart(storeval);

       // Refresh slider position after it became visible
       elem.closest('[data-type="popup"]').on("fadein", function(event) {
           var storeval = localStorage.getItem("slider_"+id);
               pwrng.setStart(parseInt(storeval));
       });
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
                var part = elem.data('get-value');
                var nstate = getPart(state, part);
                var tstate = nstate;
                if ( new RegExp('^' + elem.data('on') + '$').test( nstate.toString() ) )
                    nstate=pwrng.options.max;
                if ( new RegExp('^' + elem.data('off') + '$').test( nstate.toString() ) )
                    nstate=pwrng.options.min;
                if ($.isNumeric(nstate) && input_elem) {
                    var v = elem.hasClass('negated')
                            ? pwrng.options.max + pwrng.options.min - parseInt(nstate)
                            : parseInt(nstate);
                    if ( elem.hasClass('nodelay') ) {
                        pwrng.setStart(parseInt(v));
                    } else {
                      // hack for this.slider.offsetHeight=0 issue
                      setTimeout(function(){
                          pwrng.setStart(parseInt(v));
                      }, 250);
                    }
                    localStorage.setItem("slider_"+dev+"_"+par, v);
                    DEBUG && console.log( 'slider dev:'+dev+' par:'+par+' changed to:'+v );
                }
                if ( elem.data('value') ) {
                    var slidervalue = elem.find( '#slidervalue' );
                    if (slidervalue){
                        if ( elem.hasClass('textvalue') ) {
                          slidervalue.text( tstate );
                        } else {
                          slidervalue.text( nstate );
                        }
                    }
                }
                input_elem.css({visibility:'visible'});
            }
    });
   }

});
