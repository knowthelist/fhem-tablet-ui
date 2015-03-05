/* FHEM tablet ui */
/**
* Just another dashboard for FHEM
*
* Version: 1.2.1
* Requires: jQuery v1.7+, font-awesome, jquery.gridster, jquery.toast
*
* Copyright (c) 2015 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
*/
var deviceStates={};
var readings = {"STATE":true};
var devices = {};
var ready = true;
var reading_cntr;
var doLongPoll = false;
var timer;
var shortpollInterval = 30 * 1000; // 30 seconds

$( document ).ready(function() {
	
	wx = $("meta[name='widget_base_width']").attr("content");
	wy = $("meta[name='widget_base_height']").attr("content");
	doLongPoll = ($("meta[name='longpoll']").attr("content") == '1');
	
	gridster = $(".gridster > ul").gridster({
          widget_base_dimensions: [wx, wy],
          widget_margins: [5, 5],
          draggable: {
            handle: 'header'
          }
        }).data('gridster');

   	$('div[type=label]').each(function(index) {
   		$(this).data('get', $(this).data('get') || 'STATE');
	});
   	
   	//init widgets
	$('div[type="homestatus"]').each(function( index ) {
		var clientX=0;
		var clientY=0;
		var knob_elem =  jQuery('<input/>', {
			type: 'text',
		}).data($(this).data())
		  .data('curval', 10)
		  .appendTo($(this));
		
		$(this).bind('mousemove', function(e) {
	
			knob_elem.data('pageX',e.pageX);
			knob_elem.data('pageY',e.pageY);
			e.preventDefault();
		});

		var device = $(this).attr('device');
		$(this).data('get', $(this).data('get') || 'STATE');
		
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
			'reading': $(this).data('set') || '',
			'draw' : drawHomeSelector,
			'change' : function (v) { 
				  startInterval();
			},
			'release' : function (v) { 
			  if (ready){
				  	setFhemStatus(device, this.o.reading + ' ' + this.o.status);
				  	this.$.data('curval', v);
			  }
			}	
		});	
	});	
	
	$('div[type="volume"]').each(function( index ) {
		var knob_elem =  jQuery('<input/>', {
			type: 'text',
			value: '10',
		}).appendTo($(this));
		
		var device = $(this).attr('device');
		$(this).data('get', $(this).data('get') || 'STATE');
		
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
			'change' : function (v) { 
				  startInterval();
			},
			'release' : function (v) { 
				  if (ready){
				  		setFhemStatus(device,v);
				  		this.$.data('curval', v);
				  }
			}	
		});
		
	});
	
	$('div[type="thermostat"]').each(function( index ) {
		var knob_elem =  jQuery('<input/>', {
			type: 'text',
			value: '10',
		}).appendTo($(this));
		  
		var device = $(this).attr('device');  
		//default reading parameter name
		$(this).data('get', $(this).data('get') || 'desired-temp');
		$(this).data('temp', $(this).data('temp') || 'measured-temp');
		
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
			'reading': $(this).data('set') || 'desired-temp',
			'draw' : drawDial,
			'change' : function (v) { 
				//reset poll timer to avoid jump back
				startInterval();
			},
			'release' : function (v) { 
			  if (ready){
				setFhemStatus(device, this.o.reading + ' ' + v);
				$.toast('Set '+ device + this.o.reading + ' ' + v );
				this.$.data('curval', v);
			  }
			}	
		});
		
		
	});

 	$('div[type="switch"]').each(function(index) {
 	
		var device = $(this).attr('device');
		$(this).data('get', $(this).data('get') || 'STATE');
		$(this).data('on', $(this).data('on') || 'on');
		$(this).data('off', $(this).data('off') || 'off');
		var elem = $(this).famultibutton({
			icon: 'fa-lightbulb-o',
			backgroundIcon: 'fa-circle',
			offColor: '#2A2A2A',
			onColor: '#2A2A2A',
			
			// Called in toggle on state.
			toggleOn: function( ) {
				 setFhemStatus(device,$(this).data('on'));
			},
			toggleOff: function( ) {
			console.log($(this).data());
				 setFhemStatus(device,$(this).data('off'));
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
				 setFhemStatus(device,$(this).data('set'));
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
		//default reading parameter name
		$(this).data('get', $(this).data('get') || 'STATE');
		$(this).data('on', $(this).data('on') || 'open');
		$(this).data('off', $(this).data('off') || 'closed');
	});
 
	$("*").focus(function(){
    	$(this).blur();
  	}); 
  	
	$('input').css({visibility:'visible'});

	//collect required devices
	$('div[device]').each(function(index){
		var device = $(this).attr("device");
		if(!devices[device])
			devices[device] = true;
	});
	
	//collect required readings
	$('[data-get]').each(function(index){
		var reading = $(this).data("get");
		if(!readings[reading])
			readings[reading] = true;
	});
	$('[data-temp]').each(function(index){
		var reading = $(this).data("temp");
		if(!readings[reading])
			readings[reading] = true;
	});

	//get current values of readings
	for (var reading in readings) {
		requestFhem(reading);
	}
	reading_cntr = Object.keys(readings).length;

	if ( doLongPoll ){
		setTimeout(function() {
				longPoll();
		}, 1000);
		shortpollInterval = 15 * 60 * 1000; // 15 minutes
	}
	
	// refresh every x secs
	startInterval();

});

function startInterval() {
     clearInterval(timer);
     timer = setInterval(function () {
		//get current values of readings every x seconds
		for (var reading in readings) {
			requestFhem(reading);
		}
     }, shortpollInterval); 
 }

function update(filter) {
	ready = false;	
	var deviceElements;
	var deviceType;
	
	if ( filter == '*' )
		deviceElements= $('div[device]');
	else
   		deviceElements= $('div[device="'+filter+'"]');
   		
   	deviceElements.each(function(index) {
   	
   		deviceType = $(this).attr('type');
   		
   		if (deviceType == 'label'){
 	
			var value = getDeviceValue( $(this), 'get' );
			if (value){
				var part =  $(this).data('part') || -1;
				var unit = ($(this).data('unit')) ? unescape($(this).data('unit')) : '';
				var fix =  $(this).data('fix');
				fix = ( $.isNumeric(fix) ) ? fix : 1;
				var val = getPart(value,part);
				val = ( $.isNumeric(val) ) ? Number(val).toFixed(fix) : val;
				$(this).html( val + "<span style='font-size: 50%;'>"
													+unit+"</span>" );
			 }
		} 
    	else if (deviceType == 'thermostat'){
		
			var clima = getClimaValues( $(this) );
			if ( clima.desired && clima.temp ){
				var knob_elem = $(this).find('input');
				
				if ( clima.desired > 0 && knob_elem.val() != clima.desired ){	
					knob_elem.val( clima.desired ).trigger('change');
				}
				if ( clima.temp > 0 && knob_elem.data('curval') != clima.temp ){
					knob_elem.trigger( 
						'configure', { "isValue": clima.temp }
					);		
					knob_elem.data('curval', clima.temp);
				}
			}
		}
	    else if (deviceType == 'volume'){
		
			var val = getDeviceValue( $(this), 'get' );
			if (val){
				var knob_elem = $(this).find('input');
				if ( knob_elem.val() != val )
					knob_elem.val( val ).trigger('change');
			}
		}
		else if (deviceType == 'homestatus'){
		
			var value = getDeviceValue( $(this), 'get' );
			if (value && value > -1){
				var knob_elem = $(this).find('input');
				var val=0;
				switch( value ) {
					case '3':
						val=Math.PI;
						break;
					case '4':
						val=Math.PI*0.25;
						break;
					case '2':
						val=Math.PI*1.75;
						break;
					default:
						val=0;
				}
				if ( knob_elem.data('curval') != val )
					knob_elem.val( val ).trigger('change');		
			}
		}
	 	else if (deviceType == 'switch' || deviceType == 'contact'){
			
			var state = getDeviceValue( $(this), 'get' );
			
			if ( state == $(this).data('on') )
				$(this).data('famultibutton').setOn();
			else if ( state == $(this).data('off') )
				$(this).data('famultibutton').setOff();
		}
 	});
 	ready = true;
	console.log('update done (filter:'+filter+')');
}

function setFhemStatus(device,status) {
	startInterval();
	$.ajax({
		async: true,
		url: "../fhem",
		data: {
			cmd: "set "+device+" "+status,
			XHR: "1"
		}
	})
	.fail (function(jqXHR, textStatus, errorThrown) {
    		$.toast("Error: " + textStatus + ": " + errorThrown);
	})
  	.done ( function( data ) {
  		if ( !doLongPoll ){
			setTimeout(function(){
				for (var reading in readings) {
					requestFhem(reading);
				}
			}, 4000);
		}
	});
}

var xhr;
var currLine=0;
function longPoll(roomName) {
/* try to avoid this terrible fmt=JSON output format 
	- no separat node for parameter name
	- multiple nodes with the same data (2xdate)
*/
	console.log('start longpoll');
	
	if (xhr)
		xhr.abort();
	currLine=0;
	
	$.ajax({
		url: "../fhem",
		cache: false,
		complete: function() {
			setTimeout(function() {
				longPoll();
			}, 100);
		},
		timeout: 60000,
		async: true,
		data: {
			XHR:1,
			inform: "type=raw;filter=.*"
		},
		xhr: function() {
			xhr = new window.XMLHttpRequest();
			xhr.addEventListener("readystatechange", function(e){
				var data = e.target.responseText;
		  		if ( e.target.readyState == 4) {
    				//$.toast("Connection lost, trying to reconnect in 5 seconds.");
    				return;
  				}
				if ( e.target.readyState == 3 )
				{
					var lines = data.replace(/<br>/g,"").split(/\n/);
					var regDevice = /\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9]\s(\S*)\s(\S*)\s(.*)/;
					var regDate = /^([0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9])\s/;
					var regParaname = /(\S*):\s(.*)$/;
					lines.pop(); //remove last empty line
					
					for (var i=currLine; i < lines.length; i++) {
						var date;
						var line = $.trim( lines[i] );
						//console.log('#'+line+'#');
						
						if ( regDate.test( line ))
							date = $.trim(line.match( regDate )[1]);
						if ( regDevice.test( line )) {
							//Bad parse hack, but the JSON is not well formed
							var room = $.trim( line.match( regDevice )[1] );
							var key = $.trim( line.match( regDevice )[2] );
							var parname_val = $.trim(line.match( regDevice )[3]);
							var params = deviceStates[key] || {};
							var paraname;
							var val;
							if ( regParaname.test(parname_val) ){
								var paraname = $.trim(parname_val.match( regParaname )[1]);
								var val = $.trim(parname_val.match( regParaname )[2]);
							}
							else {
								var paraname = 'STATE';
								var val = parname_val;
							}
							if ( (paraname in readings) && (key in devices) ){
								var value = {"date": date,
											  "room": room,
												"val": val
											};
								params[paraname]=value;
								deviceStates[key]=params;
								update(key);
								
								//console.log(date + ' / ' + key+' / '+paraname+' / '+val);
							}
							//console.log(date + ' / ' + key+' / '+paraname+' / '+val);
						}
					}
					currLine = lines.length;
				}
 
    		}, false);
			return xhr;
			}
	});
}
            
