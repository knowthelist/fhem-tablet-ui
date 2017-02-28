
/* 
Version 0.0

weekprofile Widget für fhem-tablet-ui (https://github.com/knowthelist/fhem-tablet-ui)
Modifikationen fuer FTUI 2.2 klausw Dateiversion vom 4.7.2016
basierend auf der FTUI 1 Version von Thorsten Pferdekämper 2016
Basiert auf dem WdTimer-Widget von Sascha Hermann

Derzeit auskommentiert: jquery.datetimepicker.css
wozu benoetigt?

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
    data-width: Breite des Dialogs (Default '400').
    data-height: Hoehe des Dialogs (Default '500').
    data-title: Titel des Dialogs. Angabe NAME verwendet data-device. (Default)
                                   Ansonsten Angabe eines beliebigen Dialog-Titels.
    data-icon: Dialog Titel Icon (Standard 'fa-clock-o').
    data-theme: Angabe des Themes, mögich ist 'dark', 'light', oder beliebige eigene CSS-Klasse für individuelle Themes.
    data-style: Angabe 'round' oder 'square'.
    
localStore:
~~~~~~~~~    
Name: weekprofile_<FHEM_Device_Name>
 ~~~~~~~~~~~~~ PROFIL ~~~~~~~~~~~~~
	profiles: Array der "Profile" 
 		weekdays: [ Wochentage]
            (0)[ So (true/false) ]
            (1)[ Mo (true/false) ]
            (2)[ Di (true/false) ]
            (3)[ Mi (true/false) ]
            (4)[ Do (true/false) ]
            (5)[ Fr (true/false) ]
            (6)[ Sa (true/false) ]
        times: Liste der Uhrzeiten
		temps: Liste der Temperaturen
	templist: Liste der moeglichen Temperaturen 
	name: FHEM Device name
	profile: Name des Profils im weekprofile Device
	title: Dialog-Titel
	theme: Theme-Class
    style:	Style
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

//if(typeof widget_widget == 'undefined') {
//    loadplugin('widget_widget');
//}

function depends_weekprofile (){
	var deps = [];
	if (!$.fn.datetimepicker){
	    deps.push(ftui.config.basedir + "lib/jquery.datetimepicker.js");
	    //$('head').append('<link rel="stylesheet" href="'+ ftui.config.basedir + 'lib/jquery.datetimepicker.css" type="text/css" />');    
	}
	if (!$.fn.draggable){
	    deps.push(ftui.config.basedir + "lib/jquery-ui.min.js");
	}
	return deps;
}

var Modul_weekprofile = function () {
	
    function weekprofile_showDialog(elem,device) { //Erstellen des Dialogs und öffnen des Dialogs
        var base = this;
		// localstore laden und fuer "Abbrechen" zwischenspeichern
		localStorage.setItem(this.widgetname+"_sav_"+device, localStorage.getItem(this.widgetname+"_"+device));
		var config = weekprofile_loadLocal(device);
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
                    weekprofile_addProfile( $('.weekprofile_'+device), device );
                },
                "Speichern": function(){
                    var canClose = weekprofile_saveProfile( $('.weekprofile_'+device), device );
                    if (canClose === true) {
						// localStorage-Kopie loeschen
						localStorage.removeItem(this.widgetname+"_sav_"+device);
                        weekprofile_dialog.dialog( "close" );
                        $('.weekprofile_'+device).remove();
                        $('.weekprofile_datetimepicker_'+device).each(function(){ $(this).remove(); });
                        elem.children('.weekprofile_dialog').remove();  
                    }
                },
                "Abbrechen": function() {
					// localStore-Kopie zurueckholen
					localStorage.setItem(this.widgetname+"_"+device, localStorage.getItem(this.widgetname+"_sav_"+device));
					localStorage.removeItem(this.widgetname+"_sav_"+device);
                    weekprofile_dialog.dialog( "close" );
                    $('.weekprofile_'+device).remove();                    
                    $('.weekprofile_datetimepicker_'+device).each(function(){ $(this).remove(); });
                    elem.children('.weekprofile_dialog').remove();                  
                }
            },
            create: function (e, ui) {
                var pane = $('.weekprofile_'+device).find(".ui-dialog-buttonpane");
                $('.weekprofile_'+device).find('.ui-dialog-titlebar-close').remove();                
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
        weekprofile_setActions($('.weekprofile_'+device), device, config.style); 
        weekprofile_dialog.dialog( "open" );
    }
    
	function weekprofile_setActions(elem,device,style){
		//Verwendete Plugins aktivieren
        weekprofile_setDateTimePicker(elem, device, style); //DateTimePicker Plugin zuweisen
        // Aktionen zuweisen
        weekprofile_setDeleteAction(elem, device); //Löschen-Schalter Aktion  
        weekprofile_setAddLineAction(elem, device); //"Plus"-Schalter Aktion        
        weekprofile_setDeleteLineAction(elem, device); //"Minus"-Schalter Aktion     
		weekprofile_setTimeChangedAction(elem, device); // Zeit geaendert	
		weekprofile_setTempChangedAction(elem, device); // Temperatur geaendert	
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
		 		  "   <div class='weekprofile_profiletime cell inline text'>" +
                  "       <div class='weekprofile_starttime "+theme+" "+style+"' type='text' style='visibility: visible;'>"+starttime+"</div>" +
                  "   </div> - " +
				  "   <div class='weekprofile_profiletime cell inline input-control text'>";
			if(lineno == times.length-1) {
				result += 	"<div class='weekprofile_starttime "+theme+" "+style+"' type='text' style='visibility: visible;'>"+times[lineno]+"</div>";
			}else{
				result +=   "<input data-profile='"+profileid+"' data-line='"+lineno+"' class='weekprofile_time "+theme+" "+style+"' type='text' style='visibility: visible;' value='"+times[lineno]+"'>";
			}
            
			result +=       "   </div>" +
                        "   <div class='weekprofile_profilecmd cell inline input-control text'>";
			result += weekprofile_buildweekprofilecmddropdown(cmds, temps[lineno], theme, style, profileid, lineno); 
			result += "   </div> " +
				  "   <div class='weekprofile_addlinediv cell inline'><button data-profile='"+profileid+"' data-line='"+lineno+"' id='addline"+profileid+"_"+lineno+"' class='fa weekprofile_addline weekprofile_button "+theme+" "+style+"' type='button'>+</button></div>";
			if(lineno != times.length-1) {
				result +=   "<div class='weekprofile_deletelinediv cell inline'>" +
						"     <button data-profile='"+profileid+"' data-line='"+lineno+"' id='addline"+profileid+"_"+lineno+"' class='fa weekprofile_deleteline weekprofile_button "+theme+" "+style+"' type='button'>-</button></div>";
			}
            
			result += "</div>";
		}
        
		result += "</div>";
        return result;          
    }
    
    function weekprofile_buildprofile(profile, cmds, id, theme, style) {
        var result = "";  
		result += "<div data-profile='"+id+"' id='profile"+id+"' class='weekprofile_profile row'>";
        result +=       "<div>" +
						"   <div class='weekprofile_profileweekdays inline'>" +
                        "       <div class='weekprofile_checkbox begin "+theme+" "+style+"'><input type='radio' name='mo' id='checkbox_mo-reihe"+id+"' "+weekprofile_getCheckedString(profile.weekdays[1])+"/><label class='begin' for='checkbox_mo-reihe"+id+"'>Mo</label></div>"+
                        "       <div class='weekprofile_checkbox "+theme+" "+style+"'><input type='radio' name='di' id='checkbox_di-reihe"+id+"' "+weekprofile_getCheckedString(profile.weekdays[2])+"/><label for='checkbox_di-reihe"+id+"'>Di</label></div>"+
                        "       <div class='weekprofile_checkbox "+theme+" "+style+"'><input type='radio' name='mi' id='checkbox_mi-reihe"+id+"' "+weekprofile_getCheckedString(profile.weekdays[3])+"/><label for='checkbox_mi-reihe"+id+"'>Mi</label></div>"+
                        "       <div class='weekprofile_checkbox "+theme+" "+style+"'><input type='radio' name='do' id='checkbox_do-reihe"+id+"' "+weekprofile_getCheckedString(profile.weekdays[4])+"/><label for='checkbox_do-reihe"+id+"'>Do</label></div>"+
                        "       <div class='weekprofile_checkbox "+theme+" "+style+"'><input type='radio' name='fr' id='checkbox_fr-reihe"+id+"' "+weekprofile_getCheckedString(profile.weekdays[5])+"/><label for='checkbox_fr-reihe"+id+"'>Fr</label></div>"+
                        "       <div class='weekprofile_checkbox "+theme+" "+style+"'><input type='radio' name='sa' id='checkbox_sa-reihe"+id+"' "+weekprofile_getCheckedString(profile.weekdays[6])+"/><label for='checkbox_sa-reihe"+id+"'>Sa</label></div>"+
                        "       <div class='weekprofile_checkbox end "+theme+" "+style+"'><input type='radio' name='so' id='checkbox_so-reihe"+id+"' "+weekprofile_getCheckedString(profile.weekdays[0])+"/><label class='end' for='checkbox_so-reihe"+id+"'>So</label></div>"+
                        "   </div>"+
												
                        "   <div class='weekprofile_delprofile cell inline'><button data-profile='"+id+"' id='delprofile"+id+"' class='fa fa-trash-o weekprofile_deleteprofile weekprofile_button "+theme+" "+style+"' type='button'></button></div>" +
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
    
    function weekprofile_deleteProfile(elem, device) {
        var config = weekprofile_loadLocal(device);
        var currProfile = elem.data('profile');
		config.profiles.splice(currProfile,1);
		var newElem = $(weekprofile_buildweekprofilelist(config,device));
		weekprofile_setActions(newElem, config.name, config.style); 
		elem.parent().parent().parent().parent().replaceWith(newElem);        
        weekprofile_saveLocal(config);
    }
    
    function weekprofile_addProfile(elem, device) {
        var config = weekprofile_loadLocal(device);   
		var newprofile = {};
		newprofile.weekdays = [false,false,false,false,false,false,false];
		newprofile.times = ["24:00"];
		newprofile.temps = [config.templist[0]];
        config.profiles.push(newprofile);
		
        var profile_row = weekprofile_buildprofile(config.profiles[config.profiles.length-1],config.templist,config.profiles.length-1,config.theme,config.style);       
		var jqRow = $(profile_row);
		
        $('.weekprofile_'+device).find('.weekprofile_profilelist').append(jqRow);
        weekprofile_setActions(jqRow, config.name, config.style); 
        weekprofile_saveLocal(config); //Aktuelle Profile lokal speichern
    }
    
	function weekprofile_addLine(elem, device) {
		// Profile und Zeile finden
		var config = weekprofile_loadLocal(device);
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
		weekprofile_setActions(jqNewLines, device, config.style); 
		elem.parent().parent().parent().replaceWith(jqNewLines);
        weekprofile_saveLocal(config); //Aktuelle Profile lokal speichern		
    }
    
	function weekprofile_deleteLine(elem, device) {
		// Zeile finden
		var config = weekprofile_loadLocal(device);
		var currProfile = elem.data('profile');
		var currLine = elem.data('line');
		// Zeile aus config loeschen
		config.profiles[currProfile].times.splice(currLine,1);
		config.profiles[currProfile].temps.splice(currLine,1);
		var newLines = weekprofile_buildlines(config.profiles[currProfile].times, config.profiles[currProfile].temps, config.templist, 
															   currProfile, config.theme,config.style);
		var jqNewLines = $(newLines);		
		weekprofile_setActions(jqNewLines, device, config.style); 		
		elem.parent().parent().parent().replaceWith(jqNewLines);
		weekprofile_saveLocal(config); //Aktuelle Profile lokal speichern
    }
    
	function weekprofile_timeChanged(elem, device) {
		console.log("changed");
		// Zeile finden
		var config = weekprofile_loadLocal(device);
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
    
	function weekprofile_tempChanged(elem, device) {
		// Zeile finden
		var config = weekprofile_loadLocal(device);
		var currProfile = elem.data('profile');
		var currLine = elem.data('line');
		// in profile uebernehmen
		config.profiles[currProfile].temps[currLine] = config.templist[elem.val()];
		weekprofile_saveLocal(config); //Aktuelle Profile lokal speichern
	}
    
    function weekprofile_saveProfile(elem, device) { // Ins weekprofile Device schreiben
        var config = weekprofile_loadLocal(device);

        // Im Prinzip steht alles in arr_config, ausser den Tages-Flags
		weekprofile_getWeekdayFlags($('.weekprofile_'+device),config.profiles);
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
		console.log(cmd);
		ftui.setFhemStatus(cmd);	
        //TOAST && $.toast(cmd);
        //--------------------------------------------------
        //Aktuelle Einstellungen/Profile in localStore schreiben    
        weekprofile_saveLocal(config); 
        //--------------------------------------------------  
        return true;
    }
    
    function weekprofile_saveLocal(config) {
        var dataToStore = JSON.stringify(config);
        localStorage.setItem(this.widgetname+"_"+config.name, dataToStore);
    }
    
    function weekprofile_loadLocal(device) {        
        return JSON.parse(localStorage.getItem(this.widgetname+"_"+device));        
    }
    
    function weekprofile_setDeleteAction(elem,device) {
        elem.find('.weekprofile_deleteprofile').each(function(){       
            $(this).on('click', function(event) {
                weekprofile_deleteProfile( $(this), device );
            });
        });        
    }
    
    function weekprofile_setAddLineAction(elem,device) {
        elem.find('.weekprofile_addline').each(function(){       
            $(this).on('click', function(event) {
                weekprofile_addLine( $(this), device );
            });
        });        
    }
    
    function weekprofile_setDeleteLineAction(elem,device) {
        elem.find('.weekprofile_deleteline').each(function(){       
            $(this).on('click', function(event) {
                weekprofile_deleteLine( $(this), device );
            });
        });        
    }
    
    function weekprofile_setTimeChangedAction(elem,device) {
        elem.find('.weekprofile_time').each(function(){       
            $(this).on('input change', function(event) {
				weekprofile_timeChanged( $(this), device );
            });
        });        
    }
    
    function weekprofile_setTempChangedAction(elem,device) {
        elem.find('.weekprofile_cmd').each(function(){  
            $(this).on('input change', function(event) {
				weekprofile_tempChanged( $(this), device );
            });
        });        
    }
    
    function weekprofile_setDateTimePicker(elem,device,style) {      
        elem.find('.weekprofile_time').each(function(){    
            var dtp_style;
            if (style != 'dark' ) {
				dtp_style = 'default';
			}else{
				dtp_style ='dark'; 
			}
            $(this).datetimepicker({
                step:5, 
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
        var attr_theme = elem.data('theme');
        var attr_style = elem.data('style');
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
                    
            if (typeof date !== Object) {return;}
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
			};
			
            config.templist = []; //Verfuegbare Temperaturen (Dropdown)
			for(var t = 5; t <= 29; t++) {
				config.templist.push(t.toString()+".0");
				config.templist.push(t.toString()+".5");
			}
			config.templist.push("30.0");
			
            config.name = attr_device; // zu Device
			config.profile = attr_profile;  // Profil im Device
			config.title = weekprofile_title; //Dialog Titel
            config.theme = attr_theme; //verwendetes Theme
            config.style = attr_style; //verwendeter Style       
                           
            weekprofile_saveLocal(config); //Konfiguration speichern
            //-----------------------------------------------

            // Aufruf des Popups
            var showDialogObject = (elem.data('starter')) ? $(document).find( elem.data('starter') ) : elem.children(":first");
            showDialogObject.on( "click", function() {
                weekprofile_showDialog(elem, attr_device);                        
            });    
        });    
    }
    
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
    }
    
	function weekprofile_arrayInsert(a,pos,newElem) {
		for(var i = a.length; i > pos; i--) {
			a[i] = a[i-1];
		};
		a[pos] = newElem;	
	}
    
	function weekprofile_arrayCompare(a1,a2) {
		return (a1.length == a2.length) && a1.every(function(element, index) {
				return element === a2[index]; } );
	}
    
    function init() {
        var base = this;
		this.elements = $('div[data-type="'+this.widgetname+'"]',this.area);
        this.elements.each(function(index) {            
            var elem=$(this);
            //Setzten der Standartattribute falls diese nicht angegeben wurden  
            elem.initData('width',  $(this).data('width') 	|| '400');
            elem.initData('height', $(this).data('height') 	|| '500');
            elem.initData('title',  $(this).data('title') 	|| 'NAME');
            elem.initData('icon',   $(this).data('icon') 	|| 'fa-clock-o');
            elem.initData('style',  $(this).data('style') 	|| 'square'); 			//round or square           
            elem.initData('theme',  $(this).data('theme') 	|| 'light');  			//light,dark,custom
			elem.initData('profile',$(this).data('profile')	|| 'default');
            //-----------------------------------------------
            weekprofile_getProfiles(elem);         
        });
    }
    
    function update (dev,par){
    }
    
	return $.extend(new Modul_widget(), {
        widgetname: 'weekprofile',
        init:init,

    });   
};

