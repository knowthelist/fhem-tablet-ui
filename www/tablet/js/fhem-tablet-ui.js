/* FHEM tablet ui */
/**
* Just another dashboard for FHEM
*
* Version: 1.5.1
* Requires: jQuery v1.7+, font-awesome, jquery.gridster, jquery.toast
*
* Copyright (c) 2015 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
*/
var deviceStates={};
var readings = {"STATE":true};
var devices = {};
var types = [];

var DEBUG = false;
var DEMO = false;
var debuglevel;
var TOAST = true;
var doLongPoll = false;
var longPollRequest;
var shortPollTimer;
var longPollTimer;
var dir = '';
var fhem_dir = '';

var filename = '';
var shortpollInterval = 30 * 1000; // 30 seconds
var devs = [];
var pars = [];
var gridster;
var styleCollection={};
var stdColors=["green","orange","red","ligthblue","blue","gray"];

var plugins = {
  modules: [],
  addModule: function (module) {
    this.modules.push(module);
  },
  load: function (name) {
    return loadplugin(name, function () {
		var module = eval(name);
        plugins.addModule(module);
        module.init();
        //update all what we have until now
        for (var device in devices) {
            var params = deviceStates[device];
            for (var reading in params) {
                if(readings[reading]){
                    module.update(device,reading);
                }
            }
        }
        //fill missing readings
        for (var reading in readings) {
            if (pars.indexOf(reading)<0){
                pars.push(reading);
            }
        }
        DEBUG && console.log('Loaded plugin: '+ name);
    },null,true);
  },
  update: function (dev,par) {  
    $.each(this.modules, function (index, module) {
      //Iterate each module and run update function
      module.update(dev,par);
    });
    DEBUG && console.log('update done for device:'+dev+' parameter:'+par);
  }
}

// ToDo: switch step by step to encapsulation of FTUI as an object literal
var ftui = {
    requests: {'waiting':0,'running':0,'waitTime':100,'maxRunning':4},
    states: {'lastSetOnline':0,'longPollRestart':false},
    paramIdMap:{},
    timestampMap:{},
    init: function() {
    },
    initPage: function(){
        initPage();
    },
    shortPoll: function() {
        var reading = null;
        ftui.log(1,'start shortpoll');
        // invalidate all readings for detection of outdated ones
        for (var device in devices) {
            var params = deviceStates[device];
            for (reading in params) {
                params[reading].valid = false;
            }
        }
        // request only the needed readings from FHEM
        ftui.requests.waiting = Object.keys(readings).length;
        ftui.requests.length = ftui.requests.waiting;
        ftui.requests.startTime = new Date();
        ftui.log(1,'shortPoll - waiting requests:'+ftui.requests.waiting);
        for (reading in readings) {
            requestFhem(reading);
        }
    },
    decreaseRequests: function( settings ) {
        ftui.requests.waiting--;
        if (ftui.requests.waiting === 0){
            var duration = diffSeconds(ftui.requests.startTime,new Date());
            if (DEBUG) ftui.toast("Full refresh done in "
                                  +duration+"s for "
                                  +ftui.requests.length+" readings");
            ftui.log(1,'shortPoll - Done');
            ftui.onUpdateDone();
        }
    },
    onUpdateDone: function(){
        $(document).trigger("updateDone");
        ftui.checkInvalidElements();
    },
    checkInvalidElements: function(){
        $('div.autohide[data-get]').each(function(index){
            var elem = $(this);
            var valid = elem.getReading('get').valid;
            if ( valid && valid===true )
                elem.removeClass('invalid');
            else
                elem.addClass('invalid');
        });
    },
    setOnline: function(){
        var ltime = new Date().getTime() / 1000;
        if ((ltime - ftui.states.lastSetOnline) > 60){
            if (DEBUG) ftui.toast("Network connected");
            ftui.states.lastSetOnline = ltime;
            startShortPollInterval(500);
            if (!doLongPoll){
                doLongPoll  = ($("meta[name='longpoll']").attr("content") == '1');
                if ( doLongPoll )
                    startLongPollInterval(5000);
            }
            ftui.log(1,'FTUI is online');
        }
    },
    setOffline: function(){
        if (DEBUG) ftui.toast("Lost network connection");
        doLongPoll = false;
        clearInterval(shortPollTimer);
        clearInterval(longPollTimer);
        if (longPollRequest)
            longPollRequest.abort();
        ftui.saveStatesLocal();
        ftui.log(1,'FTUI is offline');
    },
    saveStatesLocal: function(){
        //save deviceStates into localStorage
        var dataToStore = JSON.stringify(deviceStates);
        localStorage.setItem('deviceStates', dataToStore);
    },
    restartLongPoll: function(){
        ftui.toast("Disconnected from FHEM");
        if ( doLongPoll ){
            ftui.toast("Retry to connect in 10 seconds");
            setTimeout(function(){
                longPoll();
            }, 10000);
        }
    },
    toast: function(text){
        if (TOAST)
            $.toast(text);
    },
    log: function(level,text){
        if (debuglevel >= level)
            console.log(text);
    },
}

