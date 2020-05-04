/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_knob:true */

"use strict";

function depends_volume() {
    return ["knob"];
}

var Modul_volume = function () {

    var isUpdating = false;

    function drawDial() {

        /*jshint validthis: true */
        var c = this.g, // context
            a = this.arc(this.cv), // Arc
            r = 1;

        c.clearRect(0, 0, this.w, this.h);
        c.lineWidth = this.lineWidth;
        c.lineCap = this.lineCap;
        if ((this.o.mode >> 0) % 2 !== 0) {
            this.o.bgColor = 'hsl(' + this.cv + ',50%,50% )';
        } else if ((this.o.mode >> 3) % 2 !== 0) {
            var cl = Math.floor(this.cv * (255 / this.o.max));
            this.o.bgColor = 'rgb(' + cl + ',' + cl + ',' + cl + ')';
        }
        if (this.o.bgColor !== "none") {
            c.beginPath();
            c.strokeStyle = this.o.bgColor;
            c.arc(this.xy, this.xy, this.radius, this.endAngle - 0.00001, this.startAngle + 0.00001, true);
            c.stroke();
        }

        var tick_w = (2 * Math.PI) / 360;
        var step = (this.o.max - this.o.min) / this.angleArc;
        var acAngle = ((this.o.isValue - this.o.min) / step) + this.startAngle;
        var dist = this.o.tickdistance || 4;

        // draw ticks
        for (var tick = this.startAngle; tick < this.endAngle + 0.00001; tick += tick_w * dist) {
            var i = step * (tick - this.startAngle) + this.o.min;
            var w = tick_w;

            c.beginPath();

            if ((this.o.mode >> 1) % 2 !== 0) {
                // draw ticks in hue color
                c.strokeStyle = 'hsl(' + i + ',50%,50% )';
            } else if ((this.o.mode >> 4) % 2 !== 0) {
                var clr = Math.floor(i * (255 / this.o.max));
                c.strokeStyle = 'rgb(' + clr + ',' + clr + ',' + clr + ')';
            } else {
                // draw normal ticks
                c.strokeStyle = this.o.fgColor; //'#4477ff';
            }

            // thicker lines every 5 ticks
            if (Math.round(i * 10) / 10 % 5 === 0) {
                w = tick_w * 2.2;
                w *= (c.strokeStyle != this.o.fgColor) ? 1.5 : 1;
            } else {
                w *= (c.strokeStyle != this.o.fgColor) ? 2 : 1;
            }

            c.arc(this.xy, this.xy, this.radius, tick, tick + w, false);
            c.stroke();
        }

        // draw selection cursor
        c.beginPath();
        if ((this.o.mode >> 2) % 2 !== 0) {
            this.o.hdColor = 'hsl(' + this.cv + ',50%,50% )';
        } else if ((this.o.mode >> 5) % 2 !== 0) {
            var cls = Math.floor(this.cv * (255 / this.o.max));
            this.o.hdColor = 'rgb(' + cls + ',' + cls + ',' + cls + ')';
        }

        c.strokeStyle = this.o.hdColor;
        c.lineWidth = this.lineWidth * 2;
        c.arc(this.xy, this.xy, this.radius - this.lineWidth / 2, a.s, a.e, a.d);
        c.stroke();

        return false;
    }

    function onChange(v) {

        /*jshint validthis: true */
        if (v > this.o.max - this.o.variance && this.o.lastValue < this.o.min + this.o.variance) {
            this.i.val(this.o.min).change();
            return false;
        } else if (v < this.o.min + this.o.variance && this.o.lastValue > this.o.max - this.o.variance) {
            this.i.val(this.o.max).change();
            return false;
        }
        this.o.lastValue = v;
    }

    function onRelease(v) {

        /*jshint validthis: true */
        if (!isUpdating) {
            if ((this.o.mode >> 6) % 2 !== 0) {
                //send hex rbg value
                v = ftui.hslToRgb(v / this.o.max, 1.0, 0.5);
            } else {
                //send decimal value
                v = v * (this.o.origmax / this.o.max);
                v = (this.step < 1) ? Number(v).toFixed(1) : Number(v).toFixed(0);
            }
            var device = this.$.data('device');
            if (typeof device != 'undefined') {
                var val = this.o.setValue.replace('$v', v.toString());
                var cmdl = [this.o.cmd, device, this.o.set, val].join(' ');
                ftui.setFhemStatus(cmdl);
                ftui.toast(cmdl);
            }
            this.$.data('curval', v);
        }
    }

    function onFormat(v) {

        /*jshint validthis: true */
        //fix digits count
        var ret = (this.step < 1) ? Number(v).toFixed(1) : v;
        return (this.unit) ? ret + window.unescape(this.unit) : ret;
    }

    function actualSettings(elem) {

            var hdDefaultColor = ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname + '.handle', 'color') || '#aa6900';
            if (elem.hasClass('hue-back')) {
                hdDefaultColor = '#cccccc';
            }
            if (elem.hasClass('hue-tick')) {
                hdDefaultColor = '#bbbbbb';
            }
            elem.reinitData('fgcolor', ftui.getStyle('.' + me.widgetname, 'color') || '#666');
            elem.reinitData('bgcolor', ftui.getStyle('.' + me.widgetname, 'background-color') || 'none');
            elem.reinitData('nomcolor', ftui.getStyle('.' + me.widgetname + '.nominal', 'color') || '#999');
            elem.reinitData('hdcolor', hdDefaultColor);
        
        return {
            'fgColor': elem.data('fgcolor'),
            'bgColor': elem.data('bgcolor'),
            'hdColor': elem.data('hdcolor'),
            'nomColor': elem.data('nomcolor')
        };
    }

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");

            var maxval = elem.isValidData('max') ? elem.data('max') : 70;
            elem.data('origmax', maxval);
            elem.data('max', (maxval > 360) ? 360 : maxval);
            elem.initData('fgcolor', ftui.getStyle('.' + me.widgetname, 'color') || '#666');
            elem.initData('get-value', elem.data('get-value') || elem.data('part') || '-1');

            var mode = 0; //no hue colors
            var hdDefaultColor = ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname + '.handle', 'color') || '#aa6900';
            if (elem.hasClass('hue-back')) {
                mode = mode | 1 << 0;
                hdDefaultColor = '#cccccc';
            }
            if (elem.hasClass('hue-tick')) {
                mode = mode | 1 << 1;
                hdDefaultColor = '#bbbbbb';
            }
            if (elem.hasClass('hue-front')) {
                mode = mode | 1 << 2;
            }

            if (elem.hasClass('dim-back')) {
                mode = mode | 1 << 3;
            }
            if (elem.hasClass('dim-tick')) {
                mode = mode | 1 << 4;
            }
            if (elem.hasClass('dim-front')) {
                mode = mode | 1 << 5;
            }
            if (elem.hasClass('rgb')) {
                mode = mode | 1 << 6;
            }
            elem.data('mode', mode);
            elem.initData('fgcolor', ftui.getStyle('.' + me.widgetname, 'color') || '#666');
            elem.initData('bgcolor', ftui.getStyle('.' + me.widgetname, 'background-color') || 'none');
            elem.initData('hdcolor', hdDefaultColor);
            elem.initData('tickstep', (((mode >> 1) % 2 !== 0) ? 4 : 20));
            elem.initData('cursor', 6);
            elem.initData('height', 160);
            elem.initData('width', 160);

            me.init_attr(elem);
            me.init_ui(elem);
        });
    }

    function update(dev, par) {

        isUpdating = true;

        me.elements.each(function (index) {
            var elem = $(this);

            // update from desired temp reading
            if (elem.matchDeviceReading('get', dev, par)) {
                var value = elem.getReading('get').val;
                if (ftui.isValid(value)) {
                    var knob_elem = elem.find('input');
                    if (knob_elem) {
                        var part = elem.data('get-value');
                        var val = ftui.getPart(value, part);
                        if ((parseInt(elem.data('mode')) >> 6) % 2 !== 0) {
                            //is hex rgb

                            val = ftui.rgbToHsl(val)[0];
                            val = val * elem.data('max');
                        } else {
                            //is decimal value
                            val = (val * (elem.data('max') / elem.data('origmax')));
                            val = (elem.data('step') < 1) ? Number(val).toFixed(1) : val;
                        }
                        if (knob_elem.val() != val) {
                            knob_elem.val(val).trigger('change');
                            ftui.log(3, me.widgetname + ' dev:' + dev + ' par:' + par + ' change ' + elem.data('device') + ':knob to ' + val);
                        }
                        knob_elem.css({
                            visibility: 'visible'
                        });
                    }
                }
            }

            //extra reading for reachable
            me.updateReachable(elem, dev, par);

            //extra reading for hide
            me.updateHide(elem, dev, par);

            //extra reading for lock
            me.updateLock(elem, dev, par);
        });

        isUpdating = false;
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_knob(), {
        //override or own public members
        widgetname: 'volume',
        init: init,
        actualSettings: actualSettings,
        update: update,
        drawDial: drawDial,
        onRelease: onRelease,
        onChange: onChange,
    });

    return me;
};
