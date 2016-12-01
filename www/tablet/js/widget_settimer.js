/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * originally created by Thomas Nesges,
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_volume:true */

"use strict";

function depends_settimer() {

    var ret = [];
    if (typeof Modul_volume == 'undefined') {
        ret.push("volume");
    }

    if (typeof Module_famultibutton == 'undefined') {
        ret.push("famultibutton");
    }
    return ret;
}

var Modul_settimer = function () {

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.initData('get', elem.data('reading') || 'STATE');
            elem.initData('set', elem.data('reading'));
            elem.initData('cmd', elem.data('reading') ? 'setreading' : 'set');
            elem.initData('set-off', elem.data('off') || 'off');
            elem.initData('get-off', elem.data('set-off'));
            elem.initData('running-get', 'STATE');
            elem.initData('running-get-on', 'running');
            elem.initData('running-blink', true);
            elem.initData('running-color', '#0069aa');
            elem.initData('running-set-off', elem.data('set-off'));
            elem.initData('width', (elem.attr('data-width') ? elem.data('width') : (elem.hasClass('large') ? 520 : 380)));

            me.addReading(elem, 'get');
            me.addReading(elem, 'running-get');

            var container = $('<div style="position:relative;' + ($.isNumeric(elem.data('width')) ? 'width:' + elem.data('width') + 'px' : '') + ';min-height:60px;" class="widget_' + me.widgetname + '_container"/>').appendTo(elem);

            var buttons = $('<div style="position:absolute;top:0;right:0;margin-top:5px;margin-right:25px" class="widget_' + me.widgetname + '_buttons" />').appendTo(container);
            var button_set = $('<div class="widget_' + me.widgetname + '_set" style="display:block" />').appendTo(buttons);
            var button_off = $('<div class="widget_' + me.widgetname + '_off" style="display:block" />').appendTo(buttons);

            var knobs = $('<div style="position:absolute;top:0;left:0;margin-top:5px;margin-left:20px" class="widget_' + me.widgetname + '_knobs" />').appendTo(container);
            var knob_hour_wrap = $('<div class="widget_' + me.widgetname + '_hour_wrap" style="display:inline;margin-right:10px !important" />').appendTo(knobs);
            var knob_hour = $('<input class="widget_' + me.widgetname + '_hour" />', {
                type: 'text',
                value: elem.attr('data-initvalue') || '0',
                disabled: true,
            }).appendTo(knob_hour_wrap);

            var knob_min_wrap = $('<div class="widget_' + me.widgetname + '_hour_wrap" style="display:inline;margin-left:10px !important" />').appendTo(knobs);
            var knob_min = $('<input class="widget_' + me.widgetname + '_minute" />', {
                type: 'text',
                value: elem.attr('data-initvalue') || '0',
                disabled: true,
            }).appendTo(knob_min_wrap);


            knob_hour.knob({
                'min': 0,
                'max': 23,
                'lastValue': 0,
                'height': elem.hasClass('large') ? 180 : 120,
                'width': elem.hasClass('large') ? 180 : 120,
                'angleOffset': elem.attr('data-angleoffset') ? elem.attr('data-angleoffset') * 1 : -120,
                'angleArc': elem.attr('data-anglearc') ? elem.attr('data-anglearc') * 1 : 240,
                'bgColor': elem.data('bgcolor') || 'transparent',
                'fgColor': elem.data('fgcolor') || '#cccccc',
                'tkColor': elem.data('tkcolor') || 'DimGray',
                'hdColor': elem.data('hdcolor') || '#aa6900',
                'thickness': 0.25,
                'tickdistance': 20,
                'cursor': 6,
                'touchPosition': 'left',
                'draw': me.drawDial,
                'readOnly': elem.hasClass('readonly'),
            });
            knob_min.knob({
                'min': 0,
                'max': 59,
                'lastValue': 0,
                'height': elem.hasClass('large') ? 180 : 120,
                'width': elem.hasClass('large') ? 180 : 120,
                'angleOffset': elem.attr('data-angleoffset') ? elem.attr('data-angleoffset') * 1 : -120,
                'angleArc': elem.attr('data-anglearc') ? elem.attr('data-anglearc') * 1 : 240,
                'bgColor': elem.data('bgcolor') || 'transparent',
                'fgColor': elem.data('fgcolor') || '#cccccc',
                'tkColor': elem.data('tkcolor') || 'DimGray',
                'hdColor': elem.data('hdcolor') || '#aa6900',
                'thickness': 0.25,
                'tickdistance': 10,
                'cursor': 6,
                'touchPosition': 'left',
                'draw': me.drawDial,
                'readOnly': elem.hasClass('readonly'),
            });

            button_set.famultibutton({
                backgroundIcon: 'fa-circle',
                offBackgroundColor: '#aa6900',
                icon: 'fa-clock-o',
                offColor: '#2a2a2a',
                mode: 'push',
                // Called in toggle on state.
                toggleOn: function () {
                    var knob_hour = elem.find('input[class=widget_' + me.widgetname + '_hour]');
                    var knob_min = elem.find('input[class=widget_' + me.widgetname + '_minute]');
                    var hour = knob_hour.val() * 1;
                    var min = knob_min.val() * 1;

                    hour = hour < 10 ? '0' + hour : hour;
                    min = min < 10 ? '0' + min : min;

                    var v = hour + ':' + min;
                    if (hour == elem.data('get-off') || min == elem.data('get-off')) {
                        v = elem.data('set-off');
                    }

                    elem.data('value', v);
                    elem.transmitCommand();
                },
            });

            button_off.famultibutton({
                backgroundIcon: 'fa-circle',
                icon: 'fa-power-off',
                mode: 'push',
                // Called in toggle on state.
                toggleOn: function () {
                    var val = elem.getReading('running-get').val;
                    var setoff;
                    if (val && val == elem.data('running-get-on')) {
                        setoff = elem.data('running-set-off');
                    } else {
                        setoff = elem.data('set-off');
                    }

                    elem.data('value', setoff);
                    elem.transmitCommand();
                },
            });
            button_off.data('off-background-color', button_off.find('#bg').css('color'));
        });
    }

    function update(dev, par) {

        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var val = elem.getReading('get').val;
                var button_off = elem.find('.widget_settimer_off');
                var button_off_bg = button_off.find('#bg');

                var knob_hour = elem.find('input[class=widget_' + me.widgetname + '_hour]');
                var knob_min = elem.find('input[class=widget_' + me.widgetname + '_minute]');
                if (val) {
                    var v = val.split(':');
                    var hour = v[0];
                    var min = v[1];

                    if (hour == elem.data('get-off')) {
                        hour = min = 'off';
                    }
                    if (hour == elem.data('running-set-off') && hour != elem.data('get-off')) {
                        hour = min = '#';
                    }

                    var running = elem.getReading('running-get').val;
                    if (running == elem.data('running-get-on')) {
                        hour = min = '!';
                    }

                    if (knob_hour.val() != hour) {
                        knob_hour.val(hour).trigger('change');
                        knob_hour.val(hour);
                    }
                    if (knob_min.val() != min) {
                        knob_min.val(min).trigger('change');
                        knob_min.val(min);
                    }
                }
                knob_hour.css({
                    visibility: 'visible'
                });
                knob_min.css({
                    visibility: 'visible'
                });
            });

        //extra reading for dynamic color
        me.elements.filterDeviceReading('running-get', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var button_off = elem.find('.widget_settimer_off');
                var button_off_bg = button_off.find('#bg');
                var val = elem.getReading('running-get').val;
                if (val && val == elem.data('running-get-on')) {
                    button_off_bg.css('color', elem.data('running-color'));
                    if (elem.data('running-blink')) {
                        button_off.addClass('blink');
                    }
                } else {
                    button_off_bg.css('color', button_off.data('off-background-color'));
                    button_off.removeClass('blink');
                }
            });
    }


    // public
    // inherit members from base class
    var me = $.extend(new Modul_volume(), {
        //override members
        widgetname: 'settimer',
        init: init,
        update: update
    });

    return me;
};