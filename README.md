fhem-tablet-ui
========

Just another dashboard for FHEM  http://fhem.de/fhem.html  
But with a clear intention: Keep it short and simple!


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

A lot more plugins are available on addiational sources [Widgets-for-fhem-tablet-ui](https://github.com/nesges/Widgets-for-fhem-tablet-ui)
* copy additional widgets **widget_xxx.js** to js folder

Configure
-------
Just configure the **index.html** to change the dashboard for your needs.

Change the wiget container according your rooms
```html
<li data-row="2" data-col="2" data-sizex="2" data-sizey="2">
	<header>KUECHE</header>
	<div class="container">
	  <div class="left">
		<div data-type="thermostat" data-device='KuecheHeizung_Clima' class="cell"></div>
		<div data-type="thermostat" data-device='KuecheHeizung2_Clima' class="cell"></div>
	  </div>
	  <div class="right">
		<div data-type="switch" data-device="HerdLicht_Sw" class="cell"></div>
		<div data-type="label" class="cell">HerdLicht</div>
		<div data-type="symbol" data-device="KuechenFenster" class="cell"></div>
	  </div>
	</div>
</li>
```
Change the widgets you have and want to see on the dashboard
```html
<div data-type="thermostat" data-device='WohnzimmerHeizung_Clima' class="cell"></div>
```

All widgets have individual parameter settings. Set following attributes according your needs.

####All widgets
- **data-type**      : widget type
- **data-device**    : FHEM device name (call FHEM's 'list' command to get names)
- **class**		     : css classes for look and formatting of the widget

####Switch widgets
- **data-get**      : name of the reading to get from FHEM (default 'STATE')
- **data-get-on**   : value for ON status to get. (default 'on')
- **data-get-off**  : value for OFF status to get. (default 'off')
- **data-set-on**   : value for ON status to set. (default: value of data-get-on)
- **data-set-off**  : value for OFF status to set. (default: value of data-get-off)
- **data-cmd**      : name of the command (\<command\> \<device\> \<value\>) (e.g. setstate, set, setreading, trigger) default: 'set'
- **data-icon**     : name of the font-awesome icon. (default: fa-lightbulb-o)
- **data-on-color** : color of ON state (default '#aa6900')
- **data-off-color**: color of Off state (default '#505050')

####Symbol widgets
- **data-get**      : name of the reading to get from FHEM (default 'STATE')
- **data-get-on**   : value for ON status to get or an array of states (default 'open')
- **data-get-off**  : value for OFF status to get. (default 'closed')
- **data-icon**     : name of the font-awesome icon.
- **data-on-color** : color of ON state (default '#aa6900')
- **data-off-color**: color of Off state (default '#505050')
- **data-icons**    : array of icons related to the data-get-on array
- **data-on-colors**: array of colors related to the data-get-on array

####Label widgets
- **data-get**  : name of the reading to get from FHEM
- **data-fix**  : keeping a specified number of decimals. (default '-1' -> non-numeric)
- **data-icon** : name of the font-awesome icon. 						 
- **data-part** : split position of the space separated value to show or an RegEx
- **data-colors** : a array of color values to affect the colour of the label according to the limit value 
- **data-limits** : a array of numeric values to affect the colour of the label
- **data-unit** : add a unit after a numeric value. use encoded strings e.g. "%B0C%0A"

####Push widgets
- **data-set**  : value to send to FHEM (\<commnd\> \<device\> \<value\>)
- **data-icon** : name of the font-awesome icon. 
- **data-cmd**  : name of the command (\<command\> \<device\> \<value\>) (e.g. setstate, set, setreading, trigger) default: 'set'

####Thermostat widgets
- **data-get**   : name of the reading to get from FHEM (default 'desired-temp')
- **data-temp**  : reading for measured temperature of thermostates (default 'measured-temp')
- **data-set**   : command to send to FHEM (set \<device\> \<command\> \<value\>) (default 'desired-temp')
- **data-valve** : reading for valve position of thermostates
- **data-min**   : minimal value to set (default 10)
- **data-max**   : maximal value to set (default 30)
- **data-step**  : step size for value adjustment e.g. 0.5 (default 1)

####Volume widgets
- **data-get**  : name of the reading to get from FHEM (default 'STATE')
- **data-set**  : command to send to FHEM (set \<device\> \<command\> \<value\>) (default '')
- **data-cmd**  : name of the command (\<command\> \<device\> \<value\>) (e.g. setstate, set, setreading, trigger) default: 'set'
- **data-min**  : minimal value to set (default 0)
- **data-max**  : maximal value to set (default 70)

####Homestatus widget
- **data-get**  : name of the reading to get from FHEM (default 'STATE')
- **data-set**  : command to send to FHEM (set \<device\> \<command\> \<value\>) (default '')
4 states are valid: 1,2,3 or 4 (1=home,2=night,3=away,4=holiday) 

####Slider widgets (currently vertical only)
- **data-get**  : name of the reading to get from FHEM (default 'STATE')
- **data-set**  : command to send to FHEM (set \<device\> \<command\> \<value\>) (default '')
- **data-cmd**  : name of the command (\<command\> \<device\> \<value\>) (e.g. setstate, set, setreading, trigger) default: 'set'
- **data-min**  : minimal value to set (default 0)
- **data-max**  : maximal value to set (default 100)

####Dimmer widgets
- **data-get**      : name of the reading to get from FHEM (default 'STATE')
- **data-get-on**   : value for ON status to get. (default 'on')
- **data-get-off**  : value for OFF status to get. (default 'off')
- **data-set-off**  : value for OFF status to set. (default: value of data-get-off)
- **data-cmd**      : name of the command (\<command\> \<device\> \<value\>) (e.g. setstate, set, setreading, trigger) default: 'set'
- **data-set**      : command to send to FHEM (set \<device\> \<command\> \<value\>) (default '')
- **data-icon**     : name of the font-awesome icon. (default: fa-lightbulb-o)

####Image widgets
- **data-get**      : name of the reading to get an URL from FHEM (default 'STATE')
- **data-size**     : width of the image in px or %, the height scales proportionally. (default: 50%)
- **data-url**      : URL of the image to show (use data-url or data-device + data-get, not both)

data-get-on and data-get-off accept RegEx values. e.g. data-get-on="[0-9]{1,3}|on" means set switch on if STATE is a numeric value or 'on'.

Select one of over 500 icons from http://fortawesome.github.io/Font-Awesome/icons. Just enter the icon name (with suffix "fa-"), all icons are available. e.g. data-icon="fa-volume-up"

Meta tags configuration
-------

To disable longpoll, set an other value then 1
```html
<meta name="longpoll" content="1">
```
To disable drag&drop for gridster set this value to 1
```html
<meta name='gridster_disable' content='1'>
```


Widgets
-------
Currently there are 10 types of widgets.
- **thermostat** : dial for heater thermostates to set desired value and show current value
- **switch** : on / off
- **label** : show state as text
- **symbol** : show state as an icon (e.g. window open) 
- **push** : e.g. up / down
- **volume** : dial to set a single value (e.g. 0-60)
- **homestatus** : selector for 4 states (1=home,2=night,3=away,4=holiday) 
- **dimmer** : toogle button with a setter for on value
- **slider** : vertical slider to select between min/max value
- **image** : insert an image, the URL is given by a reading

By default the ui gets/sets the fhem parameter 'STATE' (not 'state').

####Thermostat 
Configure as data-device='...' that item which delivers temp and desired-temp as reading.

Default parameters are:
```
data-get="desired-temp" data-temp="measured-temp" data-set="desired-temp"
```
Therefor for HomaMatic HM-CC-RT-DN this is sufficient.
```html
<div data-type="thermostat" data-device='KH_Clima' class="cell"></div>
```
The long format looks like this:
```html
<div data-type="thermostat" 
     data-device="KH_Clima" 
     data-get="desired-temp" 
     data-temp="measured-temp" 
     class="cell">
</div>
```
The wigets will show the valve value only in case of a valid data-valve attribute.
The default for data-valve ist null. That means, a empty data-valve attribute hides the valve label for the widget.   
![](http://knowthelist.github.io/fhem-tablet-ui/thermo.png)

####Label
**Example** for HM-WDS40-TH-I Funk-Temperatur-/Feuchtesensor innen 
```
STATE	T: 20.0 H: 61
```
```html
<div data-type="label" data-device="THSensorWZ" 
     data-part="2" data-unit="%B0C%0A" class="cell big"></div>
<div data-type="label" class="cell">Temperatur</div>
<div data-type="label" data-device="THSensorWZ" data-part="4" 
     data-unit="%" class="cell big"></div>
<div data-type="label" class="cell">Luftfeuchte</div>
```
But the same result can reached by getting single readings:
```
humidity	58
temperature	20.1
```
```html
<div data-type="label" data-device="THSensorWZ" 
     data-get="temperature" data-unit="%B0C%0A" class="cell big"></div>
<div data-type="label" class="cell">Temperatur</div>
<div data-type="label" data-device="THSensorWZ" 
     data-get="humidity" data-unit="%" class="cell big"></div>
<div data-type="label" class="cell">Luftfeuchte</div>
```

**Example** for how to influence the color of the label according to value limits
```html
<div data-type="label" 
     data-device="OutTemp" 
     data-limits='[-73,10,23]' 
     data-colors='["#6699FF","#AA6900","#FF0000"]' 
     data-unit="%B0C%0A" 
     class="cell big">
</div>
```

**Example** for how to create a widget for shutter via push: show state and set up/down
```html
<div data-type="switch" 
     data-device="wzRollo" 
     data-get-on="up" 
     data-get-off="down" 
     data-icon="fa-bars" 
     class="cell" >
</div>
<div data-type="label" 
     class="cell">Rollo</div>
```

**Example** for how to create a label for a time value in short format with usage of RegEx
```html
<div data-type="label" 
     data-device="dummy1" 
     data-part="(\d\d\.\d\d\.).*" 
     class="cell">
</div>
```

**Example** for how to use a label to show a weather icon according reading literal
```html
<div data-type="label" 
     data-device="dummy1" 
     data-get="fc0_weatherDay" 
     class="cell weather">
</div>
```

Important is to add the CSS class 'weather' to get this behavior.  
![](http://knowthelist.github.io/fhem-tablet-ui/weather.png)

Currently this literals are mapped to a appropriate METEOCONS icon:
heiter":"H","wolkig":"N","Regenschauer":"Q","stark bewoelkt":"Y","Regen":"R","bedeckt":"N","sonnig":"B","Schnee":"U"

The weather literal could be delivered by a FHEM module like PROPLANTA:

Add 'big' or 'bigger' to CSS class to get a bigger weather icon.

####Push
**Example** for how to create a push button widget to trigger all devices on:
```html
<div data-type="push" 
     data-device="LightAll" 
     data-cmd="trigger" 
     data-set="on" 
     class="cell">
</div>
```

####Switch
**Example** for how to create a widget for MILIGHT via toggle button. Usage of RegEx pattern for state request:
```html
<div data-type="switch" class="cell" 
            data-device="MILIGHT_Zone1_Wohnzimmer" 
            data-get-on="on.*"
            data-get-off="off"></div>
```
![](http://knowthelist.github.io/fhem-tablet-ui/button.png)

**Example** for a button group to toggle between 4 different values for one device
```html
<div class="cell left">
 <div data-type="switch" data-device="dummy1" 
      data-get-off="((?!Wert1).)*" 
      data-get-on="Wert1" class="cell" ></div>
 <div data-type="label" class="cell">Wert1</div>
 <div data-type="switch" data-device="dummy1" 
      data-get-off="((?!Wert2).)*" 
      data-get-on="Wert2" class="cell" ></div>
 <div data-type="label" class="cell">Wert2</div>
 <div data-type="switch" data-device="dummy1" 
      data-get-off="((?!Wert3).)*" 
      data-get-on="Wert3" class="cell" ></div>
 <div data-type="label" class="cell">Wert3</div>
 <div data-type="switch" data-device="dummy1" 
      data-get-off="((?!Wert4).)*" 
      data-get-on="Wert4" class="cell" ></div>
 <div data-type="label" class="cell">Wert4</div>
</div>
```
![](http://knowthelist.github.io/fhem-tablet-ui/group.png)

###Slider
**Example** for how to create a widget for a slider to set values from 10 to 90:
```html
<div data-type="slider" 
     data-device='Dummy1' 
     data-min="10" 
     data-max="90" 
     class="cell" >
</div>
<div data-type="label" class="cell">Light1</div>
```
![](http://knowthelist.github.io/fhem-tablet-ui/slider.png)

####Dimmer
**Example** for how to create a widget for a dimmer via toggle button incl. dimmer. Usage of RegEx pattern get all values for state on:
```html
<div data-type="dimmer" data-device="MyDimmer1" 
			data-get-on="[0-9]{1,3}|on" 
			data-get-off="off" 
			class="cell">
</div>
```
To change the dim value: push the button and slide up or down   
![](http://knowthelist.github.io/fhem-tablet-ui/dimmer.png)

####Image
**Example** for how to add an image to the dashboard which its URL is delivered by a FHEM module like PROPLANTA:
```html
<div data-type="image" data-device="Wetter1" 
	 data-get="fc0_weatherDayIcon" 
	 data-size="40px" 
	 class="cell">
</div>
```

Format
-------
The layout and look can be influinced be the class attribute.
The available classes are: container,left,right,cell,narrow,darker,big,bigger,small

Specials
-------
**Example** to call a command directly to FHEM. This calls "set dummy1 off"
```html
<div onclick="setFhemStatus('set dummy1 off')">All off!</div>
```

Circle Menu
-------
Cover a lot of other button behind one single button 

```html
<div class="left">
<div class="cell circlemenu">
	<ul class="menu">
	  <li><div data-type="push" data-icon="fa-wrench"></div></li>
	  <li><div data-type="push" data-device="AvReceiver" 
	  		   data-set="remoteControl subwoofer-temporary-level -6" 
	  		   data-icon="">-6</div></li>
	  <li><div data-type="push" data-device="AvReceiver" 
	  		   data-set="remoteControl subwoofer-temporary-level -2" 
	  		   data-icon="">-2</div></li>
	  <li><div data-type="push" data-device="AvReceiver" 
	  		   data-set="remoteControl subwoofer-temporary-level 0" 
	  		   data-icon="">0</div></li>
	  <li><div data-type="push" data-device="AvReceiver" 
	  		   data-set="remoteControl subwoofer-temporary-level +3" 
	  		   data-icon="">2</div></li>
	  <li><div data-type="push" data-device="AvReceiver" 
	  		   data-set="remoteControl subwoofer-temporary-level +9" 
	  		   data-icon="">9</div></li>
	  <li><div data-type="push" data-device="AvReceiver" 
	  		   data-set="remoteControl subwoofer-temporary-level +C" 
	  		   data-icon="">12</div></li>
	</ul>
</div>
<div data-type="label" class="cell">Woofer</div>
</div>
```

![](http://knowthelist.github.io/fhem-tablet-ui/circle_menu_open.png)

License
-------
This project is licensed under [MIT](http://www.opensource.org/licenses/mit-license.php).
  
