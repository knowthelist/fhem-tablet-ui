/* FHEM tablet ui */
/**
* Just another dashboard for FHEM
*
* Version: 1.4.0
* Requires: jQuery v1.7+, font-awesome, jquery.gridster, jquery.toast
*
* Copyright (c) 2015 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
*/
var deviceStates={};
var readings = {"STATE":true};
var devices = {};
var types = {};
var ready = true;
var DEBUG = false;
var TOAST = true;
var doLongPoll = false
var timer;
var timeoutMenu;
var dir = '';
var filename = '';
var shortpollInterval = 30 * 1000; // 30 seconds
var devs=Array();
var pars=Array();

var plugins = {
  modules: [],
  addModule: function (module) {
    this.modules.push(module);
  },
  load: function (name) {
  	loadplugin(name, function () { 
		DEBUG && console.log('Loaded plugin: '+ name);
		var module = eval(name);
		plugins.addModule(module);
        module.init();
        //request missing readings
        for (var reading in readings) {
            if (pars.indexOf(reading)<0){
                pars.push(reading);
                requestFhem(reading);
            }
        }

	});
  },
  update: function (dev,par) {  
    ready = false;
    $.each(this.modules, function (index, module) {
      //Iterate each module and run update function
      module.update(dev,par);
    });
    ready = true;
    DEBUG && console.log('update done for device:'+dev+' parameter:'+par);
  }
}


// event page is loaded
$( document ).ready(function() {
	
	wx = parseInt( $("meta[name='widget_base_width']").attr("content") );
	wy = parseInt( $("meta[name='widget_base_height']").attr("content") );
	doLongPoll = ($("meta[name='longpoll']").attr("content") == '1');
	DEBUG  = ($("meta[name='debug']").attr("content") == '1');
    TOAST  = ($("meta[name='toast']").attr("content") != '0');
	
	//self path
	dir = $('script[src$="fhem-tablet-ui.js"]').attr('src');
	var name = dir.split('/').pop(); 
	dir = dir.replace('/'+name,"");
	DEBUG && console.log('Plugin dir: '+dir);

    var url = window.location.pathname;
    filename = url.substring(url.lastIndexOf('/')+1);
    DEBUG && console.log('Filename: '+filename);

	//init gridster
	gridster = $(".gridster > ul").gridster({
          widget_base_dimensions: [wx, wy],
          widget_margins: [5, 5],
          draggable: {
            handle: 'header'
          }
        }).data('gridster');
        if($("meta[name='gridster_disable']").attr("content") == '1') {
        	gridster.disable();
    	}

    //add background for modal dialogs
    $("<div id='shade' />").prependTo('body').hide();
	
    //include extern html code
    if ($('div[data-include]').length>0){
        $('div[data-include]').each(function(index) {
            $(this).load($(this).data('include') +' div', function() {
                //continue after loading the includes
                initWidgets();
            });
        });
    }
    else{
       //continue immediately with initWidgets
       initWidgets();
    }

    if ( doLongPoll ){
        setTimeout(function() {
                longPoll();
        }, 1000);
        shortpollInterval = 15 * 60 * 1000; // 15 minutes
    }

    $("*:not(select)").focus(function(){
        $(this).blur();
    });

    // refresh every x secs
    startPollInterval();

});

function initWidgets() {

    showDeprecationMsg();

    //collect required widgets types
    $('div[data-type]').each(function(index){
        var t = $(this).data("type");
        if(!types[t])
            types[t] = true;
    });

    //collect required devices
    $('div[data-device]').each(function(index){
        var device = $(this).data("device");
        if(!devices[device]){
            devices[device] = true;
            devs.push(device);
        }
    });

    //collect required readings
    DEBUG && console.log('Collecting required readings');
    $('[data-get]').each(function(index){
        var reading = $(this).data("get");
        if(!readings[reading]){
            readings[reading] = true;
            pars.push(reading);
        }
    });

    //init widgets
    for (var widget_type in types) {
        plugins.load('widget_'+widget_type);
    }

    //get current values of readings
    DEBUG && console.log('Request readings from FHEM');
    for (var reading in readings) {
        requestFhem(reading);
    }

}

function showDeprecationMsg() {

    //make it HTML conform (remove this after migration)
    $('div[type]').each(function() {
        $(this).attr({
            'data-type' : $(this).attr('type'),
        })
        .removeAttr('type');
        console.log('Please rename widget attribute "type" into "data-type" in ' + document.location + ($(this).attr('data-device')?' device: '+$(this).attr('data-device'):'') + ' - Details below:');
        console.log($(this));
    });
    $('div[device]').each(function() {
        $(this).attr({
            'data-device' : $(this).attr('device'),
        })
        .removeAttr('device');
        console.log('Please rename widget attribute "device" into "data-device" in ' + document.location + ($(this).attr('data-device')?' device: '+$(this).attr('data-device'):'') + ' - Details below:');
        console.log($(this));
    });
    $('div[data-type="contact"]').each(function() {
        $(this).attr({'data-type' : 'symbol',})
        console.log('Please rename widget "contact" into "symbol" in ' + document.location + ($(this).attr('data-device')?' device: '+$(this).attr('data-device'):'') + ' - Details below:');
        console.log($(this));
    });
    //end **** (remove this after migration)
}

function startPollInterval() {
     clearInterval(timer);
     timer = setInterval(function () {
		//get current values of readings every x seconds
		for (var reading in readings) {
			requestFhem(reading);
        }
     }, shortpollInterval); 
 }