// event page is loaded
$(document).on('ready', function() {

    //new encapsulated FTUI
    ftui.init();
    $(ftui).on('shortpollfinished', function(){
        $.toast("shortpollfinished");
    });

    //add background for modal dialogs
    $("<div id='shade' />").prependTo('body').hide();
    $("#shade").on('click',function() {
        $(document).trigger("shadeClicked");
    });
	
    loadStyleSchema();
    initPage();

    if ( doLongPoll ){
        var longpollDelay = $("meta[name='longpoll_delay']").attr("content");
        if (!$.isNumeric(longpollDelay)) longpollDelay = (typeof wvcDevices != 'undefined')?shortpollInterval:100;
        startLongPollInterval(longpollDelay);
    }

    $("*:not(select)").focus(function(){
        $(this).blur();
    });

    // refresh every x secs
    startShortPollInterval();
});

function initPage() {

    wx = parseInt( $("meta[name='widget_base_width']").attr("content") );
    wy = parseInt( $("meta[name='widget_base_height']").attr("content") );
    if ( $("meta[name='widget_margin']").attr("content") )
      wm = parseInt( $("meta[name='widget_margin']").attr("content") );
    else
      wm = 5;
	doLongPoll = ($("meta[name='longpoll']").attr("content") == '1');
    DEMO = ($("meta[name='demo']").attr("content") == '1');
    debuglevel  = $("meta[name='debug']").attr("content") || 0;
    DEBUG = ( debuglevel>0 );
    TOAST  = ($("meta[name='toast']").attr("content") != '0');
	
	//self path
    dir = $('script[src*="fhem-tablet-ui"]').attr('src');
	var name = dir.split('/').pop(); 
	dir = dir.replace('/'+name,"");
	DEBUG && console.log('Plugin dir: '+dir);

    var url = window.location.pathname;
    filename = url.substring(url.lastIndexOf('/')+1);
    DEBUG && console.log('Filename: '+filename);

    fhem_dir = $("meta[name='fhemweb_url']").attr("content") || "/fhem/";
    DEBUG && console.log('FHEM dir: '+fhem_dir);

    //init gridster
    if ($.fn.gridster){
        if (gridster)
            gridster.destroy();
        gridster = $(".gridster > ul").gridster({
          widget_base_dimensions: [wx, wy],
          widget_margins: [wm, wm],
          draggable: {
            handle: '.gridster li > header'
          }
        }).data('gridster');
        if($("meta[name='gridster_disable']").attr("content") == '1') {
            gridster.disable();
        }
        if($("meta[name='gridster_starthidden']").attr("content") == '1') {
            $('.gridster').hide();
        }
    }
	
    //include extern html code
    var total = $('[data-template]').length;
    if (total>0){
        $('[data-template]').each(function(index) {
            var tempelem = $(this);
            $.get(
                tempelem.data('template'),
                {},
                function (data) {
                    var parValues = tempelem.data('parameter');
                    for (var key in parValues) {
                        data = data.replace(new RegExp(key, 'g'), parValues[key]);
                    }
                    tempelem.html(data);
                    if (index === total - 1) {
                        //continue after loading the includes
                        initWidgets();
                    }
                }
            );
        });
    }
    else{
       //continue immediately with initWidgets
       initWidgets();
    }

}

