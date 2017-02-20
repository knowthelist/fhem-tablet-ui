/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_knob() {
    if (!$.fn.knob)
        return [ftui.config.basedir + "lib/jquery.knob.mod.min.js"];
}

var Modul_knob = function () {

    var isUpdating = false;
    var onChange = null;

    function onRelease(v) {
        /*jshint validthis: true */
        if (!isUpdating) {
            var device = this.$.data('device');
            if (typeof device != 'undefined') {
                var val = this.o.setValue.replace('$v', v.toString());
                var cmdl = [this.o.cmd, device, this.o.set, val].join(' ');
                ftui.setFhemStatus(cmdl);
                ftui.toast(cmdl);
            }
        }
    }

    function onFormat(v) {
        /*jshint validthis: true */
        //fix digits count
        var ret = (this.step < 1) ? Number(v).toFixed(1) : v;
        return (this.unit) ? ret + window.unescape(this.unit) : ret;
    }

    function init_attr(elem) {

        elem.initData('get', 'STATE');
        elem.initData('set', '');
        elem.initData('cmd', 'set');
        elem.initData('set-value', '$v');
        elem.initData('get-value', elem.data('part') || '-1');

        elem.initData('min', 0);
        elem.initData('max', 100);


        if (elem.hasClass('bigger')) {
            elem.data('height', 260);
            elem.data('width', 260);
        }
        if (elem.hasClass('big')) {
            elem.data('height', 210);
            elem.data('width', 210);
        }
        if (elem.hasClass('large')) {
            elem.data('height', 150);
            elem.data('width', 150);
        }
        if (elem.hasClass('small')) {
            elem.data('height', 100);
            elem.data('width', 100);
        }
        if (elem.hasClass('mini')) {
            elem.data('height', 52);
            elem.data('width', 52);
            elem.data('thickness', 0.45);
        }

        elem.initData('height', 120);
        elem.initData('width', 120);

        elem.initData('initvalue', 10);
        elem.initData('thickness', 0.25);
        elem.initData('step', 1);
        elem.initData('angleoffset', -120);
        elem.initData('anglearc', 240);

        elem.initData('bgcolor', ftui.getStyle('.' + me.widgetname, 'background-color') || '#505050');
        elem.initData('fgcolor', ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname, 'color') || '#aa6900');
        elem.initData('inputcolor', ftui.getStyle('.' + me.widgetname + '.input', 'color') || '#ffffff');
        elem.initData('hdcolor', ftui.getStyle('.' + me.widgetname + '.handle', 'color') || '#666');

        elem.initData('font', ftui.getStyle('.' + me.widgetname, 'font-family') || '"Helvetica Neue", "Helvetica", "Open Sans", "Arial", sans-serif');
        elem.initData('font-weight', ftui.getStyle('.' + me.widgetname, 'font') || 'normal');

        elem.initData('unit', '');

        me.addReading(elem, 'get');

        // if lock reading is defined, set defaults for comparison
        if (elem.isValidData('lock')) {
            elem.initData('lock-on', 'true|1|on');
        }
        elem.initData('lock', elem.data('get'));
        if (elem.isValidData('lock-on')) {
            elem.initData('lock-off', '!on');
        }
        me.addReading(elem, 'lock');

        // reachable parameter
        elem.initData('reachable-on', '!off');
        elem.initData('reachable-off', 'false|0');
        me.addReading(elem, 'reachable');
    }

    function init_ui(elem) {
        var knob_elem = $('<input/>', {
                type: 'text',
                value: elem.data('initvalue'),
                disabled: true,
            }).data(elem.data())
            .appendTo(elem);
        if (knob_elem) {
            knob_elem.knob({
                'min': elem.data('min'),
                'max': elem.data('max'),
                'step': 1 * elem.data('step') || 1,
                'height': elem.data('height'),
                'width': elem.data('width'),
                'variance': Math.floor(elem.data('max') / 5),
                'origmax': elem.data('origmax'),
                'bgColor': elem.data('bgcolor'),
                'fgColor': elem.data('fgcolor'),
                'tkColor': elem.data('tkcolor'),
                'hdColor': elem.data('hdcolor'),
                'inputColor': elem.data('inputcolor'),
                'minColor': elem.data('mincolor'),
                'maxColor': elem.data('maxcolor'),
                'thickness': elem.data('thickness'),
                'tickdistance': elem.data('tickstep'),
                'lastvalue': 0,
                'displayInput': elem.data('displayinput'),
                'angleOffset': elem.data('angleoffset'),
                'angleArc': elem.data('anglearc'),
                'cmd': elem.data('cmd'),
                'set': elem.data('set'),
                'mode': elem.data('mode'),
                'cursor': elem.data('cursor'),
                'unit': elem.data('unit'),
                'setValue': elem.data('set-value'),
                'touchPosition': elem.data('touchposition') || elem.data('touch-position') || 'left',
                'draw': me.drawDial,
                'readOnly': elem.hasClass('readonly'),
                'change': me.onChange,
                'release': me.onRelease,
                'format': me.onFormat,
            });
            elem.append($('<div/>', {
                class: 'overlay'
            }));
        }
        return elem;
    }

    function update_lock(dev, par) {
        me.elements.filterDeviceReading('lock', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var value = elem.getReading('lock').val;
                var knob_elem = elem.find('input');
                if (knob_elem) {
                    if (elem.matchingState('lock', value) === 'on') {
                        knob_elem.trigger('configure', {
                            'readOnly': true
                        });
                    }
                    if (elem.matchingState('lock', value) === 'off') {
                        knob_elem.trigger('configure', {
                            'readOnly': false
                        });
                    }
                }
            });
    }


    function update(dev, par) {
        isUpdating = true;

        // update from desired temp reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.getReading('get').val;
                if (value) {
                    var knob_elem = elem.find('input');
                    if (knob_elem) {
                        var part = elem.data('get-value');
                        var val = ftui.getPart(value, part);
                        if (knob_elem.val() != val) {
                            knob_elem.val(val).trigger('change');
                            ftui.log(3, me.widgetname + ' dev:' + dev + ' par:' + par + ' change ' + elem.data('device') + ':knob to ' + val);
                        }
                        knob_elem.css({
                            visibility: 'visible'
                        });
                    }
                }
            });

        // update from lock reading
        me.update_lock(dev, par);

        //extra reading for reachable
        me.update_reachable(dev, par);

        isUpdating = false;
    }


    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'knob',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
        update_lock: update_lock,
        onRelease: onRelease,
        onChange: onChange,
        onFormat: onFormat
    });

    return me;
};