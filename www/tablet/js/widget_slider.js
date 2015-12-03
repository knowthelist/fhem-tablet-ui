var widget_slider = {
  _slider: null,
  elements: null,
  init: function () {

    if (!$.fn.Powerange){
        dynamicload('lib/powerange.min.js', null, null, false);
        $('head').append('<link rel="stylesheet" href="'+ dir + '/../lib/powerange.min.css" type="text/css" />');
    }
    _slider=this;
    _slider.elements = $('div[data-type="slider"]');
    _slider.elements.each(function(index) {

        var device = $(this).data('device');
        $(this).data('get', $(this).data('get') || 'STATE');
        $(this).data('set', $(this).data('set') || '');
        $(this).data('cmd', $(this).data('cmd') || 'set');
        $(this).data('on', $(this).data('on') || 'on');
        $(this).data('off', $(this).data('off') || 'off');
        $(this).data('set-value', $(this).data('set-value') || '$v');
        $(this).data('width', $(this).data('width'));
        $(this).data('height', $(this).data('height'));
        $(this).data('get-value',   $(this).data('get-value') || $(this).data('part') || -1);

        readings[$(this).data('get')] = true;
        //ToDo: more data parameter: color etc.
        $(this).data('value', $(this).data('value') || false );


        var storeval = localStorage.getItem("slider_"+device);
        storeval = (storeval)?storeval:'5';
        var elem =  jQuery('<input/>', {
            type: 'text',
        }).appendTo($(this));

        if ( $(this).data('value') ) {
          var lbl =  jQuery('<div/>', {
              id : 'slidervalue',
              class : 'slidertext normal',
          }).appendTo($(this));
        }

        $(this).data('selection',0);
        var pwrng = new Powerange(elem[0], {
            vertical: !$(this).hasClass('horizontal'),
            'min': $(this).data('min') || 0,
            'max': $(this).data('max') || 100,
            'tap': $(this).hasClass('tap') || false,
            klass: $(this).hasClass('horizontal')?'slider_horizontal':'slider_vertical',
            callback: (function() {
              var pwrng = $(this).data('Powerange');
              var selMode = $(this).data('selection');
              var v = 0, sliVal = 0;
              var isunsel = 1;
              if ( pwrng ) {
                isunsel = $( pwrng.slider ).hasClass('unselectable');
                if ( isunsel ) {
                  $(this).data('selection',1);
                }
                sliVal = pwrng.element.value;
                v = $(this).hasClass('negated')? pwrng.options.max + pwrng.options.min - sliVal:sliVal;
              }

              if ( $(this).data('value') ) {
                $(this).find( '#slidervalue' ).text( v );
              }

              // isunsel == false (0) means drag is over
              if ( ( ! isunsel ) && ( selMode ) ) {
                var device = $(this).data('device');
                v = $(this).data('set-value').replace('$v',v.toString());
                var cmdl = [$(this).data('cmd'),device,$(this).data('set'),v].join(' ');

                // write visible value (from pwrng) to local storage NOT the fhem exposed value)
                localStorage.setItem("slider_"+device, sliVal);
                setFhemStatus(cmdl);
                TOAST && $.toast(cmdl);

                $(this).data('selection',0);

              }
              }).bind(this),
        });
        $(this).data('Powerange',pwrng);

        if ($(this).hasClass('negated')){
          var rangeQuantity = $(this).find('.range-quantity');
          var rangeBar = $(this).find('.range-bar');
          var rangeBarColor = rangeBar.css('background-color');
          rangeBar.css({'background-color':rangeQuantity.css('background-color')});
          rangeQuantity.css({'background-color':rangeBarColor});
        }

        localStorage.setItem("slider_"+device, storeval );

        if ($(this).hasClass('horizontal')){
            if ($(this).data('width')) {
                $(this).css({'width': $(this).data('width')+'px','max-width': $(this).data('width')+'px','height':'0px'});
            } else {
                if ($(this).hasClass('mini'))
                    $(this).css({'width': '60px','max-width': '60px','height':'0px'});
                else
                    $(this).css({'width': '120px','max-width': '120px','height':'0px'});
            }
            if ($(this).data('height')) {
                $(this).children().find('.range-bar').css({'height': $(this).data('height')+'px',
                                                           'max-height': $(this).data('height')+'px',
                                                           'top': '-'+$(this).data('height')/2+'px',
                                                          });
            }
        }
        else {
            if ($(this).data('height')) {
                $(this).css({'height': $(this).data('height')+'px','max-height': $(this).data('height')+'px'});
            } else {
                if ($(this).hasClass('mini'))
                    $(this).css({'height': '60px','max-height': '60px'});
                else
                    $(this).css({'height': '120px','max-height': '120px'});
            }
            if ($(this).data('width')) {
                $(this).children().find('.range-bar').css({'width': $(this).data('width')+'px',
                                                           'max-width': $(this).data('width')+'px',
                                                           'left': '-'+$(this).data('width')/4+'px',
                                                          });
            }
        }

       if ($(this).hasClass('readonly'))
            $(this).children().find('.range-handle').css({'visibility':'hidden'});


        $(this).addClass(pwrng.options.klass);
        pwrng.setStart(storeval);
     });
  },
  update: function (dev,par) {

    var deviceElements= _slider.elements.filter('div[data-device="'+dev+'"]');
    deviceElements.each(function(index) {

    if ( $(this).data('get')==par){

            var lstate = getDeviceValue( $(this), 'get' );
            if (lstate) {
                var pwrng = $(this).data('Powerange');
                var elem = $(this).find('input');
                var part = $(this).data('get-value');
                var nstate = getPart(lstate, part);
                var tstate = nstate;
                if ( new RegExp('^' + $(this).data('on') + '$').test( nstate.toString() ) )
                    nstate=pwrng.options.max;
                if ( new RegExp('^' + $(this).data('off') + '$').test( nstate.toString() ) )
                    nstate=pwrng.options.min;
                if ($.isNumeric(nstate) && elem) {
                    var v = $(this).hasClass('negated')
                            ? pwrng.options.max + pwrng.options.min - parseInt(nstate)
                            : parseInt(nstate);
                    // hack for this.slider.offsetHeight=0 issue
                    setTimeout(function(){
                        pwrng.setStart(parseInt(v));
                    }, 250);
                    localStorage.setItem("slider_"+dev, v);
                    DEBUG && console.log( 'slider dev:'+dev+' par:'+par+' changed to:'+v );
                }
                if ( $(this).data('value') ) {
                    var slidervalue = $(this).find( '#slidervalue' );
                    if (slidervalue){
                        if ( $(this).hasClass('textvalue') ) {
                          slidervalue.text( tstate );
                        } else {
                          slidervalue.text( nstate );
                        }
                    }
                }
                elem.css({visibility:'visible'});
            }
        }
    });
   }

};
