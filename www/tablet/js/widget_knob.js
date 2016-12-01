/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_knob() {
    if (!$.fn.knob)
        return ["lib/jquery.knob.mod.min.js"];
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

        elem.data('get', elem.data('get') || 'STATE');
        elem.data('set', elem.data('set') || '');
        elem.data('cmd', elem.data('cmd') || 'set');
        elem.data('set-value', elem.data('set-value') || '$v');
        elem.data('get-value', elem.data('get-value') || elem.data('part') || '-1');

        elem.data('min', elem.isValidData('min') ? elem.data('min') : 0);
        elem.data('max', elem.isValidData('max') ? elem.data('max') : 100);

        elem.data('height', elem.isValidData('height') ? elem.data('height') : 120);
        elem.data('width', elem.isValidData('width') ? elem.data('width') : 120);
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
        }

        elem.data('initvalue', elem.isValidData('initvalue') ? elem.data('initvalue') : 10);
        elem.data('step', elem.isValidData('step') ? elem.data('step') : 1);
        elem.data('angleoffset', elem.isValidData('angleoffset') ? elem.data('angleoffset') : -120);
        elem.data('anglearc', elem.isValidData('anglearc') ? elem.data('anglearc') : 240);

        elem.data('bgcolor', elem.data('bgcolor') || ftui.getStyle('.' + me.widgetname, 'background-color') || '#505050');
        elem.data('fgcolor', elem.data('fgcolor') || ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname, 'color') || '#aa6900');
        elem.data('inputcolor', elem.data('inputcolor') || ftui.getStyle('.' + me.widgetname + '.input', 'color') || '#ffffff');
        elem.data('hdcolor', elem.data('hdcolor') || ftui.getStyle('.' + me.widgetname + '.handle', 'color') || '#666');

        elem.data('font', elem.data('font') || ftui.getStyle('.' + me.widgetname, 'font-family') || '"Helvetica Neue", "Helvetica", "Open Sans", "Arial", sans-serif');
        elem.data('font-weight', elem.data('font-weight') || ftui.getStyle('.' + me.widgetname, 'font') || 'normal');

        elem.initData('unit', '');
        elem.initData('lock', elem.data('readonly-get'));

        me.addReading(elem, 'get');
        me.addReading(elem, 'lock');
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
                'thickness': (elem.hasClass('mini')) ? 0.45 : 0.25,
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
                'touchPosition': elem.data('touchposition') || 'left',
                'draw': me.drawDial,
                'readOnly': elem.hasClass('readonly'),
                'change': me.onChange,
                'release': me.onRelease,
                'format': me.onFormat,
            });
        }
        return elem;
    }

    function update_lock(dev, par) {
        me.elements.filterDeviceReading('lock', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var val = elem.getReading('lock').val;
                if (val) {
                    var knob_elem = elem.find('input');
                    if (knob_elem) {
                        ftui.log(3, me.widgetname + ' dev:' + dev + ' par:' + par + ' change ' + elem.data('device') + ':readOnly to ' + val);
                        knob_elem.trigger('configure', {
                            'readOnly': (val === 'true' || val === '1' || val === 'on')
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

        me.update_lock(dev, par);

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