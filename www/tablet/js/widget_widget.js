var widget_widget = {
    widgetname : 'widget',
    FS20: {
        'dimmerArray':[0, 6, 12, 18, 25, 31, 37, 43, 50, 56, 62, 68, 75, 81, 87, 93, 100],
        'dimmerValue': function(value){
            var idx = indexOfNumeric(this.dimmerArray,value);
            return (idx > -1) ? this.dimmerArray[idx] : 0;
        }
    },
    rgbToHsl: function(rgb){
        var r=parseInt(rgb.substring(0,2),16);
        var g=parseInt(rgb.substring(2,4),16);
        var b=parseInt(rgb.substring(4,6),16);
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        
        if(max == min){
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h, s, l];
    },
    hslToRgb: function(h, s, l){
        var r, g, b;
        var hex = function(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
    
        if(s == 0){
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return [hex(Math.round(r * 255)), hex(Math.round(g * 255)), hex(Math.round(b * 255))].join('');
    },
    rgbToHex: function(rgb){
     var tokens = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
     return (tokens && tokens.length === 4) ? "#" +
      ("0" + parseInt(tokens[1],10).toString(16)).slice(-2) +
      ("0" + parseInt(tokens[2],10).toString(16)).slice(-2) +
      ("0" + parseInt(tokens[3],10).toString(16)).slice(-2) : rgb;
    },
    getGradientColor: function(start_color, end_color, percent) {
     // strip the leading # if it's there
    start_color = this.rgbToHex(start_color).replace(/^\s*#|\s*$/g, '');
    end_color   = this.rgbToHex(end_color).replace(/^\s*#|\s*$/g, '');

     // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
     if(start_color.length == 3){
       start_color = start_color.replace(/(.)/g, '$1$1');
     }

     if(end_color.length == 3){
       end_color = end_color.replace(/(.)/g, '$1$1');
     }

     // get colors
     var start_red = parseInt(start_color.substr(0, 2), 16),
         start_green = parseInt(start_color.substr(2, 2), 16),
         start_blue = parseInt(start_color.substr(4, 2), 16);

     var end_red = parseInt(end_color.substr(0, 2), 16),
         end_green = parseInt(end_color.substr(2, 2), 16),
         end_blue = parseInt(end_color.substr(4, 2), 16);

     // calculate new color
     var diff_red = end_red - start_red;
     var diff_green = end_green - start_green;
     var diff_blue = end_blue - start_blue;

     diff_red = ( (diff_red * percent) + start_red ).toString(16).split('.')[0];
     diff_green = ( (diff_green * percent) + start_green ).toString(16).split('.')[0];
     diff_blue = ( (diff_blue * percent) + start_blue ).toString(16).split('.')[0];

     // ensure 2 digits by color
     if( diff_red.length == 1 )
       diff_red = '0' + diff_red

     if( diff_green.length == 1 )
       diff_green = '0' + diff_green

     if( diff_blue.length == 1 )
       diff_blue = '0' + diff_blue

     return '#' + diff_red + diff_green + diff_blue;
    },
    precision: function(a) {
        var s = a + "",
        d = s.indexOf('.') + 1;
        return !d ? 0 : s.length - d;
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr.call(base,$(this));
            base.init_ui.call(base,$(this));
        });
    },
}
$.fn.filterData = function(key, value) {
    return this.filter(function() {
        return $(this).data(key) == value;
    });
};
$.fn.filterDeviceReading = function(key, device, param) {
    return this.filter(function() {
        return  ( $(this).data(key) === param && $(this).data('device') === device )
                || ($(this).data(key) === device + ':' + param);
    });
};
$.fn.isValidData = function(key) {
    return typeof $(this).data(key) != 'undefined';
};
$.fn.initData = function(key,value) {
    $(this).data(key, $(this).isValidData(key) ? $(this).data(key) : value);
    return $(this);
};
$.fn.mappedColor = function(key) {
    return getStyle('.'+$(this).data(key),'color') || $(this).data(key);
};
$.fn.isDeviceReading = function(key) {
    return !$.isNumeric($(this).data(key)) && $(this).data(key).match(/:/);
};
$.fn.isExternData = function(key) {
    var data = $(this).data(key);
    if (!data) return '';
    return (data.match(/^[#\.\[].*/));
};
$.fn.addReading = function(key) {
    var data = $(this).data(key);
    if (!data.match(/^[#\.\[].*/)){
        var device = $(this).data('device');
        if(! $.isArray(data)) {
            data = new Array(data);
        }
        for(var i=0; i<data.length; i++) {
            var reading = data[i];
            // fully qualified readings => DEVICE:READING
            if(reading.match(/:/)) {
                var fqreading = reading.split(':');
                device = fqreading[0]
                reading = fqreading[1];
            }
            // fill objects for mapping from ugly fhem ids to device + reading

            if (isValid(device) && isValid(reading)){
                var paramid = (reading==='STATE') ? device : [device,reading].join('-');
                var paramidts = [device,reading,'ts'].join('-');
                ftui.paramIdMap[paramid]={};
                ftui.paramIdMap[paramid].device=device;
                ftui.paramIdMap[paramid].reading=reading;
                ftui.timestampMap[paramidts]={};
                ftui.timestampMap[paramidts].device=device;
                ftui.timestampMap[paramidts].reading=reading;
            }
            // deprecated
            // fill separat device + reading objects
            if(!devices[device] && isValid(device) )
                devices[device] = true;
            if(!readings[reading] && !reading.match(/^[#\.\[].*/))
                readings[reading] = true;
        }
    }
};
$.fn.getReading = function (key) {
    var devname = $(this).data('device'),
        paraname = $(this).data(key);
    if(paraname && paraname.match(/:/)) {
        var temp = paraname.split(':');
        devname = temp[0];
        paraname = temp[1];
    }
    if (devname && devname.length>0){
        var params = deviceStates[devname];
        return ( params && params[paraname] ) ? params[paraname] : {};
    }
    return {};
}
$.fn.valOfData = function(key) {
    var data = $(this).data(key);
    if (!data) return '';
    return (data.match(/^[#\.\[].*/))?$(data).data('value'):data;
};
$.fn.transmitCommand = function() {
    if ($(this).hasClass('notransmit')) return;
    var cmdl = [$(this).valOfData('cmd'),$(this).valOfData('device'),$(this).valOfData('set'),$(this).valOfData('value')].join(' ');
    setFhemStatus(cmdl);
    ftui.toast(cmdl);
};
