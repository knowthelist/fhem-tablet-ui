fhem-tablet-ui
========

Just another dashboard for FHEM  http://fhem.de/fhem.html  
But with a clear intention: Keep it short and simple!


![](http://knowthelist.github.io/fhem-tablet-ui/fhem-tablet-ui-example_new.png)

Requires
-------
* jQuery v1.7+
* font-awesome http://fortawesome.github.io/Font-Awesome
* jquery.gridster  http://gridster.net
* jquery.toast

Install
-------
 * copy the whole tree into the corresponding folder of your FHEM server /\<fhem-path\>/www/tablet
 * add 'define TABLETUI HTTPSRV ftui/ ./www/tablet/ Tablet-UI' in fhem.cfg
 * rename the index-example.html to index.html or create your own index.html
 * Tadaaa! A new fhem ui in http://\<fhem-url\>:8083/fhem/ftui/
 
 Depending on the HTTPSRV version, only this cfg works:
 'define TABLETUI HTTPSRV ftui ./www/tablet/ Tablet-UI'
 
 or just use 'update all https://raw.githubusercontent.com/knowthelist/fhem-tablet-ui/master/controls_fhemtabletui.txt'
 on the FHEM commandline (or input field of FHEMWEB)

A lot more plugins are available on addiational sources [Widgets-for-fhem-tablet-ui](https://github.com/nesges/Widgets-for-fhem-tablet-ui)
* copy additional widgets **widget_xxx.js** into js folder

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
Widgets
-------
Currently there are more then 20 types of widgets in the base installation.
- **thermostat** : dial for heater thermostates to set desired value and show current value
- **switch** : Toggle any command to FHEM (e.g. on / off)
- **label** : show state as text (colourable)
- **symbol** : show state as an icon (e.g. window open) 
- **push** : send any command to FHEM e.g. up / down
- **volume** : dial to set a single value (e.g. 0-60)
- **homestatus** : selector for 4 states (1=home,2=night,3=away,4=holiday) 
- **dimmer** : toogle button with a setter for on value
- **slider** : vertical/horizontal slider to select between min/max value
- **image** : insert an image, the URL is given by a reading
- **weather** : insert an icon or image, represending a weather literal
- **circlemenu** : Cover multiple widgets behind a single widget
- **select**	: Combobox to provide a list for selection
- **pagetab**	 : Element to smoothly exchange the whole page with another page
- **pagebutton** : Simple element to jump to another page
- **level** : vertical/horizontal bar to show values between min/max value
- **rotor** : slider between multiple widgets at one position
- **progress** : round symbolic display  for percent values
- **simplechart** : simple XY line chart for one value (reads directly from fhem log file)
- **popup** : a popup dialog which open on click on another widget 
- **readingsgroup** : displaying a readingsgroup defined in fhem
- **datetimepicker** : select a date and time value from calendar
- **eventmonitor**: for debugging - shows all events which normal widgets 'see'
- **chart** : multistyle chart for multiple values (reads directly from FHEM log file)
- **highchart** : multistyle chart for multiple values
- **checkbox** : Toggle any command to FHEM (e.g. on / off)
- **range** : vertical bar graph to show a values range between min/max value and high/low limits with different colors

More plugins are available [here](https://github.com/nesges/Widgets-for-fhem-tablet-ui)

By default the ui gets/sets the fhem parameter 'STATE' (not 'state').

All widgets have individual parameter settings. Set following attributes according your needs.
Attributes with defaults are optional and does not have to be set.

General attribute meaning
----
- A general command to FHEM looks like this
**\<command\> \<device\> \<reading\> \<value\>**

- e.g. 
**set MyLamp dim 75**

- widget attributes
**data-cmd data-device data-set data-set-on**

**receive data**
- data-get		: 		Reading name
- data-get-on   : 		Value for ON
- data-get-off  : 		Value for OFF

**send data**
- data-set		: 		Reading name
- data-set-on   : 		Value for ON
- data-set-off  : 		Value for OFF

####All widgets
- **data-type**      : widget type
- **data-device**    : FHEM device name (call FHEM's 'list' command to get all names)
- **class**          : CSS classes for look and formatting of the widget

####Switch widgets
- **data-get**      : name of the reading to get from FHEM (default 'STATE')
- **data-set**      : name of the reading to set from FHEM (default '')
- **data-set-on**   : value for ON status to set. (default: value of data-get-on)
- **data-set-off**  : value for OFF status to set. (default: value of data-get-off)
- **data-cmd**      : name of the command (**\<command\>** \<device\> \<reading\> \<value\>) (e.g. setstate, set, setreading, trigger) default: 'set'
- **data-doubleclick**: timeout to wait for x millisecondes click or touch. '0' disables the doubleclick feature. (default '0')

dual state notation   
- **data-get-on**   : value for ON status to get or an array of states (default 'on')
- **data-get-off**  : value for OFF status to get. (default 'off')
- **data-icon**     			: name of the font-awesome icon. (default: fa-lightbulb-o)
- **data-background-icon** 		: name of the font-awesome icon for background (default 'fa-circle')
- **data-on-background-color**          : color for ON state or DEVICE:READING for dynamic setting (default '#aa6900')
- **data-off-background-color**         : color for OFF state or DEVICE:READING for dynamic setting (default '#505050')
- **data-on-color** 			: color for ON state or DEVICE:READING for dynamic setting (default '#aa6900')
- **data-off-color**			: color for Off state or DEVICE:READING for dynamic setting (default '#505050')

multi state notation   
- **data-states**   			: array of states 
- **data-icons**    			: array of icons related to the data-states array 
- **data-background-icons**             : array of background icons related to the data-states array
- **data-colors**                       : array of colors related to the data-states array
- **data-background-colors**            : array of background colors related to the data-states array
- **class**     			: readonly, 

data-get-on and data-get-off accept also RegEx values. e.g. data-get-on="[0-9]{1,3}|on" means set switch on if STATE is a numeric value or 'on'.
data-get-off="!on" means accept all but the data-get-on value (negation)
data-set-off="" suppress sending off

See [examples](#switch) of Switch

####Symbol widgets
- **data-get**      			: name of the reading to get from FHEM (default 'STATE')

dual state notation
- **data-get-on**   			: value for ON status to get or an array of states (default 'open')
- **data-get-off**  			: value for OFF status to get. (default 'closed')
- **data-icon**     			: name of the font-awesome icon.  (default 'ftui-window')
- **data-background-icon** 		: name of the font-awesome icon for background (default '')
- **data-on-background-color**          : fix color attribute for ON state or DEVICE:READING for dynamic setting (default '#aa6900')
- **data-off-background-color**         : fix color attribute for OFF state or DEVICE:READING for dynamic setting (default '#505050')
- **data-on-color** 			: fix color attribute for ON state or DEVICE:READING for dynamic setting (default '#aa6900')
- **data-off-color**			: fix color attribute for Off state or DEVICE:READING for dynamic setting (default '#505050')

multi state notation   
- **data-states**   			: array of states 
- **data-icons**    			: array of icons related to the data-states array 
- **data-background-icons**             : array of icons related to the data-states array
- **data-colors**                       : array of colors related to the data-states array
- **data-background-colors**            : array of colors related to the data-states array

data-get-on,data-get-off and data-states accept also RegEx values.
The value for one icon can also contain an additional animatation CSS name, e.g. "fa-exclamation-triangle fa-blink" for a blinking symbol

See [examples](#symbol) of Symbol

####Label widgets
- **data-get**  : name of the reading to get from FHEM
- **data-fix**  : keeping a specified number of decimals. (default '-1' -> non-numeric)						 
- **data-part** : part number of the space separated value to show or an RegEx
- **data-colors** : a array of color values to affect the colour of the label according to the limit value 
- **data-limits-get**  : name of the DEVICE:Reading to colorize the label (default: data-device:data-get)
- **data-limits** : a array of numeric or RegEx values to affect the colour of the label
- **data-limits-part**  : part number of the space separated value to show or an RegEx (default '-1' -> all)	
- **data-unit** : add a unit after a numeric value. use encoded strings e.g. "%B0C%0A"
- **data-substitution**: regex-substitution to apply on the value. Standard regex notation (s/regex/subst/modifier) is expected
- **class**     : small, large, big, bigger, thin, red, green, blue, orange, darker, timestamp, w1x, w2x, w3x, circleborder

See [examples](#label) of Label

####Select widgets
- **data-get**  : name of the reading that get the selected item of the list
- **data-set**  : name of the reading to set on FHEM (\<command\> \<device\> **\<reading\>** \<value\>) (default '')
- **data-list** : name of the reading to get a :-separated list from FHEM
- **data-items**: a array of fix items to show in the selection box and send to FHEM  (alternative if data-list is empty)
- **data-alias**: a array of fix names to show only in the selection box as an alias to the real items
- **data-cmd**  : name of the command to send to FHEM (**\<command\>** \<device\> \<reading\> \<value\>) (e.g. setstate, set, setreading, trigger) default: 'set'
- **data-quote** : characters to enclose the send value. (default '')
- **class**     : wider, w1x, w2x, w3x, large, big

####Push widgets
- **data-set**    : name of the reading to set on FHEM (\<command\> \<device\> **\<reading\>** \<value\>) (default '')
- **data-set-on** : value (or an array of values) to send when the the button get pressed. (default '')
- **data-icon**   : name of the font-awesome icon. 
- **data-background-icon** : name of the font-awesome icon for background (default 'fa-circle')
- **data-cmd**  : name of the command (**\<command\>** \<device\> \<reading\> \<value\>) (e.g. setstate, set, setreading, trigger) default: 'set'
- **data-doubleclick**: timeout to wait for a second click or touch. '0' disables the doubleclick feature. (default '0')
- **data-countdown**: secondes for the countdown progress control (default: autodetect from 'on-for-timer' command)

'data-set-on' can also be an array of values to toggle between this values

####Knob widgets
- **data-get**  : name of the reading to get from FHEM (default 'STATE')
- **data-set**  : name of the reading to set on FHEM (\<command\> \<device\> **\<reading\>** \<value\>) (default '')
- **data-cmd**  : name of the command (**\<command\>** \<device\> \<reading\> \<value\>) (e.g. setstate, set, setreading, trigger) default: 'set'
- **data-get-value** : RegEx to retrieve the value or part number of the space separated input to get the value (default '-1': all of the input)
- **data-set-value** : Format of the value to send to FHEM (default '$v': the value only)
- **data-min**  : minimal value to set (default 0)
- **data-max**  : maximal value to set (default 70)
- **data-initvalue**  : (default 10)
- **data-step**  :  (default 1);
- **data-angleoffset**  : (default -120);
- **data-anglearc**  : (default 240);
- **data-bgcolor**  : (default '#505050');
- **data-fgcolor**  : (default '#aa6900');
- **data-inputcolor**  :  (default '#ffffff');
- **data-tkcolor**  :  (default '#666');
- **data-hdcolor**  :  (default '#666');
- **data-displayInput**  : Show the value (default true);
- **data-font**  :  (default '"Helvetica Neue", "Helvetica", "Open Sans", "Arial", sans-serif');
- **data-font-weight**
- **class**		: mini, small, large, readonly

![](http://knowthelist.github.io/fhem-tablet-ui/knob.png)

####Thermostat widgets
all parameters from knob widget plus following additional parameters
- **data-get**   : name of the reading to get from FHEM (default 'desired-temp')
- **data-temp**  : name of the reading for measured temperature of thermostates (default 'measured-temp')
- **data-set**   : name of the reading to set on FHEM (\<command\> \<device\> **\<reading\>** \<value\>) (default 'desired-temp')
- **data-valve** : name of the reading for valve position of thermostates
- **data-mode**  : name of the reading for mode of thermostates
- **data-min**   : minimal value to set (default 10)
- **data-max**   : maximal value to set (default 30)
- **data-step**  : step size for value adjustment e.g. 0.5 (default 1)
- **data-off**   : value to send to get the thermostat switch off (for this, dial the knob to then minimum value)
- **data-boost** : value to send to force boost mode (for this, dial the knob to then maximum value)
- **class**		 : mini, small, big, bigger, readonly

// special for MAX! WandThermostat
date-mode: if the value, retrieved from this reading equals 'auto' then such a command is created "set wz_WandThermostat desiredTemperature **auto** <value>".
Other values creates something like this "set wz_WandThermostat desiredTemperature <value>"

####Volume widgets
all parameters from knob widget plus following additional parameters
- **data-get**  : name of the reading to get from FHEM (default 'STATE')
- **data-set**  : name of the reading to set on FHEM (\<command\> \<device\> **\<reading\>** \<value\>) (default '')
- **data-cmd**  : name of the command (**\<command\>** \<device\> \<reading\> \<value\>) (e.g. setstate, set, setreading, trigger) default: 'set'
- **data-get-value** : RegEx to retrieve the value or part number of the space separated input to get the value (default '-1': all of the input)
- **data-set-value** : Format of the value to send to FHEM (default '$v': the value only)
- **data-min**  : minimal value to set (default 0)
- **data-max**  : maximal value to set (default 70)
- **data-tickstep** : distance between ticks (default 4|20)
- **class**		: mini, small, big, bigger, hue-tick, hue-front, hue-back, dim-tick ,dim-front, dim-back, readonly

####Homestatus widget
all parameters from knob widget plus following additional parameters
- **data-get**      : name of the reading to get from FHEM (default 'STATE')
- **data-set**      : name of the reading to set on FHEM (\<command\> \<device\> **\<reading\>** \<value\>) (default '')
- **data-get-on**   : array of states using for get (default ['1','2','3','4'])
- **data-set-on**   : array of states using for set. (default: value of data-get-on)
- **data-alias**	: array of fix names to show only in the UI as an alias to the real states
- **data-icons**    : array of icons related to the data-get-on array
- **data-version**  : name of the status model e.g. 'residents','roommate','guest' (default NULL)
- **class**			: small, readonly

  The default version has 4 states: '1','2','3','4' 
  The default aliases are 'Home','Night','Away','Holiday';
  data-version='residents' or 'roommate' or 'guest' has 5 states ('home','asleep','absent','gone','gotosleep')
  They have these aliases 'Home','Night','Away','Holiday','Retire'

####Slider widgets
- **data-get**  : name of the reading to get from FHEM (default 'STATE')
- **data-set**  : name of the reading to set on FHEM (\<command\> \<device\> **\<reading\>** \<value\>) (default '')
- **data-cmd**  : name of the command (**\<command\>** \<device\> \<value\>) (e.g. setstate, set, setreading, trigger) default: 'set'
- **data-min**  : minimal value to set (default 0)
- **data-max**  : maximal value to set (default 100)
- **data-on**   : value or RegEx where the slider moves to max  (default 'on') 
- **data-off**  : value or RegEx where the slider moves to min  (default 'off')
- **data-get-value** : RegEx to retrieve the value or part number of the space separated input to get the value (default '-1': all of the input)
- **data-set-value** : Format of the value to send to FHEM (default '$v': the value only)
- **data-value**: show the value in a text box (default 'false')
- **data-width**: width for horizontal sliders (default '120px', for mini '60px')
- **data-height**: height for vertical sliders (default '120px', for mini '60px')
- **class**     : mini, horizontal, negated, textvalue, tap,big,bigger,large

The slider supports tap to target only if the CSS class 'tap' is added. 

####Level widgets
- **data-get**  : name of the reading to get from FHEM (default 'STATE')
- **data-min**  : minimal value to set (default 0)
- **data-max**  : maximal value to set (default 100)
- **data-on**   : value where the slider moves to max  (default 'on')
- **data-off**  : value where the slider moves to min  (default 'off')
- **data-part** : part number of the space separated value to show or an RegEx
- **data-colors** : a array of color values to affect the colour of the label according to the limit value 
- **data-limits** : a array of numeric or RegEx values to affect the colour of the label
- **class**	: mini, horizontal,big,bigger,large

####Progress widgets
- **data-get**  : name of the reading to get from FHEM (default 'STATE')
- **data-max**  : maximal value to set or name of the reading which helds the max value (default 100)
- **class**		: novalue, percent

####Dimmer widgets
- **data-get**       : name of the reading to get from FHEM (default 'STATE')
- **data-get-on**    : value for ON status to get.  (default 'on')
- **data-get-off**   : value for OFF status to get. (default 'off')
- **data-get-value** : RegEx to retrieve the value or part number of the space separated input to get the value (default '-1': all of the input)
- **data-set**       : name of the reading to set on FHEM (\<command\> \<device\> **\<reading\>** \<value\>) (default '')
- **data-set-on**    : string for ON status to set. (default: value of data-get-on)
- **data-set-off**   : string for OFF status to set. (default: value of data-get-off)
- **data-set-value** : Format of the value to send to FHEM (default '$v': the value only)
- **data-cmd**       : name of the command (**\<command\>** \<device\> \<value\>) (e.g. setstate, set, setreading, trigger) default: 'set'
- **data-cmd-value** : name of the command for value changing via slider (**\<command\>** \<device\> \<reading\> \<value\>) (e.g. setreading) default: 'set'
- **data-dim**       : name of the reading responsible for DIM  (\<command\> \<device\> **\<reading\>** \<value\>) (default: '')
- **data-icon**      : name of the font-awesome icon. (default: fa-lightbulb-o)

To change the dim value: push the button and slide up or down.

In simple mode (no 'data-dim' parameter is given) the dimmer toggles between OFF value and the DIM value.  
In extented mode ('data-dim' parameter is given) the DIM value is send to /received from this reading
and the button is only used for ON / OFF.

$v is a placeholder for the numeric value, it will be replaced be the real value at runtime

####Image widgets
- **data-get**      : name of the reading to get an URL from FHEM (default 'STATE')
- **data-path**     : first part of the URL of the image to show  (default '')
- **data-suffix**   : last part of the URL of the image to show (default '')
- **data-size**     : width of the image in px or %, the height scales proportionally. (default: 50%)
- **data-url**      : URL of the image to show 
- **data-refresh**  : Interval in seconds for image refresh for usage together with data-url (default: 900)
- **data-opacity**  : opacity of the image 0-1 (default 0.8)
- **data-height**   : height of the image (default 'auto')
- **data-width**    : width of the image  (default 100%)
- **class**			: nocache

If 'data-url' is not set, then the URL for image src is built from: data-path + valueof data-get + data-suffix
Use data-url + data-refresh or data-device + data-get, not both.

####Weather widgets
- **data-get**      : name of the reading to get the weather literal from FHEM (default 'STATE')
- **data-imageset** : collection of images to display current weather situation. Possible values: 'meteocons', 'kleinklima' (Default: 'meteocons')
- **data-image-path**: path to the images of the selected imageset (default: <fhem-dir>/images/weather/)

####CircleMenu widgets
- **data-item-diameter** : diameter of the circle (default 52)
- **data-circle-radius** : radius of each item, in pixel (default 70)
- **data-border**        : style of border - 'round','square' (default 'round')
- **data-item-width**    : fixe size for width in px (default value of data-item-diameter)
- **data-item-height**   : fixe size for height in px (default value of data-item-diameter)
- **data-direction**     : position of the items in relation to the center (default full). Options are: top | right | bottom | left | top-right | top-left | bottom-right | bottom-left | top-half | right-half | bottom-half | left-half | full | vertical | horizontal
- **class**		 : keepopen

####Playstream widgets
- **data-url**      : URL of the Radio stream
- **data-get**      : name of the reading to get the control state from FHEM (default 'STATE')
- **data-get-on**   : value for PLAY status to get. (default 'on')
- **data-get-off**  : value for STOP status to get. (default 'off')
- **data-volume**   : name of the reading to get the volume value (0-100) (default: volume)

####Pagetab widgets
- **data-url**		: URL of the new page to show
- **data-icon**     : name of the font-awesome icon. (default 'fa-power-off')
- **data-background-icon** : name of the font-awesome icon for background (default '')
- **data-on-background-color** : color of ON state (default '#aa6900')
- **data-off-background-color** : color of OFF state (default '#505050')
- **data-on-color** : color of ON state (default '#aa6900')
- **data-off-color**: color of Off state (default '#505050')
- **data-get-on**   : array of status to assign a special icon-list from data-icons
- **data-icons**    : array of icons related to the a data-get-on array
- **class**		    : warn, activate (as additionals for data-icons)

####Pagebutton widgets
- **data-url**	: URL of the new page to show
all other parameters like switch widget

####Rotor widgets
- **data-delay**    : time in millisecondes to wait until next list item get shown. (default: 3500)
- **class**		    : fade, rotate  (default: '' means no animation)  

####Simplechart widgets
- **data-logdevice**   : name of the logdevice (e.g. FileLog_WohnzimmerHeizung)
- **data-logfile**     : name of the logfile   (e.g. WohnzimmerHeizung-2015.log) (default '-' means current logfile)
- **data-get**         : name of the reading which triggers the update (default 'STATE')
- **data-columnspec**  : definition for how to find the values (e.g. "4:meas.*")
- **data-minvalue**    : min Y value to show  or an array of values for dynamic minY (default 10)
- **data-maxvalue**    : max Y value to show  or an array of values for dynamic maxY (default 30) 
- **data-yticks**      : value distance between Y tick lines (default 5)
- **data-xticks**      : time range between each X tick line (default 360 minutes)
- **data-daysago**     : number of days back from now (default 0)
- **data-caption**     : name of the chart to show as text
- **data-yunit**       : unit of the value to show beside of each Y ticks
- **data-width**       : fixe size for width (in % or px)
- **data-height**      : fixe size for height (in % or px)
- **class**		       : fullsize, noticks

The chart gets updated every time the data-get reading is changed and after each shortpoll interval  (15 min).

####Chart widgets
- **data-logdevice** 	name of the logdevice (e.g. FileLog_WohnzimmerHeizung) or array of names if more than one graph shall be displayed
- **data-logfile** 	name of the logfile (e.g. WohnzimmerHeizung-2015.log) or or array of names if more than one graph shall be displayed 	(default '-' or omitting this data means current logfile)
- **data-columnspec** 	definition for how to find the values (e.g. "4:meas.*:1:int") or or array of columnspecs if more than one graph shall be displayed
- **data-style** 	name of the graph style to be used (e.g. 'SVGplot l0' or 'ftui l0dash') or or array of styles if more than one graph shall be displayed using different stlyes. The standard fhem plot styles can be used furthermore there are some more predefined styles existing (details see css file). Own styles can be specified e.g. in the fhem-table-ui-user.css file.
- **data-ptype** 	name of the plot type (e.g. 'lines' or 'fa-cog') or or array of plottypes if more than one graph shall be displayed. All fhem plot styles are supported. Additionally it is possible to specify symbols (currently supported are font awesome ('fa-...'), open automation ('oa-...') and fhem symbols ('fs-...')) 	(default 'lines')
- **data-uaxis** 	name of the axis to be used ('primary' or 'secondary') or or array of axis' to be used if more than one graph shall be displayed. The 'primary' axis is labelled on the left side, the 'secondary' axis is labelled on the right side 	(default 'primary'
- **data-legend** 	caption of the graph (used in the legend and at the cursor) or an array of legend texts if more than one graph shall be displayed.
- **data-minvalue**	min Y value to Show or an array of values for dynamic minY for primary axis. A value of 'auto' means that the value is calculated from the data displayed dynamically 	(default 10)
- **data-minvalue_sec**	min Y value to Show or an array of values for dynamic minY for secondary axis. A value of 'auto' means that the value is calculated from the data displayed dynamically 	(default 'auto')
- **data-maxvalue** 	max Y value to Show or an array of values for dynamic maxY for primary axis. A value of 'auto' means that the value is calculated from the data displayed dynamically 	(default 30)
- **data-maxvalue_sec**	max Y value to Show or an array of values for dynamic maxY for secondary axis. A value of 'auto' means that the value is calculated from the data displayed dynamically 	(default 'auto')
- **data-yticks** 	value distance between Y tick lines (related to primary axis). A value of 'auto' means that the value is calculated from the data displayed dynamically. 	(default 'auto')
- **data-xticks** 	time range between each X tick lines (in minutes). A value of 'auto' means that the value is calculated from the data displayed dynamically 	(default 'auto')
- **data-daysago_start**	number of days back from now for the start of the plot (0 means the plot starts from today 0:00). Additionally the x-axis start value can be set here unsing standard data formats like ('2013-10-23'), the time portion of the string is only used when data-nofulldays is 'true'. 	(default 0)
- **data-daysago_end** 	number of days back from now for the end of the plot (-1 means the plot ends today 24:00). Additionally the x-axis end value can be set here unsing standard data formats like ('2013-10-23'), the time portion of the string is only used when data-nofulldays is 'true'. 	(default -1)
- **data-nofulldays** 	switch to activate/deactivate rounding of the xaxis start and end values to full days ('true' or 'false') 	'false'
- **data-ytext** 	text to be shown besides the primary y axis.
- **data-ytext_sec** 	text to be shown besides the secondary y axis.
- **data-yunit** 	unit of the value to show beside of each Y ticks for primary y axis.
- **data-crosshair **	switch to activate/deactivate the crosshair cursor ('true' or 'false') 	(default 'false')
- **data-cursorgroup** 	number to define coupling of the crosshair cursor. The cursors of all charts having the same number are coupled and move together.
- **data-scrollgroup** 	number to define coupling of the scrolling (shift and zoom). All charts having the same number are scrolled (shifted and zoomed) together.
- **data-showlegend**	switch to activate/deactivate the initial display of the legend window ('true' or 'false') 	(default 'false')
- **data-yunit_sec** 	unit of the value to show beside of each Y ticks for secondary y axis.
- **data-width** 	fixe size for width (in % or px)
- **data-height** 	fixe size for height (in % or px)
- **class**             fullsize, noticks, nobuttons

data-logfile can be omitted in this case the default value "-" will be used. This means that the current logfile is going to be used.

There are several buttons that control the dynamic behaviour of the chart. The <-, ->, + and - buttons shift and zoom the displayed data. The "legend" and "cursor" buttons are switching on and off the display of the legend window and the crosshair cursor respectively.

When the legend window is displayed, a click on the legend text shows/hides the respective graph. The legend window can be dragged to other positions on desktop browsers (currently not yet working for iOS and Android).

The crosshair cursor currently only works dynamically on desktop browsers. On iOS and Android you have to tap on the screen to set the cursor to a new position.

####Popup widgets
- **data-get**         : name of the reading where to get the alert value from (default 'STATE')
- **data-get-on**      : value which trigger to open the dialog (default 'on')
- **data-get-off**     : value which trigger to close the dialog (default 'off')
- **data-width**       : fixe size for width (in % or px)
- **data-height**      : fixe size for height (in % or px)

It's important that a ```<div class="dialog">``` inside the widget can be found. See the [basic structure](#dialog) of popup

####Datetimepicker widgets
All parameters like Label Widgets plus these:
- **data-format**      : date and time format of the output  (default 'Y-m-d H:i')
- **data-theme**       : color scheme: normal, dark (default 'dark')
- **data-timepicker**  : show the time picker (default 'true')
- **data-datepicker**  : show the date picker (default 'true')
- **data-step**        : step for time in minutes (default '60')
- **data-set-value**   : Format of the value to send to FHEM (default '$v': the value only)

####Readingsgroup widgets
- **data-max-update**         : Specify a minimum number of seconds between an update of the widget to avoid high load on the system

  Formatting will be taken from the corresponding readingsGroup formatting. 
  If the readingsgrouop uses css references, images or similar pieces, then the corresponding files / links need to be also reachable / included

####Eventmonitor widgets
- **data-width**       : fixe size for width (default '750px')
- **data-height**      : fixe size for height (default '450px')
- **device-filter**    : (default '.*')
- **reading-filter**   : (default '.*')
- **max-items**        : (default '100')

Place this widget for debugging purpose within a normal page and klick it to see the events which updates all widgets.
```html
<div data-type="eventmonitor">EM</div>
```

####Checkbox widgets
All parameters like Switch widgets

- **class**             small, large

![](http://knowthelist.github.io/fhem-tablet-ui/Checkboxes.png)

####Range widgets
- **data-high**       : name of the reading to get the high value from FHEM (default 'STATE')
- **data-low**        : name of the reading to get the low value from FHEM  (default '')
- **data-max**        : value for the maximal value on the scale (default '30')
- **data-min**        : value for the minimal value on the scale (default '-10')
- **data-limit-high** : value for the upper limit, where the range bar changes the color (default '20')
- **data-limit-low**  : value for the lower limit, where the range bar changes the color (default '0')
- **data-color**      : rgb value or color name for the normal range of the value bar (default 'orange')
- **data-color-high** : rgb value or color name for the upper range of the value bar (default 'red')
- **data-color-low**  : rgb value or color name for the lower range of the value bar (default 'blue')
- **data-width**      : fixe size for width (default '8px')
- **data-height**     : fixe size for height (default '220px')

- **class**           : nolabels

See [examples](#range) of Range
  
####Colorwheel widgets
- **data-get**         : name of the reading where to get the rgb color value from (default 'STATE')
- **data-set**         : (default '')
- **data-cmd**         : (default 'set')
- **data-width**       : (default 150)
- **class**            : roundIndicator,barIndicator,lineIndicator

####Link widgets
- **data-color**                   : rgb value or color name for the text and icon (default 'orange')
- **data-background-color**        : rgb value or color name for the back (default null)
- **data-border-color**            : rgb value or color name for the border (default null)
- **data-icon-left**               : name of the left icon   (default null)
- **data-icon-right**              : name of the right icon  (default null)
- **data-width**                   : width of the link  (default 'auto')
- **data-height**                  : height of the link (default 'auto')
- **data-text-align**              : alignment of text ['left','center','right']  (default 'center')
- **data-active-pattern**          : RegEx to define active state  (default null)
- **data-active-color**            : rgb value or color name for the text and icon in case active-pattern is matching (default same as data-color)
- **data-active-background-color** : rgb value or color name for the back in case active-pattern is matching (default same as data-background-color)
- **data-active-border-color**     : rgb value or color name for the border in case active-pattern is matching (default same as data-border-color)

Format
-------
The layout, look and behavior can be influenced by the class attribute.

**CSS Class description**

not all widgets support all classes
- readonly		: changing of state is not allowed 
- w1x, w2x, w3x	: set the widget to a fix width: 1x, 2x, 3x width
- small			: font 80% size (label), small diameter for volume widget
- mini			: lowest diameter for volume widget
- large			: font 150% size
- big			: font 200% size
- bigger		: font 320% size
- thin			: font thin
- darker		: forecolor in gray
- hue-tick		: draw ticks in color range
- hue-front		: draw handle in color range
- hue-back		: draw background in color range
- dim-tick 		: draw ticks in brightness range
- dim-front		: draw handle in brightness range
- dim-back		: draw background in brightness range
- red			: foreground color red
- green			: foreground color green
- blue			: foreground color blue
- orange		: foreground color orange
- doublebox-v           : container to place 2 small widgets (e.g. switch) one above the other
- doublebox-h           : container to place 2 small widgets (e.g. switch) side by side
- triplebox-v           : container to place 3 small widgets (e.g. switch) one above the other
- timestamp		: deliver the date time for the reading instead of the value
- blink                 : blink animatation for label or symbol widget
- rotate-90		: rotate (e.g an image) for 90 degres  
- circleborder          : draws a round border around labels

Positioning:
- row                   : new row
- col-x-y 		: new column with x/y of width (col-1-3,col-2-3,col-1-2,col-1-4,col-1-8,col-1-5,col-2-5,col-3-5,col-4-5)
- inline		: positioning elements in a row, no line break
- top-space     : 15px extra on top (top-space-2x -> 30px; top-space-3x -> 45px)
- left-space	: 15px extra on left (left-space-2x -> 30px; left-space-3x -> 45px)
- right-space  	: 15px extra on right (right-space-2x -> 30px; right-space-3x -> 45px)
- top-narrow    : -15px closer on top  (top-narrow-2x -> -30px; top-narrow-10 -> -10px)
- centered		: horizontal centered
- left-align	: align text left
- right-align	: align text right
- bottom        : align text at the bottom of
- wider			: 15px extra space for the widget all around 
- narrow		: shorter distant to the widget above 
- fullsize		: 100% in width and height

Icon configuration
-------

- Built-in icons
Built in icons have the ftui- prefix. Currently available are: ftui-window, ftui-door

- Font-Awesome 
Select one of over 500 icons from http://fortawesome.github.io/Font-Awesome/icons.
Just enter the icon name (with suffix "fa-"), all icons are available. e.g. data-icon="fa-volume-up"

- FHEM and OpenAutomation
Enable respectively add following lines to index.html to active FHEMWEB icons for FHEM Tablet ui
```html
<link rel="stylesheet" href="/fhem/tablet/lib/openautomation.css" />
<link rel="stylesheet" href="/fhem/tablet/lib/fhemSVG.css" />
```
This font icons has the prefix 'fs-' and 'oa-'

Color configuration
-------
It is possible to specify color value in Hex or RBG style.
- Hex: #A3CFA3
- RBG: rgb(163, 207, 163) 

Try to avoid flashy color like #ff0000 for red or #00ff00 for green. 
It is always better to stay below #D0 (208) values for each primary color.

Recommended colors:
- Orange: 	#aa6900
- Red:		#ad3333
- Green:	#32a054
- Blue:		#6699FF
- Gray:		#8C8C8C

You could use this color picker: http://www.w3schools.com/tags/ref_colorpicker.asp

Prepared color schemas are available in css folder and can be included with a additional link at the end of the css link list.
```html
<link rel="stylesheet" href="/fhem/tablet/css/fhem-blue-ui.css" />
```
These schemas change all widgets together.
It is also possible to change only color of single widgets by adding one of these CSS classes 'red', 'green', 'blue', 'orange', 'ligthblue', 'gray'

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
To disable Toast messages set this value to 0
```html
<meta name='toast' content='1'>
```
Change this to adjust the size of a Gridster base (data-sizey=1/data-sizex=1)
```html
<meta name="widget_base_width" content="116">
<meta name="widget_base_height" content="131">
```
Add this to adjust the size of the Gridster margin
```html
<meta name="widget_margin" content="4">
```


Examples
-------

See Live-Demos for widgets here: http://knowthelist.github.io/fhem/tablet/demo_widgets.html

**Position grid** 

Two main boxes left and right. The first row of the left box has 3 columns. The second row has 2 columns.  

```html
<li data-row="1" data-col="4" data-sizex="5" data-sizey="3">
   <header>EXAMPLE3</header>
   <div class="row top-space">
        <div class="col-1-2">
            <div class="row top-space">
                <div class="col-1-3">
                    <div data-type="switch" data-device="Switch1" data-icon="fa-music"></div>
                    <div data-type="label" class="">Station1</div>
                </div>
                <div class="col-1-3">
                    <div data-type="switch" data-device="Switch2" data-icon="fa-music"></div>
                    <div data-type="label" class="">Station2</div>
                </div>
                <div class="col-1-3">
                    <div data-type="switch" data-device="Switch3" data-icon="fa-music"></div>
                    <div data-type="label" class="">Station3</div>
                </div>
             </div>
             <div class="row top-space">
                 <div class="col-1-2">
                     <div data-type="symbol" data-device="Switch1" data-icon="fa-battery-4"></div>
                     <div data-type="label" class="">Value1</div>
                 </div>
                 <div class="col-1-2">
                     <div data-type="symbol" data-device="Switch1" data-icon="fa-battery-4"></div>
                     <div data-type="label" class="">Value2</div>
                 </div>
              </div>
        </div>
        <div class="col-1-2">
            <div data-type="volume" data-device='Volume1' class="" ></div>
        </div>
   </div>
</li>
```

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

Example for MAX!:
```html
<div data-type="thermostat" data-device="HZ_Tuer" 
	data-valve="valveposition" 
	data-get="desiredTemperature" 
	data-temp="temperature" 
	data-set="desiredTemperature" 
	class="cell">
</div>
```
Example to realize a thermostat off and boost function. It sends 'off' if the dial is set to min value 
and 'boost' if the max value get selected. 
```html
<div data-type="thermostat" data-device="W_HEIZUNG" 
	data-min="4" data-off="off" 
	data-max="31" data-boost="boost">
</div>
```

The wigets will show the valve value only in case of a valid data-valve attribute.
The default for data-valve ist null. That means, a empty data-valve attribute hides the valve label for the widget.   
![](http://knowthelist.github.io/fhem-tablet-ui/thermo.png)

###Label
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

**Example** for how to show two labels in one line.
```html
<div class="">
   <div type="label" device="OnSunrise" class="inline"></div>bis
   <div type="label" device="OnSunset" class="inline"></div>
</div>
```

###Push
**Example** for how to create a push button widget to trigger all devices on:
```html
<div data-type="push" 
     data-device="LightAll" 
     data-cmd="trigger" 
     data-set-on="on" 
     class="cell">
</div>
```
**Example** two square buttons horizontal
```html
<div class="cell">
    <div class="doublebox-h">
        <div data-type="push" data-device="Rollo" 
        	 data-icon="fa-angle-up" data-background-icon="fa-square-o" 
        	 data-set-on="up">
        </div>
        <div data-type="push" data-device="Rollo" 
        	 data-icon="fa-angle-down" data-background-icon="fa-square-o" 
        	 data-set-on="down">
        </div>
    </div>
</div>
```
![](http://knowthelist.github.io/fhem-tablet-ui/square-push-h.png)

**Example** two square buttons vertical
```html
<div class="cell">
    <div class="doublebox-v">
        <div data-type="push" data-device="Rollo" 
             data-icon="fa-chevron-up" data-background-icon="fa-square-o" 
             data-set-on="up">
    	</div>
        <div data-type="push" data-device="Rollo" 
        	data-icon="fa-chevron-down" data-background-icon="fa-square-o" 
        	data-set-on="down">
        </div>
    </div>
</div>
```
![](http://knowthelist.github.io/fhem-tablet-ui/square-push-v.png)

**Example** for a push button to switch a lamp on for 5 minutes. The control shows a progress circle while countdown is running.
The countdown time is auto detected via the on-for-timer command. A other value can be set with the parameter data-countdown
```html
<div data-type="push" data-device="MyLamp" data-set-on="on-for-timer 300"  
	 class="cell" ></div>
```
![](http://knowthelist.github.io/fhem-tablet-ui/push_on-for-timer.png)

###Switch
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

###Symbol

**Example** for a simple window symbol
```html
<div data-type="symbol" data-device="SchlafzimmerFenster" class="narrow big"></div>
```

**Example** for a tristate icon
```html
<div data-type="symbol" data-device="dummy1" 
 data-states='["wert1","wert2","wert3"]' 
 data-icons='["fa-arrow-up","fa-user","fa-arrow-down"]' 
 data-colors='["SeaGreen","SlateBlue","IndianRed"]' 
 class="cell big">
</div>
```

**Example** for a tristate icon with blink and spin animation
```html
<div data-type="symbol" data-device="dummy1" 
  data-states='["Wert1","Wert2","Wert3"]'
  data-icons='["fa-exclamation-triangle fa-blink","fa-exclamation-circle","fa-cog fa-spin"]' 
  data-colors='["Crimson","GoldenRod","SeaGreen"]' 
   >
</div>
```

**Example** for a battery level control with RegEx
```html
<div data-type="symbol" data-device="WohnzimmerHeizung" data-get="batteryLevel"
    data-states='["3.[0-9]","2.[789]","2.[456]","2.[123]","((2.0)|([01].[0-9]))"]'
        data-icons='["fa-battery-4","fa-battery-3","fa-battery-2","fa-battery-1","fa-battery-0"]'
    data-colors='["#505050","#505050","#505050","#ad3333","#ad3333"]'>
</div>
```       

**Example** for a battery level control with greater-equal compare and 90° rotated symbols
```html       
<div data-type="symbol" data-device="BadHeizung" data-get="batteryLevel"
	data-states='["0","2","2.4","2.7","3.0"]'
	data-icons='["oa-measure_battery_0 fa-rotate-90","oa-measure_battery_25 fa-rotate-90","oa-measure_battery_50 fa-rotate-90","oa-measure_battery_75 fa-rotate-90","oa-measure_battery_0 fa-rotate-90"]'
	data-colors='["#ad3333","#ad3333","#505050","#505050","#505050"]'>
</div>
```

**Example** for a door symbol which shows a warning sign in case of an open state
```html  
<div data-type="symbol" data-device="Eingangstuer" 
	 data-states='["open","closed"]' 
	 data-icons='["ftui-door warn","ftui-door"]' 
	 data-colors='["#999","#555"]' >
</div>
```

###Weather

**Example** for how to use a label to show a weather icon according reading literal
```html
<div data-type="weather" 
     data-device="Weather" 
     data-get="fc0_weatherDay" 
     class="cell big">
</div>
```
The weather literal could be delivered by a FHEM module like PROPLANTA, OPENWEATHER, Weather.

Add 'big' or 'bigger' to CSS class to get a bigger weather icon.

![](http://knowthelist.github.io/fhem-tablet-ui/weather.png)

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

###Level
**Example** for how to create a widget for a double level control with additional labels
```html
<div class="cell">
	<div data-type="level" data-device='Tablet'  data-get='powerLevel'
		data-limits='["[12]*[0-9]","[3456][0-9]","([789][0-9]|100)"]'
		data-colors='["#dd3366","#ffcc00","#55aa44"]'
		class="horizontal left" >
	</div>
	<div data-type="label" data-device='Tablet'
		 data-get='powerLevel'
		 data-unit="%" class="top-space left"></div>
</div>
<div class="cell">
	<div data-type="level" data-device='dummy1'
		data-limits='["20","70","95"]'
		data-colors='["#dd3366","#ffcc00","#55aa44"]'
		class="horizontal left" >
	</div>
	<div data-type="label" data-device='dummy1' data-unit="%" 
		 class="top-space left"></div>
</div>
```
![](http://knowthelist.github.io/fhem-tablet-ui/level_limits.png)

###Progress
**Example** for how to create a widget for a percent display
```html
<div data-type="progress" data-device="dummy1" data-get='pct'></div>
```
![](http://knowthelist.github.io/fhem-tablet-ui/progress.png)

###Volume
**Example** for how to create a widget for a HueDevice to set hue values:
```html
<div data-type="volume" data-device='dummy1' 
	data-min='0' 
	data-max='65535' 
	data-tickstep='4' 
	data-get='hue' 
	data-set='hue' 
	class="cell small hue-tick" ></div>
<div data-type="label" class="cell">Light2</div>
```
![](http://knowthelist.github.io/fhem-tablet-ui/volume_hue.png)

Following CSS classes are available to influence the look:
hue-tick|hue-front|hue-back or dim-tick|dim-front|dim-back|rgb
This classes can be combined (e.g. class="cell small hue-tick hue-front")

###Dimmer
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


**Example** for how to create a widget for a HUEDevice for on/off, percent and hue adjustment:
```html
<div data-type="volume" data-device="HUEDevice1" data-min="0" data-max="65353" data-get="hue" data-set="hue" class="hue-tick mini wider" ></div>
<div data-type="label" class="cell">Color</div>
<div data-type="dimmer" data-device="HUEDevice1" data-get-on="!off" data-get-off="off" data-set="pct" class="cell" ></div>
<div data-type="label" class="cell">Hell</div>
```

**Example** for the same HUEDevice but with separat reading for dim
```html
<div data-type="dimmer" data-device="HUEDevice1"
     data-get="onoff"
     data-get-on="1" data-get-off="0"
     data-set=""
     data-set-on="on" data-set-off="off"
     data-dim="pct"
     class="top-space-2x" ></div>
<div data-type="label" class="cell">Philips</div>
```  
  
![](http://knowthelist.github.io/fhem-tablet-ui/hue_pct.png)

**Example** for a FS20 Dimmer in simple mode (toggles between OFF value and the DIM value)
```html
<div data-type="dimmer" data-device='myFS20Dimmer'
     data-set-on="dim$v%"
     data-set-off="dim0%"
     data-set-value="dim$v%"
     data-get-on="dim([1-9]\d?)?%"
     data-get-off="dim0%"></div>
```

###Image
**Example** for how to add an image to the dashboard which its URL is delivered by a FHEM module like PROPLANTA:
```html
<div data-type="image" data-device="Wetter1" 
	 data-get="fc0_weatherDayIcon" 
	 data-size="40px" 
	 class="cell">
</div>
```

**Example** for how to grab a live image every 5 secondes
```html
<div data-type="image"
     data-size="95%"
     data-url="http://vusolo2/grab?format=jpg"
     data-refresh="5">
</div>
```

**Example** for how to update a web image every 15 secondes
```html
<div data-type="image"
   data-size="95%"
   data-url="http://lorempixel.com/400/200"
   data-refresh="15"
   class="nocache">
</div>
```

###Homestatus
**Example** for how to individualize the homestatus widget:
```html
<div data-type="homestatus" data-device='hs_normal' class="small" ></div>

<div data-type="homestatus" data-device='hs_extra'
        data-get-on='["home","asleep","absent","gone","gotosleep"]'
        data-alias='["Home","Night","Away","Holiday","Retire"]'
        data-icons='["fa-fire","fa-film","fa-plus","fa-car","fa-tint"]'
        data-version='residents'>
```

###Pagetab
**Example** for a tab menu to switch smoothly between multiple pages. 
Multiple pagetabs in a template file: menu.html
```html
<html>
<body>
    <header>MENU</header>
    <div class="cell">
        <div data-type="pagetab" data-url="index.html"  data-icon="fa-home" class="cell"></div>
        <div data-type="pagetab" data-url="index_2.html" data-icon="fa-sliders" class="cell"></div>
        <div data-type="pagetab" data-url="index_3.html" data-icon="fa-music" class="cell"></div>
        <div data-type="pagetab" data-url="index_4.html" data-icon="fa-hotel" class="cell"></div>
        <div data-type="pagetab" data-url="index_5.html" data-icon="fa-music" class="cell"></div>
        <div data-type="pagetab" data-url="index_6.html" data-icon="fa-database" class="cell"></div>
        <div data-type="pagetab" data-url="index_7.html" data-icon="fa-fax" class="cell"></div>
    </div>
</body>
</html>
```

**Example** for a tab menu item, which shows also the numeric value of a reading 
```html
<div data-type="pagetab" data-device="MyFaxDevice"
		data-get-on='["0","1"]'
		data-icons='["fa-fax","fa-fax warn"]'
		data-url="index_fax.html" class="cell"></div>
</div>
```

**Example** for a tab menu item, which also activate the new page in case of 'on' status
```html
<div data-type="pagetab" data-device="myDoorBell"
		data-get-on='["0","(?:[1-9][0-9]*)","on"]'
		data-icons='["fa-fax","fa-fax warn","fa-fax warn activate"]'
		data-url="index_door.html" class="cell"></div>
</div>
```
    
![](http://knowthelist.github.io/fhem-tablet-ui/menu.png)


###Rotor
**Example** for a rotor widget, which switches between two days of weather forecast
```html
<div data-type="rotor" class="fade">
 <ul>
  <li>
	<div data-type="label" class="darker">Heute</div>
	<div data-type="weather" data-device="AgroWeather" data-get="fc0_weatherDay" class="big"></div>
	<div data-type="label" data-device="AgroWeather" data-get="fc0_weatherDay" class=""></div>
	<div data-type="label" data-device="AgroWeather" data-get="fc0_tempMax" data-unit="%B0C%0A" class="large"></div>
  </li>
  <li>
	<div data-type="label" class="darker">Morgen</div>
	<div data-type="weather" data-device="AgroWeather" data-get="fc1_weatherDay" class="big"></div>
	<div data-type="label" data-device="AgroWeather" data-get="fc1_weatherDay" class=""></div>
	<div data-type="label" data-device="AgroWeather" data-get="fc1_tempMax" data-unit="%B0C%0A" class="large"></div>
  </li>
 </ul>
</div>
```

###Simplechart
**Example** for simplechart widget: two charts inline
```html
<li data-row="4" data-col="4" data-sizex="8" data-sizey="3">
<header>CHARTS</header>
    <div data-type="simplechart"
    	data-device="WohnzimmerHeizung"
		data-logdevice="FileLog_WohnzimmerHeizung"
		data-columnspec="4:meas.*:1:int"
		data-minvalue="10"
		data-maxvalue="30"
        data-width="250px"
        data-height="120px"
		data-yticks="4"
		data-daysago="0"
		data-caption="Wohnzimmer" class="inline cell">
    </div>
    <div data-type="simplechart"
	    data-device="KuecheHeizung"
		data-logdevice="FileLog_KuecheHeizung"
		data-columnspec="4:meas.*:1:int"
		data-minvalue="12"
		data-maxvalue="28"
        data-width="250px"
        data-height="120px"
		data-yticks="6"
		data-daysago="2"
		data-caption="Küche" class="inline cell">
    </div>
</li>
```

![](http://knowthelist.github.io/fhem-tablet-ui/simplechart-two.png)

**Example** for simplechart widget: one chart fill the whole gridster element
```html
<li data-row="4" data-col="4" data-sizex="8" data-sizey="3">
<header>CHART</header>
	<div data-type="simplechart"
		data-device="WohnzimmerHeizung2"
		data-logdevice="FileLog_WohnzimmerHeizung2"
		data-logfile="WohnzimmerHeizung2.log"
		data-columnspec="4:temp:1:int"
		data-minvalue="10"
		data-maxvalue="30"
		data-yticks="4"
		data-daysago="0"
		data-caption="Wohnzimmer" class="fullsize">
	</div>
</li>
```

**Example** for chart widget
```html
<li data-row="4" data-col="9" data-sizex="10" data-sizey="3">
  <header>CHART</header>
    <div class="normal"
         data-type="chart"
         data-device="WohnzimmerHeizung"
         data-logdevice='["FileLog_WohnzimmerHeizung","FileLog_WohnzimmerHeizung","FileLog_WohnzimmerHeizung"]'
         data-columnspec='["4:measured-temp","4:desired-temp","4:ValvePosition"]'
         data-style='["ftui l0fill","ftui l0dot","ftui l2dash"]'
         data-ptype='["lines","lines","lines"]'
         data-uaxis='["primary","primary","secondary"]'
         data-legend='["Measured", "Desired", "Valve"]'
         data-yunit="°C"
         data-ytext="Temperature"
         data-minvalue="auto"
         data-maxvalue="auto"
         data-yunit_sec="%"
         data-ytext_sec="Percentage"
         data-yticks="auto"
         data-minvalue_sec="0"
         data-maxvalue_sec="100"
         data-daysago_start="0"
         data-daysago_end="-1"
         data-crosshair="true"
         data-cursorgroup="1"
         data-scrollgroup="1"
         data-showlegend="true"
         data-xticks="auto">
    </div>
</li>
```

![](http://knowthelist.github.io/fhem-tablet-ui/widget_chart_example.png)

###Circle Menu
-------
Cover a lot of other button behind one single button 

```html
<div class="left">
<div data-type="circlemenu" class="cell circlemenu">
	<ul class="menu">
	  <li><div data-type="push" data-icon="fa-wrench"></div></li>
	  <li><div data-type="push" data-device="AvReceiver" 
	  		   data-set="remoteControl" data-set-on="subwoofer-temporary-level -6" 
	  		   data-icon="">-6</div></li>
	  <li><div data-type="push" data-device="AvReceiver" 
	  		   data-set="remoteControl" data-set-on="subwoofer-temporary-level -2" 
	  		   data-icon="">-2</div></li>
	  <li><div data-type="push" data-device="AvReceiver" 
	  		   data-set="remoteControl" data-set-on="subwoofer-temporary-level 0" 
	  		   data-icon="">0</div></li>
	  <li><div data-type="push" data-device="AvReceiver" 
	  		   data-set="remoteControl" data-set-on="subwoofer-temporary-level +3" 
	  		   data-icon="">2</div></li>
	  <li><div data-type="push" data-device="AvReceiver" 
	  		   data-set="remoteControl" data-set-on="subwoofer-temporary-level +9" 
	  		   data-icon="">9</div></li>
	  <li><div data-type="push" data-device="AvReceiver" 
	  		   data-set="remoteControl" data-set-on="subwoofer-temporary-level +C" 
	  		   data-icon="">12</div></li>
	</ul>
</div>
<div data-type="label" class="cell">Woofer</div>
</div>
```

![](http://knowthelist.github.io/fhem-tablet-ui/circle_menu_open.png)


###Playstream
-------
Create a simple button to play a webradio stream directly on the tablet

```html
<div data-type="playstream" data-url="http://radioeins.de/stream"></div>
<div data-type="label" class="darker">Radio eins</div>
```

Use a FHEM dummy device to start/stop stream and set volume

```html
<div data-type="playstream" data-url="http://radioeins.de/stream" 
	 data-device="dummy1" 
	 data-get-on="play" data-get-off="stop"
     data-volume="volume">
</div>
```
      
###Select
-------
Create two comboboxes to select the inputs of a two zone AV receiver. List for Zone2 is fix, list for Zone1 will be received from FHEM.

```html
<div class="cell wider">
          <div data-type="label" class="inline wider">Zone2</div>
          <div data-type="select" data-device="AvReceiverZ2" data-items='["Airplay","Webradio","BD/DVD","PHONO"]' data-get="input" data-set="input" class="cell w2x" ></div>
          <div></div>
          <div data-type="label" class="inline">Zone1</div>
          <div data-type="select" data-device="AvReceiver" data-list="inputs" data-get="input" data-set="input" class="cell w2x" ></div>
</div>
```
![](http://knowthelist.github.io/fhem-tablet-ui/select_2x.png)    

###Dialog
-------
Basic structure for a popup:
```html
<div data-type="popup" data-height="150px" data-width="250px">
  <div><!-- click object to open the popup --></div>
  <div class="dialog">
	  <header>DIALOG</header>
	  <div><!-- widget(s) inside the popup dialog --></div>
  </div>
</div>
```
Create a Label in the UI which opens a dialog with sub widgets .
```html
<div data-type="popup" data-height="150px" data-width="250px">
  <div data-type="label" class="cell">show temperatur</div>
  <div class="dialog">
	  <header>DIALOG</header>
	  <div class="right top-space right-space-2x">
		<div class="inline">
		  <div data-type="label" data-device="THSensorWZ" data-get="temperature" data-limits='[-73,19,23]' data-colors='["#6699FF","#aa6900","#bb6242"]' data-unit="%B0C%0A" class="bigger thin"></div>
		  <div data-type="label" class="cell">Temperatur</div>
		</div>
		<div class="inline">
		  <div data-type="label" data-device="THSensorWZ" data-fix="0" data-part="4" data-limits='[0,40,60]' data-colors='["#bb6242","#aa6900","#bb6242"]' data-unit="%" class="bigger thin"></div>
		  <div data-type="label" class="cell">Luftfeuchte</div>
		</div>
	  </div>
  </div>
</div>
```
Create a mini chart in the UI which opens a dialog with the full size of the chart.

```html
<div data-type="popup" data-width="450px">
	<div data-type="simplechart"
	 	  data-device="OutTemp"
		  data-logdevice="FileLog_OutTemp"
		  data-columnspec="4:temp"
		  data-minvalue="-25"
		  data-maxvalue="35"
		  data-height="50"
		  data-width="100"
		  class="cell">
	</div>
	<div class="dialog">
		<header>BIG-CHART</header>
		<div data-type="simplechart"
	 		  data-device="OutTemp"
			  data-logdevice="FileLog_OutTemp"
			  data-columnspec="4:temp"
			  data-minvalue="-25"
			  data-maxvalue="35"
			  data-yticks="5"
			  data-height="150"
			  class="cell">
		</div>
	</div>
</div>
```

###Datetimepicker
-------
Create a Label in the UI which opens a datetime picker.

```html
<div class="cell left" >
    <div data-type="label" class="inline thin" >Start:</div>
    <div data-type="datetimepicker" data-device="dummy1" class="inline large thin orange"></div>
</div>    
```

Create a Label in the UI which opens a time picker.

```html
<div class="cell left" >
    <div data-type="label" class="inline thin" >Bad:</div>
    <div data-type="datetimepicker" data-device="dummy1"
         data-datepicker="false" data-format="H:i"
         class="inline large thin orange"></div>
</div>
```

![](http://knowthelist.github.io/fhem-tablet-ui/timepicker.png)

###Range
-------

Example of range widgets to visualize max and min temperature value as a range bar. Temperatures below zero are shown in blue, values above 2 become red.

```html
<div class="container">
    <div data-type="range" data-device="AgroWeather" data-low="fc0_tempMin" data-high="fc0_tempMax" data-max="5" data-min="-5" data-limit-low="0" data-limit-high="2" class="inline left-space"></div>
    <div data-type="range" data-device="AgroWeather" data-low="fc1_tempMin" data-high="fc1_tempMax" data-max="5" data-min="-5" data-limit-low="0" data-limit-high="2" class="inline left-space nolabels"></div>
    <div data-type="range" data-device="AgroWeather" data-low="fc2_tempMin" data-high="fc2_tempMax" data-max="5" data-min="-5" data-limit-low="0" data-limit-high="2" class="inline left-space nolabels"></div>
</div>
```

![](http://knowthelist.github.io/fhem-tablet-ui/widget_range.png)


Specials
-------
**Example** to call a command directly to FHEM. This calls "set dummy1 off"
```html
<div onclick="setFhemStatus('set dummy1 off')">All off!</div>
```
**Example** to call a Perl function directly to FHEM. This calls the myUtils_HeizungUpDown function located in 99_myUtils.pm:
	myUtils_HeizungUpDown("WZ.Thermostat_Climate","up")
```html
<div onclick="setFhemStatus('{myUtils_HeizungUpDown(&quot;WZ.Thermostat_Climate&quot;,&quot;up&quot;)}')"
	class="cell big">+</div>
```

Templates
-------
Include re-usable code. 

Load a whole extern gridster element
```html
<li data-row="1" data-col="1" data-sizex="1" data-sizey="4" data-template="menu.html"></li>
```
Load a re-usable widget group
```html
<div data-template="template_div.html" class="cell"></div>
```

###Donation
--------
You can support the creator of this beautiful UI so that he can buy a new laptop.

Update 2015-10-27: yesterday my old 2007 MacBook died. Total fail of HDD. 
I'm unable to work now and I need to buy a new one.

Update 2015-11-04: my old 2007 MacBook runs again with the previous HDD, but totaly slow and out of space.

* Goal  : 13'' MacBook Pro 1445€ 
* Status: 467€ (32% - 03.12.2015 -> many thanks to all donators :-)


<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PD4C2XM2VTD9A"><img src="https://www.paypalobjects.com/de_DE/DE/i/btn/btn_donateCC_LG.gif" alt="[paypal]" /></a>


License
-------
This project is licensed under [MIT](http://www.opensource.org/licenses/mit-license.php).
  
