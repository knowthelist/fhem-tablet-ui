/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_colorwheel() {
    if (!$.fn.farbtastic) {
        $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'css/ftui_colorwheel.css" type="text/css" />');
        return [ftui.config.basedir + "lib/farbtastic.min.js"];
    }
}

var Modul_colorwheel = function () {

    function onChange(elem, color) {
        elem.find('.colorIndicator').css({
            backgroundColor: color,
        });
    }

    function onRelease(elem, color) {
        ftui.log(2,me.widgetname + ' set color to:' + color);
        var value = (typeof color === 'string') ? color.replace('#', '') : color;
        elem.data('value', value);
        elem.transmitCommand();
    }

    function init_attr(elem) {
        elem.initData('get', 'STATE');
        elem.initData('set', '');
        elem.initData('cmd', 'set');
        elem.initData('width', 150);
        if (elem.hasClass('big')) {
            elem.data('width', 210);
        }
        if (elem.hasClass('large')) {
            elem.data('width', 150);
        }
        if (elem.hasClass('small')) {
            elem.data('width', 100);
        }
        if (elem.hasClass('mini')) {
            elem.data('width', 52);
        }
        elem.initData('mode', 'rgb');
        me.addReading(elem, 'get');
    }

    function init_ui(elem) {
        var colorArea = $('<div/>', {
            class: 'colorArea',
        });
        var colorIndicator = $('<div/>', {
            class: 'colorIndicator',
        }).appendTo(colorArea);
        var colorWheel = $('<div/>', {
                class: 'colorWheel',
            })
            .css({
                width: elem.data('width'),
            })
            .appendTo(colorArea);
        var farbtastic = $.farbtastic(colorWheel, {
            width: elem.data('width'),
            mode: elem.data('mode'),
            callback: function (color) {
                onChange(elem, color);
            },
            release: function (color) {
                onRelease(elem, color);
            },
        });
        elem.append(colorArea);

        return elem;
    }

    function update(dev, par) {

        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.getReading('get').val;
                var color = elem.find('.colorWheel');
                if (value && color) {
                    if (elem.data('isInit')) {
                        $.farbtastic(color).setColor('#' + value);
                    } else {
                        setTimeout(function () {
                            elem.data('isInit', true);
                            $.farbtastic(color).setColor('#' + value);
                        }, 2000);
                    }
                }
            });
    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_widget(), {
        //override members
        widgetname: 'colorwheel',
        init_ui: init_ui,
        init_attr: init_attr,
        update: update,
    });

    return me;
};