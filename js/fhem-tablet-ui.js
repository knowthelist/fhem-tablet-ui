/* FHEM tablet ui */
/**
* Just another dashboard for FHEM
*
* Version: 1.0.0
* Requires: jQuery v1.7+, font-awesome, jquery.gridster, jquery.toast
*
* Copyright (c) 2015 Mario Stephan
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
*/
var deviceStates={};
var ready = true;
var host = "localhost";
var port = 7072;

$( document ).ready(function() {
	
	host = $("meta[name='fhem-host']").attr("content");
	port = $("meta[name='fhem-port']").attr("content");
	wx = $("meta[name='widget_base_width']").attr("content");
	wy = $("meta[name='widget_base_height']").attr("content");
	
	gridster = $(".gridster > ul").gridster({
          widget_base_dimensions: [wx, wy],
          widget_margins: [5, 5],
          draggable: {
            handle: 'header'
          }
        }).data('gridster');

	$('div[type="homestatus"]').each(function( index ) {
		var clientX=0;
		var clientY=0;
		var knob_elem =  jQuery('<input/>', {
			type: 'text',
			value: '10',
		}).data($(this).data())
		  .appendTo($(this));
		  
		var clickEventType=((document.ontouchstart!==null)?'mousedown':'touchstart');

		$(this).bind('mousemove', function(e) {
	
			knob_elem.data('pageX',e.pageX);
			knob_elem.data('pageY',e.pageY);
			e.preventDefault();
		});
		
		knob_elem.knob({
			'min': 0,
			'max': 2 * Math.PI,
			'step': 0.01,
			'height':210,
			'width':210,
			'bgColor': $(this).data('bgcolor') || '#aaaaaa',
			'fgColor': $(this).data('fgcolor') || '#aa6900',
			'tkColor': $(this).data('tkcolor') || '#696969',
			'minColor': '#2A2A2A',
			'maxColor': '#696969',
			'thickness': 0.4,
			'displayInput': false,
			'angleOffset' : 0,
			'cmd': $(this).data('cmd') || 'state',
			'draw' : drawHomeSelector,
		});	
	});	
	
	$('div[type="volume"]').each(function( index ) {
		var knob_elem =  jQuery('<input/>', {
			type: 'text',
			value: '10',
		}).data($(this).data())
		  .appendTo($(this));
		  
		knob_elem.knob({
			'min': $(this).data('min') || 0,
			'max': $(this).data('max') || 70,
			'height':150,
			'width':150,
			//'step':.5,
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
			'draw' : drawDial,
			
		});
		
	});
	
	$('div[type="thermostat"]').each(function( index ) {
		var knob_elem =  jQuery('<input/>', {
			type: 'text',
			value: '10',
		}).data($(this).data())
		  .appendTo($(this));
		  
		knob_elem.knob({
			'min':10,
			'max':30,
			'height':100,
			'width':100,
			//'step':.5,
			'angleOffset': $(this).data('angleoffset') || -120,
			'angleArc': $(this).data('anglearc') || 240,
			'bgColor': $(this).data('bgcolor') || 'transparent',
			'fgColor': $(this).data('fgcolor') || '#cccccc',
			'tkColor': $(this).data('tkcolor') || '#696969',
			'minColor': '#4477ff',
			'maxColor': '#ff0000',
			'thickness': .25,
			'cursor': 6,
			'cmd': $(this).data('cmd') || 'desired-temp',
			'draw' : drawDial,
		});
		
	});

 	$('div[type="switch"]').each(function(index) {
 	
 	var device = $(this).attr('device');
 	var elem = $(this).famultibutton({
		icon: 'fa-lightbulb-o',
		backgroundIcon: 'fa-circle',
		offColor: '#2A2A2A',
		onColor: '#2A2A2A',
		
		// Called in toggle on state.
		toggleOn: function( ) {
			 setFhemStatus(device,"on");
	    },
	   	toggleOff: function( ) {
			 setFhemStatus(device,"off");
	    },
	});
	elem.data('famultibutton',elem);
	
 });
	
 	$('div[type="push"]').each(function(index) {
 	
 	var device = $(this).attr('device');
 	var elem = $(this).famultibutton({
		backgroundIcon: 'fa-circle-thin',
		offColor: '#505050',
		onColor: '#aa6900',
		mode: 'push', 
		
		// Called in toggle on state.
		toggleOn: function( ) {
			 setFhemStatus(device,$(this).data('cmd'));
	    },
	});
	elem.data('famultibutton',elem);
 });

 	$('div[type="contact"]').each(function(index) {
 	
 	var elem = $(this).famultibutton({
		icon: 'fa-windows',
		backgroundIcon: null,
		onColor: '#aa6900',
		onBackgroundColor: '#aa6900',
		offColor: '#505050',
		offBackgroundColor: '#505050',
		mode: 'signal',  //toggle, push, ,
	});
	elem.data('famultibutton',elem);
 });
 
	$("*").focus(function(){
    	$(this).blur();
  	}); 
  	
	$('input').css({visibility:'visible'});
	
	requestFhemStatus();
	
	// refresh every 30 sec
	setInterval(function(){
   		requestFhemStatus();
	}, 30000);
	
	// !!!! remove this test !!!!
	$(".label").on('click',function(){
    	update();
  	}); 

});

