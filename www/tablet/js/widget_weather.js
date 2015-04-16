var widget_weather = {
    _weather: null,
    elements: null,
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
        
        // OPENWEATHER (Wetter.com) (incomplete)
        'leichter Schnee - Schauer' :   'U',
        'leichter Schnee-Regen' :       'V',
        'm\u00e4\u00dfiger Schneefall' :'U',
        'leichter Regen' :              'R',
        
        // others
        'undefined' :                   ')',
        'overcast' :                    'N',
        'rain':                         'R',
    },
    kleinklimamap: {
        // Weather (YAHOO) en
        'tornado' :                     '/images/default/weather/storm.png',
        'tropical storm' :              '/images/default/weather/storm.png',
        'hurricane' :                   '/images/default/weather/storm.png',
        'severe thunderstorms' :        '/images/default/weather/thunderstorm.png',
        'thunderstorms' :               '/images/default/weather/thunderstorm.png',
        'mixed rain and snow' :         '/images/default/weather/rainsnow.png',
        'mixed rain and sleet' :        '/images/default/weather/sleet.png',
        'mixed snow and sleet' :        '/images/default/weather/snow.png',
        'freezing drizzle' :            '/images/default/weather/drizzle.png',
        'drizzle' :                     '/images/default/weather/drizzle.png',
        'freezing rain':                '/images/default/weather/icy.png',
        'showers' :                     '/images/default/weather/chance_of_rain.png',
        'snow flurries' :               '/images/default/weather/snowflurries.png',
        'light snow showers' :          '/images/default/weather/chance_of_snow.png',
        'blowing snow' :                '/images/default/weather/heavysnow.png',
        'snow' :                        '/images/default/weather/snow.png',
        'hail' :                        '/images/default/weather/sleet.png',
        'sleet' :                       '/images/default/weather/sleet.png',
        'dust' :                        '/images/default/weather/dust.png',
        'foggy' :                       '/images/default/weather/fog.png',
        'haze' :                        '/images/default/weather/haze.png',
        'smoky' :                       '/images/default/weather/smoke.png',
        'blustery' :                    '/images/default/weather/flurries.png',
        'windy' :                       '/images/default/weather/windy.png',
        'cold' :                        '/images/default/weather/cold.png',
        'cloudy' :                      '/images/default/weather/cloudy.png',
        'mostly cloudy' :               '/images/default/weather/mostlycloudy.png',
        'partly cloudy' :               '/images/default/weather/partly_cloudy.png',
        'clear' :                       '/images/default/weather/sunny.png',
        'sunny' :                       '/images/default/weather/sunny.png',
        'fair' :                        '/images/default/weather/mostly_sunny.png',
        'mixed rain and hail' :         '/images/default/weather/heavyrain.png',
        'hot' :                         '/images/default/weather/sunny.png',
        'isolated thunderstorms' :      '/images/default/weather/scatteredthunderstorms.png',
        'scattered thunderstorms' :     '/images/default/weather/scatteredthunderstorms.png',
        'scattered showers' :           '/images/default/weather/scatteredshowers.png',
        'heavy snow' :                  '/images/default/weather/heavysnow.png',
        'scattered snow showers' :      '/images/default/weather/chance_of_snow.png',
        'partly cloudy' :               '/images/default/weather/partly_cloudy.png',
        'thundershowers' :              '/images/default/weather/heavyrain.png',
        'snow showers' :                '/images/default/weather/chance_of_snow.png',
        'isolated thundershowers' :     '/images/default/weather/scatteredshowers.png',
        
        // PROPLANTA
        "heiter":                       '/images/default/weather/partly_cloudy.png',
        "wolkig":                       '/images/default/weather/mostlycloudy.png',
        "Regenschauer":                 '/images/default/weather/chance_of_rain.png',
        "stark bewoelkt":               '/images/default/weather/cloudy.png',
        "Regen":                        '/images/default/weather/rain.png',
        "bedeckt":                      '/images/default/weather/mostlycloudy.png',
        "sonnig":                       '/images/default/weather/sunny.png',
        "Schnee":                       '/images/default/weather/snow.png',
        'Schneeregen':                  '/images/default/weather/rainsnow.png',
        
        // OPENWEATHER (wetter.com) (incomplete)
        'leichter Schnee - Schauer' :   '/images/default/weather/chance_of_snow.png',
        'leichter Schnee-Regen' :       '/images/default/weather/rainsnow.png',
        'm\u00e4\u00dfiger Schneefall' :'/images/default/weather/chance_of_snow.png',
        'leichter Regen' :              '/images/default/weather/drizzle.png',
        
        // others
        'undefined' :                   '/images/default/weather/na.png',
        'overcast' :                    '/images/default/weather/overcast.png',
        'rain':                         '/images/default/weather/rain.png',
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
        '\u00fcberwiegend wolkig' :         ':mostly cloudy',
        'teilweise wolkig' :            ':partly cloudy',
        'klar' :                        ':clear',
        'sonnig' :                      ':sunny',
        'heiter' :                      ':fair',
        'Regen und Hagel' :             ':mixed rain and hail',
        'hei\u00df' :                       ':hot',
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
    },
  
    init: function () {
        _weather=this;
        _weather.elements = $('div[data-type="weather"]');
        _weather.elements.each(function(index) {
            $(this).data('get', $(this).data('get') || 'STATE');
            readings[$(this).data('get')] = true;
            $(this).addClass('weather');
        });
    },
    
    update: function (dev,par) {
        var deviceElements= _weather.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            if ( $(this).data('get')==par){
                var value = getDeviceValue( $(this), 'get' );
                if (value){
                    var part =  $(this).data('part') || -1;
                    var val = getPart(value,part);

                    //wheater icons
                    $(this).empty();
                    // translate val to a ':key'
                    var translation = _weather.translationmap[val];
                    while(typeof mapped != "undefined" && !mapped.match(/^:/)) {
                        translation = _weather.translationmap[mapped];
                    }

                    var mapped = typeof translation == "undefined"?val:translation;
                    if($(this).data('imageset')=="kleinklima") {
                        mapped = _weather.kleinklimamap[mapped.replace(/^:/, '')];
                        var fhem = $("meta[name='fhemweb_url']").attr("content") || "../fhem/";
                        fhem = fhem.replace(/\/$/, '');
                        $(this).prepend('<img style="width:100%" src="' + fhem + mapped + '" title="' + val + '">');
                    } else {
                        mapped = _weather.meteoconsmap[mapped.replace(/^:/, '')];
                        $(this).attr('data-icon', mapped);
                    }
                 }
            }
        });
    }
};
