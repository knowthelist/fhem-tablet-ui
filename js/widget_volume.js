var widget_volume = {
  _volume: null,
  elements: null,
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
	
	// draw ticks
	for (tick = this.startAngle; tick < this.endAngle + 0.00001; tick+=tick_w*dist) {
		i = step * (tick-this.startAngle)+this.o.min;
		
		c.beginPath();
		
		if ((tick > acAngle && tick < a.s) || (tick-tick_w*4 <= acAngle && tick+tick_w*4 >= a.s)){
			// draw diff range in gradient color
			c.strokeStyle = getGradientColor(maxcolor, mincolor, (this.endAngle-tick)/this.angleArc);   
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

	// draw target temp cursor
	c.beginPath();
	this.o.fgColor= getGradientColor(maxcolor, mincolor, (this.endAngle-a.e)/(this.endAngle-this.startAngle));
	c.strokeStyle = r ? this.o.fgColor : this.fgColor;
	c.lineWidth = this.lineWidth * 2;
	c.arc(this.xy, this.xy, this.radius-this.lineWidth/2, a.s, a.e, a.d);
	c.stroke();

	//draw current value as text
    var x = this.radius*0.7*Math.cos(acAngle);
    var y = this.radius*0.7*Math.sin(acAngle);
    c.fillStyle = this.o.tkColor;
    c.font="10px sans-serif";
    c.fillText(this.o.isValue ,this.xy+x-5,this.xy+y+5);
  
	//draw valve value as text
	if ( this.o.valveValue ) {
		var x = -5;
		var y = this.radius*0.55;
		c.fillStyle = this.o.tkColor;
		c.font="10px sans-serif";
		c.fillText(this.o.valveValue+'%',this.xy+x,this.xy+y+5);
    }
  return false;
},
  init: function () {
  	_volume=this;
  	_volume.elements = $('div[data-type="volume"]');
 	_volume.elements.each(function(index) {
		var knob_elem =  jQuery('<input/>', {
			type: 'text',
			value: '10',
		}).appendTo($(this));
		
		var device = $(this).data('device');
		$(this).data('get', $(this).data('get') || 'STATE');
		
		knob_elem.knob({
			'min': $(this).data('min') || 0,
			'max': $(this).data('max') || 70,
			'height':150,
			'width':150,
			'angleOffset': $(this).data('angleoffset') || -120,
			'angleArc': $(this).data('anglearc') || 240,
			'bgColor': $(this).data('bgcolor') || 'transparent',
			'fgColor': $(this).data('fgcolor') || '#cccccc',
			'tkColor': $(this).data('tkcolor') || '#696969',
			'minColor': '#aa6900',
			'maxColor': '#aa6900',
			'thickness': .25,
			'tickdistance': 20,
			'cursor': 6,
			'reading': $(this).data('set') || '',
			'draw' : _volume.drawDial,
			'change' : function (v) { 
				  startInterval();
			},
			'release' : function (v) { 
				  if (ready){
				  		setFhemStatus(device, this.o.reading + ' ' + v);
				  		this.$.data('curval', v);
				  }
			}	
		});
	 });
  },
  update: function (dev,par) {

	var deviceElements;
	if ( dev == '*' )
		deviceElements= _volume.elements;
	else
   		deviceElements= _volume.elements.filter('div[data-device="'+dev+'"]');

	deviceElements.each(function(index,elem) {
			
			var val = getDeviceValue( $(this), 'get' );
			if (val){
				var knob_elem = $(this).find('input');
				if ( knob_elem.val() != val )
					knob_elem.val( val ).trigger('change');
				knob_elem.css({visibility:'visible'});	
			}
			
	});
   }
			 
};