function setFhemStatus(cmdline) {
    startPollInterval();
    DEBUG && console.log('send to FHEM: '+cmdline);
	$.ajax({
		async: true,
		url: $("meta[name='fhemweb_url']").attr("content") || "../fhem/",
		data: {
			cmd: cmdline,
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
	DEBUG && console.log('start longpoll');
	
	if (xhr)
		xhr.abort();
	currLine=0;
	
	$.ajax({
		url: $("meta[name='fhemweb_url']").attr("content") || "../fhem/",
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
                    var regDevice = /\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9]\.?[0-9]{0,3}\s(\S*)\s(\S*)\s(.*)/;
                    var regDate = /^([0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9])\.?[0-9]{0,3}\s/;
					var regParaname = /^(\S{3,}):(?:\s(.*))?$/;
					lines.pop(); //remove last empty line
					
					for (var i=currLine; i < lines.length; i++) {
						var date;
                        //date = ..... new Date(); //do we need this?
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
								DEBUG && console.log(date + ' / ' + key+' / '+paraname+' / '+val);
                                plugins.update(key,paraname);
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
		url: $("meta[name='fhemweb_url']").attr("content") || "../fhem/",
		data: {
			cmd: "list " + devs.join() + " " + paraname,
			XHR: "1"
		}
	})
	.fail (function(jqXHR, textStatus, errorThrown) {
    		$.toast("Error: " + textStatus + ": " + errorThrown);
  	})
  	.done (function( data ) {
			var lines = data.replace(/\n\)/g,")\n").split(/\n/);
            var regCapture = /^(\S*)\s*([0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9])?\.?[0-9]{0,3}\s+(.*)$/;
			for (var i=0; i < lines.length; i++) {
                var date,key,val;
				var line = $.trim( lines[i] );
                //console.log(line);
                if (regCapture.test(line) ) {
                    var groups = line.match( regCapture );
                    key = $.trim( line.match( regCapture )[1]);
                    if (groups.length>2){
                        date = $.trim( line.match( regCapture )[2]);
                        val = $.trim( line.match( regCapture )[3]);
                    }
                    else{
                        //date = ..... new Date(); //do we need this?
                        val = $.trim( line.match( regCapture )[2]);
                    }
					var params = deviceStates[key] || {};
					var paraname = this.paraname;
					var value = {"date": date, "val": val};
					params[paraname]=value;
                    if (key in devices){
						deviceStates[key]=params;
                        plugins.update(key,paraname);
                    }
				}
			}
	});

}

function loadplugin(plugin, success, error) {
    dir = $('script[src$="fhem-tablet-ui.js"]').attr('src');
    var name = dir.split('/').pop(); 
    dir = dir.replace('/'+name,"");
    $.ajax({
        url: dir + '/'+plugin+'.js',
        dataType: "script",
        cache: true,
        //async: false,
        context:{name: name},
        success: success||function(){ return true },
        error: error||function(){ return false },
    });
}

this.getPart = function (s,p) {
	if ($.isNumeric(p)){
		var c = (s && typeof s != "undefined") ? s.split(" ") : '';
		return (c.length >= p && p>0 ) ? c[p-1] : s;
	}
	else {
		if ((s && typeof s != "undefined") )
			var matches = s.match( RegExp('^' + p + '$') );
		var ret='';
		if (matches) {
			for (var i=1;i<matches.length;i++) {
				ret+=matches[i];
			}
		}
		return ret;
	}
};

this.getDeviceValue = function (device, src) {
    var param = getParameter(device, src);
    return ( param ) ? param.val : null;
}

this.getReadingDate = function (device, src) {
    var param = getParameter(device, src);
    return ( param ) ? param.date : null;
}

this.getParameter = function (device, src) {
    var devname	= device.data('device');
    var paraname =	(src && src != '') ? device.data(src) : Object.keys(readings)[0];
    if (devname && devname.length>0){
        var params = deviceStates[devname];
        return ( params && params[paraname] ) ? params[paraname] : null;
    }
    return null;
}

// global helper functions
this.showModal = function (modal) {
    if(modal)
        $("#shade").fadeIn();
    else
       $("#shade").fadeOut();
}

// global date format functions
this.dateFromString = function (str) {
 var m = str.match(/(\d+)-(\d+)-(\d+)_(\d+):(\d+):(\d+).*/);
 return (m)?new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]):new Date();
}

this.diffMinutes = function(date1,date2){
       var end   = dateFromString(date2),
       start   = dateFromString(date1),
       diff  = new Date(end - start);
       return (diff/1000/60).toFixed(0);
}
   
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.getDate().toString();
  return yyyy+'-'+ (mm[1]?mm:"0"+mm[0])+'-'+(dd[1]?dd:"0"+dd[0]); // padding
 };

Date.prototype.hhmmss = function() {
  var hh = this.getHours().toString();
  var mm = this.getMinutes().toString();
  var ss  = this.getSeconds().toString();
  return (hh[1]?hh:"0"+hh[0])+':'+ (mm[1]?mm:"0"+mm[0])+':'+(ss[1]?ss:"0"+ss[0]); // padding
 };
 
 Date.prototype.mmdd = function() {
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.getDate().toString();
  return (mm[1]?mm:"0"+mm[0])+'-'+(dd[1]?dd:"0"+dd[0]); // padding
 };
