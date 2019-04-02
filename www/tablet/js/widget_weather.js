/* FTUI Plugin
 * Copyright (c) 2015-2018 Mario Stephan <mstephan@shared-files.de>
 * originally created by Thomas Nesges
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */
 
/* amCharts animated svg weather icons
 * https://www.amcharts.com/free-animated-svg-weather-icons/
 * Under CCA 4.0 International Public License (https://creativecommons.org/licenses/by/4.0/)
 */
 
/* v2 updated by "somansch" (Andreas) */
/* v2.1 added amCharts animated icons by "somansch" (Andreas) */
/* v2.2 fixed amCharts sizing by "somansch" (Andreas) */
/* v2.3 fixed actual "weatherIcon" for ProPlanta by "somansch" (Andreas) */
/* v2.4 fixed "kleinklima" names changed to fit default content of FHEM image folder by "somansch" (Andreas) */
/* v2.5 added Day/Night differentiation for "DWD" by "somansch" (Andreas); thanks to "sinus61" */
/* v2.6 added additional "amcharts" files and mappings by "somansch" (Andreas); optimized Day/Night differentiation for "DWD" thanks to "Knallkopp_02" */
/* v2.7 changed Day/Night differentiation for "DWD" by "somansch" (Andreas); thanks to "Knallkopp_02"; now uses "SunUp" Reading from DWD - needs to add to "forecastProperties" Attribute in DWD */
/* v2.7 added WindDirection feature from former versions again by "somansch" (Andreas) */
/* v2.8 beta optimized Day/Night differentiation for "DWD" with fallback to "d" if SunUp is not found by "somansch" (Andreas) */
/* v2.8 beta added Netatmo mapping for "amcharts" by "somansch" (Andreas) */
/* v2.8 beta added additional icon and mapping in "amcharts" for windy by "somansch" (Andreas) */
/* v2.8 added mapping for 68,69,83,84,89,90,97 of "DWD" by "somansch" (Andreas) */
/* v2.9 added Netatmo mapping for "kleinklima" by "somansch" (Andreas) */


/* global ftui:true, Modul_widget:true */

"use strict";

