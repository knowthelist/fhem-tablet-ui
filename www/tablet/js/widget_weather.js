if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_weather = $.extend({}, widget_widget, {
    widgetname:"weather",
    meteoconsmap: {
        // Weather (YAHOO) en
        'tornado' :                     '9',
        'tropical storm' :              '&',
        'hurricane' :                   '!',
        'severe thunderstorms' :        '&',
        'thunderstorms' :               '0',
        'mixed rain and snow' :         'V',
        'mixed rain and sleet' :        'X',
        'mixed snow and sleet' :        'X',
        'freezing drizzle' :            'W',
        'drizzle' :                     'R',
        'freezing rain':                'W',
        'showers' :                     'Q',
        'chance of rain':               'Q',
        'snow flurries' :               'U',
        'light snow showers' :          'U',
        'blowing snow' :                'W',
        'snow' :                        'W',
        'hail' :                        'X',
        'sleet' :                       'X',
        'dust' :                        'E',
        'foggy' :                       'F',
        'haze' :                        'L',
        'smoky' :                       'M',
        'blustery' :                    '!',
        'windy' :                       'S',
        'cold' :                        'G',
        'cloudy' :                      '5',
        'mostly cloudy' :               'N',
        'partly cloudy' :               'H',
        'clear' :                       'B',
        'sunny' :                       'B',
        'fair' :                        'B',
        'mixed rain and hail' :         'X',
        'hot' :                         'B',
        'isolated thunderstorms' :      'Z',
        'scattered thunderstorms' :     'Z',
        'scattered showers' :           'Q',
        'heavy snow' :                  '#',
        'scattered snow showers' :      'V',
        'partly cloudy' :               'H',
        'thundershowers' :              '8',
        'snow showers' :                '$',
        'isolated thundershowers' :     'R',

        // PROPLANTA (most likely incomplete)
        "heiter":                       "H",
        "wolkig":                       "N",
        "Regenschauer":                 "Q",
        "stark bewoelkt":               "Y",
        "Regen":                        "R",
        "bedeckt":                      "N",
        "sonnig":                       "B",
        "Schnee":                       "U",
        'Schneeregen':                  'V',
        'unterschiedlich bewoelkt, vereinzelt Schauer und Gewitter': 'Q',
        'Nebel':                        'F',
        'klar':                         'B',

        // OPENWEATHER (Wetter.com) (incomplete)
        'leichter Schnee - Schauer' :   'U',
        'leichter Schnee-Regen' :       'V',
        'm\u00e4\u00dfiger Schneefall' :'U',
        'leichter Regen' :              'R',

        // others
        'undefined' :                   ')',
        'overcast' :                    'N',
        'rain':                         'R',

        'chance of storm':              'S',
        'sunny night'           :       '2',
        'mostly clear night'    :       '4',
        'partly cloudy night'   :       '5',
        'chance of rain night'  :       '7',
        'showers night'         :       '8',
        'chance of storm night' :       '9',
        'haze night'            :       'K',
    },
    kleinklimamap: {
        // Weather (YAHOO) en
        'tornado' :                     'storm.png',
        'tropical storm' :              'storm.png',
        'hurricane' :                   'storm.png',
        'severe thunderstorms' :        'thunderstorm.png',
        'thunderstorms' :               'thunderstorm.png',
        'mixed rain and snow' :         'rainsnow.png',
        'mixed rain and sleet' :        'sleet.png',
        'mixed snow and sleet' :        'snow.png',
        'freezing drizzle' :            'drizzle.png',
        'drizzle' :                     'drizzle.png',
        'freezing rain':                'icy.png',
        'showers' :                     'showers.png',
        'chance of rain':               'chance_of_rain.png',
        'snow flurries' :               'snowflurries.png',
        'light snow showers' :          'chance_of_snow.png',
        'blowing snow' :                'heavysnow.png',
        'snow' :                        'snow.png',
        'hail' :                        'sleet.png',
        'sleet' :                       'sleet.png',
        'dust' :                        'dust.png',
        'foggy' :                       'fog.png',
        'haze' :                        'haze.png',
        'smoky' :                       'smoke.png',
        'blustery' :                    'flurries.png',
        'windy' :                       'windy.png',
        'cold' :                        'cold.png',
        'cloudy' :                      'cloudy.png',
        'mostly cloudy' :               'mostlycloudy.png',
        'partly cloudy' :               'partly_cloudy.png',
        'clear' :                       'sunny.png',
        'sunny' :                       'sunny.png',
        'fair' :                        'mostly_sunny.png',
        'mixed rain and hail' :         'heavyrain.png',
        'hot' :                         'sunny.png',
        'isolated thunderstorms' :      'scatteredthunderstorms.png',
        'scattered thunderstorms' :     'scatteredthunderstorms.png',
        'scattered showers' :           'scatteredshowers.png',
        'heavy snow' :                  'heavysnow.png',
        'scattered snow showers' :      'chance_of_snow.png',
        'thundershowers' :              'heavyrain.png',
        'snow showers' :                'chance_of_snow.png',
        'isolated thundershowers' :     'scatteredshowers.png',

        // PROPLANTA
        "heiter":                       'partly_cloudy.png',
        "wolkig":                       'mostlycloudy.png',
        "Regenschauer":                 'chance_of_rain.png',
        "stark bewoelkt":               'cloudy.png',
        "Regen":                        'rain.png',
        "bedeckt":                      'mostlycloudy.png',
        "sonnig":                       'sunny.png',
        "Schnee":                       'snow.png',
        'Schneeregen':                  'rainsnow.png',
        'unterschiedlich bewoelkt, vereinzelt Schauer und Gewitter': 'scatteredshowers.png',
        'Nebel':                        'fog.png',
        'klar':                         'sunny_night.png',

        // OPENWEATHER (wetter.com) (incomplete)
        'leichter Schnee - Schauer' :   'chance_of_snow.png',
        'leichter Schnee-Regen' :       'rainsnow.png',
        'm\u00e4\u00dfiger Schneefall' :'chance_of_snow.png',
        'leichter Regen' :              'drizzle.png',
        'leicht bew\u00f6lkt' :         'partly_cloudy.png',
        'Regen - Schauer':              'chance_of_rain.png',

        // others
        'undefined' :                   'na.png',
        'overcast' :                    'overcast.png',
        'rain':                         'rain.png',

        'chance of storm' :             'chance_of_storm.png',
        'sunny night'           :       'sunny_night.png',
        'mostly clear night'    :       'mostly_clear_night.png',
        'mostly cloudy night'   :       'mostlycloudy_night.png',
        'partly cloudy night'   :       'partlycloudy_night.png',
        'chance of rain night'  :       'chance_of_rain_night.png',
        'showers night'         :       'showers_night.png',
        'chance of storm night' :       'chance_of_storm_night.png',
        'haze night'            :       'haze_night.png',
    },
    translationmap: {
        // Weather (YAHOO) de
        'Tornado' :                     ':tornado',
        'schwerer Sturm' :              ':tropical storm',
        'Orkan' :                       ':hurricane',
        'schwere Gewitter' :            ':severe thunderstorms',
        'Gewitter' :                    ':thunderstorms',
        'Regen und Schnee' :            ':mixed rain and snow',
        'Regen und Graupel' :           ':mixed rain and sleet',
        'Schnee und Graupel' :          ':mixed snow and sleet',
        'Eisregen' :                    ':freezing drizzle',
        'Nieselregen' :                 ':drizzle',
        'gefrierender Regen' :          ':freezing rain',
        'Schauer' :                     ':showers',
        'Schneetreiben' :               ':snow flurries',
        'leichte Schneeschauer' :       ':light snow showers',
        'Schneeverwehungen' :           ':blowing snow',
        'Schnee' :                      ':snow',
        'Hagel' :                       ':hail',
        'Graupel' :                     ':sleet',
        'Staub' :                       ':dust',
        'Nebel' :                       ':foggy',
        'Dunst' :                       ':haze',
        'Smog' :                        ':smoky',
        'Sturm' :                       ':blustery',
        'windig' :                      ':windy',
        'kalt' :                        ':cold',
        'wolkig' :                      ':cloudy',
        '\u00fcberwiegend wolkig' :     ':mostly cloudy',
        'teilweise wolkig' :            ':partly cloudy',
        'klar' :                        ':clear',
        'sonnig' :                      ':sunny',
        'heiter' :                      ':fair',
        'Regen und Hagel' :             ':mixed rain and hail',
        'hei\u00df' :                   ':hot',
        'einzelne Gewitter' :           ':isolated thunderstorms',
        'vereinzelt Gewitter' :         ':scattered thunderstorms',
        'vereinzelt Schauer' :          ':scattered showers',
        'starker Schneefall' :          ':heavy snow',
        'vereinzelt Schneeschauer' :    ':scattered snow showers',
        'teilweise wolkig' :            ':partly cloudy',
        'Gewitterregen' :               ':thundershowers',
        'Schneeschauer' :               ':snow showers',
        'vereinzelt Gewitter' :         ':isolated thundershowers',

        // Weather (YAHOO) nl
        'zware storm' :                 ':tropical storm',
        'orkaan' :                      ':hurricane',
        'hevig onweer' :                ':severe thunderstorms',
        'onweer' :                      ':thunderstorms',
        'regen en sneeuw' :             ':mixed rain and snow',
        'regen en ijzel' :              ':mixed rain and sleet',
        'sneeuw en ijzel' :             ':mixed snow and sleet',
        'aanvriezende motregen' :       ':freezing drizzle',
        'motregen' :                    ':drizzle',
        'aanvriezende regen' :          ':freezing rain',
        'buien' :                       ':showers',
        'sneeuw windstoten' :           ':snow flurries',
        'lichte sneeuwbuien' :          ':light snow showers',
        'stuifsneeuw' :                 ':blowing snow',
        'sneeuw' :                      ':snow',
        'hagel' :                       ':hail',
        'ijzel' :                       ':sleet',
        'stof' :                        ':dust',
        'mist' :                        ':foggy',
        'waas' :                        ':haze',
        'smog' :                        ':smoky',
        'heftig' :                      ':blustery',
        'winderig' :                    ':windy',
        'koud' :                        ':cold',
        'bewolkt' :                     ':cloudy',
        'overwegend bewolkt' :          ':mostly cloudy',
        'gedeeltelijk bewolkt' :        ':partly cloudy',
        'helder' :                      ':clear',
        'zonnig' :                      ':sunny',
        'mooi' :                        ':fair',
        'regen en hagel' :              ':mixed rain and hail',
        'heet' :                        ':hot',
        'plaatselijk onweer' :          ':isolated thunderstorms',
        'af en toe onweer' :            ':scattered thunderstorms',
        'af en toe regenbuien' :        ':scattered showers',
        'hevige sneeuwval' :            ':heavy snow',
        'af en toe sneeuwbuien' :       ':scattered snow showers',
        'deels bewolkt' :               ':partly cloudy',
        'onweersbuien' :                ':thundershowers',
        'sneeuwbuien' :                 ':snow showers',
        'af en toe onweersbuien' :      ':isolated thundershowers',

        // OPENWEATHER (wetter.com) weatherCode
        '0' :                           ':sunny',
        '1' :                           ':partly cloudy',
        '2' :                           ':cloudy',
        '3' :                           ':overcast',
        '4' :                           ':foggy',
        '5' :                           ':drizzle',
        '6' :                           ':rain',
        '7' :                           ':snow',
        '8' :                           ':showers',
        '9' :                           ':thunderstorms',
        '10' :                          ':partly cloudy',
        '20' :                          ':cloudy',
        '30' :                          ':overcast',
        '40' :                          ':foggy',
        '45' :                          ':foggy',
        '48' :                          ':foggy',
        '49' :                          ':foggy',
        '50' :                          ':drizzle',
        '51' :                          ':drizzle',
        '53' :                          ':drizzle',
        '55' :                          ':drizzle',
        '56' :                          ':drizzle',
        '57' :                          ':freezing rain',
        '60' :                          ':rain',
        '61' :                          ':rain',
        '63' :                          ':rain',
        '65' :                          ':mixed rain and hail',
        '66' :                          ':rain',
        '67' :                          ':freezing rain',
        '68' :                          ':sleet',
        '69' :                          ':sleet',
        '70' :                          ':snow',
        '71' :                          ':snow',
        '73' :                          ':snow',
        '75' :                          ':snow',
        '80' :                          ':scattered showers',
        '81' :                          ':showers',
        '82' :                          ':showers',
        '83' :                          ':sleet',
        '84' :                          ':sleet',
        '85' :                          ':snow showers',
        '86' :                          ':sleet',
        '90' :                          ':thunderstorms',
        '95' :                          ':scattered thunderstorms',
        '96' :                          ':thunderstorms',
        '999' :                         ':undefined',

        // PROPLANTA fc#_weather(Day|Evening|Morning|Night)Icon
        // thx to Risiko (http://forum.fhem.de/index.php/topic,34233.msg292189.html#msg292189)
        't1':                           ':sunny',
        't2':                           ':partly cloudy',
        't3':                           ':partly cloudy',
        't4':                           ':mostly cloudy',
        't5':                           ':cloudy',
        't6':                           ':chance of rain',
        't7':                           ':showers',
        't8':                           ':chance of storm',
        't9':                           ':light snow showers',
        't10':                          ':mixed rain and snow',
        't11':                          ':snow',
        't12':                          ':haze',
        't13':                          ':haze',
        't14':                          ':rain',
        'n1':                           ':sunny night',
        'n2':                           ':partly cloudy night',
        'n3':                           ':partly cloudy night',
        'n4':                           ':mostly cloudy night',
        'n5':                           ':overcast',
        'n6':                           ':chance of rain night',
        'n7':                           ':showers night',
        'n8':                           ':chance of storm night',
        'n9':                           ':sleet',
        'n10':                          ':mixed rain and snow',
        'n11':                          ':snow',
        'n12':                          ':haze night',
        'n13':                          ':haze night',
        'n14':                          ':rain',
    },

    init_attr: function(elem) {
        elem.data('get', elem.data('get') || 'STATE');

        readings[elem.data('get')] = true;

        var fhem_path = $("meta[name='fhemweb_url']").attr("content") || "/fhem/";
        fhem_path = fhem_path.replace(/\/$/, '');
        var image_path = $("meta[name='weather_image_path']").attr("content") || fhem_path + '/images/default/weather/';
        elem.data('image-path', elem.data('image-path') || image_path);
        if(!elem.data('image-path').match(/\/$/)) {
            elem.data('image-path', elem.data('image-path')+'/');
        }
    },

    init: function () {
        base=this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            $(this).addClass('weather');
        });
    },

    update: function (dev,par) {
        base=this;
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par){
                var value = getDeviceValue( $(this), 'get' );
                if (value){
                    var part =  $(this).data('part') || -1;
                    var val = getPart(value,part);
                    var _val = val;

                    //wheater icons
                    $(this).empty();

                    var device_type;
                    if($(this).data('device-type')) {
                        device_type = $(this).data('device-type');
                    } else {
                        if(par.match(/^fc\d+_weather(Day|Evening|Morning|Night)(?:Icon)?$/)) {
                            device_type='PROPLANTA';
                        } else if(par.match(/^fc\d+_condition$/)) {
                            device_type='Weather';
                        } else if(par.match(/^fc\d+_weather\d*$/)) {
                            device_type='OPENWEATHER';
                        } else if(par.match(/^fc\d+_weatherCode\d*$/)) {
                            device_type='OPENWEATHER';
                        } else {
                            device_type='UNKNOWN';
                        }
                    }
                    var translate = true;
                    if(device_type == 'PROPLANTA') {
                        var matches;
                        if(matches = val.match('^http://www\.proplanta\.de/wetterdaten/images/symbole/([tn][0-9]+)\.gif')) {
                            val = matches[1];
                        } else {
                            translate = false;
                        }
                    }

                    if(translate) {
                        // translate val to ':key'
                        var translation = base.translationmap[val];
                        while(typeof mapped != "undefined" && !mapped.match(/^:/)) {
                            translation = base.translationmap[mapped];
                        }
                    }

                    var mapped = typeof translation == "undefined"?val:translation;
                    if($(this).data('imageset')=="kleinklima") {
                        mapped = base.kleinklimamap[mapped.replace(/^:/, '')];
                        $(this).prepend('<img style="width:100%" src="' + $(this).data('image-path') + mapped + '" title="' + val + '">');
                    } else if($(this).data('imageset')=="reading") {
                        $(this).prepend('<img style="width:100%" src="' + _val + '">');
                    } else {
                        mapped = base.meteoconsmap[mapped.replace(/^:/, '')];
                        $(this).attr('data-icon', mapped);
                    }
                 }
            }
        });
    }
});
