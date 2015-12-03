var widget_widget = {
    widgetname : 'widget',
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
     if (!rgb) return null;
     var tokens = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
     return (tokens && tokens.length === 4) ? "#" +
      ("0" + parseInt(tokens[1],10).toString(16)).slice(-2) +
      ("0" + parseInt(tokens[2],10).toString(16)).slice(-2) +
      ("0" + parseInt(tokens[3],10).toString(16)).slice(-2) : null;
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
    return $(this).data(key).match(/:/);
};
$.fn.addReading = function(key) {
    initReadingsArray($(this).data(key));
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
