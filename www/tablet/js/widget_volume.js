var widget_volume = {
  widgetname : 'volume',
  rgbToHsl: function(rgb){
      var r=parseInt(rgb.substring(0,2),16);
      var g=parseInt(rgb.substring(2,4),16);
      var b=parseInt(rgb.substring(4,6),16);
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min){
            h = s = 0; // achromatic
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h, s, l];
  },
  hslToRgb: function(h, s, l){
      var r, g, b;
      var hex = function(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
      }

      if(s == 0){
                 r = g = b = l; // achromatic
             }else{
                 function hue2rgb(p, q, t){
                     if(t < 0) t += 1;
                     if(t > 1) t -= 1;
                     if(t < 1/6) return p + (q - p) * 6 * t;
                     if(t < 1/2) return q;
                     if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                     return p;
                 }

                 var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                 var p = 2 * l - q;
                 r = hue2rgb(p, q, h + 1/3);
                 g = hue2rgb(p, q, h);
                 b = hue2rgb(p, q, h - 1/3);
             }
        return [hex(Math.round(r * 255)), hex(Math.round(g * 255)), hex(Math.round(b * 255))].join('');
  },

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
		i = step * (tick-this.startAngle)+this.o.min;
		
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
			w = tick_w*2;
			w *= (c.strokeStyle != this.o.tkColor) ? 1.5 : 1; 
		}
		else {
			w = tick_w;
			w *= (c.strokeStyle != this.o.tkColor) ? 2 : 1;
		}
		// thicker lines every at current value
		//if (acAngle > tick-tick_w && acAngle < tick+tick_w)
			//w *= 1.9;	
			
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
  	base=this;
  	this.elements = $('div[data-type="'+this.widgetname+'"]');
 	this.elements.each(function(index) {
		var knob_elem =  jQuery('<input/>', {
			type: 'text',
			value: $(this).attr('data-initvalue')||'10',
			disabled : true,
		}).appendTo($(this));
		
		var device = $(this).data('device');
		$(this).data('get', $(this).data('get') || 'STATE');
		readings[$(this).data('get')] = true;
		
		var mode=0; //no hue colors
		var hdDefaultColor='#aa6900';
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

		var maxval = $(this).data('max') || 70;
		$(this).data('max', maxval);
		$(this).data('max360', (maxval>360)?360:maxval);
		
		$(this).data('height', 1*$(this).attr('data-height')||150);
        $(this).data('width', 1*$(this).attr('data-width')||150);
		if($(this).hasClass('small')) {
		    $(this).data('height', 100);
		    $(this).data('width', 100);
		}
		if($(this).hasClass('mini')) {
		    $(this).data('height', 52);
		    $(this).data('width', 52);
		}

		knob_elem.knob({
			'min': $(this).data('min') || 0,
			'max': $(this).data('max360'),
            'lastValue': 0,
            'variance': Math.floor($(this).data('max360') / 5),
			'origmax': $(this).data('max'),
            'height':$(this).data('height'),
            'width':$(this).data('width'),
			'angleOffset': $(this).attr('data-angleoffset')?$(this).attr('data-angleoffset')*1:-120,
			'angleArc': $(this).attr('data-anglearc')?$(this).attr('data-anglearc')*1:240,
			'bgColor': $(this).data('bgcolor') || 'transparent',
			'fgColor': $(this).data('fgcolor') || '#cccccc',
			'tkColor': $(this).data('tkcolor') || '#696969',
			'hdColor': $(this).data('hdcolor') || hdDefaultColor,
            'thickness': ($(this).hasClass('mini'))?.45:.25,
			'tickdistance': $(this).data('tickstep') || (((mode>>1) % 2 != 0)?4:20),
			'mode': mode,
			'cursor': 6,
            'touchPosition': 'left',
			'cmd': $(this).data('cmd') || 'set',
			'set': $(this).data('set') || '',
			'draw' : base.drawDial,
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
				  if (ready){
                        if ((this.o.mode>>6) % 2 != 0){
                            //send hex rbg value
                            v=base.hslToRgb(v/this.o.max,1.0,0.5);
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
	deviceElements.each(function(index) {
		
        if ( $(this).data('get')==par){
			var val = getDeviceValue( $(this), 'get' );
            var knob_elem = $(this).find('input');
			if (val){
                if ((parseInt($(this).data('mode'))>>6) % 2 != 0){
                    //is hex rgb
                    val=base.rgbToHsl(val)[0];
                    val=val*$(this).data('max360');
                }
                else{
                    //is deciaml value
                    val = (val * ($(this).data('max360')/$(this).data('max'))).toFixed(0);
                }
                if ( knob_elem.val() != val ){
					knob_elem.val( val ).trigger('change');
					DEBUG && console.log( base.widgetname + ' dev:'+dev+' par:'+par+' change '+$(this).data('device')+':knob to ' +val );
				}	
			}
            knob_elem.css({visibility:'visible'});
		}
	});
   }
			 
};