function requestFhem(paraname) {
/* 'list' is still the fastest cmd to get all important data
*/
	$.ajax({
		async: true,
		cache: false,
		context:{paraname: paraname},
		url: "../fhem",
		data: {
			cmd: "list .* " + paraname,
			XHR: "1"
		}
	})
	.fail (function(jqXHR, textStatus, errorThrown) {
    		$.toast("Error: " + textStatus + ": " + errorThrown);
  	})
  	.done (function( data ) {
			var lines = data.replace(/\n\)/g,")\n").split(/\n/);
			var regDevice = /^(\S*)\s.*/;
			var regState = (this.paraname!='STATE')
						? /\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9]\s(.*)/
						: /^\S*\s*(.*)/;
			var regDate = /\s([0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9])\s/;
			
			for (var i=0; i < lines.length; i++) {
				var date;
				var line = $.trim( lines[i] );
				if ( regDate.test( line ))
					date = $.trim( line.match( regDate )[1] );
				if (regState.test(line) && regDevice.test(line) ) {
					var key = $.trim( line.match( regDevice )[1] );
					var val = $.trim( line.match( regState )[1] );
					var params = deviceStates[key] || {};
					var paraname = this.paraname;
					var value = {"date": date, "val": val};
					params[paraname]=value;
					if (key in devices)
						deviceStates[key]=params;
				}
			}
		reading_cntr--;
		if ( reading_cntr < 1 ) {
			update('*'); 
			reading_cntr = Object.keys(readings).length;
 		}
	});

}

this.getPart = function (s,p) {
	var c = (s !== undefined) ? s.split(" ") : '';
	return (c.length >= p && p>0 ) ? c[p-1] : s;
};

this.getDeviceValue = function (device, src) {
	var devname	= device.attr('device');
	var paraname =	(src && src != '') ? device.data(src) : Object.keys(readings)[0];
	if (devname && devname.length>0){
		var params = deviceStates[devname];
		return ( params && params[paraname] ) ? params[paraname].val : null;
	}
	return null;
}

this.getClimaValues = function (device) {

	var state = getDeviceValue( device, '');
	var desi = getDeviceValue( device, 'get');
	return {
		temp: getDeviceValue( device, 'temp'),
		desired: ( state && state.indexOf('set_') < 0 ) ? desi : getPart(state,2),
		valve: getDeviceValue( device, 'valve')
	};
};

this.getGradientColor = function(start_color, end_color, percent) {
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

	//Assign sector 1 for center pressed or set value 0
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
		c.font = "100 11px sans-serif";
		c.fillText("Home", this.xy-14, this.xy+15);
		c.font = "22px FontAwesome";
		c.fillText("\uf015", this.xy-12, this.xy+2);
		
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
