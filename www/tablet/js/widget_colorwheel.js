/* FTUI Plugin
* Copyright (c) 2015 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*/

if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

if (!$.fn.farbtastic){
    dynamicload('lib/farbtastic.js', null, null, false);
}

$('head').append('<link rel="stylesheet" href="'+ dir + '/../css/ftui_colorwheel.css" type="text/css" />');

var widget_colorwheel = $.extend({}, widget_widget, {
    widgetname : 'colorwheel',
    onChange : function(elem,color) {
        elem.find('.colorIndicator').css({
          backgroundColor: color,
        });
    },
    onRelease: function(elem,color) {
        var val = color.replace('#','');
        var cmdl = [elem.data('cmd'),elem.data('device'),elem.data('set'),val].join(' ');
        setFhemStatus(cmdl);
        TOAST && $.toast(cmdl);
    },
    init_attr : function(elem) {
        elem.initData('get'     ,'STATE');
        elem.initData('set'     , '');
        elem.initData('cmd'     ,'set');
        elem.initData('width'   ,150);
        if(elem.hasClass('big')) { elem.data('width', 210);}
        if(elem.hasClass('large')) { elem.data('width', 150);}
        if(elem.hasClass('small')) { elem.data('width', 100);}
        if(elem.hasClass('mini')) { elem.data('width', 52);}
        elem.addReading('get');
    },
    init_ui : function(elem) {
        var base = this;
        var colorArea =  jQuery('<div/>', {
            class: 'colorArea',
        });
        var colorIndicator =  jQuery('<div/>', {
            class: 'colorIndicator',
        }).appendTo(colorArea);
        var colorWheel =  jQuery('<div/>', {
            class: 'colorWheel',
        })
        .css({width: elem.data('width'),})
        .appendTo(colorArea);
        var farbtastic = $.farbtastic(colorWheel,{
          width: elem.data('width'),
          callback: function (color) {base.onChange(elem,color);},
          release: function (color)  {base.onRelease(elem,color);},
        });
        elem.append(colorArea);

        return elem;
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            base.init_ui($(this));
        });
    },
    update: function (dev,par) {
        var base = this;
        this.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var value = elem.getReading('get').val;
            var color = elem.find('.colorWheel');
            if (value && color) {
                if ( elem.data('isInit') ){
                    $.farbtastic(color).setColor('#'+value);
                }
                else{
                    setTimeout(function(){
                        elem.data('isInit',true);
                        $.farbtastic(color).setColor('#'+value);
                    }, 2000);
                }
            }
        });
    }
});
