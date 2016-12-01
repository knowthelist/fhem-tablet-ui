/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * originally created by Thomas Nesges
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

var Modul_klimatrend = function () {

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.initData('get', elem.data('get') || 'statTemperatureTendency');
            me.addReading(elem, 'get');
        });
    }

    function update(dev, par) {

        var deviceElements = me.elements.filter('div[data-device="' + dev + '"]');
        deviceElements.each(function (index) {

            if ($(this).data('get') == par || par == '*') {
                var value = $(this).getReading('get').val;
                if (value) {
                    var part = 0;
                    if ($(this).data('refperiod')) {
                        if (String($(this).data('refperiod')).match(/^[123]$/)) {
                            part = $(this).data('refperiod') * 2;
                        } else if ($(this).data('refperiod') == "6") {
                            part = 8;
                        } else {
                            part = -1;
                            console.log("ERROR: data-refperiod='" + $(this).data('refperiod') + "' is invalid");
                        }
                    }
                    if (part === 0) {
                        if ($(this).data('part')) {
                            if (String($(this).data('part')).match(/^[2468]$/)) {
                                part = $(this).data('part');
                            } else {
                                console.log("ERROR: data-part='" + $(this).data('part') + "' is invalid");
                            }
                        } else {
                            part = 2;
                        }
                    }

                    var timespan = ftui.getPart(value, part - 1);
                    var text = ftui.getPart(value, part).replace(/[\r\n]+$/, '');
                    var number = 1 * text.replace(/[^0-9.]/g, '');
                    var sign = text.replace(/^([+-]).*/, '$1');
                    var reading = $(this).data('get');
                    var highmark = 99;
                    if ($(this).data('highmark')) {
                        highmark = $(this).data('highmark');
                    } else {
                        if (reading.match(/humidity/i)) {
                            highmark = 5;
                        } else if (reading.match(/temp/i)) {
                            highmark = 1;
                        }
                    }
                    var icon = $(this).data("icon") || "fa-angle";
                    var stagnatingColor = $(this).data("stagnating-color") || '#808080';
                    var risingColor = $(this).data("rising-color") || 'firebrick';
                    var fallingColor = $(this).data("falling-color") || 'cornflowerblue';

                    if (number >= highmark) {
                        icon = $(this).data("highmark-icon") || "fa-angle-double";
                        risingColor = $(this).data("highmark-rising-color") || 'firebrick';
                        fallingColor = $(this).data("highmark-falling-color") || 'cornflowerblue';
                    }

                    $(this).text('');
                    if (text.match(/^-\s/)) {
                        $(this).text(' - ');
                    } else if (number === 0) {
                        $(this).prepend('<span style="color:' + stagnatingColor + '" title="' + timespan + ' ' + text + '"> = </span>');
                    } else if (sign == "+") {
                        $(this).prepend('<i id="fg" class="fa ' + icon + '-up" style="color:' + risingColor + ';" title="' + timespan + ' ' + text + '"></i>');
                    } else if (sign == "-") {
                        $(this).prepend('<i id="fg" class="fa ' + icon + '-down" style="color:' + fallingColor + ';" title="' + timespan + ' ' + text + '"></i>');
                    }
                }
            }
        });
    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_widget(), {
        //override members
        widgetname: 'klimatrend',
        init: init,
        update: update,
    });

    return me;
};