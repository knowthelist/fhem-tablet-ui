fhem-tablet-ui
========

Just another dashboard for FHEM  http://fhem.de/fhem.html

![](http://knowthelist.github.io/fhem-tablet-ui/fhem-tablet-ui-example.png)

Requires
-------
* jQuery v1.7+
* font-awesome http://fortawesome.github.io/Font-Awesome
* jquery.gridster  http://gridster.net
* jquery.toast

Install
-------
 * create a new folder named 'tablet' in /\<fhem-path\>/www
 * copy all files incl. sub folders into /\<fhem-path\>/www/tablet
 * add 'define tablet_ui HTTPSRV tablet ./www/tablet Tablet Frontend' in fhem.cfg
 * Tadaaa! A new fhem ui in http://\<fhem-url\>:8083/fhem/tablet

Configure
-------
Just configure the **index.html** to change the dashboard for your needs.

Change the wiget container according your rooms
```html
<li data-row="2" data-col="2" data-sizex="2" data-sizey="2">
	<header>KUECHE</header>
	<div class="container">
	  <div class="left">
		<div type="thermostat" device='KuecheHeizung_Clima' class="cell"></div>
		<div type="thermostat" device='KuecheHeizung2_Clima' class="cell"></div>
	  </div>
	  <div class="right">
		<div type="switch" device="HerdLicht_Sw" class="cell"></div>
		<div type="label" class="cell">HerdLicht</div>
		<div type="contact" device="KuechenFenster" class="cell"></div>
	  </div>
	</div>
</li>
```
Change the widgets you have and want to see on the dashboard
```html
<div type="thermostat" device='WohnzimmerHeizung_Clima' class="cell"></div>
```

All widgets have individual parameter settings. Set following attributes according your needs.

####All widgets
- **type**      : widget type
- **device**    : FHEM device name (call FHEM's 'list' command to get names)
- **class**     : css classes for look and formatting of the widget
- **data-get**  : name of the reading to get from FHEM (default 'STATE')
- **data-set**  : command to send to FHEM (set \<device\> \<command\> \<value\>)

####Switch widgets
- **data-get-on**   : value for ON status to get. (default 'on')
- **data-get-off**  : value for OFF status to get. (default 'off')
- **data-set-on**   : value for ON status to set. (default: value of data-get-on)
- **data-set-off**  : value for OFF status to set. (default: value of data-get-off)
- **data-icon**     : name of the font-awesome icon.

####Contact widgets
- **data-get-on**   : value for ON status to get. (default 'on')
- **data-get-off**  : value for OFF status to get. (default 'off')
- **data-icon**     : name of the font-awesome icon.

####Label widgets
- **data-fix**  : keeping a specified number of decimals. (default '1')
- **data-icon** : name of the font-awesome icon. 						 
- **data-part** : split position of the space separated value to show.

####Push widgets
- **data-icon** : name of the font-awesome icon. 

Thermostat widgets
=============
- **data-temp** : reading for measured temperature of thermostates
- **data-valve**: reading for valve position of thermostates


Select one of over 500 icons from http://fortawesome.github.io/Font-Awesome/icons. Just enter the icon name (with suffix "fa-"), all icons are available. e.g. data-icon="fa-volume-up"

To disable longpoll, set an other value then 1
```html
<meta name="longpoll" content="1">
```

Widgets
-------
Currently there are 7 types of widgets.
- **thermostat** : dial for heater thermostates to set desired value and show current value
- **switch** : on / off
- **label** : show state as text
- **contact** : show state as icon (e.g. window open) 
- **push** : e.g. up / down
- **volume** : dial to set a single value (e.g. 0-60)
- **homestatus** : selector for 4 states (1=home,2=night,3=away,4=holiday) 

By default the ui gets/sets the fhem parameter 'STATE' (not 'state').

######Thermostat 
Configure as device='...' that item which delivers temp and desired-temp as reading.

Default parameters are:
```
data-get="desired-temp" data-temp="measured-temp" data-set="desired-temp"
```
Therefor for HomaMatic HM-CC-RT-DN this is sufficient.
```html
<div type="thermostat" device='KH_Clima' class="cell"></div>
```
The long format looks like this:
```html
<div type="thermostat" device="KH_Clima" data-get="desired-temp" data-temp="measured-temp" class="cell"></div>
```
The wigets will show the valve value only in case of a valid data-valve attribute.
The default for data-valve ist null. That means, a empty data-valve attribute hides the valve label for the widget.

######Label
Example for HM-WDS40-TH-I Funk-Temperatur-/Feuchtesensor innen 
```
STATE	T: 20.0 H: 61
```
```html
<div type="label" device="THSensorWZ" data-part="2" data-unit="%B0C%0A" class="cell big"></div>
<div type="label" class="cell">Temperatur</div>
<div type="label" device="THSensorWZ" data-part="4" data-unit="%" class="cell big"></div>
<div type="label" class="cell">Luftfeuchte</div>
```
But the same result can reached by getting single readings:
```
humidity	58
temperature	20.1
```
```html
<div type="label" device="THSensorWZ" data-get="temperature" data-unit="%B0C%0A" class="cell big"></div>
<div type="label" class="cell">Temperatur</div>
<div type="label" device="THSensorWZ" data-get="humidity" data-unit="%" class="cell big"></div>
<div type="label" class="cell">Luftfeuchte</div>
```

Example for how to create a widget for shutter via push: show state and set up/down
```html
<div type="switch" device="wzRollo" data-on="up" data-off="down" data-icon="fa-bars" class="cell" ></div>
<div type="label" class="cell">Rollo</div>
```


License
-------
This project is licensed under [MIT](http://www.opensource.org/licenses/mit-license.php).
