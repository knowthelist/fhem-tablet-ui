/* 
weekprofile Widget für fhem-tablet-ui (https://github.com/knowthelist/fhem-tablet-ui)
Klaus Wittstock 2017 (Name ohne Punkt dazwischen bei gmail.com)
Basiert auf dem WdTimer-Widget von Sascha Hermann und der ersten Version von Thorsten Pferdekämper

Version 0.5 neues Attribut data-timesteps; update bei aenderung des readings data-trigger
			passendes Notify: define notify.weekprofile notify .*PROFILES_SAVED.* {fhem("setreading $NAME profile saved")}
Version 0.4 Wenn data-todevice angegeben werden beim speichern die dort angegebenen Devices mit aktualisiert
			Beim loeschen von Definitionen werden die Wochentage in die Vorangegangen Definition uebertragen
			Letzte Definitionen kann nicht mehr geloescht werden
			Beim Popup taucht jetzt kein Scrollbalken mehr auf
Version 0.3 Devices mit Punkt im Namen funktionieren nun, Es koennen mehrere Profile pro Device genutzt werden
Version 0.2 nur noch eine Instanz kann geöffnet werden
Version 0.1 angepasst FTUI 2.6.x 

Verwendet:
JQuery: https://jquery.com/  [in fhem enthalten]
JQuery-UI: https://jqueryui.com/  [in fhem enthalten]
Datetimepicker:  https://github.com/xdan/datetimepicker   [in fhem-tablet-ui enthalten]
----------------------------------------------------------------------------

ATTRIBUTE:
~~~~~~~~~~
    Attribute (Pflicht):
    ---------------
    data-type="weekprofile" : Widget-Typ
    data-device : FHEM Device Name

    Attribute (Optional):
    -----------------
	data-profile:	Name des Profils das verwendet werden soll (Default 'default')
	data-todevice:	Kommesaparierte Liste von Devices deren Profildaten beim Speichern mit aktualisiert werden sollen (Default: keine)
    data-width: 	Breite des Dialogs (Default '400').
    data-height: 	Hoehe des Dialogs (Default '500').
    data-title: 	Titel des Dialogs (Default: data-device).
    data-icon: 		Dialog Titel Icon (Standard 'fa-clock-o').
    data-theme: 	Angabe des Themes, mögich ist 'dark', 'light', oder beliebige eigene CSS-Klasse für individuelle Themes.
    data-style: 	Angabe 'round' oder 'square'.
	data-timesteps:	Schrittweite (Minuten) in der Zeiteinstellung (Default '15')
	data-trigger:	Name des Readings das eine Aktualisierung antriggert. (Default 'false') deaktiviert die update Funktion
    
localStore:
~~~~~~~~~    
Name: weekprofile_<FHEM_Device_Name><Profile>
 ~~~~~~~~~~~~~ PROFIL ~~~~~~~~~~~~~
	profiles: Array der "Profile" 
 		weekdays: [ Wochentage]
            (0)[ So (true/false) ]
					...
            (6)[ Sa (true/false) ]
        times: Liste der Uhrzeiten
		temps: Liste der Temperaturen
	templist: Liste der moeglichen Temperaturen 
	name: FHEM Device name
	profile: Name des Profils im weekprofile Device
	title: Dialog-Titel
	theme: Theme-Class
    style:	Style
	todevice: Ziel Devices
	timesteps: Schrittweite in Auswahlliste
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

function depends_weekprofile (){
	var deps = [];

	var userCSS = $('head').find("[href$='fhem-tablet-ui-user.css']");
	if (userCSS.length)
		userCSS.before('<link rel="stylesheet" href="'+ ftui.config.basedir + 'css/ftui_weekprofile.css" type="text/css" />');
	else
		$('head').append('<link rel="stylesheet" href="'+ ftui.config.basedir + 'css/ftui_weekprofile.css" type="text/css" />');

	if (!$.fn.datetimepicker){
		if (userCSS.length)
			userCSS.before('<link rel="stylesheet" href="'+ ftui.config.basedir + 'lib/jquery.datetimepicker.css" type="text/css" />');   
		else
			$('head').append('<link rel="stylesheet" href="'+ ftui.config.basedir + 'lib/jquery.datetimepicker.css" type="text/css" />');   

        deps.push(ftui.config.basedir + "lib/jquery.datetimepicker.js");     
    }
	
	if (!$.fn.draggable){
	    deps.push(ftui.config.basedir + "lib/jquery-ui.min.js");
	}
	return deps;
}

var Modul_weekprofile = function () {
	
    function weekprofile_showDialog(elem,device) { //Erstellen des Dialogs und öffnen des Dialogs
    	// if (elem.dialog_visible) return; // dialog is already open, nothing to create (in case of multiple firing due to bind to click and touch)
    	if (elem.data('dialog_visible')) return; // dialog is already open, nothing to create (in case of multiple firing due to bind to click and touch)
		// elem.dialog_visible = true;
		elem.data('dialog_visible', true);
		localStorage.setItem(me.widgetname+"_sav_"+device+elem.data('profile'), localStorage.getItem(me.widgetname+"_"+device+elem.data('profile')));
		var config = weekprofile_loadLocal(device, elem.data('profile'));
        elem.append(weekprofile_buildweekprofile(config, device));                            
        var weekprofile_dialog = $( ".weekprofile_dialog" ).dialog({
            height: elem.data('height'),
            width: elem.data('width'),
            autoOpen: false,
            modal: true,
            resizable: true, 
            draggable: false, 
            closeOnEscape: false,
            dialogClass: "weekprofile "+"weekprofile_"+device, 
            title: config.title,
            buttons: {
                "Hinzufügen": function(){                        
                    weekprofile_addProfile( $('.weekprofile_'+device.replace(/\./g,'\\.')), device, elem.data('profile') ); //noch den Profilenamen angefuegt
                },
                "Speichern": function(){
                    var canClose = weekprofile_saveProfile( $('.weekprofile_'+device.replace(/\./g,'\\.')), device , elem.data('profile'));
                    if (canClose === true) {
						weekprofile_closeDialog(elem,device);
                    }
                },
                "Abbrechen": function() {
					// localStore-Kopie zurueckholen
					localStorage.setItem(me.widgetname+"_"+device+elem.data('profile'), localStorage.getItem(me.widgetname+"_sav_"+device+elem.data('profile')));
					weekprofile_closeDialog(elem,device,weekprofile_dialog);
                }
            },
            create: function (e, ui) {
                var pane = $('.weekprofile_'+device.replace(/\./g,'\\.')).find(".ui-dialog-buttonpane");
                $('.weekprofile_'+device.replace(/\./g,'\\.')).find('.ui-dialog-titlebar-close').remove();                
            }, 
            open: function () {
                $(this).parent().children(".ui-dialog-titlebar").prepend('<i class="weekprofile_header_icon fa oa '+elem.data('icon')+'"></i>');
            },
        });        
        // Benötige Klassen ergänzen
        $( ".weekprofile" ).children('.ui-dialog-titlebar').addClass('weekprofile_header '+config.theme+" "+config.style);            
        $( ".weekprofile" ).children('.ui-dialog-buttonpane').addClass('weekprofile_footer '+config.theme+" "+config.style); 
        $( ".weekprofile" ).find('.ui-dialog-buttonset > .ui-button').addClass('weekprofile_button '+config.theme+" "+config.style);
        //-----------------------------------------------          
        //Verwendete Plugins aktivieren und Aktionen zuweisen
        weekprofile_setActions($('.weekprofile_'+device.replace(/\./g,'\\.')), device, config.style, elem.data('profile')); 
        weekprofile_dialog.dialog( "open" );
     
        // Hintergrund inaktiv
        $( "body" ).find('.ui-widget-overlay').addClass('weekprofile_shader');     
        $(".weekprofile_shader").on('click',function() {
			// localStore-Kopie zurueckholen
			localStorage.setItem(me.widgetname+"_"+device+elem.data('profile'), localStorage.getItem(me.widgetname+"_sav_"+device+elem.data('profile')));
			localStorage.removeItem(me.widgetname+"_sav_"+device+elem.data('profile'));
            weekprofile_dialog.dialog( "close" );
            $('.weekprofile_'+device.replace(/\./g,'\\.')).remove();                    
            $('.weekprofile_datetimepicker_'+device.replace(/\./g,'\\.')).each(function(){ $(this).remove(); });
            elem.children('.weekprofile_dialog').remove();
            // elem.dialog_visible = false;
			elem.data('dialog_visible', false);
        }); 
        
    }
	function weekprofile_setActions(elem,device,style,hprofile){
// versuch: config hier holen:
		var config = weekprofile_loadLocal(device, hprofile);
		//Verwendete Plugins aktivieren
        weekprofile_setDateTimePicker(elem, device, style, config.timesteps); //DateTimePicker Plugin zuweisen
        // Aktionen zuweisen
        weekprofile_setDeleteAction(elem, device, hprofile); //Löschen-Schalter Aktion  
        weekprofile_setAddLineAction(elem, device, hprofile); //"Plus"-Schalter Aktion        
        weekprofile_setDeleteLineAction(elem, device, hprofile); //"Minus"-Schalter Aktion     
		weekprofile_setTimeChangedAction(elem, device, hprofile); // Zeit geaendert	
		weekprofile_setTempChangedAction(elem, device, hprofile); // Temperatur geaendert	
	}
	function weekprofile_closeDialog(elem,device) {
		// localStorage-Kopie loeschen
		localStorage.removeItem(me.widgetname+"_sav_"+device+elem.data('profile'));
		var weekprofile_dialog = $( ".weekprofile_dialog" );
		weekprofile_dialog.dialog( "close" );
		$('.weekprofile_'+device.replace(/\./g,'\\.')).remove();                    
		$('.weekprofile_datetimepicker_'+device.replace(/\./g,'\\.')).each(function(){ $(this).remove(); });
		elem.children('.weekprofile_dialog').remove();
		// elem.dialog_visible = false;
		elem.data('dialog_visible', false);
	}
    function weekprofile_buildweekprofilecmddropdown(list, selectedval, theme,style,profileid,lineno) {
        var result = "";
		
        result += "<select data-profile='"+profileid+"' data-line='"+lineno+"' class='weekprofile_cmd "+theme+" "+style+"' name='weekprofile_cmd'>";
        for (var i = 0; i < list.length; i++) {            
            if (list[i] === selectedval) { 
				result += "<option value='"+i+"' selected>"+list[i]+"</option>"; 
			}else{ 
				result += "<option value='"+i+"'>"+list[i]+"</option>"; 
			}
        }
        result += "</select>";   
        return result;        
    }   
    function weekprofile_buildlines(times, temps, cmds, profileid, theme, style) {
        var result = "<div class='weekprofile_lines'>"; 
		var starttime = "00:00";
		for (var lineno = 0; lineno < times.length; lineno++) {
			if(lineno > 0) {
				starttime = times[lineno-1];
			}
			result += "<div>" +			
		 		  "   <div class='weekprofile_profiletime inline  text'>" +
                  "       <div class='weekprofile_starttime "+theme+" "+style+"' type='text' style='visibility: visible;'>"+starttime+"</div>" +
                  "   </div> - " +
				  "   <div class='weekprofile_profiletime inline  input-control text'>";
			if(lineno == times.length-1) {
				result += 	"<div class='weekprofile_starttime "+theme+" "+style+"' type='text' style='visibility: visible;'>"+times[lineno]+"</div>";
			}else{
				result +=   "<input data-profile='"+profileid+"' data-line='"+lineno+"' class='weekprofile_time "+theme+" "+style+"' type='text' style='visibility: visible;' value='"+times[lineno]+"'>";
			}
			result +=       "   </div>" +
                        "   <div class='weekprofile_profilecmd inline  input-control text'>";
			result += weekprofile_buildweekprofilecmddropdown(cmds, temps[lineno], theme, style, profileid, lineno); 
			result += "   </div> " +
				  "   <div class='weekprofile_addlinediv inline '><button data-profile='"+profileid+"' data-line='"+lineno+"' id='addline"+profileid+"_"+lineno+"' class='fa weekprofile_addline weekprofile_button "+theme+" "+style+"' type='button'>+</button></div>";
			if(lineno != times.length-1) {
				result +=   "<div class='weekprofile_deletelinediv inline '>" +
						"     <button data-profile='"+profileid+"' data-line='"+lineno+"' id='addline"+profileid+"_"+lineno+"' class='fa weekprofile_deleteline weekprofile_button "+theme+" "+style+"' type='button'>-</button></div>";
			}
			result += "</div>";
		}
		result += "</div>";
        return result;          
    }
	// Zeile mit Wochentagen
    function weekprofile_buildprofile(profile, cmds, id, theme, style) {
        var result = "";  
		result += 	"<div data-profile='"+id+"' id='profile"+id+"' class='weekprofile_profile row'>";
		result +=	"<div class='weekprofile_lines'>" +
					"   <div class='weekprofile_profileweekdays inline'>" +
					"       <div class='weekprofile_checkbox begin "+theme+" "+style+"'><input type='radio' name='mo' id='checkbox_mo-reihe"+id+"' "+weekprofile_getCheckedString(profile.weekdays[1])+"/><label class='begin' for='checkbox_mo-reihe"+id+"'>Mo</label></div>"+
					"       <div class='weekprofile_checkbox "+theme+" "+style+"'><input type='radio' name='di' id='checkbox_di-reihe"+id+"' "+weekprofile_getCheckedString(profile.weekdays[2])+"/><label for='checkbox_di-reihe"+id+"'>Di</label></div>"+
					"       <div class='weekprofile_checkbox "+theme+" "+style+"'><input type='radio' name='mi' id='checkbox_mi-reihe"+id+"' "+weekprofile_getCheckedString(profile.weekdays[3])+"/><label for='checkbox_mi-reihe"+id+"'>Mi</label></div>"+
					"       <div class='weekprofile_checkbox "+theme+" "+style+"'><input type='radio' name='do' id='checkbox_do-reihe"+id+"' "+weekprofile_getCheckedString(profile.weekdays[4])+"/><label for='checkbox_do-reihe"+id+"'>Do</label></div>"+
					"       <div class='weekprofile_checkbox "+theme+" "+style+"'><input type='radio' name='fr' id='checkbox_fr-reihe"+id+"' "+weekprofile_getCheckedString(profile.weekdays[5])+"/><label for='checkbox_fr-reihe"+id+"'>Fr</label></div>"+
					"       <div class='weekprofile_checkbox "+theme+" "+style+"'><input type='radio' name='sa' id='checkbox_sa-reihe"+id+"' "+weekprofile_getCheckedString(profile.weekdays[6])+"/><label for='checkbox_sa-reihe"+id+"'>Sa</label></div>"+
					"       <div class='weekprofile_checkbox end "+theme+" "+style+"'><input type='radio' name='so' id='checkbox_so-reihe"+id+"' "+weekprofile_getCheckedString(profile.weekdays[0])+"/><label class='end' for='checkbox_so-reihe"+id+"'>So</label></div>"+
					"   </div>"+
					"   <div class='weekprofile_delprofile inline'><button data-profile='"+id+"' id='delprofile"+id+"' class='fa fa-trash-o weekprofile_deleteprofile weekprofile_button "+theme+" "+style+"' type='button'></button></div>" +
					"</div>";
		result += weekprofile_buildlines(profile.times, profile.temps, cmds, id, theme, style);
		result += "   </div>";	
        return result;          
    } 
    function weekprofile_buildweekprofilelist(config,device) {
        var result = "";        
        result += 	"   <div class='weekprofile_profilelist'>";       
        for (var i = 0; i < config.profiles.length; i++) {
            result += weekprofile_buildprofile(config.profiles[i],config.templist,i,config.theme,config.style);
        }       
        result += 	"   </div>";
        return result;
    }
    function weekprofile_buildweekprofile(config,device) { 
        return "<div class='weekprofile_dialog "+config.theme+"'>"+
		  weekprofile_buildweekprofilelist(config,device) +
               "</div>";
    }
    function weekprofile_deleteProfile(elem, device,hprofile) {
        var config = weekprofile_loadLocal(device,hprofile);
		weekprofile_getWeekdayFlags($('.weekprofile_'+device.replace(/\./g,'\\.')),config.profiles);	// Tages-Flags holen
        var currProfile = elem.data('profile');
		if(config.profiles.length > 1) {		//letztes Profil nicht loeschen
			weekprofile_moveweekdays(config,currProfile);
			config.profiles.splice(currProfile,1);
			var newElem = $(weekprofile_buildweekprofilelist(config,device));
			weekprofile_setActions(newElem, config.name, config.style, hprofile); 
			elem.parent().parent().parent().parent().replaceWith(newElem);        
			weekprofile_saveLocal(config);			
		}
    }
	function weekprofile_moveweekdays(config,currProfile) {
		// Wochentage von geloeschter Konfiguration auf vorhergehendes uebertragen
		if(currProfile !== 0) {
			targetprofile = currProfile - 1;
		} else {
			targetprofile = 1;
		}
		for(var dayNum = 0; dayNum < 7; dayNum++) {
			if(config.profiles[currProfile].weekdays[dayNum]){
				config.profiles[targetprofile].weekdays[dayNum] = true;
			}
		}
	}
    function weekprofile_addProfile(elem, device, hprofile) {
        var config = weekprofile_loadLocal(device, hprofile);   
		var newprofile = {};
		newprofile.weekdays = [false,false,false,false,false,false,false];
		newprofile.times = ["24:00"];
		newprofile.temps = [config.templist[0]];
        config.profiles.push(newprofile);
		
        var profile_row = weekprofile_buildprofile(config.profiles[config.profiles.length-1],config.templist,config.profiles.length-1,config.theme,config.style);       
		var jqRow = $(profile_row);
		
        $('.weekprofile_'+device.replace(/\./g,'\\.')).find('.weekprofile_profilelist').append(jqRow);
        weekprofile_setActions(jqRow, config.name, config.style, hprofile); 
        weekprofile_saveLocal(config); //Aktuelle Profile lokal speichern
    }
	function weekprofile_addLine(elem, device, hprofile) {
		// Profile und Zeile finden
		var config = weekprofile_loadLocal(device, hprofile);
		var currProfile = elem.data('profile');
		var currLine = elem.data('line');		
		// Die neue Zeile wird immer unter der alten eingefuegt
		// Anfangs- und Endezeit ist immer gleich der Endezeit der alten Zeile
		// Temperatur ist die Temperatur der alten Zeile
		weekprofile_arrayInsert(config.profiles[currProfile].times,currLine+1,config.profiles[currProfile].times[currLine]);
		weekprofile_arrayInsert(config.profiles[currProfile].temps,currLine+1,config.profiles[currProfile].temps[currLine]);
		// HTML Elemente
		// Neue Line erzeugen
		var newLines = weekprofile_buildlines(config.profiles[currProfile].times, config.profiles[currProfile].temps, config.templist, 
																 currProfile, config.theme,config.style);
		var jqNewLines = $(newLines);
		weekprofile_setActions(jqNewLines, device, config.style, hprofile); 
		elem.parent().parent().parent().replaceWith(jqNewLines);
        weekprofile_saveLocal(config); //Aktuelle Profile lokal speichern		
    }
	function weekprofile_deleteLine(elem, device, hprofile) {
		// Zeile finden
		var config = weekprofile_loadLocal(device, hprofile);
		var currProfile = elem.data('profile');
		var currLine = elem.data('line');
		// Zeile aus config loeschen
		config.profiles[currProfile].times.splice(currLine,1);
		config.profiles[currProfile].temps.splice(currLine,1);
		var newLines = weekprofile_buildlines(config.profiles[currProfile].times, config.profiles[currProfile].temps, config.templist, 
															   currProfile, config.theme,config.style);
		var jqNewLines = $(newLines);		
		weekprofile_setActions(jqNewLines, device, config.style, hprofile); 		
		elem.parent().parent().parent().replaceWith(jqNewLines);
		weekprofile_saveLocal(config); //Aktuelle Profile lokal speichern
    }	
	function weekprofile_timeChanged(elem, device, hprofile) {
		ftui.log(3, "changed");
		// Zeile finden
		var config = weekprofile_loadLocal(device, hprofile);
		var currProfile = elem.data('profile');
		var currLine = elem.data('line');
		// Gibt es eine naechste Zeile?
		if(currLine >= config.profiles[currProfile].times.length -1) {
			return;  // nein 
		}
		// in profile uebernehmen
		config.profiles[currProfile].times[currLine] = elem.val();
		// ja, also naechste Zeile suchen
		var nextLine = elem.parent().parent().next();
		// Die Startzeit ist das erste erste Element
		nextLine.children().first().children().first().html(elem.val());
		weekprofile_saveLocal(config); //Aktuelle Profile lokal speichern
    }	
	function weekprofile_tempChanged(elem, device, hprofile) {
		// Zeile finden
		var config = weekprofile_loadLocal(device, hprofile);
		var currProfile = elem.data('profile');
		var currLine = elem.data('line');
		// in profile uebernehmen
		config.profiles[currProfile].temps[currLine] = config.templist[elem.val()];
		weekprofile_saveLocal(config); //Aktuelle Profile lokal speichern
	}
    function weekprofile_saveProfile(elem, device, hprofile) { // Ins weekprofile Device schreiben
        var config = weekprofile_loadLocal(device, hprofile);
        // Im Prinzip steht alles in arr_config, ausser den Tages-Flags
		weekprofile_getWeekdayFlags($('.weekprofile_'+device.replace(/\./g,'\\.')),config.profiles);
		// Datenstruktur fuer weekprofile-Modul basteln
		var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
		var result = {};
		for(var profileNum = 0; profileNum < config.profiles.length; profileNum++) {
			for(var dayNum = 0; dayNum < 7; dayNum++) {
				if(config.profiles[profileNum].weekdays[dayNum]){
					result[days[dayNum]] = {"temp": config.profiles[profileNum].temps,
											"time": config.profiles[profileNum].times };
				}
			}
		}
		var resultJson = JSON.stringify(result);
		var cmd = "set "+device+" profile_data "+config.profile+" "+resultJson;
		ftui.log(3,"weekprofile wird geändert: '"+cmd+"'");
		ftui.setFhemStatus(cmd);
		if ( config.todevice !== undefined && config.todevice !=='' ) {
			ftui.log(3,"weekprofile todevice Wert: '"+config.todevice+"'");
			cmd = "set "+device+" send_to_device "+config.profile+" "+config.todevice;
			ftui.setFhemStatus(cmd);
		}
		if (ftui.config.DEBUG) ftui.toast(cmd);
        //TOAST && $.toast(cmd);
        //--------------------------------------------------
        //Aktuelle Einstellungen/Profile in localStore schreiben    
        weekprofile_saveLocal(config); 
        //--------------------------------------------------  
        return true;
    }
    function weekprofile_saveLocal(config) { //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var dataToStore = JSON.stringify(config);
        //localStorage.setItem(this.widgetname+"_"+config.name, dataToStore);
        //variante mit Profilen
        localStorage.setItem(me.widgetname+"_"+config.name+config.profile, dataToStore);
    }    
    function weekprofile_loadLocal(device, hprofile) {
        return JSON.parse(localStorage.getItem(me.widgetname+"_"+device+hprofile));        
    }         
    function weekprofile_setDeleteAction(elem,device, hprofile) {
        elem.find('.weekprofile_deleteprofile').each(function(){       
            $(this).on('click', function(event) {
                weekprofile_deleteProfile( $(this), device, hprofile );
            });
        });        
    }    
    function weekprofile_setAddLineAction(elem,device, hprofile) {
        elem.find('.weekprofile_addline').each(function(){       
            $(this).on('click', function(event) {
                weekprofile_addLine( $(this), device, hprofile );
            });
        });        
    }           
    function weekprofile_setDeleteLineAction(elem,device, hprofile) {
        elem.find('.weekprofile_deleteline').each(function(){       
            $(this).on('click', function(event) {
                weekprofile_deleteLine( $(this), device, hprofile );
            });
        });        
    }          
    function weekprofile_setTimeChangedAction(elem,device, hprofile) {
        elem.find('.weekprofile_time').each(function(){       
            $(this).on('input change', function(event) {
				weekprofile_timeChanged( $(this), device, hprofile );
            });
        });        
    }      
    function weekprofile_setTempChangedAction(elem,device, hprofile) {
        elem.find('.weekprofile_cmd').each(function(){  
            $(this).on('input change', function(event) {
				weekprofile_tempChanged( $(this), device, hprofile );
            });
        });        
    }           
    function weekprofile_setDateTimePicker(elem,device,style,timesteps) {   
        var dtp_style;
        elem.find('.weekprofile_time').each(function(){     
            if (style != 'dark' ) {
				dtp_style = 'default';
			}else{
				dtp_style ='dark'; 
			}
            $(this).datetimepicker({
                step:timesteps, 
                lang: 'de',
                theme: dtp_style,
                format: 'H:i',
                timepicker: true,
                datepicker: false,     
                className:  "weekprofile_datetimepicker "+"weekprofile_datetimepicker_"+device, 
            });           
        });        
    }         
    function weekprofile_getCheckedString(val) {
        if (val) {return "checked";}        
        return "";
    }       
    function weekprofile_getProfiles(elem) { /*Erstellt den localStore, verankert den Aufruf des PopUps*/
        var attr_device = elem.data('device');  
        var attr_title = elem.data('title');
 		var attr_profile = elem.data('profile');
        
        var cmd = "get " + attr_device + " profile_data " + attr_profile;

        ftui.sendFhemCommand(cmd)
        .done(function(data ) {
			var config = {};
            var weekprofile_title;
            if (attr_title == 'NAME') { 
				weekprofile_title = attr_device; 
			}else{ 
				weekprofile_title = attr_title; 
			}            
                    
			var parsedData = JSON.parse(data);   
			var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
			config.profiles = []; //Verfuegbare Profile (Tage/Uhrzeit/Befehl)
			for(var i = 0; i < days.length; i++) {
				 var profile = {};
				 var dayNum = (i+1)%7;
				 profile.times = parsedData[days[dayNum]].time;
				 profile.temps = parsedData[days[dayNum]].temp;
				 // es kam vor, dass die Zeiten und Temperaturen leer sind
				 if(profile.times.length === 0 || profile.temps.length === 0) {
					profile.times = ["24:00"];
					profile.temps = ["5.0"];
				 }
				 // check whether this is basically the same as one
				 // which already exists
				 var found = false;
				 for(var j = 0; j < config.profiles.length; j++){
					if(weekprofile_arrayCompare(profile.times,config.profiles[j].times) 
							&& weekprofile_arrayCompare(profile.temps,config.profiles[j].temps)){
						found = true;
						config.profiles[j].weekdays[dayNum] = true;
						break;
					} 
				 }
				 if(found) continue;
				 // neues Profil 
				 profile.weekdays = [false,false,false,false,false,false,false];
				 profile.weekdays[dayNum] = true;
				 profile.valid = true;			
				 config.profiles.push(profile); 
			}
			
            config.templist = []; //Verfuegbare Temperaturen (Dropdown)
			for(var t = 5; t <= 29; t++) {
				config.templist.push(t.toString()+".0");
				config.templist.push(t.toString()+".5");
			}
			config.templist.push("30.0");
			
            config.name = attr_device; 			// zu Device
			config.profile 	 = attr_profile;  	// Profil im Device
			config.title 	 = weekprofile_title; //Dialog Titel
            config.theme 	 = elem.data('theme'); 		//verwendetes Theme
            config.style 	 = elem.data('style'); 		//verwendeter Style
			config.todevice  = elem.data('todevice');
			config.timesteps = elem.data('timesteps');
                           
            weekprofile_saveLocal(config); //Konfiguration speichern
            //-----------------------------------------------

            // Aufruf des Popups
            var showDialogObject = (elem.data('starter')) ? $(document).find( elem.data('starter') ) : elem.children(":first");
            showDialogObject.css({'cursor': 'pointer'});
			showDialogObject.on( "clicked click touchend mouseup", function(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				if (elem[0].style.getPropertyValue('visibility') != 'visible') weekprofile_showDialog(elem, attr_device);
			});
            
            //showDialogObject.on( "click", function() {
            //    weekprofile_showDialog(elem, attr_device);                        
            //}); 
			
			if (elem.data('dialog_visible')) {
				ftui.log(3, 'weekprofile triggered Dialog '+ elem.data('profile')+' ist sichtbar und wird aktualisiert');
				weekprofile_closeDialog(elem,config.name)	//Dialogfenster bei Update schliessen	
				weekprofile_showDialog(elem,config.name)	//...und aktualisiert oeffnen
			}
			
        });    
    };      
    function weekprofile_getWeekdayFlags(elem, profiles) {
		// Wochentage aus UI uebernehmen
		var days = ["so","mo","di","mi","do","fr","sa"];
        elem.find('.weekprofile_profile').each(function(){
            var profileid = $( this ).data('profile');
            // Wochentage
            //-----------------------------------------------
			for(var i = 0; i < 7; i++) {
				profiles[profileid].weekdays[i] = $( this ).children().children(".weekprofile_profileweekdays").children().children("#checkbox_"+days[i]+"-reihe"+profileid).prop('checked');
			};	
		});	
    };
	function weekprofile_arrayInsert(a,pos,newElem) {
		for(var i = a.length; i > pos; i--) {
			a[i] = a[i-1];
		};
		a[pos] = newElem;	
	}; 
	function weekprofile_arrayCompare(a1,a2) {
		return (a1.length == a2.length) && a1.every(function(element, index) {
				return element === a2[index]; } );
	};
    function init() {
        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");
            
            elem.data('dialog_visible', false);
            //Setzten der Standartattribute falls diese nicht angegeben wurden  
            elem.initData('width',    $(this).data('width') 	|| '400');
            elem.initData('height',   $(this).data('height')	|| 'auto');
            elem.initData('title',    $(this).data('title') 	|| 'NAME');
            elem.initData('icon',     $(this).data('icon') 		|| 'fa-clock-o');
            elem.initData('style',    $(this).data('style') 	|| 'square'); 			//round or square           
            elem.initData('theme',    $(this).data('theme') 	|| 'light');  			//light,dark,custom
			elem.initData('profile',  $(this).data('profile')	|| 'default');
			elem.initData('timesteps',$(this).data('timesteps') || 15);
			elem.initData('updtrig', 'PROFILES_SAVED');
			elem.initData('trigger', $(this).data('trigger') || false);
			// elem.initData('trigger', $(this).data('trigger') || 'changed');
            //-----------------------------------------------
            // subscripe my readings for updating
            me.addReading(elem, 'updtrig');
			if (elem.data('trigger')) me.addReading(elem, 'trigger');
            weekprofile_getProfiles(elem);   
        });
    };            
    function update (dev,par){
    	// Test fuer Triggerelement ... im Moment kommt es nicht im FTUI an
		me.elements.filterDeviceReading('updtrig', dev, par)
            .each(function (index) {
				if (ftui.config.DEBUG) ftui.toast('weekprofile '+dev+' updtrig: ' + $(this).data('profile'));
            	ftui.log(3, 'weekprofile '+dev+' updtrig: ' + $(this).data('profile'));
            });
		// Update ueber eigenes Reading	
		me.elements.filterDeviceReading('trigger', dev, par)
            .each(function (index) {
            	//console.log('weekprofile '+dev+' triggered Profil: ' + $(this).data('profile'));
            	ftui.log(3, 'weekprofile '+dev+' triggered Profil: ' + $(this).data('profile'));
				weekprofile_getProfiles($(this));			//Profildaten aktualisieren
            });			
		
    };
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        widgetname: 'weekprofile',
        init:init,
		update: update,
    });   
    return me;
};

