/* FTUI Plugin
* Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*/

if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

$('head').append('<link rel="stylesheet" href="'+ dir + '/../css/ftui_departure.css" type="text/css" />');

var widget_departure = $.extend({}, widget_widget, {
    widgetname : 'departure',
    requestUpdate: function(elem) {
        var cmdl = [elem.data('cmd'),elem.data('device'),elem.data('get')].join(' ');
        setFhemStatus(cmdl);
        ftui.toast(cmdl);
    },
    init_attr : function(elem) {
        elem.initData('get'                     ,'STATE');
        elem.initData('cmd'                     ,'get');
        elem.initData('color'                   ,getClassColor(elem) || getStyle('.'+this.widgetname,'color') || '#222');
        elem.initData('background-color'        ,getStyle('.'+this.widgetname,'background-color')    || '#C0C0C0');
        elem.initData('icon-color'              ,getStyle('.'+this.widgetname,'icon-color')    || '#aa6900');
        elem.initData('text-color'              ,getStyle('.'+this.widgetname,'text-color')    || '#ddd');
        elem.initData('width'                   ,'200');
        elem.initData('height'                  ,'250');
        elem.initData('interval'                ,'120');

        elem.addReading('get');
     },
    init_ui : function(elem) {
        var base = this;
        var icon = elem.data('icon');
        var interval = elem.data('interval');

        // prepare container element
        elem.html('')
            .addClass('departure')
            .css({
                width: elem.data('width')+'px',
                maxWidth: elem.data('width')+'px',
                height: elem.data('height')+'px',
                color: elem.mappedColor('text-color'),
                backgroundColor: elem.mappedColor('background-color'),
        });

        // prepare icon
        var elemIcon=jQuery('<div/>', {
            class: 'icon',
        })
        .css({
            color: elem.mappedColor('icon-color'),
        })
        .prependTo(elem);
        if (icon)
            elemIcon.addClass('fa '+ icon +' fa-lg fa-fw');
        else
            elemIcon.html('H');

        // prepare station label element
        jQuery('<div/>', {
            class : 'station',
        })
        .text(elem.data('get'))
        .appendTo(elem);

        // prepare refresh element
        var elemRefresh = jQuery('<div/>', {
            class : 'refresh fa fa-refresh fa-fw',
        }).appendTo(elem);

        // prepare timestamp element
        jQuery('<div/>', {
            class : 'time',
        }).appendTo(elem);

        // prepare list header
        var text='&nbsp;<div class="header">';
        text+='<div class="line">Linie</div>';
        text+='<div class="destination">Richtung</div>';
        text+='<div class="minutes">in Min</div></div>';
        elem.append(text);

        // prepare list text element
        jQuery('<div/>', {
            class : 'listText',
        })
        .fadeOut()
        .appendTo(elem);

        // event handler
        elemRefresh.on('click',function(e) {
            base.requestUpdate.call(base,elem);
        });

        // init interval timer
        if ($.isNumeric(interval) && interval>0){
            setInterval(function () {
                base.requestUpdate.call(base,elem);
            }, Number(interval)*1000);
        }

        // first refresh
        base.requestUpdate(elem);
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
        // update from normal state reading
        this.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var list = elem.getReading('get').val;
            if (list) {
                var elemText = elem.find('.listText');
                elemText.fadeOut();
                var text = '';
                var collection = JSON.parse(list);
                for (var idx in collection) {
                    var line = collection[idx];
                    text+='<div class="connection">';
                    text+='<div class="line">'+line[0]+'</div>';
                    text+='<div class="destination">'+line[1]+'</div>';
                    text+='<div class="minutes">'+line[2]+'</div></div>';
                }
                elemText.html(text).fadeIn();
                var ts = elem.getReading('get').date;
                if (ts){
                    elem.find('.time').html(ts.toDate().hhmm());
                }
            }
         });

    },
});
