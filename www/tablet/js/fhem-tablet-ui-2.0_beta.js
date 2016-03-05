/* FHEM tablet ui */
/**
* UI builder framework for FHEM
*
* Version: 2.0.0
*
* Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*
*/

// depricated global variables
var deviceStates={};
var readings = {"STATE":true};
var devices = {};
var types = [];
var dir;
var filename;

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
        for (var key in ftui.paramIdMap) {
           module.update(ftui.paramIdMap[key].device,ftui.paramIdMap[key].reading);
        }
        ftui.log(1,'Loaded plugin: '+ name);
    },null,true);
  },
  update: function (dev,par) {  
    $.each(this.modules, function (index, module) {
      //Iterate each module and run update function
      module.update(dev,par);
    });
      ftui.log(1,'update done for "'+dev+':'+par+'"');
  }
}

var ftui = {
   config: {
        DEBUG: false,
        DEMO:false,
        debuglevel:0,
        doLongPoll:false,
        shortpollInterval:30 * 1000,
        styleCollection:{},
        stdColors:["green","orange","red","ligthblue","blue","gray"],
    },
    poll: {currLine:0,xhr:null,longPollRequest:null,shortPollTimer:null,longPollTimer:null,},
    states: {'lastSetOnline':0,'longPollRestart':false},
    paramIdMap:{},
    timestampMap:{},
    gridster:{instance:null,wx:0,wy:0,wm:5},

    init: function() {
        ftui.paramIdMap={};
        ftui.timestampMap={};
        ftui.loadStyleSchema();
        ftui.gridster.wx = parseInt( $("meta[name='widget_base_width']").attr("content") );
        ftui.gridster.wy = parseInt( $("meta[name='widget_base_height']").attr("content") );
        if ( $("meta[name='widget_margin']").attr("content") )
          ftui.gridster.wm = parseInt( $("meta[name='widget_margin']").attr("content") );
        ftui.config.doLongPoll = ($("meta[name='longpoll']").attr("content") == '1');
        ftui.config.DEMO = ($("meta[name='demo']").attr("content") == '1');
        ftui.config.debuglevel  = $("meta[name='debug']").attr("content") || 0;
        ftui.config.DEBUG = ( ftui.config.debuglevel>0 );
        ftui.config.TOAST  = ($("meta[name='toast']").attr("content") != '0');

        //self path
        dir = $('script[src*="fhem-tablet-ui"]').attr('src');
        var name = dir.split('/').pop();
        dir = dir.replace('/'+name,"");
        ftui.log(1,'Plugin dir: '+dir);
        var url = window.location.pathname;
        filename = url.substring(url.lastIndexOf('/')+1);
        ftui.log(1,'Filename: '+filename);
        ftui.fhem_dir = $("meta[name='fhemweb_url']").attr("content") || "/fhem/";
        ftui.log(1,'FHEM dir: '+ftui.fhem_dir);

        //add background for modal dialogs
        $("<div id='shade' />").prependTo('body').hide();
        $("#shade").on('click',function() {
            $(document).trigger("shadeClicked");
        });

        ftui.readStatesLocal();
        ftui.initPage();
        ftui.initLongpoll();

        $("*:not(select)").focus(function(){
            $(this).blur();
        });

        // refresh every x secs
        ftui.startShortPollInterval();
    },

    initPage: function(){
        //init gridster
        if ($.fn.gridster){
            if (ftui.gridster.instance)
                ftui.gridster.instance.destroy();
            ftui.gridster.instance = $(".gridster > ul").gridster({
              widget_base_dimensions: [ftui.gridster.wx, ftui.gridster.wy],
              widget_margins: [ftui.gridster.wm, ftui.gridster.wm],
              draggable: {
                handle: '.gridster li > header'
              }
            }).data('gridster');
            if($("meta[name='gridster_disable']").attr("content") == '1') {
                ftui.gridster.instance.disable();
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
                            ftui.initWidgets();
                        }
                    }
                );
            });
        }
        else{
           //continue immediately with initWidgets
          ftui.initWidgets();
        }
    },

    initWidgets: function(sel) {

        sel = (typeof sel !== 'undefined') ? sel : '';
        readings = {"STATE":true};
        devices = {};
        types = [];
        ftui.paramIdMap = {};
        ftui.timestampMap = {};

        //collect required widgets types
        $(sel+' div[data-type]').each(function(index){
            var type = $(this).data("type");
            if (types.indexOf(type)<0){
                  types.push(type);
            }
        });

        //init widgets
        var deferredArr = $.map(types, function(widget_type, i) {
            return plugins.load('widget_'+widget_type);
        });

        //get current values of readings not before all widgets are loaded
        $.when.apply(this, deferredArr).then(function() {
            ftui.log(1,'Request readings from FHEM');
            setTimeout(function(){
                ftui.shortPoll();
            }, 50);
        });
    },

    initLongpoll: function(){
        if ( ftui.config.doLongPoll ){
            var longpollDelay = $("meta[name='longpoll_delay']").attr("content");
            if (!$.isNumeric(longpollDelay)) longpollDelay = (typeof wvcDevices != 'undefined')?ftui.config.shortpollInterval:100;
            ftui.startLongPollInterval(longpollDelay);
        }
    },

    startShortPollInterval: function(delay) {
        clearInterval(ftui.shortPollTimer);
        ftui.shortPollTimer = setTimeout(function () {
            //get current values of readings every x seconds
            ftui.shortPoll();
            ftui.startShortPollInterval() ;
         }, delay || ftui.config.shortpollInterval);
    },

    startLongPollInterval: function(interval) {
        if (ftui.config.DEBUG) ftui.toast("Start Longpoll in " + interval/1000 + "s");
        clearInterval(ftui.longPollTimer);
        ftui.longPollTimer = setTimeout(function() {
            ftui.longPoll();
        }, interval);
        ftui.config.shortpollInterval = 15 * 60 * 1000; // 15 minutes
    },

    shortPoll: function() {
        var reading = null;
        ftui.log(1,'start shortpoll');
        var startTime = new Date();
        var paramCount = Object.keys(ftui.paramIdMap).length;
        if (paramCount===0)
            return;

        // invalidate all readings for detection of outdated ones
        for (var device in devices) {
            var params = deviceStates[device];
            for (reading in params) {
                params[reading].valid = false;
            }
        }
        //Request all devices from FHEM
        $.getJSON(ftui.fhem_dir,
                  {cmd: 'jsonlist2',
                   XHR:1,
                   timeout: 30000},  function (data) {

            // function to convert results
            function DevicesJSON(fhemJSON) {
                this.length = fhemJSON.Results.length;
                var results = fhemJSON.Results;
                for(var i = 0; i < this.length; i++)
                   this[results[i].Name] = results[i];
            }
            // function to import data
            function checkReading(device,section){
               for (var reading in section) {
                 var paramid = (reading==='STATE') ? device : [device,reading].join('-');
                 if( ftui.paramIdMap[paramid] ){
                       var newParam = section[reading];
                       if (typeof newParam!=='object')
                             newParam={"Value": newParam,"Time": ''};
                       var oldParam = getParameterByName(device,reading);
                       var isUpdated = (!oldParam || oldParam.val!=newParam.Value || oldParam.date!=newParam.Time);

                       // update deviceStates
                       var params = deviceStates[device] || {};
                       var param = params[reading]  || {};
                       param.date = newParam.Time;
                       param.val = newParam.Value;
                       param.valid = true;
                       params[reading] = param;
                       deviceStates[device]= params;

                       //update widgets only if necessary
                       if(isUpdated){
                           plugins.update(device,reading);
                       }
                 }
               }
            }
            // convert from indexed array to associative array
            var devicesJson  = new DevicesJSON(data);
            ftui.log(6,devicesJson);

            // start to get data of interest
            for(var device in devices){
               var dev = devicesJson[device];
               if (dev){
                   checkReading(device,dev.Readings);
                   checkReading(device,dev.Internals);
                   checkReading(device,dev.Attributes);
                }
            }
            // finished
            var duration = diffSeconds(startTime,new Date());
            if (ftui.config.DEBUG) ftui.toast("Full refresh done in "
                                 +duration+"s for "
                                 +paramCount+" parameter");
            ftui.log(1,'shortPoll - Done');
            ftui.onUpdateDone();
        });
    },

    longPoll: function() {
        if (ftui.config.DEMO) {console.log('DEMO-Mode: no longpoll');return;}
        ftui.log(1,(ftui.states.longPollRestart)?"Longpoll re-started":"Longpoll started");
        if (ftui.xhr)
            ftui.xhr.abort();
        if (ftui.longPollRequest)
            ftui.longPollRequest.abort();
        ftui.poll.currLine=0;
        if (ftui.config.DEBUG) {
            if (ftui.states.longPollRestart)
                ftui.toast("Longpoll re-started");
            else
                ftui.toast("Longpoll started");
        }
        ftui.states.longPollRestart=0;
        ftui.longPollRequest=$.ajax({
            url: ftui.fhem_dir,
            cache: false,
            async: true,
            data: {
                XHR:1,
                inform: "type=status;filter=.*;fmt=JSON"
            },
            xhr: function() {
                ftui.xhr = new window.XMLHttpRequest();
                ftui.xhr.addEventListener("readystatechange", function(e){
                    var data = e.target.responseText;
                    if ( e.target.readyState == 4) {
                        return;
                    }
                    if ( e.target.readyState == 3 ){
                        var lines = data.split(/\n/);//.replace(/<br>/g,"").split(/\n/);
                        lines.pop(); //remove last empty line

                        for (var i=ftui.poll.currLine, len = lines.length; i < len; i++) {
                            if (isValid(lines[i])){
                                var dataJSON = JSON.parse(lines[i]);
                                var params = null;
                                var param = null;
                                var isSTATE = ( dataJSON[1] !== dataJSON[2] );

                                var pmap = ftui.paramIdMap[dataJSON[0]];
                                var tmap = ftui.timestampMap[dataJSON[0]];

                                if ( pmap ) {
                                  if (isSTATE)
                                    pmap.reading = 'STATE';
                                  params = deviceStates[pmap.device] || {};
                                  param = params[pmap.reading]  || {};
                                  param.val = dataJSON[1];
                                  param.valid = true;
                                  params[pmap.reading] = param;
                                  deviceStates[pmap.device]= params;
                                  if (isSTATE)
                                    plugins.update(pmap.device,pmap.reading);
                                }

                                if ( tmap  && !isSTATE ) {
                                  params = deviceStates[tmap.device] || {};
                                  param = params[tmap.reading]  || {};
                                  param.date = dataJSON[1];
                                  params[tmap.reading] = param;
                                  deviceStates[tmap.device]= params;
                                  // update widgets
                                  plugins.update(tmap.device,tmap.reading);
                                }
                            }
                        }
                        ftui.poll.currLine = lines.length;
                        if (ftui.poll.currLine>1024){
                            ftui.states.longPollRestart=true;
                            ftui.longPollRequest.abort();
                        }
                    }
                }, false);
                return ftui.xhr;
                }
        })
        .done ( function( data ) {
            if (ftui.states.longPollRestart)
                ftui.longPoll();
            else{
                ftui.log(1,"Disconnected from FHEM - poll done - "+data);
                ftui.restartLongPoll();
            }
        })
        .fail (function(jqXHR, textStatus, errorThrown) {
            if (ftui.states.longPollRestart)
                ftui.longPoll();
            else{
                ftui.log(1,"Error while longpoll: " + textStatus + ": " + errorThrown);
                ftui.restartLongPoll();
            }
        });
    },

    setFhemStatus: function(cmdline) {
        if (ftui.config.DEMO) {console.log('DEMO-Mode: no setFhemStatus');return;}
        ftui.startShortPollInterval();
        cmdline = cmdline.replace('  ',' ');
        ftui.log(1,'send to FHEM: '+cmdline);
        $.ajax({
            async: true,
            cache:false,
            url: ftui.fhem_dir,
            data: {
                cmd: cmdline,
                XHR: "1"
            }
        })
        .fail (function(jqXHR, textStatus, errorThrown) {
                ftui.toast("Error: " + textStatus + ": " + errorThrown);
        })
        .done ( function( data ) {
            if ( !ftui.config.doLongPoll ){
                setTimeout(function(){
                    ftui.shortPoll();
                }, 4000);
            }
        });
    },

    loadStyleSchema: function (){
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
                       ftui.config.styleCollection[elmName]=params;
                }
            }
        });
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
            if (ftui.config.DEBUG) ftui.toast("Network connected");
            ftui.states.lastSetOnline = ltime;
            ftui.startShortPollInterval(100);
            if (!ftui.config.doLongPoll){
                ftui.config.doLongPoll  = ($("meta[name='longpoll']").attr("content") == '1');
                if ( ftui.config.doLongPoll )
                    ftui.startLongPollInterval(100);
            }
            ftui.log(1,'FTUI is online');
        }
    },

    setOffline: function(){
        if (ftui.config.DEBUG) ftui.toast("Lost network connection");
        ftui.config.doLongPoll = false;
        clearInterval(ftui.shortPollTimer);
        clearInterval(ftui.longPollTimer);
        if (ftui.longPollRequest)
            ftui.longPollRequest.abort();
        ftui.saveStatesLocal();
        ftui.log(1,'FTUI is offline');
    },

    readStatesLocal: function(){
        if (!ftui.config.DEMO)
            deviceStates=JSON.parse(localStorage.getItem('deviceStates')) || {};
        else {
            $.ajax({async: false,url: "/fhem/tablet/data/"+filename.replace(".html",".dat"),})
            .done ( function( data ) {deviceStates=JSON.parse(data) || {};});
        }
    },

    saveStatesLocal: function(){
        //save deviceStates into localStorage
        var dataToStore = JSON.stringify(deviceStates);
        localStorage.setItem('deviceStates', dataToStore);
    },

    restartLongPoll: function(){
        ftui.toast("Disconnected from FHEM");
        if ( ftui.config.doLongPoll ){
            ftui.toast("Retry to connect in 10 seconds");
            setTimeout(function(){
                longPoll();
            }, 10000);
        }
    },

    toast: function(text){
        if (ftui.config.TOAST)
            $.toast(text);
    },

    log: function(level,text){
        if (ftui.config.debuglevel >= level)
            console.log(text);
    },
}