function update() {

   ready = false;	
   
   $('div[type=label]').each(function(index) {
 	
 	 var device = $(this).attr('device');
 	 if ( device && device != '' ){
 	 	value = getDeviceStatus(device);
 	 	part =  $(this).data('part') || -1;
 	 	unit = ($(this).data('unit')) ? unescape($(this).data('unit')) : '';
	 	$(this).html( getPart(value,part) + "<span style='font-size: 50%;'>"
	 										+unit+"</span>" );
	 }
    });
 
	$('div[type="thermostat"]').each(function( index ) {
		
		var device = $(this).attr('device');
		if (device && device.length>0){
			var clima = getClimaValues( deviceStates[device] );
			knob_elem = $(this).find('input');
			knob_elem.val( clima.desired ).trigger('change');
			if ( clima.temp > 0 ){
				knob_elem.trigger(
				'configure',
				{
					"isValue": clima.temp,
					'release' : function (v) { 
					  if (ready){
						setFhemStatus(device, this.o.cmd + ' ' + v);
						$.toast('Set '+ device + this.o.cmd + ' ' + v );
					  }
					}
				});		
			}
		}
	});
	
	$('div[type="volume"]').each(function( index ) {
		
		var device = $(this).attr('device');
		if (device && device.length>0){
			knob_elem = $(this).find('input');
			knob_elem.val( deviceStates[device] ).trigger('change');
			knob_elem.trigger(
			'configure',
			{
				'release' : function (v) { 
				  if (ready)
				  		setFhemStatus(device,v);
				}
			});			
		}
	});
	
	$('div[type="homestatus"]').each(function( index ) {
		
		var device = $(this).attr('device');
		if (device && device.length>0){
			knob_elem = $(this).find('input');
			var val=0;
			switch( deviceStates[device] ) {
				case 4:
					val=Math.PI;
					break;
				case 3:
					val=Math.PI*0.25;
					break;
				case 2:
					val=Math.PI*1.75;
					break;
				default:
					val=0;
			}
			console.log("val="+val);
			knob_elem.val( val ).trigger('change');
			knob_elem.trigger(
			'configure',
			{
				'release' : function (v) { 
				  if (ready){
				  	console.log('Set Homestatus to' + this.o.status);
				  	setFhemStatus(device, this.o.cmd + ' ' + this.o.status);
				  }
				}
			});			
		}
	});
	 
	$('div[type="switch"],div[type="contact"]').each(function(index) {
 	
 	var state = getDeviceStatus( $(this).attr('device') );
	
	if ( state == 'on' || state == 'open' )
		$(this).data('famultibutton').setOn();
	else
		$(this).data('famultibutton').setOff();
 });
 
 	ready = true;
	console.log('update');
}

