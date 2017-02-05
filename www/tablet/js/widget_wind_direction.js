/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * originally created by Thomas Nesges, idea by michiatlnx
 * http://forum.fhem.de/index.php/topic,34233.msg281124.html#msg281124
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_volume:true */

"use strict";

function depends_wind_direction() {
    if (typeof Modul_volume == 'undefined' || !$.fn.knob) {
        return ["volume"];
    }
}

var Modul_wind_direction = function () {

    var isUpdating = false;

    function onRelease(v) {}

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);

            // height and width can't be different
            elem.data('size', 1 * elem.attr('data-height') || 1 * elem.attr('data-width') || 1 * elem.attr('data-size') || 150);
            if (elem.hasClass('small')) {
                elem.data('size', 100);
            } else if (elem.hasClass('mini')) {
                elem.data('size', 52);
            } else if (elem.hasClass('tiny')) {
                elem.data('size', 12);
            }

            elem.addClass('readonly');
            elem.initData('height', elem.data('size'));
            elem.initData('width', elem.data('size'));
            elem.initData('angleoffset', 0);
            elem.initData('anglearc', 360);
            elem.initData('lang', ftui.config.lang);
            elem.initData('tickstep', elem.hasClass('tiny') ? 90 : 45);
            elem.initData('thickness', elem.hasClass('tiny') ? 0.5 : 0.25);
            elem.initData('cursor', elem.hasClass('tiny') ? 18 : 6);
            elem.initData('bgcolor', 'transparent');
            elem.initData('fgcolor', '#cccccc');
            elem.initData('tkcolor', '#696969');
            elem.initData('hdcolor', '#aa6900');
            elem.initData('direction', elem.data('get') || 'wind_direction');
            elem.initData('speed', 'wind_speed');
            elem.initData('min', 0);
            elem.initData('max', 360);
            elem.data('compass', {
                "N": 0, // 360/16 * 0
                "NNO": 22.5, // 360/16 * 1
                "NO": 45, // 360/16 * 2
                "ONO": 67.5, // 360/16 * 3
                "O": 90, // 360/16 * 4
                "OSO": 112.5, // ...
                "SO": 135,
                "SSO": 157.5,
                "S": 180,
                "SSW": 202.5,
                "SW": 225,
                "WSW": 247.5,
                "W": 270,
                "WNW": 292.5,
                "NW": 315,
                "NNW": 337.5,
                "N2": 360
            });
            elem.data('compass_en', {
                "N": 0, // 360/16 * 0
                "NNE": 22.5, // 360/16 * 1
                "NE": 45, // 360/16 * 2
                "ENE": 67.5, // 360/16 * 3
                "E": 90, // 360/16 * 4
                "ESE": 112.5, // ...
                "SE": 135,
                "SSE": 157.5,
                "S": 180,
                "SSW": 202.5,
                "SW": 225,
                "WSW": 247.5,
                "W": 270,
                "WNW": 292.5,
                "NW": 315,
                "NNW": 337.5,
                "N2": 360
            });


            me.addReading(elem, 'direction');
            me.addReading(elem, 'speed');

            me.init_attr(elem);
            me.init_ui(elem);
        });
    }

    function update(dev, par) {
        isUpdating = true;
        me.elements.filterDeviceReading('direction', dev, par)
            .add(me.elements.filterDeviceReading('speed', dev, par))
            .each(function (index) {
                var elem = $(this);
                var value = elem.getReading('direction').val;
                var part = elem.data('part') || elem.data('direction-part') || -1;
                var val = ftui.getPart(value, part);
                var lang = elem.attr('data-lang');
                var speed = elem.getReading('speed').val;
                var speed_part = elem.data('speed-part') || -1;
                speed = ftui.getPart(speed, part);

                var knob_elem = elem.find('input');
                if (val) {
                    var compass;
                    if (lang == "en") {
                        compass = elem.data('compass_en');
                    } else {
                        compass = elem.data('compass');
                    }

                    if (!$.isNumeric(val)) {
                        // if the reading is something like 'NNO', fetch it's numerical representation from compass
                        val = (val in compass ? compass[val] : -1);
                    }
                    if (knob_elem.val() != val) {
                        // set value and redraw
                        knob_elem.val(val).trigger('change');
                    }
                    if (elem.hasClass('tiny')) {
                        // don't display val in the middle of the widget
                        knob_elem.val('');
                    } else {
                        var valt = 'WTF';
                        if (val < 0) {
                            valt = 'ERR';
                            console.log('wind_direction', (elem.attr('data-device') ? '(' + elem.attr('data-device') + ')' : '') + ': ' + ftui.getPart(value, part) + ' is invalid');
                        } else if (!speed || speed === 0) {
                            valt = elem.data('calm') || '-';
                        } else {
                            if (!elem.data('display-numeric')) {
                                // search compass for the literal representation to val
                                var ckeys = Object.keys(compass);
                                for (var k = 0; k < ckeys.length; k++) {
                                    var key = ckeys[k];
                                    var kev = compass[key];
                                    // the compass is divided into 16 sections, which are split into 11,25 degrees before val and 11,25 degrees after val
                                    // iow: val is the middle of a 22,5 degree wide section of the compass
                                    if (val > kev - 360 / 32 && val <= kev + 360 / 32) {
                                        valt = key;
                                        break;
                                    }
                                }
                            } else {
                                valt = val;
                            }
                        }
                        knob_elem.val(valt == "N2" ? "N" : valt);
                    }
                }
                knob_elem.css({
                    visibility: 'visible'
                });
            });
        isUpdating = false;
    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_volume(), {
        //override members
        widgetname: 'wind_direction',
        init: init,
        update: update,
        onRelease: onRelease
    });

    return me;
};