function initReadingsArray(get) {
    if(! $.isArray(get)) {
        get = new Array(get);
    }
    for(var g=0; g<get.length; g++) {
        var reading = get[g];
        // fully qualified readings => DEVICE:READING
        if(reading.match(/:/)) {
            var fqreading = reading.split(':');
            var device = fqreading[0]
            if(!devices[device] && typeof device != 'undefined' && device !== 'undefined' ){
                devices[device] = true;
                devs.push(device);
            }
            reading = fqreading[1];
        }
        if(!readings[reading] && !reading.match(/^[#\.\[].*/)){
            readings[reading] = true;
            pars.push(reading);
        }
    }
}

function initWidgets(sel) {
    
    sel = (typeof sel !== 'undefined') ? sel : '';
    readings = {"STATE":true};
    devices = {};
    types = [];
    devs = [];
    pars = [];

    //restore device states from storage
    if (!DEMO)
        deviceStates=JSON.parse(localStorage.getItem('deviceStates')) || {};
    else {
        $.ajax({async: false,url: "/fhem/tablet/data/"+filename.replace(".html",".dat"),})
        .done ( function( data ) {deviceStates=JSON.parse(data) || {};});
    }
    showDeprecationMsg();

    //collect required widgets types
    $(sel+' div[data-type]').each(function(index){
        var type = $(this).data("type");
        if (types.indexOf(type)<0){
              types.push(type);
        }
    });

    //collect required devices
    $(sel+' div[data-device]').each(function(index){
        var device = $(this).data("device");
        if (!device.match(/^[#\.\[].*/)){
            if(!devices[device] && typeof device != 'undefined' && device !== 'undefined' ){
                devices[device] = true;
                devs.push(device);
            }
        }
    });

    //collect required readings
    DEBUG && console.log('Collecting required readings');
    $(sel+' [data-get]').each(function(index){
        var param = $(this).data("get");
        initReadingsArray(param);
    });

    //init widgets
    var deferredArr = $.map(types, function(widget_type, i) {
        return plugins.load('widget_'+widget_type);
    });

    //get current values of readings not before all widgets are loaded
    $.when.apply(this, deferredArr).then(function() {
        DEBUG && console.log('Request readings from FHEM');
        ftui.shortPoll();
    });
}

function showDeprecationMsg() {
    //make it HTML conform (remove this after migration)
    //end **** (remove this after migration)
}

function startShortPollInterval(delay) {
    clearInterval(shortPollTimer);
    shortPollTimer = setTimeout(function () {
        //get current values of readings every x seconds
        ftui.shortPoll();
        startShortPollInterval() ;
     }, delay || shortpollInterval);
 }

function startLongPollInterval(interval) {
    if (DEBUG) ftui.toast("Start Longpoll in " + interval/1000 + "s");
    clearInterval(longPollTimer);
    longPollTimer = setTimeout(function() {
        longPoll();
    }, interval);
    shortpollInterval = 15 * 60 * 1000; // 15 minutes
}

function setFhemStatus(cmdline) {
    if (DEMO) {console.log('DEMO-Mode: no setFhemStatus');return;}
    startShortPollInterval();
    cmdline = cmdline.replace('  ',' ');
    DEBUG && console.log('send to FHEM: '+cmdline);
	$.ajax({
		async: true,
        cache:false,
        url: fhem_dir,
		data: {
			cmd: cmdline,
			XHR: "1"
		}
	})
	.fail (function(jqXHR, textStatus, errorThrown) {
            TOAST && $.toast("Error: " + textStatus + ": " + errorThrown);
	})
  	.done ( function( data ) {
        if ( !doLongPoll ){
			setTimeout(function(){
                ftui.shortPoll();
			}, 4000);
		}
	});
}

var xhr;
var currLine=0;
function longPoll(roomName) {
    if (DEMO) {console.log('DEMO-Mode: no longpoll');return;}
    ftui.log(1,(ftui.states.longPollRestart)?"Longpoll re-started":"Longpoll started");
    if (xhr)
        xhr.abort();
    if (longPollRequest)
        longPollRequest.abort();
    currLine=0;
    if (DEBUG) {
        if (ftui.states.longPollRestart)
            ftui.toast("Longpoll re-started");
        else
            ftui.toast("Longpoll started");
    }
    ftui.states.longPollRestart=0;
    longPollRequest=$.ajax({
        url: fhem_dir,
		cache: false,
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
    				return;
  				}
				if ( e.target.readyState == 3 )
				{
					var lines = data.replace(/<br>/g,"").split(/\n/);
                    var regDevice = /\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9]\.?[0-9]{0,3}\s(\S*)\s(\S*)\s(.*)/;
                    var regDate = /^([0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9])\.?[0-9]{0,3}\s/;
                    var regParaname = /^(\S{2,}):(?:\s(.*))?$/;
					lines.pop(); //remove last empty line
					
                    for (var i=currLine, len = lines.length; i < len; i++) {
						var date;
                        //date = ..... new Date(); //do we need this?
						var line = $.trim( lines[i] );
                        //console.log('#'+line+'#');
						if ( regDate.test( line ))
							date = $.trim(line.match( regDate )[1]);
						if ( regDevice.test( line )) {
							//Bad parse hack, but the JSON is not well formed
							var room = $.trim( line.match( regDevice )[1] );
                            var dev = $.trim( line.match( regDevice )[2] );
							var parname_val = $.trim(line.match( regDevice )[3]);
                            var params = deviceStates[dev] || {};
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
//              console.log('TEST +dev:' + dev+ '+  para:'+paraname+'+   val:'+val+'+');
              // Special hack for readingsGroups (all params will be accepted)
              if ( ( ( room == 'readingsGroup' ) && (dev in devices) ) ||
                                 ( (paraname in readings) && (dev in devices) ) ) {
								var value = {"date": date,
                                             "room": room,
                                              "val": val,
                                              "valid": true
                                            };
								params[paraname]=value;
                                deviceStates[dev]=params;
                                DEBUG && console.log(date + ' / ' + dev+' / '+paraname+' / '+val);
                                plugins.update(dev,paraname);
							}
                            //console.log(date + ' / ' + dev+' / '+paraname+' / '+val);
						}
					}
                    currLine = lines.length;
                    if (currLine>1024){
                        ftui.states.longPollRestart=true;
                        longPollRequest.abort();
                    }
				}
     		}, false);
			return xhr;
			}
    })
    .done ( function( data ) {
        if (ftui.states.longPollRestart)
            longPoll(roomName);
        else{
            ftui.log(1,"Disconnected from FHEM - poll done - "+data);
            ftui.restartLongPoll();
        }
    })
    .fail (function(jqXHR, textStatus, errorThrown) {
        if (ftui.states.longPollRestart)
            longPoll(roomName);
        else{
            ftui.log(1,"Error while longpoll: " + textStatus + ": " + errorThrown);
            ftui.restartLongPoll();
        }
    });
}
            
