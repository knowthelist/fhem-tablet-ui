if(typeof widget_knob == 'undefined') {
    loadplugin('widget_knob');
}

var widget_volume = $.extend({}, widget_knob, {
  widgetname : 'volume',
    drawDial: function () {
  	var c = this.g, // context
	a = this.arc(this.cv), // Arc
	r = 1;

	c.lineWidth = this.lineWidth;
	c.lineCap = this.lineCap;
	if ((this.o.mode>>0) % 2 != 0) {
		this.o.bgColor='hsl('+ this.cv +',50%,50% )';
    } else if ((this.o.mode>>3) % 2 != 0) {
	    var cl=Math.floor(this.cv*(255/this.o.max));
	    this.o.bgColor = 'rgb('+cl+','+cl+','+cl+')';
	}
	if (this.o.bgColor !== "none") {
		c.beginPath();
		c.strokeStyle = this.o.bgColor;
		c.arc(this.xy, this.xy, this.radius, this.endAngle - 0.00001, this.startAngle + 0.00001, true);
		c.stroke();
	}
	
    var tick_w = (2 * Math.PI) / 360;
	var step =  (this.o.max - this.o.min) / this.angleArc;
	var acAngle = ((this.o.isValue - this.o.min) / step) + this.startAngle;
	var dist = this.o.tickdistance || 4;
	
	// draw ticks
	for (tick = this.startAngle; tick < this.endAngle + 0.00001; tick+=tick_w*dist) {
        var i = step * (tick-this.startAngle)+this.o.min;
        var w = tick_w;
		
		c.beginPath();
		
		if ((this.o.mode>>1) % 2 != 0){
			// draw ticks in hue color
			c.strokeStyle = 'hsl('+ i +',50%,50% )';  
		} else if ((this.o.mode>>4) % 2 != 0){
		    var cl=Math.floor(i*(255/this.o.max));
		    c.strokeStyle = 'rgb('+cl+','+cl+','+cl+')';  
	    } else {
			// draw normal ticks
			c.strokeStyle = this.o.tkColor;//'#4477ff';
		}

        // thicker lines every 5 ticks
		if ( Math.round(i*10)/10 % 5 == 0 ){ 
            w = tick_w*2.2;
			w *= (c.strokeStyle != this.o.tkColor) ? 1.5 : 1; 
		}
		else {
			w *= (c.strokeStyle != this.o.tkColor) ? 2 : 1;
		}
			
        c.arc( this.xy, this.xy, this.radius, tick, tick+w , false);
		c.stroke();
	}

	// draw selection cursor
	c.beginPath();
	if ((this.o.mode>>2) % 2 != 0) {
		this.o.hdColor='hsl('+ this.cv +',50%,50% )';
	} else if ((this.o.mode>>5) % 2 != 0) {
	    var cl=Math.floor(this.cv*(255/this.o.max));
        this.o.hdColor = 'rgb('+cl+','+cl+','+cl+')';  
	}
		
	c.strokeStyle = this.o.hdColor;
	c.lineWidth = this.lineWidth * 2;
	c.arc(this.xy, this.xy, this.radius-this.lineWidth/2, a.s, a.e, a.d);
	c.stroke();

  return false;
  },
  init: function () {
    var base=this;
    this.elements = $('div[data-type="'+this.widgetname+'"]');
 	this.elements.each(function(index) {
		var maxval = $(this).data('max') || 70;
	    $(this).data('max', maxval);
	    $(this).data('max360', (maxval>360)?360:maxval);
        $(this).data('fgcolor', $(this).data('fgcolor') || getStyle('.volume.fgcolor','color') || '#ccc');
        $(this).data('part',    $(this).data('part')                   || -1);

		base.init_attr($(this));
		var knob_elem =  jQuery('<input/>', {
			type: 'text',
			value: $(this).attr('data-initvalue')||'10',
			disabled : true,
		}).appendTo($(this));
		
		var device = $(this).data('device');
		
		var mode=0; //no hue colors
        var hdDefaultColor=getStyle('.volume.hdcolor','color') || '#aa6900';
		if ($(this).hasClass('hue-back')){
			mode = mode | 1<<0;
			hdDefaultColor='#cccccc'; 
		}
		if ($(this).hasClass('hue-tick')){
			mode = mode | 1<<1; 
			hdDefaultColor='#bbbbbb';
		}
		if ( $(this).hasClass('hue-front')){
			mode = mode | 1<<2; 
		}
		
		if ($(this).hasClass('dim-back')){
			mode = mode | 1<<3;
		}
		if ($(this).hasClass('dim-tick')){
			mode = mode | 1<<4; 
		}
		if ( $(this).hasClass('dim-front')){
			mode = mode | 1<<5; 
		}
        if ( $(this).hasClass('rgb')){
            mode = mode | 1<<6;
        }
        $(this).data('mode',mode);

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
			'hdColor': $(this).data('hdcolor') || hdDefaultColor,
            'thickness': ($(this).hasClass('mini'))?.45:.25,
			'tickdistance': $(this).data('tickstep') || (((mode>>1) % 2 != 0)?4:20),
			'mode': mode,
			'cursor': 6,
            'touchPosition': 'left',
			'cmd': $(this).data('cmd'),
			'set': $(this).data('set'),
            'draw' : widget_volume.drawDial,
			'readOnly' : $(this).hasClass('readonly'),
			'change' : function (v) { 
                  startPollInterval();
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
                        if ((this.o.mode>>6) % 2 != 0){
                            //send hex rbg value
                            v=widget_knob.hslToRgb(v/this.o.max,1.0,0.5);
                        }
                        else{
                           //send decimal value
                           v=v*(this.o.origmax/this.o.max);
                           v=v.toFixed(0);
                        }
				  		if(typeof device!='undefined') {
                            var cmdl = [this.o.cmd,device,this.o.set,v].join(' ');
			  				setFhemStatus(cmdl);
			  				$.toast(cmdl);
				  		}
				  		this.$.data('curval', v);
				  }
			}	
        });
     });
  },
  update: function (dev,par) {

    var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
    isUpdating=true;
    deviceElements.each(function(index) {

        if ( $(this).data('get')==par){
            var value = getDeviceValue( $(this), 'get' );
            var knob_elem = $(this).find('input');
            if (value){
                var part = $(this).data('part');
                var val = getPart(value,part);
                if ((parseInt($(this).data('mode'))>>6) % 2 != 0){
                    //is hex rgb

                    val=widget_knob.rgbToHsl(val)[0];
                    val=val*$(this).data('max360');
                }
                else{
                    //is decimal value
                    val = (val * ($(this).data('max360')/$(this).data('max'))).toFixed(0);
                }
                if ( knob_elem.val() != val ){
					knob_elem.val( val ).trigger('change');
                    DEBUG && console.log( this.widgetname + ' dev:'+dev+' par:'+par+' change '+$(this).data('device')+':knob to ' +val );
				}	
			}
            knob_elem.css({visibility:'visible'});
		}
	});
    isUpdating=false;
   }
});
