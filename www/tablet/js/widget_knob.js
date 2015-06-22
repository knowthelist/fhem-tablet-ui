if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_knob = $.extend({}, widget_widget, {
    widgetname : 'knob',
    isUpdating : false,
    init_attr: function(elem) {
        elem.data('get', elem.data('get') || 'STATE');
        readings[elem.data('get')] = true;
        elem.data('set', elem.data('set') || '');
        elem.data('cmd', elem.data('cmd') || 'set');
        
        elem.data('min', elem.data('min') || 0);
        var maxval = elem.data('max') || 100;
        elem.data('max', maxval);
        elem.data('max360', (maxval>360)?360:maxval);
        
        elem.data('height', 1*elem.attr('data-height')||150);
        elem.data('width', 1*elem.attr('data-width')||150);
        if(elem.hasClass('small')) {
            elem.data('height', 100);
            elem.data('width', 100);
        }
        if(elem.hasClass('mini')) {
            elem.data('height', 52);
            elem.data('width', 52);
        }
        
        elem.data('step', 1*elem.data('step') || 1);
        elem.data('angleoffset', elem.data('angleoffset') || -120);
        elem.data('anglearc', elem.data('anglearc') || 240);
        
        elem.data('bgcolor', elem.data('bgcolor') || 'transparent');
        elem.data('fgcolor', elem.data('fgcolor') || '#cccccc');
        elem.data('tkcolor', elem.data('tkcolor') || '#666');
    },
    init: function () {
        var base=this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            var knob_elem =  jQuery('<input/>', {
                type: 'text',
                value: $(this).attr('data-initvalue')||'10',
                disabled : true,
            }).appendTo($(this));
            
            var device = $(this).data('device');
        
            knob_elem.knob({
                'min': $(this).data('min'),
                'max': $(this).data('max360'),
                'lastValue': 0,
                'variance': Math.floor($(this).data('max360') / 5),
                'origmax': $(this).data('max'),
                'height':$(this).data('height'),
                'width':$(this).data('width'),
                'angleOffset': $(this).data('angleoffset'),
                'angleArc': $(this).data('anglearc'),
                'bgColor': $(this).data('bgcolor'),
                'fgColor': $(this).data('fgcolor'),
                'tkColor': $(this).data('tkcolor'),
                'thickness': ($(this).hasClass('mini'))?.45:.25,
                'tickdistance': $(this).data('tickstep'),
                'cursor': 6,
                'touchPosition': 'left',
                'cmd': $(this).data('cmd'),
                'set': $(this).data('set'),
                'draw' : base.drawDial,
                'readOnly' : $(this).hasClass('readonly'),
                'change' : function (v) { 
                      startInterval();
                        if (v > this.o.max - this.o.variance && this.o.lastValue < this.o.min + this.o.variance) {
                            knob_elem.val(this.o.min).change();
                            return false;
                        } else if (v < this.o.min + this.o.variance && this.o.lastValue > this.o.max - this.o.variance) {
                            knob_elem.val(this.o.max).change();
                            return false;
                        }
                        this.o.lastValue = v;
                },
                'release' : function (v) { 
                        if (!isUpdating){
                            //send decimal value
                            v=v*(this.o.origmax/this.o.max);
                            v=v.toFixed(0);
        
                            if(typeof device!='undefined') {
                                var cmdl = [this.o.cmd,device,this.o.set,v].join(' ');
                                setFhemStatus(cmdl);
                                $.toast(cmdl);
                            }
                            this.$.data('curval', v);
                        }
                },   
            });
        });
    },
    update: function (dev,par) {
        var deviceElements;
        var base=this;
        if ( dev == '*' )
            deviceElements= this.elements;
        else
            deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        
        isUpdating=true;
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par || par =='*'){    
                var val = getDeviceValue( $(this), 'get' );
                var knob_elem = $(this).find('input');
                if (val){
                    val = (val * ($(this).data('max360')/$(this).data('max'))).toFixed(0);
                    if ( knob_elem.val() != val ){
                        knob_elem.val( val ).trigger('change');
                        DEBUG && console.log( base.widgetname + ' dev:'+dev+' par:'+par+' change '+$(this).data('device')+':knob to ' +val );
                    }   
                }
                knob_elem.css({visibility:'visible'});
            }
        });
        isUpdating=false;
    }
});