function requestFhem(paraname, devicename) {
    if (DEMO) {console.log('DEMO-Mode: no requestFhem');return;}
    var devicelist;

    // paraname = DEVICE:READING; devicename is ignored
    if(paraname.match(/:/)) {
        var temp = paraname.split(':');
        devicename = temp[0];
        paraname = temp[1];
    }
    
    if(typeof devicename != 'undefined' && devicename !== 'undefined') {
        devicelist = devicename;
    } else {
        devicelist = $.map(devs, $.trim).join();
    }

    // if too much requests are running in paralell, then delay next request
    if ( ftui.requests.running > ftui.requests.maxRunning ){
        setTimeout(function() { requestFhem(paraname, devicename) }, ftui.requests.waitTime);
    }
    else{
        ftui.log(5,'starting new AJAX. still running:'+ftui.requests.running);

        /* 'list' is still the fastest cmd to get all important data
        */
        if(typeof paraname != 'undefined' && paraname !== 'undefined' && paraname !== '' &&
           typeof devicelist != 'undefined' && devicelist !== 'undefined' && devicelist !== '') {
        ftui.requests.running++;
        $.ajax({
            async: true,
            timeout: 15000,
            cache: false,
            context:{paraname: paraname},
            url: fhem_dir,
            data: {
                cmd: ["list",devicelist,paraname].join(' '),
                XHR: "1"
            },
           beforeSend: function(jqXHR, settings) {
               jqXHR.url = settings.url;
           },
           error: function(jqXHR, exception) {
               //alert(jqXHR.url);
           }
        })
        .fail (function(jqXHR, textStatus, errorThrown) {
            if (DEBUG) ftui.toast("Error: " + textStatus + ": " + errorThrown  + ": " +  ftui.requests.running);
            ftui.requests.running--;
            ftui.decreaseRequests();
        })
        .done (function( data ) {
            ftui.requests.running--;
            if (debuglevel>=5) console.log('finished AJAX request. still running:'+ftui.requests.running);
            var paraname = this.paraname;
            var lines = data.replace(/\n\)/g,")\n").split(/\n/);
            var regCapture = /^(\S*)\s*([0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9])?\.?[0-9]{0,3}\s+(.*)$/;
            for (var i=0, len=lines.length; i < len; i++) {
                var date="";
                var dev="";
                var val="";
                var line = $.trim( lines[i] );
                if (debuglevel>=6) console.log('line: '+line);
                if (regCapture.test(line) ) {
                    var groups = line.match( regCapture );
                    dev = $.trim( line.match( regCapture )[1]);
                    if (dev in devices){
                        if (groups.length>2){
                            date = $.trim( groups[2]);
                            val = $.trim( groups[3]);
                        }
                        if (debuglevel>=5) console.log('requestFhem::done: Line parser result: dev:'+dev+' paraname:'+paraname+' date:'+date+' val:'+val);

                        var oldParams = getParameterByName(dev,paraname);
                        var params = deviceStates[dev] || {};
                        var value = {"date": date, "val": val, "valid": true};
                        params[paraname]=value;
                        deviceStates[dev]=params;

                        //check if update is necessary
                        if(!oldParams || oldParams.val!=val || oldParams.date!=date){
                            plugins.update(dev,paraname);
                        }

                    }
                }
            }
            ftui.decreaseRequests();
        });
    }
    }
}