// event "page is loaded" -> start FTUI
$(document).on('ready', function() {
    ftui.init();
});

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


// deprecated function
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
            }
            reading = fqreading[1];
        }
        if(!readings[reading] && !reading.match(/^[#\.\[].*/)){
            readings[reading] = true;
        }
    }
}

// deprecated function
function setFhemStatus(cmdline) {
     ftui.setFhemStatus(cmdline);
}

function loadplugin(plugin, success, error, async) {
    return dynamicload('js/'+plugin+'.js', success, error, async);
}

function dynamicload(file, success, error, async) {
    var cache = (ftui.config.DEBUG) ? false : true;
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


this.getPart = function (s,p) {
    if ($.isNumeric(p)){
        var c = (s && isValid(s)) ? s.split(" ") : '';
        return (c.length >= p && p>0 ) ? c[p-1] : s;
    }
    else {
        if ((s && isValid(s)) )
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

this.getStyle = function (selector, prop) {
    var props = ftui.config.styleCollection[selector];
    return ( props && props[prop] ) ? props[prop] : null;
}

this.getClassColor = function (elem) {
    for (var i=0, len=ftui.config.stdColors.length; i<len; i++) {
        if ( elem.hasClass(ftui.config.stdColors[i]) ){
            return getStyle('.'+ftui.config.stdColors[i],'color');
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