var Modul_weather = function () {

    var weathericonsmap = {
		// Proplanta - Day Icons
        't1': 'wi wi-day-sunny',		
        't2': 'wi wi-day-sunny-overcast',		
        't3': 'wi wi-day-sunny-overcast',		
        't4': 'wi wi-day-cloudy',		
        't5': 'wi wi-cloudy',		
        't6': 'wi wi-day-showers',		
        't7': 'wi wi-day-showers',		
        't8': 'wi wi-day-thunderstorm',		
        't9': 'wi wi-day-sprinkle',		
        't10': 'wi wi-day-sleet',		
        't11': 'wi wi-day-snow',		
        't12': 'wi wi-day-haze',		
        't13': 'wi wi-day-fog',		
        't14': 'wi wi-day-rain',		
		// Proplanta - Night Icons
        'n1': 'wi wi-night-clear',		
        'n2': 'wi wi-night-partly-cloudy',		
        'n3': 'wi wi-night-partly-cloudy',		
        'n4': 'wi wi-night-cloudy',		
        'n5': 'wi wi-cloudy',		
        'n6': 'wi wi-night-showers',		
        'n7': 'wi wi-night-showers',		
        'n8': 'wi wi-night-thunderstorm',		
        'n9': 'wi wi-night-sprinkle',		
        'n10': 'wi wi-night-sleet',		
        'n11': 'wi wi-night-snow',		
        'n12': 'wi wi-night-fog',		
        'n13': 'wi wi-night-fog',		
        'n14': 'wi wi-night-rain',	
		// Weather Darksky - Day Icons
        'clear-day': 'wi wi-day-sunny',		
        'cloudy': 'wi wi-cloudy',		
        'fog': 'wi wi-day-fog',		
        'hail': 'wi wi-day-hail',		
        'partly-cloudy-day': 'wi wi-day-sunny-overcast',		
        'rain': 'wi wi-day-rain',		
        'sleet': 'wi wi-day-sleet',		
        'snow': 'wi wi-day-snow',		
        'thunderstorm': 'wi wi-day-thunderstorm',		
        'wind': 'wi wi-day-cloudy-windy',		
		// Weather Darksky - Night Icons
        'clear-night': 'wi wi-night-clear',	
        'partly-cloudy-night': 'wi wi-day-sunny',	// nicht "wi wi-partly-cloudy-night", siehe DarkSky API FAQ: https://darksky.net/dev/docs/faq
		// Weather Openweather - Day Icons
        '01d': 'wi wi-day-sunny',		
        '02d': 'wi wi-day-sunny-overcast',		
        '03d': 'wi wi-day-cloudy',		
        '04d': 'wi wi-cloudy',		
        '09d': 'wi wi-day-showers',		
        '10d': 'wi wi-day-rain',		
        '11d': 'wi wi-day-thunderstorm',		
        '13d': 'wi wi-day-snow',		
        '50d': 'wi wi-day-fog',		
		// Weather Openweather - Night Icons
        '01n': 'wi wi-night-clear',		
        '02n': 'wi wi-night-partly-cloudy',		
        '03n': 'wi wi-night-cloudy',		
        '04n': 'wi wi-cloudy',		
        '09n': 'wi wi-night-showers',		
        '10n': 'wi wi-night-rain',		
        '11n': 'wi wi-night-thunderstorm',		
        '13n': 'wi wi-night-snow',		
        '50n': 'wi wi-night-fog',		
		// DWD Opendata - Day Icons
        '0d': 'wi wi-day-sunny',		
        '1d': 'wi wi-day-sunny-overcast',		
        '2d': 'wi wi-day-cloudy',		
        '3d': 'wi wi-cloudy',		
        '4d': 'wi wi-day-haze',		
        '18d': 'wi wi-day-cloudy-windy',		
        '45d': 'wi wi-day-fog',		
        '48d': 'wi wi-day-fog',		
        '49d': 'wi wi-day-fog',		
        '51d': 'wi wi-day-rain-mix',		
        '53d': 'wi wi-day-rain-mix',		
        '55d': 'wi wi-day-rain-mix',		
        '56d': 'wi wi-day-sleet',		
        '57d': 'wi wi-day-sleet',		
        '60d': 'wi wi-day-showers',	
        '61d': 'wi wi-day-rain',		
        '62d': 'wi wi-day-showers',		
        '63d': 'wi wi-day-rain',		
        '65d': 'wi wi-day-rain',		
        '66d': 'wi wi-day-sleet',		
        '67d': 'wi wi-day-sleet',		
        '68d': 'wi wi-day-sleet',		
        '69d': 'wi wi-day-sleet',		
        '70d': 'wi wi-day-sprinkle',		
        '71d': 'wi wi-day-snow',		
        '73d': 'wi wi-day-snow',	
        '75d': 'wi wi-day-snow',	
        '77d': 'wi wi-day-sprinkle',		
        '80d': 'wi wi-day-showers',		
        '81d': 'wi wi-day-showers',		
        '82d': 'wi wi-day-showers',		
        '83d': 'wi wi-day-showers',		
        '84d': 'wi wi-day-showers',		
        '85d': 'wi wi-day-snow',		
        '86d': 'wi wi-day-snow',		
        '89d': 'wi wi-day-sleet',		
        '90d': 'wi wi-day-sleet',		
        '95d': 'wi wi-day-thunderstorm',		
        '96d': 'wi wi-day-thunderstorm',		
        '97d': 'wi wi-day-thunderstorm',		
        '99d': 'wi wi-day-hail',	
		// DWD Opendata - Night Icons
        '0n': 'wi wi-night-clear',		
        '1n': 'wi wi-night-partly-cloudy',		
        '2n': 'wi wi-night-cloudy',		
        '3n': 'wi wi-cloudy',		
        '4n': 'wi wi-night-fog',		
        '18n': 'wi wi-night-cloudy-windy',		
        '45n': 'wi wi-night-fog',		
        '48n': 'wi wi-night-fog',		
        '49n': 'wi wi-night-fog',		
        '51n': 'wi wi-night-rain-mix',		
        '53n': 'wi wi-night-rain-mix',		
        '55n': 'wi wi-night-rain-mix',		
        '56n': 'wi wi-night-sleet',		
        '57n': 'wi wi-night-sleet',		
        '60n': 'wi wi-night-showers',	
        '61n': 'wi wi-night-rain',		
        '62n': 'wi wi-night-showers',		
        '63n': 'wi wi-night-rain',		
        '65n': 'wi wi-night-rain',		
        '66n': 'wi wi-night-sleet',		
        '67n': 'wi wi-night-sleet',		
        '68n': 'wi wi-night-sleet',		
        '69n': 'wi wi-night-sleet',		
        '70n': 'wi wi-night-sprinkle',		
        '71n': 'wi wi-night-snow',		
        '73n': 'wi wi-night-snow',	
        '75n': 'wi wi-night-snow',	
        '77n': 'wi wi-night-sprinkle',		
        '80n': 'wi wi-night-showers',		
        '81n': 'wi wi-night-showers',		
        '82n': 'wi wi-night-showers',		
        '83n': 'wi wi-night-showers',		
        '84n': 'wi wi-night-showers',		
        '85n': 'wi wi-night-snow',		
        '86n': 'wi wi-night-snow',		
        '89n': 'wi wi-night-sleet',		
        '90n': 'wi wi-night-sleet',		
        '95n': 'wi wi-night-thunderstorm',		
        '96n': 'wi wi-night-thunderstorm',		
        '97n': 'wi wi-night-thunderstorm',		
        '99n': 'wi wi-night-hail',	

    };
    var meteoconsmap = {
		// Proplanta - Day Icons
        't1': 'B',		
        't2': 'H',		
        't3': 'H',		
        't4': 'N',		
        't5': 'Y',		
        't6': 'Q',		
        't7': 'Q',		
        't8': 'P',		
        't9': 'U',		
        't10': 'V',		
        't11': 'W',		
        't12': 'L',		
        't13': 'F',		
        't14': 'R',		
        'na': '',		
		// Proplanta - Night Icons
        'n1': 'C',		
        'n2': 'I',		
        'n3': 'I',		
        'n4': 'N',		
        'n5': 'Y',		
        'n6': 'Q',		
        'n7': 'Q',		
        'n8': 'P',		
        'n9': 'U',		
        'n10': 'V',		
        'n11': 'W',		
        'n12': 'K',		
        'n13': 'F',		
        'n14': 'R',	
		// Weather Darksky - Day Icons
        'clear-day': 'B',		
        'cloudy': 'Y',		
        'fog': 'F',		
        'hail': 'Z',		
        'partly-cloudy-day': 'H',		
        'rain': 'R',		
        'sleet': 'V',		
        'snow': 'W',		
        'thunderstorm': 'P',		
        'wind': 'S',		
		// Weather Darksky - Night Icons
        'clear-night': 'C',	
        'partly-cloudy-night': 'B',			// not "I", see DarkSky API FAQ: https://darksky.net/dev/docs/faq
		// Weather Openweather - Day Icons
        '01d': 'B',		
        '02d': 'H',		
        '03d': 'N',		
        '04d': 'Y',		
        '09d': 'Q',		
        '10d': 'R',		
        '11d': 'P',		
        '13d': 'W',		
        '50d': 'F',		
		// Weather Openweather - Night Icons
        '01n': 'C',		
        '02n': 'I',		
        '03n': 'N',		
        '04n': 'Y',		
        '09n': 'Q',		
        '10n': 'R',		
        '11n': 'P',		
        '13n': 'W',		
        '50n': 'F',		
		// DWD Opendata - Day Icons
        '0d': 'B',		
        '1d': 'H',		
        '2d': 'N',		
        '3d': 'Y',		
        '4d': 'L',		
        '18d': 'S',		
        '45d': 'F',		
        '48d': 'F',		
        '49d': 'F',		
        '51d': 'Q',		
        '53d': 'Q',		
        '55d': 'Q',		
        '56d': 'V',		
        '57d': 'V',		
        '60d': 'Q',	
        '61d': 'R',		
        '62d': 'Q',		
        '63d': 'R',		
        '65d': 'R',		
        '66d': 'V',		
        '67d': 'V',		
        '68d': 'V',		
        '69d': 'V',		
        '70d': 'U',		
        '71d': 'W',		
        '73d': 'W',	
        '75d': 'W',	
        '77d': 'U',		
        '80d': 'Q',		
        '81d': 'Q',		
        '82d': 'Q',		
        '83d': 'Q',		
        '84d': 'Q',		
        '85d': 'W',		
        '86d': 'W',		
        '89d': 'V',		
        '90d': 'V',		
        '95d': 'P',		
        '96d': 'P',		
        '97d': 'P',		
        '99d': 'Z',	
		// DWD Opendata - Night Icons
        '0n': 'C',		
        '1n': 'I',		
        '2n': 'N',		
        '3n': 'Y',		
        '4n': 'K',		
        '18n': 'S',		
        '45n': 'F',		
        '48n': 'F',		
        '49n': 'F',		
        '51n': 'Q',		
        '53n': 'Q',		
        '55n': 'Q',		
        '56n': 'V',		
        '57n': 'V',		
        '60n': 'Q',	
        '61n': 'R',		
        '62n': 'Q',		
        '63n': 'R',		
        '65n': 'R',		
        '66n': 'V',		
        '67n': 'V',		
        '68n': 'V',		
        '69n': 'V',		
        '70n': 'U',		
        '71n': 'W',		
        '73n': 'W',	
        '75n': 'W',	
        '77n': 'U',		
        '80n': 'Q',		
        '81n': 'Q',		
        '82n': 'Q',		
        '83n': 'Q',		
        '84n': 'Q',		
        '85n': 'W',		
        '86n': 'W',		
        '89n': 'V',		
        '90n': 'V',		
        '95n': 'P',		
        '96n': 'P',		
        '97n': 'P',		
        '99n': 'Z',	

    };
    var kleinklimamap = {
		// Proplanta - Day Icons
        't1': 'sunny.png',		
        't2': 'partlycloudy.png',		
        't3': 'partlycloudy.png',		
        't4': 'mostlycloudy.png',		
        't5': 'cloudy.png',		
        't6': 'chance_of_rain.png',		
        't7': 'showers.png',		
        't8': 'scatteredthunderstorms.png',		
        't9': 'chance_of_snow.png',		
        't10': 'rainsnow.png',		
        't11': 'snow.png',		
        't12': 'haze.png',		
        't13': 'fog.png',		
        't14': 'rain.png',	
		// Proplanta - Night Icons
        'n1': 'clear.png',		
        'n2': 'partlycloudy_night.png',		
        'n3': 'partlycloudy_night.png',		
        'n4': 'mostlycloudy_night.png',		
        'n5': 'overcast.png',		
        'n6': 'chance_of_rain_night.png',		
        'n7': 'showers_night.png',		
        'n8': 'scatteredthunderstorms_night.png',		
        'n9': 'chance_of_snow_night.png',		
        'n10': 'rainsnow.png',		
        'n11': 'snow.png',		
        'n12': 'haze_night.png',		
        'n13': 'fog.png',		
        'n14': 'rain_night.png',		
		'na': 'na.png',		
		// Weather Darksky - Day Icons
        'clear-day': 'sunny.png',		
        'cloudy': 'cloudy.png',		
        'fog': 'fog.png',		
        'hail': 'thunderstorm.png',		
        'partly-cloudy-day': 'partlycloudy.png',		
        'rain': 'rain.png',		
        'sleet': 'rainsnow.png',		
        'snow': 'snow.png',		
        'thunderstorm': 'scatteredthunderstorms.png',		
        'wind': 'windy.png',		
		// Weather Darksky - Night Icons
        'clear-night': 'clear.png',	
        'partly-cloudy-night': 'sunny.png',	// not "partlycloudy_night.png", see DarkSky API FAQ: https://darksky.net/dev/docs/faq	
		// Weather Openweather - Day Icons
        '01d': 'sunny.png',		
        '02d': 'partlycloudy.png',		
        '03d': 'mostlycloudy.png',		
        '04d': 'cloudy.png',		
        '09d': 'chance_of_rain.png',		
        '10d': 'rain.png',		
        '11d': 'scatteredthunderstorms.png',		
        '13d': 'snow.png',		
        '50d': 'fog.png',		
		// Weather Openweather - Night Icons
        '01n': 'clear.png',		
        '02n': 'partlycloudy_night.png',		
        '03n': 'mostlycloudy_night.png',		
        '04n': 'overcast.png',		
        '09n': 'chance_of_rain_night.png',		
        '10n': 'rain.png',		
        '11n': 'scatteredthunderstorms.png',		
        '13n': 'snow.png',		
        '50n': 'fog.png',		
		// DWD Opendata - Day Icons
        '0d': 'sunny.png',		
        '1d': 'partlycloudy.png',		
        '2d': 'mostlycloudy.png',		
        '3d': 'cloudy.png',		
        '4d': 'haze.png',		
        '18d': 'windy.png',		
        '45d': 'fog.png',		
        '48d': 'fog.png',		
        '49d': 'fog.png',		
        '51d': 'drizzle.png',		
        '53d': 'drizzle.png',		
        '55d': 'drizzle.png',		
        '56d': 'rainsnow.png',		
        '57d': 'rainsnow.png',		
        '60d': 'chance_of_rain.png',	
        '61d': 'rain.png',		
        '62d': 'showers.png',		
        '63d': 'rain.png',		
        '65d': 'rain.png',		
        '66d': 'rainsnow.png',		
        '67d': 'rainsnow.png',		
        '68d': 'rainsnow.png',		
        '69d': 'rainsnow.png',		
        '70d': 'chance_of_snow.png',		
        '71d': 'snow.png',		
        '73d': 'snow.png',	
        '75d': 'snow.png',	
        '77d': 'chance_of_snow.png',		
        '80d': 'scatteredshowers.png',		
        '81d': 'showers.png',		
        '82d': 'showers.png',		
        '83d': 'scatteredshowers.png',		
        '84d': 'showers.png',		
        '85d': 'snow.png',		
        '86d': 'snow.png',		
        '89d': 'rainsnow.png',		
        '90d': 'rainsnow.png',		
        '95d': 'scatteredthunderstorms.png',		
        '96d': 'scatteredthunderstorms.png',		
        '97d': 'scatteredthunderstorms.png',		
        '99d': 'thunderstorm.png',	
		// DWD Opendata - Night Icons
        '0n': 'clear.png',		
        '1n': 'partlycloudy_night.png',		
        '2n': 'mostlycloudy_night.png',		
        '3n': 'overcast.png',		
        '4n': 'haze_night.png',		
        '18n': 'windy.png',		
        '45n': 'fog.png',		
        '48n': 'fog.png',		
        '49n': 'fog.png',		
        '51n': 'drizzle_night.png',		
        '53n': 'drizzle_night.png',		
        '55n': 'drizzle_night.png',		
        '56n': 'rainsnow.png',		
        '57n': 'rainsnow.png',		
        '60n': 'chance_of_rain_night.png',	
        '61n': 'rain.png',		
        '62n': 'showers_night.png',		
        '63n': 'rain.png',		
        '65n': 'rain.png',		
        '66n': 'rainsnow.png',		
        '67n': 'rainsnow.png',		
        '68n': 'rainsnow.png',		
        '69n': 'rainsnow.png',		
        '70n': 'chance_of_snow_night.png',		
        '71n': 'snow.png',		
        '73n': 'snow.png',	
        '75n': 'snow.png',	
        '77n': 'chance_of_snow_night.png',		
        '80n': 'scatteredshowers_night.png',		
        '81n': 'showers_night.png',		
        '82n': 'showers_night.png',		
        '83n': 'scatteredshowers_night.png',		
        '84n': 'showers_night.png',		
        '85n': 'snow.png',		
        '86n': 'snow.png',		
        '89n': 'rainsnow.png',		
        '90n': 'rainsnow.png',		
        '95n': 'scatteredthunderstorms.png',		
        '96n': 'scatteredthunderstorms.png',		
        '97n': 'scatteredthunderstorms.png',		
        '99n': 'thunderstorm.png',	
		// Netatmo - Day Icons
        '100000': 'sunny.png',	
        '110000': 'partlycloudy.png',	
        '110001': 'scatteredthunderstorms.png',	
        '110002': 'scatteredthunderstorms.png',	
        '110010': 'rainsnow.png',	
        '110011': 'scatteredthunderstorms.png',	
        '110012': 'scatteredthunderstorms.png',	
        '110020': 'rainsnow.png',	
        '110021': 'scatteredthunderstorms.png',	
        '110022': 'scatteredthunderstorms.png',	
        '110030': 'rainsnow.png',	
        '110031': 'thunderstorm.png',	
        '110032': 'thunderstorm.png',	
        '110100': 'chance_of_snow.png',	
        '110101': 'scatteredthunderstorms.png',	
        '110102': 'scatteredthunderstorms.png',	
        '110200': 'snow.png',	
        '110201': 'scatteredthunderstorms.png',	
        '110202': 'scatteredthunderstorms.png',	
        '110300': 'snow.png',	
        '110301': 'scatteredthunderstorms.png',	
        '110302': 'scatteredthunderstorms.png',	
        '111000': 'chance_of_rain.png',	
        '111001': 'scatteredthunderstorms.png',	
        '111002': 'scatteredthunderstorms.png',	
        '111100': 'rainsnow.png',	
        '112000': 'showers.png',	
        '112001': 'scatteredthunderstorms.png',	
        '112002': 'scatteredthunderstorms.png',	
        '112200': 'rainsnow.png',	
        '112201': 'scatteredthunderstorms.png',	
        '112202': 'scatteredthunderstorms.png',	
        '113000': 'rain.png',	
        '113001': 'scatteredthunderstorms.png',	
        '113002': 'scatteredthunderstorms.png',	
        '113300': 'rainsnow.png',	
        '113301': 'scatteredthunderstorms.png',	
        '113302': 'scatteredthunderstorms.png',	
        '120000': 'mostlycloudy.png',	
        '120001': 'scatteredthunderstorms.png',	
        '120002': 'scatteredthunderstorms.png',	
        '120010': 'rainsnow.png',	
        '120011': 'scatteredthunderstorms.png',	
        '120012': 'scatteredthunderstorms.png',	
        '120020': 'rainsnow.png',	
        '120021': 'scatteredthunderstorms.png',	
        '120022': 'scatteredthunderstorms.png',	
        '120030': 'rainsnow.png',	
        '120031': 'thunderstorm.png',	
        '120032': 'thunderstorm.png',	
        '120100': 'chance_of_snow.png',	
        '120101': 'scatteredthunderstorms.png',	
        '120102': 'scatteredthunderstorms.png',	
        '120200': 'snow.png',	
        '120201': 'scatteredthunderstorms.png',	
        '120202': 'scatteredthunderstorms.png',	
        '120300': 'snow.png',	
        '120301': 'scatteredthunderstorms.png',	
        '120302': 'scatteredthunderstorms.png',	
        '121000': 'chance_of_rain.png',	
        '121001': 'scatteredthunderstorms.png',	
        '121002': 'scatteredthunderstorms.png',	
        '121100': 'rainsnow.png',	
        '122000': 'showers.png',	
        '122001': 'scatteredthunderstorms.png',	
        '122002': 'scatteredthunderstorms.png',	
        '122200': 'rainsnow.png',	
        '122201': 'scatteredthunderstorms.png',	
        '122202': 'scatteredthunderstorms.png',	
        '123000': 'rain.png',	
        '123001': 'scatteredthunderstorms.png',	
        '123002': 'scatteredthunderstorms.png',	
        '123300': 'rainsnow.png',	
        '123301': 'scatteredthunderstorms.png',	
        '123302': 'scatteredthunderstorms.png',	
		// Netatmo - Night Icons		
        '200000': 'clear.png',
        '210000': 'partlycloudy_night.png',	
        '210001': 'scatteredthunderstorms_night.png',	
        '210002': 'scatteredthunderstorms_night.png',	
        '210010': 'rainsnow.png',	
        '210011': 'scatteredthunderstorms_night.png',	
        '210012': 'scatteredthunderstorms_night.png',	
        '210020': 'rainsnow.png',	
        '210021': 'scatteredthunderstorms_night.png',	
        '210022': 'scatteredthunderstorms_night.png',	
        '210030': 'rainsnow.png',	
        '210031': 'thunderstorm.png',	
        '210032': 'thunderstorm.png',	
        '210100': 'chance_of_snow_night.png',	
        '210101': 'scatteredthunderstorms_night.png',	
        '210102': 'scatteredthunderstorms_night.png',	
        '210200': 'snow.png',	
        '210201': 'scatteredthunderstorms_night.png',	
        '210202': 'scatteredthunderstorms_night.png',	
        '210300': 'snow.png',	
        '210301': 'scatteredthunderstorms_night.png',	
        '210302': 'scatteredthunderstorms_night.png',	
        '211000': 'chance_of_rain_night.png',	
        '211001': 'scatteredthunderstorms_night.png',	
        '211002': 'scatteredthunderstorms_night.png',	
        '211100': 'rainsnow.png',	
        '212000': 'showers_night.png',	
        '212001': 'scatteredthunderstorms_night.png',	
        '212002': 'scatteredthunderstorms_night.png',	
        '212200': 'rainsnow.png',	
        '212201': 'scatteredthunderstorms_night.png',	
        '212202': 'scatteredthunderstorms_night.png',	
        '213000': 'rain.png',	
        '213001': 'scatteredthunderstorms_night.png',	
        '213002': 'scatteredthunderstorms_night.png',	
        '213300': 'rainsnow.png',	
        '213301': 'scatteredthunderstorms_night.png',	
        '213302': 'scatteredthunderstorms_night.png',	
        '220000': 'mostlycloudy_night.png',	
        '220001': 'scatteredthunderstorms_night.png',	
        '220002': 'scatteredthunderstorms_night.png',	
        '220010': 'rainsnow.png',	
        '220011': 'scatteredthunderstorms_night.png',	
        '220012': 'scatteredthunderstorms_night.png',	
        '220020': 'rainsnow.png',	
        '220021': 'scatteredthunderstorms_night.png',	
        '220022': 'scatteredthunderstorms_night.png',	
        '220030': 'rainsnow.png',	
        '220031': 'thunderstorm.png',	
        '220032': 'thunderstorm.png',	
        '220100': 'chance_of_snow_night.png',	
        '220101': 'scatteredthunderstorms_night.png',	
        '220102': 'scatteredthunderstorms_night.png',	
        '220200': 'snow.png',	
        '220201': 'scatteredthunderstorms_night.png',	
        '220202': 'scatteredthunderstorms_night.png',	
        '220300': 'snow.png',	
        '220301': 'scatteredthunderstorms_night.png',	
        '220302': 'scatteredthunderstorms_night.png',	
        '221000': 'chance_of_rain_night.png',	
        '221001': 'scatteredthunderstorms_night.png',	
        '221002': 'scatteredthunderstorms_night.png',	
        '221100': 'rainsnow.png',	
        '222000': 'showers_night.png',	
        '222001': 'scatteredthunderstorms_night.png',	
        '222002': 'scatteredthunderstorms_night.png',	
        '222200': 'rainsnow.png',	
        '222201': 'scatteredthunderstorms_night.png',	
        '222202': 'scatteredthunderstorms_night.png',	
        '223000': 'rain.png',	
        '223001': 'scatteredthunderstorms_night.png',	
        '223002': 'scatteredthunderstorms_night.png',	
        '223300': 'rainsnow.png',	
        '223301': 'scatteredthunderstorms_night.png',	
        '223302': 'scatteredthunderstorms_night.png',
		// Netatmo - Neutral Icons		
        '300002': 'na.png',		
        '300003': 'fog.png',	
        '300004': 'windy.png',		
        '300005': 'na.png',		
        '300006': 'na.png',		
        '300204': 'na.png',
        '320000': 'cloudy.png',	
        '320001': 'storm.png',	
        '320002': 'storm.png',	
        '320010': 'rainsnow.png',	
        '320011': 'storm.png',	
        '320012': 'storm.png',	
        '320020': 'rainsnow.png',	
        '320021': 'storm.png',	
        '320022': 'storm.png',	
        '320030': 'rainsnow.png',	
        '320031': 'thunderstorm.png',	
        '320032': 'thunderstorm.png',	
        '320100': 'flurries.png',	
        '320101': 'storm.png',	
        '320102': 'storm.png',	
        '320200': 'snow.png',	
        '320201': 'storm.png',	
        '320202': 'storm.png',	
        '320300': 'snow.png',	
        '320301': 'storm.png',	
        '320302': 'storm.png',	
        '321000': 'mist.png',	
        '321001': 'storm.png',	
        '321002': 'storm.png',	
        '321100': 'rainsnow.png',	
        '322000': 'mist.png',	
        '322001': 'storm.png',	
        '322002': 'storm.png',	
        '322200': 'rainsnow.png',	
        '322201': 'storm.png',	
        '322202': 'storm.png',	
        '323000': 'rain.png',	
        '323001': 'storm.png',	
        '323002': 'storm.png',	
        '323300': 'rainsnow.png',	
        '323301': 'storm.png',	
        '323302': 'storm.png',	
        '330000': 'cloudy.png',	
        '330001': 'storm.png',	
        '330002': 'storm.png',	
        '330010': 'rainsnow.png',	
        '330011': 'storm.png',	
        '330012': 'storm.png',	
        '330020': 'rainsnow.png',	
        '330021': 'storm.png',	
        '330022': 'storm.png',	
        '330030': 'rainsnow.png',	
        '330031': 'thunderstorm.png',	
        '330032': 'thunderstorm.png',	
        '330100': 'flurries.png',	
        '330101': 'storm.png',	
        '330102': 'storm.png',	
        '330200': 'snow.png',	
        '330201': 'storm.png',	
        '330202': 'storm.png',	
        '330300': 'snow.png',	
        '330301': 'storm.png',	
        '330302': 'storm.png',	
        '331000': 'mist.png',	
        '331001': 'storm.png',	
        '331002': 'storm.png',	
        '331100': 'rainsnow.png',	
        '332000': 'mist.png',	
        '332001': 'storm.png',	
        '332002': 'storm.png',	
        '332200': 'rainsnow.png',	
        '332201': 'storm.png',	
        '332202': 'storm.png',	
        '333000': 'rain.png',	
        '333001': 'storm.png',	
        '333002': 'storm.png',	
        '333300': 'rainsnow.png',	
        '333301': 'storm.png',	
        '333302': 'storm.png',		
		
    };
	
    var amchartsmap = {
		// Proplanta - Day Icons
        't1': 'day.svg',		
        't2': 'Fair-Day.svg',		
        't3': 'Fair-Day.svg',		
        't4': 'cloudy-day-3.svg',		
        't5': 'cloudy.svg',		
        't6': 'rainy-2.svg',		
        't7': 'rainy-3.svg',		
        't8': 'Scattered-Thunderstorms.svg',		
        't9': 'snowy-2.svg',		
        't10': 'Rain-and-Sleet-Mix.svg',		
        't11': 'snowy-6.svg',		
        't12': 'cloudy-day-1.svg',		
        't13': 'cloudy-day-1.svg',		
        't14': 'rainy-6.svg',	
		// Proplanta - Night Icons
        'n1': 'night.svg',		
        'n2': 'Fair-Night.svg',		
        'n3': 'Fair-Night.svg',		
        'n4': 'cloudy-night-3.svg',		
        'n5': 'cloudy.svg',		
        'n6': 'rainy-4.svg',		
        'n7': 'rainy-5.svg',		
        'n8': 'Scattered-Thunderstorms.svg',		
        'n9': 'snowy-4.svg',		
        'n10': 'Rain-and-Sleet-Mix.svg',		
        'n11': 'snowy-6.svg',		
        'n12': 'cloudy-night-1.svg',		
        'n13': 'cloudy-night-1.svg',		
        'n14': 'rainy-6.svg',	
		'na': 'na.png',		
		// Weather Darksky - Day Icons
        'clear-day': 'day.svg',		
        'cloudy': 'cloudy.svg',		
        'fog': 'cloudy-day-1.svg',		
        'hail': 'Severe-Thunderstorm.svg',		
        'partly-cloudy-day': 'Fair-Day.svg',		
        'rain': 'rainy-6.svg',		
        'sleet': 'Rain-and-Sleet-Mix.svg',		
        'snow': 'snowy-6.svg',		
        'thunderstorm': 'Scattered-Thunderstorms.svg',		
        'wind': 'windy.svg',		
		// Weather Darksky - Night Icons
        'clear-night': 'night.svg',	
        'partly-cloudy-night': 'day.svg',	// not "partlycloudy_night", see DarkSky API FAQ: https://darksky.net/dev/docs/faq	
		// Weather Openweather - Day Icons
        '01d': 'day.svg',		
        '02d': 'Fair-Day.svg',		
        '03d': 'cloudy-day-3.svg',		
        '04d': 'cloudy.svg',		
        '09d': 'rainy-2.svg',		
        '10d': 'rainy-6.svg',		
        '11d': 'Scattered-Thunderstorms.svg',		
        '13d': 'snowy-6.svg',		
        '50d': 'cloudy-day-1.svg',		
		// Weather Openweather - Night Icons
        '01n': 'night.svg',		
        '02n': 'Fair-Night.svg',		
        '03n': 'cloudy-night-3.svg',		
        '04n': 'cloudy.svg',		
        '09n': 'rainy-4.svg',		
        '10n': 'rainy-6.svg',		
        '11n': 'Scattered-Thunderstorms.svg',		
        '13n': 'snowy-6.svg',		
        '50n': 'cloudy-night-1.svg',		
		// DWD Opendata - Day Icons
        '0d': 'day.svg',		
        '1d': 'Fair-Day.svg',		
        '2d': 'cloudy-day-3.svg',		
        '3d': 'cloudy.svg',		
        '4d': 'cloudy-day-1.svg',		
        '18d': 'windy.svg',		
        '45d': 'cloudy-day-1.svg',		
        '48d': 'cloudy-day-1.svg',		
        '49d': 'cloudy-day-1.svg',		
        '51d': 'rainy-4.svg',		
        '53d': 'rainy-5.svg',		
        '55d': 'rainy-5.svg',		
        '56d': 'rainy-7.svg',		
        '57d': 'Rain-and-Sleet-Mix.svg',		
        '60d': 'rainy-2.svg',	
        '61d': 'rainy-4.svg',		
        '62d': 'rainy-2.svg',		
        '63d': 'rainy-5.svg',		
        '65d': 'rainy-6.svg',		
        '66d': 'rainy-7.svg',		
        '67d': 'Rain-and-Sleet-Mix.svg',		
        '68d': 'Rain-and-Snow-Mix.svg',		
        '69d': 'Snow-and-Sleet-Mix.svg',		
        '70d': 'snowy-2.svg',		
        '71d': 'snowy-4.svg',		
        '73d': 'snowy-5.svg',	
        '75d': 'snowy-6.svg',	
        '77d': 'rainy-7.svg',		
        '80d': 'rainy-2.svg',		
        '81d': 'rainy-3.svg',		
        '82d': 'rainy-3.svg',		
        '83d': 'rainy-2.svg',		
        '84d': 'rainy-3.svg',		
        '85d': 'snowy-2.svg',		
        '86d': 'snowy-3.svg',		
        '89d': 'Rain-and-Sleet-Mix.svg',		
        '90d': 'Rain-and-Sleet-Mix.svg',		
        '95d': 'Isolated-Thunderstorms.svg',		
        '96d': 'Scattered-Thunderstorms.svg',		
        '97d': 'Scattered-Thunderstorms.svg',		
        '99d': 'Severe-Thunderstorm.svg',	
		// DWD Opendata - Night Icons
        '0n': 'night.svg',		
        '1n': 'Fair-Night.svg',		
        '2n': 'cloudy-night-3.svg',		
        '3n': 'cloudy.svg',		
        '4n': 'cloudy-night-1.svg',		
        '18n': 'windy.svg',		
        '45n': 'cloudy-night-1.svg',		
        '48n': 'cloudy-night-1.svg',		
        '49n': 'cloudy-night-1.svg',		
        '51n': 'rainy-4.svg',		
        '53n': 'rainy-5.svg',		
        '55n': 'rainy-5.svg',		
        '56n': 'rainy-7.svg',		
        '57n': 'Rain-and-Sleet-Mix.svg',		
        '60n': 'rainy-4.svg',	
        '61n': 'rainy-4.svg',		
        '62n': 'rainy-4.svg',		
        '63n': 'rainy-5.svg',		
        '65n': 'rainy-6.svg',		
        '66n': 'rainy-7.svg',		
        '67n': 'Rain-and-Sleet-Mix.svg',		
        '68n': 'Rain-and-Snow-Mix.svg',		
        '69n': 'Snow-and-Sleet-Mix.svg',		
        '70n': 'snowy-4.svg',		
        '71n': 'snowy-4.svg',		
        '73n': 'snowy-5.svg',	
        '75n': 'snowy-6.svg',	
        '77n': 'rainy-7.svg',		
        '80n': 'rainy-4.svg',		
        '81n': 'rainy-5.svg',		
        '82n': 'rainy-5.svg',		
        '83n': 'rainy-4.svg',		
        '84n': 'rainy-5.svg',		
        '85n': 'snowy-4.svg',		
        '86n': 'snowy-5.svg',		
        '89n': 'Rain-and-Sleet-Mix.svg',		
        '90n': 'Rain-and-Sleet-Mix.svg',		
        '95n': 'Isolated-Thunderstorms.svg',		
        '96n': 'Scattered-Thunderstorms.svg',		
        '97n': 'Scattered-Thunderstorms.svg',		
        '99n': 'Severe-Thunderstorm.svg',	
		// Netatmo - Day Icons
        '100000': 'day.svg',	
        '110000': 'Fair-Day.svg',	
        '110001': 'Isolated-Thunderstorms.svg',	
        '110002': 'Isolated-Thunderstorms.svg',	
        '110010': 'Rain-and-Sleet-Mix.svg',	
        '110011': 'Scattered-Thunderstorms.svg',	
        '110012': 'Scattered-Thunderstorms.svg',	
        '110020': 'Rain-and-Sleet-Mix.svg',	
        '110021': 'Scattered-Thunderstorms.svg',	
        '110022': 'Scattered-Thunderstorms.svg',	
        '110030': 'Rain-and-Sleet-Mix.svg',	
        '110031': 'Severe-Thunderstorm.svg',	
        '110032': 'Severe-Thunderstorm.svg',	
        '110100': 'snowy-2.svg',	
        '110101': 'Isolated-Thunderstorms.svg',	
        '110102': 'Isolated-Thunderstorms.svg',	
        '110200': 'snowy-3.svg',	
        '110201': 'Isolated-Thunderstorms.svg',	
        '110202': 'Isolated-Thunderstorms.svg',	
        '110300': 'snowy-6.svg',	
        '110301': 'Scattered-Thunderstorms.svg',	
        '110302': 'Scattered-Thunderstorms.svg',	
        '111000': 'rainy-2.svg',	
        '111001': 'Isolated-Thunderstorms.svg',	
        '111002': 'Isolated-Thunderstorms.svg',	
        '111100': 'rainy-7.svg',	
        '112000': 'rainy-3.svg',	
        '112001': 'Isolated-Thunderstorms.svg',	
        '112002': 'Isolated-Thunderstorms.svg',	
        '112200': 'Rain-and-Sleet-Mix.svg',	
        '112201': 'Isolated-Thunderstorms.svg',	
        '112202': 'Isolated-Thunderstorms.svg',	
        '113000': 'rainy-6.svg',	
        '113001': 'Scattered-Thunderstorms.svg',	
        '113002': 'Scattered-Thunderstorms.svg',	
        '113300': 'Rain-and-Sleet-Mix.svg',	
        '113301': 'Scattered-Thunderstorms.svg',	
        '113302': 'Scattered-Thunderstorms.svg',	
        '120000': 'cloudy-day-3.svg',	
        '120001': 'Isolated-Thunderstorms.svg',	
        '120002': 'Isolated-Thunderstorms.svg',	
        '120010': 'Rain-and-Sleet-Mix.svg',	
        '120011': 'Scattered-Thunderstorms.svg',	
        '120012': 'Scattered-Thunderstorms.svg',	
        '120020': 'Rain-and-Sleet-Mix.svg',	
        '120021': 'Scattered-Thunderstorms.svg',	
        '120022': 'Scattered-Thunderstorms.svg',	
        '120030': 'Rain-and-Sleet-Mix.svg',	
        '120031': 'Severe-Thunderstorm.svg',	
        '120032': 'Severe-Thunderstorm.svg',	
        '120100': 'snowy-2.svg',	
        '120101': 'Isolated-Thunderstorms.svg',	
        '120102': 'Isolated-Thunderstorms.svg',	
        '120200': 'snowy-3.svg',	
        '120201': 'Isolated-Thunderstorms.svg',	
        '120202': 'Isolated-Thunderstorms.svg',	
        '120300': 'snowy-6.svg',	
        '120301': 'Scattered-Thunderstorms.svg',	
        '120302': 'Scattered-Thunderstorms.svg',	
        '121000': 'rainy-2.svg',	
        '121001': 'Isolated-Thunderstorms.svg',	
        '121002': 'Isolated-Thunderstorms.svg',	
        '121100': 'rainy-7.svg',	
        '122000': 'rainy-3.svg',	
        '122001': 'Isolated-Thunderstorms.svg',	
        '122002': 'Isolated-Thunderstorms.svg',	
        '122200': 'Rain-and-Sleet-Mix.svg',	
        '122201': 'Isolated-Thunderstorms.svg',	
        '122202': 'Isolated-Thunderstorms.svg',	
        '123000': 'rainy-6.svg',	
        '123001': 'Scattered-Thunderstorms.svg',	
        '123002': 'Scattered-Thunderstorms.svg',	
        '123300': 'Rain-and-Sleet-Mix.svg',	
        '123301': 'Scattered-Thunderstorms.svg',	
        '123302': 'Scattered-Thunderstorms.svg',	
		// Netatmo - Night Icons		
        '200000': 'night.svg',
        '210000': 'Fair-Night.svg',	
        '210001': 'Isolated-Thunderstorms.svg',	
        '210002': 'Isolated-Thunderstorms.svg',	
        '210010': 'Rain-and-Sleet-Mix.svg',	
        '210011': 'Scattered-Thunderstorms.svg',	
        '210012': 'Scattered-Thunderstorms.svg',	
        '210020': 'Rain-and-Sleet-Mix.svg',	
        '210021': 'Scattered-Thunderstorms.svg',	
        '210022': 'Scattered-Thunderstorms.svg',	
        '210030': 'Rain-and-Sleet-Mix.svg',	
        '210031': 'Severe-Thunderstorm.svg',	
        '210032': 'Severe-Thunderstorm.svg',	
        '210100': 'snowy-4.svg',	
        '210101': 'Isolated-Thunderstorms.svg',	
        '210102': 'Isolated-Thunderstorms.svg',	
        '210200': 'snowy-5.svg',	
        '210201': 'Isolated-Thunderstorms.svg',	
        '210202': 'Isolated-Thunderstorms.svg',	
        '210300': 'snowy-6.svg',	
        '210301': 'Scattered-Thunderstorms.svg',	
        '210302': 'Scattered-Thunderstorms.svg',	
        '211000': 'rainy-4.svg',	
        '211001': 'Isolated-Thunderstorms.svg',	
        '211002': 'Isolated-Thunderstorms.svg',	
        '211100': 'rainy-7.svg',	
        '212000': 'rainy-5.svg',	
        '212001': 'Isolated-Thunderstorms.svg',	
        '212002': 'Isolated-Thunderstorms.svg',	
        '212200': 'Rain-and-Sleet-Mix.svg',	
        '212201': 'Isolated-Thunderstorms.svg',	
        '212202': 'Isolated-Thunderstorms.svg',	
        '213000': 'rainy-6.svg',	
        '213001': 'Scattered-Thunderstorms.svg',	
        '213002': 'Scattered-Thunderstorms.svg',	
        '213300': 'Rain-and-Sleet-Mix.svg',	
        '213301': 'Scattered-Thunderstorms.svg',	
        '213302': 'Scattered-Thunderstorms.svg',	
        '220000': 'cloudy-night-3.svg',	
        '220001': 'Isolated-Thunderstorms.svg',	
        '220002': 'Isolated-Thunderstorms.svg',	
        '220010': 'Rain-and-Sleet-Mix.svg',	
        '220011': 'Scattered-Thunderstorms.svg',	
        '220012': 'Scattered-Thunderstorms.svg',	
        '220020': 'Rain-and-Sleet-Mix.svg',	
        '220021': 'Scattered-Thunderstorms.svg',	
        '220022': 'Scattered-Thunderstorms.svg',	
        '220030': 'Rain-and-Sleet-Mix.svg',	
        '220031': 'Severe-Thunderstorm.svg',	
        '220032': 'Severe-Thunderstorm.svg',	
        '220100': 'snowy-4.svg',	
        '220101': 'Isolated-Thunderstorms.svg',	
        '220102': 'Isolated-Thunderstorms.svg',	
        '220200': 'snowy-5.svg',	
        '220201': 'Isolated-Thunderstorms.svg',	
        '220202': 'Isolated-Thunderstorms.svg',	
        '220300': 'snowy-6.svg',	
        '220301': 'Scattered-Thunderstorms.svg',	
        '220302': 'Scattered-Thunderstorms.svg',	
        '221000': 'rainy-4.svg',	
        '221001': 'Isolated-Thunderstorms.svg',	
        '221002': 'Isolated-Thunderstorms.svg',	
        '221100': 'rainy-7.svg',	
        '222000': 'rainy-5.svg',	
        '222001': 'Isolated-Thunderstorms.svg',	
        '222002': 'Isolated-Thunderstorms.svg',	
        '222200': 'Rain-and-Sleet-Mix.svg',	
        '222201': 'Isolated-Thunderstorms.svg',	
        '222202': 'Isolated-Thunderstorms.svg',	
        '223000': 'rainy-6.svg',	
        '223001': 'Scattered-Thunderstorms.svg',	
        '223002': 'Scattered-Thunderstorms.svg',	
        '223300': 'Rain-and-Sleet-Mix.svg',	
        '223301': 'Scattered-Thunderstorms.svg',	
        '223302': 'Scattered-Thunderstorms.svg',
		// Netatmo - Neutral Icons		
        '300002': 'Hurricane.svg',		
        '300003': 'cloudy.svg',	
        '300004': 'windy.svg',		
        '300005': 'Hurricane.svg',		
        '300006': 'Hurricane.svg',		
        '300204': 'Hurricane.svg',
        '320000': 'cloudy.svg',	
        '320001': 'Isolated-Thunderstorms.svg',	
        '320002': 'Isolated-Thunderstorms.svg',	
        '320010': 'Rain-and-Sleet-Mix.svg',	
        '320011': 'Scattered-Thunderstorms.svg',	
        '320012': 'Scattered-Thunderstorms.svg',	
        '320020': 'Rain-and-Sleet-Mix.svg',	
        '320021': 'Scattered-Thunderstorms.svg',	
        '320022': 'Scattered-Thunderstorms.svg',	
        '320030': 'Rain-and-Sleet-Mix.svg',	
        '320031': 'Severe-Thunderstorm.svg',	
        '320032': 'Severe-Thunderstorm.svg',	
        '320100': 'snowy-4.svg',	
        '320101': 'Isolated-Thunderstorms.svg',	
        '320102': 'Isolated-Thunderstorms.svg',	
        '320200': 'snowy-5.svg',	
        '320201': 'Isolated-Thunderstorms.svg',	
        '320202': 'Isolated-Thunderstorms.svg',	
        '320300': 'snowy-6.svg',	
        '320301': 'Scattered-Thunderstorms.svg',	
        '320302': 'Scattered-Thunderstorms.svg',	
        '321000': 'rainy-4.svg',	
        '321001': 'Isolated-Thunderstorms.svg',	
        '321002': 'Isolated-Thunderstorms.svg',	
        '321100': 'rainy-7.svg',	
        '322000': 'rainy-5.svg',	
        '322001': 'Isolated-Thunderstorms.svg',	
        '322002': 'Isolated-Thunderstorms.svg',	
        '322200': 'Rain-and-Sleet-Mix.svg',	
        '322201': 'Isolated-Thunderstorms.svg',	
        '322202': 'Isolated-Thunderstorms.svg',	
        '323000': 'rainy-6.svg',	
        '323001': 'Scattered-Thunderstorms.svg',	
        '323002': 'Scattered-Thunderstorms.svg',	
        '323300': 'Rain-and-Sleet-Mix.svg',	
        '323301': 'Scattered-Thunderstorms.svg',	
        '323302': 'Scattered-Thunderstorms.svg',	
        '330000': 'cloudy.svg',	
        '330001': 'Isolated-Thunderstorms.svg',	
        '330002': 'Isolated-Thunderstorms.svg',	
        '330010': 'Rain-and-Sleet-Mix.svg',	
        '330011': 'Scattered-Thunderstorms.svg',	
        '330012': 'Scattered-Thunderstorms.svg',	
        '330020': 'Rain-and-Sleet-Mix.svg',	
        '330021': 'Scattered-Thunderstorms.svg',	
        '330022': 'Scattered-Thunderstorms.svg',	
        '330030': 'Rain-and-Sleet-Mix.svg',	
        '330031': 'Severe-Thunderstorm.svg',	
        '330032': 'Severe-Thunderstorm.svg',	
        '330100': 'snowy-4.svg',	
        '330101': 'Isolated-Thunderstorms.svg',	
        '330102': 'Isolated-Thunderstorms.svg',	
        '330200': 'snowy-5.svg',	
        '330201': 'Isolated-Thunderstorms.svg',	
        '330202': 'Isolated-Thunderstorms.svg',	
        '330300': 'snowy-6.svg',	
        '330301': 'Scattered-Thunderstorms.svg',	
        '330302': 'Scattered-Thunderstorms.svg',	
        '331000': 'rainy-4.svg',	
        '331001': 'Isolated-Thunderstorms.svg',	
        '331002': 'Isolated-Thunderstorms.svg',	
        '331100': 'rainy-7.svg',	
        '332000': 'rainy-5.svg',	
        '332001': 'Isolated-Thunderstorms.svg',	
        '332002': 'Isolated-Thunderstorms.svg',	
        '332200': 'Rain-and-Sleet-Mix.svg',	
        '332201': 'Isolated-Thunderstorms.svg',	
        '332202': 'Isolated-Thunderstorms.svg',	
        '333000': 'rainy-6.svg',	
        '333001': 'Scattered-Thunderstorms.svg',	
        '333002': 'Scattered-Thunderstorms.svg',	
        '333300': 'Rain-and-Sleet-Mix.svg',	
        '333301': 'Scattered-Thunderstorms.svg',	
        '333302': 'Scattered-Thunderstorms.svg',		

    };
    var translationmap = {

    };

    function showOverlay(elem, value) {
        elem.find('#warn').remove();
        if (ftui.isValid(value) && value !== "") {
            var val = ($.isNumeric(value)) ? Number(value).toFixed(0) : '!';
            var digits = val.toString().length;
            var faElem = elem.find('.famultibutton');
            var warnElem = $('<i/>', {
                id: 'warn',
                class: 'digits' + digits
            }).html(val).appendTo(elem);

            if (elem.isValidData('warn-color')) {
                warnElem.css({
                    color: elem.data('warn-color')
                });
            }
            if (elem.isValidData('warn-background-color')) {
                warnElem.css({
                    backgroundColor: elem.data('warn-background-color')
                });
            }
            if (elem.hasClass('warnsamecolor')) {
                warnElem.css({
                    color: '#000',
                    backgroundColor: elem.data('on-color')
                });
            }
        }
    }

    function init_ui(elem) {
        var icon = $('<div class="weather-icon"></div>');
        elem.append(icon);

        var color = elem.data('color');
        if (color && !elem.isDeviceReading('color')) {
            icon.css("color", ftui.getStyle('.' + color, 'color') || color);
        }

    }

    function init_attr(elem) {

        elem.initData('get', 'STATE');
        elem.addClass('weather');

        me.addReading(elem, 'get');

        //time (for DWD Opendata) -- needs "SunUp" enabled in "forecastProperties" Attribute in DWD Module
		elem.initData('time', elem.data('get').replace("ww","SunUp"));
		me.addReading(elem, 'time');

        //color
        elem.initData('color', '#dcdcdc');
        if (elem.isDeviceReading('color')) {
            me.addReading(elem, 'color');
        }

        // warn parameter
        elem.initData('warn-on', 'true|on|[1-9]{1}[0-9]*');
        elem.initData('warn-off', 'false|off|0');
        me.addReading(elem, 'warn');

        // if hide reading is defined, set defaults for comparison
        if (elem.isValidData('hide')) {
            elem.initData('hide-on', '(true|1|on)');
        }
        elem.initData('hide', elem.data('get'));
        if (elem.isValidData('hide-on')) {
            elem.initData('hide-off', '!on');
        }
        me.addReading(elem, 'hide');

        var fhem_path = ftui.config.fhemDir;
        fhem_path = fhem_path.replace(/\/$/, '');
        var image_path = $("meta[name='weather_image_path']").attr("content") || fhem_path + '/images/default/weather/';
        elem.initData('image-path', image_path);
        if (!elem.data('image-path').match(/\/$/)) {
            elem.data('image-path', elem.data('image-path') + '/');
        }
    }

    function update(dev, par) {

        // update from normal state reading
        me.elements.each(function (index) {
            var elem = $(this);

            // update from normal state reading
            if (elem.matchDeviceReading('get', dev, par)) {
                var state = elem.getReading('get').val;
                if (state) {
                    var part = elem.data('part') || -1;
                    var val = ftui.getPart(state, part);
                    var _val = val;

                    //wheater icons
                    var icon = elem.find('.weather-icon');
                    icon.empty();
                    icon.removeClass();
                    icon.addClass('weather-icon');

                    var device_type;
                    if (elem.data('device-type')) {
                        device_type = elem.data('device-type');
                    } else {
                        if (par.match(/^fc\d+_weather(Day|Evening|Morning|Night|\d\d)(?:Icon)?$/)) {
                            device_type = 'PROPLANTA';
                        } else if (par.match(/^weatherIcon$/)) {
                            device_type = 'PROPLANTA';
                        } else if (par.match(/^fc\d+_iconAPI$/)) {
                            device_type = 'Weather';
                        } else if (par.match(/^hfc\d+_iconAPI$/)) {
                            device_type = 'Weather';
                        } else if (par.match(/^fc\d+_symbol$/)) {
                            device_type = 'Netatmo';
                        } else if (par.match(/^symbol$/)) {
                            device_type = 'Netatmo';
                        } else if (par.match(/^fc\d+_\d+_ww$/)) {
                            device_type = 'DWD_OpenData';
                        } else {
                            device_type = 'UNKNOWN';
                        }
                    }
                    var translate = true;
                    if (device_type === 'PROPLANTA') {
                        var matches = val.match('^https://www\.proplanta\.de/wetterdaten/images/symbole/([tn][0-9]+)\.gif');
                        if (matches) {
                            val = matches[1];
                        } else {
                            translate = false;
                        }
                    }
                    if (device_type === 'DWD_OpenData') {
						var time = elem.getReading('time').val;
						if (time === "0") {
							val = val + "n";
						} else if (time != 0) {
							val = val + "d";
						}
						} else {
                            translate = false;  
                    }

					
					
                    var translation;
                    if (translate) {
                        // translate val to ':key'
                        translation = translationmap[val];
                        while (typeof mapped != "undefined" && !mapped.match(/^:/)) {
                            translation = translationmap[mapped];
                        }
                    }

                    var mapped = typeof translation == "undefined" ? val : translation;
                    if (elem.data('imageset') === "kleinklima") {
                        mapped = kleinklimamap[mapped.replace(/^:/, '')];
                        icon.prepend('<img style="width:100%" src="' + elem.data('image-path') + mapped + '" title="' + val + '">');
                    } else if (elem.data('imageset') === "amcharts") {
                        mapped = amchartsmap[mapped.replace(/^:/, '')];
                        icon.prepend('<img width="100%" src="' + elem.data('image-path') + mapped + '" title="' + val + '">');
                    } else if (elem.data('imageset') === "reading") {
                        icon.prepend('<img style="width:100%" src="' + _val + '">');
                    } else if (elem.data('imageset') === "weathericons") {
                        switch (elem.data('device-type')) {
                            case "WindDirection":
                                icon.addClass('wi wi-wind from-' + val + '-deg');
                                break;
                             default:
						mapped = weathericonsmap[val];                        
						icon.attr('data-icon', mapped);
                        icon.addClass(mapped);
                        }
                    } else {
                        mapped = meteoconsmap[mapped.replace(/^:/, '')];
                        icon.attr('data-icon', mapped);
                        icon.addClass('meteocons');
                    }
                }

            }

            //extra reading for dynamic color
            if (elem.matchDeviceReading('color', dev, par)) {
                var cval = elem.getReading('color').val;
                var cicon = elem.find('.weather-icon');
                if (ftui.isValid(cval) && cicon) {
                    cval = '#' + cval.replace('#', '');
                    cicon.css("color", cval);
                }
            }

            //extra reading for warn
            if (elem.matchDeviceReading('warn', dev, par)) {
                var warn = elem.getReading('warn').val;
                if (elem.matchingState('warn', warn) === 'on') {
                    showOverlay(elem, ftui.getPart(warn, elem.data('get-warn')));
                }
                if (elem.matchingState('warn', warn) === 'off') {
                    showOverlay(elem, "");
                }
            }

            me.updateHide(elem, dev, par);

        });

    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_widget(), {
        //override members
        widgetname: 'weather',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};