$(window).on('beforeunload', function(){
    ftui.log(5,'beforeunload');
    ftui.setOffline();
});

$(window).on('online offline', function() {
    ftui.log(5,'online offline');
    if (navigator.onLine)
        ftui.setOnline();
    else
        ftui.setOffline();
});

function loadplugin(plugin, success, error, async) {
    return dynamicload('js/'+plugin+'.js', success, error, async);
}

function dynamicload(file, success, error, async) {
    var cache = (DEBUG) ? false : true;
    return $.ajax({
        url: dir + '/../' + file,
        dataType: "script",
        cache: cache,
        async: async || false,
        context:{name: name},
        success: success||function(){ return true },
        error: error||function(){ return false },
    });
}

function loadStyleSchema(){
    $.each($('link[href$="-ui.css"],link[href$="-ui.min.css"]') , function (index, thisSheet) {
        if (!thisSheet || !thisSheet.sheet || !thisSheet.sheet.cssRules) return;
        var rules = thisSheet.sheet.cssRules;
        for (var r in rules){
            if (rules[r].style){
               var styles = rules[r].style.cssText.split(';');
               styles.pop();
               var elmName = rules[r].selectorText;
               var params = {};
               for (var s in styles){
                   var param = styles[s].toString().split(':');
                   if (param[0].match(/color/)){
                      params[$.trim(param[0])]=$.trim(param[1]).replace('! important','').replace('!important','');
                   }
               }
               if (Object.keys(params).length>0)
                   styleCollection[elmName]=params;
            }
        }
    });
}

this.getPart = function (s,p) {
	if ($.isNumeric(p)){
		var c = (s && typeof s != "undefined") ? s.split(" ") : '';
		return (c.length >= p && p>0 ) ? c[p-1] : s;
	}
	else {
		if ((s && typeof s != "undefined") )
            var matches = s.match( new RegExp('^' + p + '$') );
        var ret='';
		if (matches) {
			for (var i=1;i<matches.length;i++) {
				ret+=matches[i];
			}
		}
		return ret;
	}
};

