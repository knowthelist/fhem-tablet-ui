var widget_thermostat = {
  elements: null,
  _thermostat:null,
  getClimaValues: function (device) {

	var state = getDeviceValue( device, '');
    var val_desired = getDeviceValue( device, 'get');
    var val_desired = ( state && state.indexOf('set_') < 0 ) ? val_desired : getPart(state,2);
    var val_temp = getDeviceValue( device, 'temp');

	return {
        temp: getPart(val_temp,'(\\d+[.,]?\\d+).*'),
        desired: getPart(val_desired,'(\\d+[.,]?\\d+).*'),
        valve: getDeviceValue( device, 'valve')
	};
},
  getGradientColor: function(start_color, end_color, percent) {
   // strip the leading # if it's there
   start_color = start_color.replace(/^\s*#|\s*$/g, '');
   end_color = end_color.replace(/^\s*#|\s*$/g, '');

   // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
   if(start_color.length == 3){
     start_color = start_color.replace(/(.)/g, '$1$1');
   }

   if(end_color.length == 3){
     end_color = end_color.replace(/(.)/g, '$1$1');
   }

   // get colors
   var start_red = parseInt(start_color.substr(0, 2), 16),
       start_green = parseInt(start_color.substr(2, 2), 16),
       start_blue = parseInt(start_color.substr(4, 2), 16);

   var end_red = parseInt(end_color.substr(0, 2), 16),
       end_green = parseInt(end_color.substr(2, 2), 16),
       end_blue = parseInt(end_color.substr(4, 2), 16);

   // calculate new color
   var diff_red = end_red - start_red;
   var diff_green = end_green - start_green;
   var diff_blue = end_blue - start_blue;

   diff_red = ( (diff_red * percent) + start_red ).toString(16).split('.')[0];
   diff_green = ( (diff_green * percent) + start_green ).toString(16).split('.')[0];
   diff_blue = ( (diff_blue * percent) + start_blue ).toString(16).split('.')[0];

   // ensure 2 digits by color
   if( diff_red.length == 1 )
     diff_red = '0' + diff_red

   if( diff_green.length == 1 )
     diff_green = '0' + diff_green

   if( diff_blue.length == 1 )
     diff_blue = '0' + diff_blue

   return '#' + diff_red + diff_green + diff_blue;
 },
  drawDial: function () {
  	var c = this.g, // context
	a = this.arc(this.cv), // Arc
	pa, // Previous arc
	r = 1;

	c.lineWidth = this.lineWidth;
	c.lineCap = this.lineCap;
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
	var mincolor = this.o.minColor || '#ff0000';
    var maxcolor = this.o.maxColor || '#4477ff';
    var destcolor = this.o.tkColor;
	
	// draw ticks
	for (tick = this.startAngle; tick < this.endAngle + 0.00001; tick+=tick_w*dist) {
		i = step * (tick-this.startAngle)+this.o.min;
		
		c.beginPath();
		
        if ((tick > acAngle && tick < a.s) || (tick-tick_w*dist <= acAngle && tick+tick_w*dist >= a.s)){
			// draw diff range in gradient color
            c.strokeStyle = _thermostat.getGradientColor(maxcolor, mincolor, (this.endAngle-tick)/this.angleArc);
            //if (tick-tick_w*dist <= acAngle )
            //    destcolor=c.strokeStyle;
        }
		else {
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
		if (acAngle > tick-tick_w && acAngle < tick+tick_w)
			w *= 1.9;	
			
        c.arc( this.xy, this.xy, this.radius, tick, tick+w , false);
		c.stroke();
	}

    //cavans font
    var cfont = null;
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/))
        cfont="18px sans-serif";
     else
        cfont="10px sans-serif";

    //draw current value as text
    var x = this.radius*0.7*Math.cos(acAngle);
    var y = this.radius*0.7*Math.sin(acAngle);
    c.fillStyle = destcolor;
    c.font=cfont;
    c.fillText(this.o.isValue ,this.xy+x-5,this.xy+y+5);

	// draw target temp cursor
	c.beginPath();
    c.strokeStyle = _thermostat.getGradientColor(maxcolor, mincolor, (this.endAngle-a.e)/(this.endAngle-this.startAngle));
	c.lineWidth = this.lineWidth * 2;
    c.arc(this.xy, this.xy, this.radius-this.lineWidth/2, a.s, a.e, a.d);
    c.stroke();
  
	//draw valve value as text
	if ( this.o.valveValue ) {
		var x = -5;
		var y = this.radius*0.55;
		c.fillStyle = this.o.tkColor;
        c.font=cfont;
		c.fillText(this.o.valveValue+'%',this.xy+x,this.xy+y+5);
    }
  return false;
},
  init: function () {
  	_thermostat=this;
	_thermostat.elements=$('div[data-type="thermostat"]');
	_thermostat.elements.each(function( index ) {
        var knob_elem =  jQuery('<input/>', {
			type: 'text',
			value: '10',
			disabled : true,
		}).appendTo($(this));

		var device = $(this).data('device');  
		//default reading parameter name
		$(this).data('get', $(this).data('get') || 'desired-temp');
		$(this).data('temp', $(this).data('temp') || 'measured-temp');
		readings[$(this).data('get')] = true;
		readings[$(this).data('temp')] = true;
		readings[$(this).data('valve')] = true;
		
		knob_elem.knob({
			'min':$(this).attr('data-min')?1*$(this).data('min'):10,
			'max':1*$(this).data('max') || 30,
			'off':$(this).attr('data-off')?$(this).data('off'):-1,
			'boost':$(this).attr('data-boost')?$(this).data('boost'):-1,
            'height':$(this).hasClass('big')?150:100,
            'width':$(this).hasClass('big')?150:100,
			'step': 1*$(this).data('step') || 1,
			'angleOffset': $(this).data('angleoffset') || -120,
			'angleArc': $(this).data('anglearc') || 240,
			'bgColor': $(this).data('bgcolor') || 'transparent',
            'fgColor': $(this).data('fgcolor') || '#bbbbbb',
			'tkColor': $(this).data('tkcolor') || '#696969',
			'minColor': '#4477ff',
			'maxColor': '#ff0000',
            'thickness': .25,
            'cursor': 6,
            'touchPosition': 'left',
			'readOnly' : $(this).hasClass('readonly')?true:false,
			'cmd': $(this).data('cmd') || 'set',
			'set': $(this).data('set') || 'desired-temp',
			'draw' : _thermostat.drawDial,
			'change' : function (v) { 
                //reset shortpoll timer to avoid jump back
                startPollInterval();
			},
            'format' : function (v) {
                //fix digits count
                return (this.step<1)?Number(v).toFixed(1):v;
            },
			'release' : function (v) { 
			  if (ready){
                    var elem = $(this).find('input');
		 		    if(v == this.o.min && this.o.off != -1) {
		 		        v=this.o.off;
		 		    } else if(v == this.o.max && this.o.boost != -1) {
		 		        v=this.o.boost;
                    }
				  	var cmdl = this.o.cmd+' '+device+' '+this.o.set+' '+v;
				  	setFhemStatus(cmdl);
				  	$.toast(cmdl);
			  }
			}	
		});
	});
  },
  update: function (dev,par) {
  
    var deviceElements= _thermostat.elements.filter('div[data-device="'+dev+'"]');
	deviceElements.each(function(index) {

		var clima = _thermostat.getClimaValues( $(this) );
		switch(clima.desired) {
		    case $(this).data('off'):   clima.desired=$(this).data('min'); break;
		    case $(this).data('boost'): clima.desired=$(this).data('max'); break;
		}

        var knob_elem = $(this).find('input');
				
        if ( ($(this).data('get')==par) &&
			clima.desired && clima.desired > 0 && knob_elem.data('desvalue') != clima.desired ){	
			knob_elem.val( clima.desired ).trigger('change');
			knob_elem.data('desvalue', clima.desired);
			DEBUG && console.log( 'thermo dev:'+dev+' par:'+par+' change:clima.desired' );
		}
		if ( clima.temp && clima.temp > 0 && knob_elem.data('curvalue') != clima.temp ){
			knob_elem.trigger( 
				'configure', { "isValue": clima.temp }
			);		
			knob_elem.data('curvalue', clima.temp);
			DEBUG && console.log( 'thermo dev:'+dev+' par:'+par+' change:clima.temp' );
		}			
		if ( clima.valve && knob_elem.data('curvalve') != clima.valve ){
			knob_elem.trigger( 
				'configure', { "valveValue": clima.valve }
			);		
			knob_elem.data('curvalve', clima.valve);
			DEBUG && console.log( 'thermo dev:'+dev+' par:'+par+' change:clima.valve' );
		}
		knob_elem.css({visibility:'visible'});
	});
},		 
};