function setFhemStatus(device,status) {
	$.ajaxSetup({
		async: true,
		data: {
			cmd: "set "+device+" "+status,
			host: host,
			port: port,
		}
	});
	
	$.get( "php/send.php", function( data ) {
		if (data.substr(0, 6) == "Error:"){
			$.toast(data);
		}
	setInterval(function(){
   		requestFhemStatus();
	}, 4000);
	});
}

function requestFhemStatus() {
	$.ajaxSetup({
		async: true,
		data: {
			cmd: "list",
			host: host,
			port: port,
		}
	});
	
	$.get( "php/send.php", function( data ) {
		//console.log(data);
		if (data.substr(0, 6) == "Error:"){
			$.toast(data);
		} else {
			var lines = data.replace(/\n\)/g,")\n").split(/\n/);
			deviceStates={};
			for (var i=0; i < lines.length; i++) {
				if (/\((.*)\)/.test(lines[i])) {
					var key = $.trim(lines[i]).match( /^(\S*).*\(/ )[1];
					var value = $.trim(lines[i]).match( /\((.*)\)/ )[1];
					deviceStates[key]=value;
				}
			}
			update();
		}
	});

}

this.getPart = function (s,p) {
	var c = (s !== undefined) ? s.split(" ") : '';
	return (c.length >= p && p>0 ) ? c[p-1] : s;
};

this.getDeviceStatus = function (dev) {
	var state = deviceStates[dev];
	return (state) ? state : '';
}

this.getClimaValues = function (s) {
	var c = (s !== undefined) ? s.split(" ") : '';
	var r = [0,0,0];
	if (c.length > 5) {
		r[0]=c[1];r[1]=c[3];r[2]=c[5];
	}
	if ( s.indexOf('set_desired-temp') > -1 )
	{
		r[1]=c[1];
	}
	return {
		temp: r[0],
		desired: r[1],
		valve: r[2]
	};
};

getGradientColor = function(start_color, end_color, percent) {
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
 };
    
var drawDial = function () {
  	var c = this.g, // context
	a = this.arc(this.cv), // Arc
	pa, // Previous arc
	r = 1;
	
	  
    //force canvas to redraw
    c.clearRect(0,0, this.$c.width, this.$c.height);
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
	c.strokeStyle = r ? this.o.fgColor : this.fgColor ;
	c.lineWidth = this.lineWidth * 2;
	c.arc(this.xy, this.xy, this.radius-this.lineWidth/2, a.s, a.e, a.d);
	c.stroke();

	//draw current value as text
    var x = this.radius*0.7*Math.cos(acAngle);
    var y = this.radius*0.7*Math.sin(acAngle);
    c.fillStyle = this.o.tkColor;
    c.font="10px Sans Serif";
    c.fillText(this.o.isValue ,this.xy+x-5,this.xy+y+5);

	// extra text 
	this.i.parent().find("#current").remove();
	if (this.o.text){
		var $target = this.i,
        	targetPosition = $target.position(),
        	$current = $('<div id="current">'+ this.o.text +'</div>').insertAfter($target);

		$current.css({
			position : 'absolute',
			top : targetPosition.top + 25,
			left : targetPosition.left,
			'margin-left' : '-' + ((this.w * 3 / 4 + 2) >> 0) + 'px',
			'text-align': 'center',
			width : $target.width(),
			'font-size': '75%'
		});
  }
  
  return false;
};