this.getDeviceValueByName = function (devname, paraname) {
    var param = getParameterByName(devname, paraname);
    return ( param ) ? param.val : null;
}
this.getDeviceValue = function (device, src) {
    var param = getParameter(device, src);
    return ( param ) ? param.val : null;
}

this.getReadingDateByName = function (devname, paraname) {
    var param = getParameterByName(devname, paraname);
    return ( param ) ? param.date : null;
}
this.getReadingDate = function (device, src) {
    var param = getParameter(device, src);
    return ( param ) ? param.date : null;
}

this.getParameterByName = function (devname, paraname) {
    // devname = DEVICE:READING; paraname is ignored
    if(devname.match(/:/)) {
        var temp = devname.split(':');
        devname = temp[0];
        paraname = temp[1];
    }
    paraname = paraname || Object.keys(readings)[0];
    if (devname && devname.length>0){
        var params = deviceStates[devname];
        return ( params && params[paraname] ) ? params[paraname] : null;
    }
    return null;
}
this.getParameter = function (elem, src) {
    var device	= elem.data('device');
    var paraname =	(src && src != '') ? elem.data(src) : Object.keys(readings)[0];
    if (device && device.length>0){
        var params = deviceStates[device];
        return ( params && params[paraname] ) ? params[paraname] : null;
    }
    return null;
}

this.hasSubscription = function (device, paraname) {
    var get = device.data('get');
    if(! $.isArray(get)) {
        get = new Array(get);
    }

    var pars;
    if(paraname.match(/,/)) {
        pars = paraname.split(',');
    } else {
        pars = new Array(paraname);
    }

    for(var g=0; g<get.length; g++) {
        for(var p=0; p<pars.length; p++) {
            var reading;
            if(get[g] && get[g].match(/:/)) {
                reading = get[g].split(':')[1];
            } else {
                reading = get[g];
            }
            if(pars[p] == reading) {
                return true;
            }
        }
    }
    return false;
}

this.getStyle = function (selector, prop) {
    var props = styleCollection[selector];
    return ( props && props[prop] ) ? props[prop] : null;
}

this.getClassColor = function (elem) {
    for (var i=0, len=stdColors.length; i<len; i++) {
        if ( elem.hasClass(stdColors[i]) ){
            return getStyle('.'+stdColors[i],'color');
        }
    }
    return null;
}

this.getIconId = function(iconName){
    if (!iconName || iconName=='')
        return "?";
    var rules = $('link[href$="font-awesome.min.css"]')[0].sheet.cssRules;
    for (var rule in rules){
        if ( rules[rule].selectorText && rules[rule].selectorText.match(new RegExp(iconName+':') )){
            var id = rules[rule].style.content;
            if (!id)
                return iconName;
            id = id.replace(/"/g,'').replace(/'/g,"");
            return (/[^\u0000-\u00ff]/.test(id))
                    ? id
                    : String.fromCharCode(parseInt(id.replace('\\',''),16));
        }
    }
}

// global helper functions
this.isValid = function(v){
    return (typeof v !== 'undefined' && v !== 'undefined'
         && typeof v !== typeof notusedvar
         && v !== '' && v !== ' ');
}

this.showModal = function (modal) {
    if(modal)
        $("#shade").fadeIn();
    else
       $("#shade").fadeOut();
}

// global date format functions
this.dateFromString = function (str) {
 var m = str.match(/(\d+)-(\d+)-(\d+)[_\s](\d+):(\d+):(\d+).*/);
 var m2 = str.match(/(\d\d).(\d\d).(\d\d\d\d)/);
 var offset = new Date().getTimezoneOffset();
 return (m) ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6])
            : (m2) ? new Date(+m2[3], +m2[2] - 1, +m2[1], 0, -offset, 0, 0)
            : new Date();
}

this.diffMinutes = function(date1,date2){
       var diff  = new Date(date2 - date1);
       return (diff/1000/60).toFixed(0);
}

this.diffSeconds = function(date1,date2){
       var diff  = new Date(date2 - date1);
       return (diff/1000).toFixed(1);
}

this.mapColor = function(value) {
    return getStyle('.'+value,'color') || value;
};

String.prototype.toDate = function() {
    return dateFromString(this);
}

Date.prototype.addMinutes = function(minutes) {
    return new Date(this.getTime() + minutes*60000);
}

Date.prototype.ago = function() {
  var now = new Date();
  var ms = (now - this) ;
  var x = ms / 1000;
  var seconds = Math.round(x % 60);
      x /= 60;
  var minutes = Math.round(x % 60);
      x /= 60;
  var hours = Math.round(x % 24);
      x /= 24;
  var days = Math.round(x);
  var userLang = navigator.language || navigator.userLanguage;
  var strUnits = (userLang.split('-')[0] === 'de')?['Tage','Stunden','Minuten','Sekunden']:['days','hours','minutes','seconds'];
  var ret = (days>0)?days +" "+strUnits[0]+ " ":"";
      ret += (hours>0)?hours +" "+strUnits[1]+ " ":"";
      ret += (minutes>0)?minutes +" "+strUnits[2]+ " ":"";
  return ret + seconds +" "+ strUnits[3];
 };
   
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.getDate().toString();
  return yyyy+'-'+ (mm[1]?mm:"0"+mm[0])+'-'+(dd[1]?dd:"0"+dd[0]); // padding
 };

Date.prototype.hhmm = function() {
  var hh = this.getHours().toString();
  var mm = this.getMinutes().toString();
  return (hh[1]?hh:"0"+hh[0])+':'+ (mm[1]?mm:"0"+mm[0]); // padding
 };

Date.prototype.hhmmss = function() {
  var hh = this.getHours().toString();
  var mm = this.getMinutes().toString();
  var ss  = this.getSeconds().toString();
  return (hh[1]?hh:"0"+hh[0])+':'+ (mm[1]?mm:"0"+mm[0])+':'+(ss[1]?ss:"0"+ss[0]); // padding
 };
 
Date.prototype.ddmm = function() {
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.getDate().toString();
  return (dd[1]?dd:"0"+dd[0])+'.'+(mm[1]?mm:"0"+mm[0])+'.'; // padding
 };

Date.prototype.eeee = function() {
    var weekday_de = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
    var weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var userLang = navigator.language || navigator.userLanguage;
    if(userLang.split('-')[0] === 'de')
        return weekday_de[this.getDay()];
    return weekday[this.getDay()];
 };

Date.prototype.eee = function() {
    var weekday_de = ['Son','Mon','Die','Mit','Don','Fre','Sam'];
    var weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var userLang = navigator.language || navigator.userLanguage;
    if(userLang.split('-')[0] === 'de')
        return weekday_de[this.getDay()];
    return weekday[this.getDay()];
 };

Date.prototype.ee = function() {
    var weekday_de = ['So','Mo','Di','Mi','Do','Fr','Sa'];
    var weekday = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    var userLang = navigator.language || navigator.userLanguage;
    if(userLang.split('-')[0] === 'de')
        return weekday_de[this.getDay()];
    return weekday[this.getDay()];
 };

//sadly it not possible to use Array.prototype. here
this.indexOfGeneric = function(array,find){
  if (!array) return -1;
  for (var i=0;i<array.length;i++) {
    if (!$.isNumeric(array[i]))
        return indexOfRegex(array,find);
  }
  return indexOfNumeric(array,find);
};

this.indexOfNumeric = function(array,val){
   var ret=-1;
   for (var i=0;i<array.length;i++) {
       if (Number(val)>=Number(array[i]))
           ret=i;
   }
   return ret;
};

this.indexOfRegex = function(array,find){
  for (var i=0;i<array.length;i++) {
      try {
        var match = find.match(new RegExp('^'+array[i]+'$'));
      	if (match)
            return i
      } catch(e) {}
  }
  return array.indexOf(find);
};

$.fn.once = function(a, b) {
    return this.each(function() {
        $(this).off(a).on(a,b);
    });
};