var drawHomeSelector = function (event) {
	var sector=0;
	var c = this.g; // context
	var x=this.$.data('pageX');
	var y=this.$.data('pageY');
	var mx=this.x+this.w2;
	var my=this.y+this.w2;
	var r=this.radius*0.4;
		
	//console.log("mX: "+mx," mY: "+my," X: "+x," Y: "+y," r: "+r," cv:"+this.cv);
	if ( Math.pow((mx-x),2) + Math.pow((my-y),2) < Math.pow(r,2)
		|| this.cv == 0 ) 
		sector=1;
	
	if (sector==1){
			// inner circle
			c.lineWidth = this.radius*0.4;
			c.strokeStyle = this.o.fgColor ;
			c.beginPath(); 
			c.arc( this.xy, this.xy, this.radius*0.2, 0, 2 * Math.PI); 
			c.stroke();
		}
		else{
			// outer section
			var start=0; 
			var end = 0;
			
			if (this.cv > Math.PI*0.5 && this.cv <= Math.PI*1.5){
					start=0; end=Math.PI; sector=3;
			}
			else if (this.cv > Math.PI*1.5 && this.cv <= Math.PI*2){
					start=Math.PI; end=Math.PI*1.5; sector=2;
			}
			else if (this.cv > 0 && this.cv <= Math.PI*0.5){
					start=Math.PI*1.5; end=Math.PI*2; sector=4;
			}
														
			c.lineWidth = this.radius*0.6;
			c.beginPath();
			c.strokeStyle = this.o.fgColor;
			c.arc(this.xy, this.xy, this.radius*0.7, start, end);
			c.stroke();
		} 

		// sections
		c.strokeStyle = this.o.tkColor;
		c.lineWidth = this.radius*0.6;
		c.beginPath();
		c.arc(this.xy, this.xy, this.radius*0.7, 0, 0.02);
		c.stroke();
		c.beginPath();
		c.arc(this.xy, this.xy, this.radius*0.7, Math.PI -0.02, Math.PI);
		c.stroke();
		c.beginPath();
		c.arc(this.xy, this.xy, this.radius*0.7, 1.5 * Math.PI-0.02, 1.5 * Math.PI);
		c.stroke();
		
		// inner circle line
		c.lineWidth = 2; 
		c.strokeStyle = this.o.tkColor;
		c.beginPath(); 
		c.arc( this.xy, this.xy, this.radius*0.4, 0, 2 * Math.PI); 
		c.stroke(); 
		
		// outer circle line
		c.lineWidth = 2; 
		c.beginPath(); 
		c.arc( this.xy, this.xy, this.radius, 0, 2 * Math.PI, false); 
		c.stroke(); 
		
		c.fillStyle = (sector==1)?this.o.minColor:this.o.maxColor;
		c.font = "22px FontAwesome";
		c.fillText("\uf015", this.xy-12, this.xy+2);
		c.font = "100 11px sans-serif";
		c.fillText("Home", this.xy-14, this.xy+15);
		
		c.fillStyle = (sector==2)?this.o.minColor:this.o.maxColor;
		c.font = "22px FontAwesome";
		c.fillText("\uf236", this.xy-this.radius*0.7, this.xy-this.radius*0.4);
		c.font = "100 11px sans-serif";
		c.fillText("Night", this.xy-this.radius*0.9, this.xy-10);
		
		c.fillStyle = (sector==3)?this.o.minColor:this.o.maxColor;
		c.font = "22px FontAwesome";
		c.fillText("\uf1b9", this.xy-12, this.xy+this.radius*0.67);
		c.font = "100 11px sans-serif";
		c.fillText("Away", this.xy-12, this.xy+this.radius*0.65+15);

		c.fillStyle = (sector==4)?this.o.minColor:this.o.maxColor;
		c.font = "22px FontAwesome";
		c.fillText("\uf0f2", this.xy+this.radius*0.4, this.xy-this.radius*0.4);
		c.font = "100 11px sans-serif";
		c.fillText("Holiday", this.xy+this.radius*0.42, this.xy-10);
		
		this.o.status = sector;
	return false;
};
