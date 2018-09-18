/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_knob:true */

"use strict";

function depends_thermostat() {
    if (window["Modul_knob"] === void 0|| !$.fn.knob) {
        return ["knob"];
    }
}

var Modul_thermostat = function () {

    var isUpdating = false;

    function drawDial() {

        /*jshint validthis: true */
        var c = this.g, // context
            a = this.arc(this.cv), // Arc
            pa, // Previous arc
            r = 1;
        c.clearRect(0, 0, this.w, this.h);
        c.lineWidth = this.lineWidth;
        c.lineCap = this.lineCap;
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
        var mincolor = (this.i.val() !== this.o.off) ? this.o.minColor || '#ff0000' : this.o.fgColor;
        var maxcolor = (this.i.val() !== this.o.off) ? this.o.maxColor || '#4477ff' : this.o.fgColor;
        var actcolor = this.o.actColor;

        // draw ticks
        for (var tick = this.startAngle; tick < this.endAngle + 0.00001; tick += tick_w * dist) {
            var i = step * (tick - this.startAngle) + this.o.min;
            var w = tick_w;

            c.beginPath();

            if ((tick > acAngle && tick < a.s) || (tick - tick_w * dist <= acAngle && tick + tick_w * dist >= a.s)) {
                // draw diff range in gradient color
                c.strokeStyle = ftui.getGradientColor(maxcolor, mincolor, (this.endAngle - tick) / this.angleArc);
                //if (tick-tick_w*dist <= acAngle )
                //    destcolor=c.strokeStyle;
            } else {
                // draw normal ticks
                c.strokeStyle = this.o.fgColor;
            }

            // thicker lines every 5 ticks
            if (Math.round(i * 10) / 10 % 5 === 0) {
                w = tick_w * 2.2;
                w *= (c.strokeStyle != this.o.fgColor) ? 1.5 : 1;
            } else {
                w *= (c.strokeStyle != this.o.fgColor) ? 2 : 1;
            }
            // thicker lines every at current value
            if (acAngle > tick - tick_w - w && acAngle < tick + tick_w)
                w *= 1.5;

            c.arc(this.xy, this.xy, this.radius, tick, tick + w, false);
            c.stroke();
        }

        //cavans font
        var cfont = 10 * window.devicePixelRatio * (this.o.height / 100) + "px sans-serif";

        // draw target temp cursor
        c.beginPath();
        c.strokeStyle = ftui.getGradientColor(maxcolor, mincolor, (this.endAngle - a.e) / (this.endAngle - this.startAngle));
        c.lineWidth = this.lineWidth * 2;
        c.arc(this.xy, this.xy, this.radius - this.lineWidth / 2, a.s, a.e, a.d);
        c.stroke();

        //draw current value as text
        var x = this.radius * 0.7 * Math.cos(acAngle);
        var y = this.radius * 0.7 * Math.sin(acAngle);
        c.fillStyle = actcolor;
        c.font = cfont;
        c.fillText(this.o.isValue, this.xy + x - 5 * (this.o.height / 50), this.xy + y + 5 * (this.o.height / 100));

        //draw valve value as text
        if (this.o.valveValue) {
            var text = (~this.o.valveValue.indexOf("%")) ? this.o.valveValue : this.o.valveValue + "%";
            x = -5;
            y = this.radius * 0.55;
            c.fillStyle = this.o.fgColor;
            c.font = cfont;
            c.fillText(text, this.xy + x, this.xy + y + 5);
        }
        return false;
    }

    function checkExtreme(v) {
        /*jshint validthis: true */
        if (v == this.min && this.off != -1) {
            v = this.off;
        } else if (v == this.max && this.boost != -1) {
            v = this.boost;
        }
        return v;
    }

    function onFormat(v) {
        /*jshint validthis: true */
        v = base.onFormat.call(this, v);
        return checkExtreme.call(this, v);
    }

    function onChange(v) {
        /*jshint validthis: true */
        var touchWidth = this.$.data('touch-width');
        var touchHeight = this.$.data('touch-height');
        if (this.$c.height() !== touchHeight) {
            this.$c.height(touchHeight + 'px');
        }
        if (this.$c.width() !== touchWidth) {
            this.$c.width(touchWidth + 'px');
        }
    }

    function onRelease(v) {
        /*jshint validthis: true */
        if (!isUpdating) {
            var device = this.$.data('device');

            // if size has been changed on change then back to normal
            if (this.$c.height() !== this.h) {
                this.$c.height(this.h + 'px');
            }
            if (this.$c.width() !== this.w) {
                this.$c.width(this.w + 'px');
            }

            var val = checkExtreme.call(this.o, v),
                mode = this.$.getReading(this.o.mode).val;
            if (mode === 'auto' && val === v)
                val = mode + ' ' + val;
            var cmdl = this.o.cmd + ' ' + device + ' ' + this.o.set + ' ' + val;
            ftui.setFhemStatus(cmdl);
            ftui.toast(cmdl);
        }
    }

    function actualSettings(elem) {
    
        elem.reinitData('fgcolor', ftui.getStyle('.' + me.widgetname, 'color') || '#666');
        elem.reinitData('bgcolor', ftui.getStyle('.' + me.widgetname, 'background-color') || 'none');
        elem.reinitData('nomcolor', ftui.getStyle('.' + me.widgetname + '.nominal', 'color') || '#999');
        elem.reinitData('actcolor', ftui.getStyle('.' + me.widgetname + '.actual', 'color') || '#999');
        elem.reinitData('mincolor', ftui.getStyle('.' + me.widgetname + '.min', 'color') || '#4477ff');
        elem.reinitData('maxcolor', ftui.getStyle('.' + me.widgetname + '.max', 'color') || '#ff0000');

        return {
            'fgColor': elem.data('fgcolor'),
            'bgColor': elem.data('bgcolor'),
            'actColor': elem.data('actcolor'),
            'nomColor': elem.data('nomcolor'),
            'minColor': elem.data('mincolor'),
            'maxColor': elem.data('maxcolor')
        };
    }

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");

            elem.initData('get', 'desired-temp');
            elem.initData('set', elem.data('get'));
            elem.initData('temp', 'measured-temp');
            elem.initData('valve', '');
            elem.initData('mode', '');
            elem.initData('height', 100);
            elem.initData('width', 100);
            elem.initData('max', 30);
            elem.initData('min', 10);
            elem.initData('cursor', 6);
            elem.initData('off', -1);
            elem.initData('boost', -1);
            elem.initData('actcolor', ftui.getStyle('.' + me.widgetname + '.actual', 'color') || '#999');
            elem.initData('fgcolor', ftui.getStyle('.' + me.widgetname, 'color') || '#666');
            elem.initData('mincolor', ftui.getStyle('.' + me.widgetname + '.min', 'color') || '#4477ff');
            elem.initData('maxcolor', ftui.getStyle('.' + me.widgetname + '.max', 'color') || '#ff0000');
            elem.initData('bgcolor', ftui.getStyle('.' + me.widgetname, 'background-color') || 'none');
            elem.initData('get-value', elem.data('part') || '-1');

            me.addReading(elem, 'get');
            me.addReading(elem, 'temp');
            me.addReading(elem, 'valve');
            me.addReading(elem, 'mode');

            me.init_attr(elem);

            elem.initData('touch-height', elem.data('height'));
            elem.initData('touch-width', elem.data('width'));
            me.init_ui(elem);

        });
    }

    function update(dev, par) {

        isUpdating = true;

        me.elements.each(function (index) {
            var elem = $(this);
            var knob_elem = elem.find('input');
            var knob_obj = knob_elem.data('knob');

            // update from desired temp reading
            if (elem.matchDeviceReading('get', dev, par)) {
                var value = elem.getReading('get').val;
                if (ftui.isValid(value)) {
                    var val = ftui.getPart(value, elem.data('get-value'));
                    var textdisplay = false;
                    switch (val) {
                        case elem.data('off'):
                            value = elem.data('min');
                            textdisplay = elem.data('off');
                            break;
                        case elem.data('boost'):
                            value = elem.data('max');
                            textdisplay = elem.data('boost');
                            break;
                    }
                    if (knob_elem) {
                        if (textdisplay)
                            knob_elem.val(textdisplay).trigger('change');
                        else
                            knob_elem.val(parseFloat(val)).trigger('change');
                        knob_elem.css({
                            visibility: 'visible'
                        });
                    }
                }
            }

            //extra reading for current temp
            if (elem.matchDeviceReading('temp', dev, par)) {
                var valueTemp = elem.getReading('temp').val;
                if (ftui.isValid(valueTemp)) {

                    if (knob_obj) {
                        knob_obj.o.isValue = parseFloat(valueTemp);
                        knob_elem.trigger('change');
                    } else {
                        ftui.log(1, 'thermostat: Update isValue failed. No knob_obj found');
                    }
                }
            }

            //extra reading for valve value
            if (elem.matchDeviceReading('valve', dev, par)) {
                var valueValve = elem.getReading('valve').val;
                if (ftui.isValid(valueValve)) {
                    if (knob_obj) {
                        knob_obj.o.valveValue = valueValve;
                        knob_elem.trigger('change');
                    } else {
                        ftui.log(1, 'thermostat: Update valveValue failed. No knob_obj found');
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
    var parent = new Modul_knob();
    var base = {
        onFormat: parent.onFormat,
    };
    var me = $.extend(parent, {
        //override or own public members
        widgetname: 'thermostat',
        init: init,
        actualSettings: actualSettings,
        update: update,
        drawDial: drawDial,
        onRelease: onRelease,
        onChange: onChange,
        onFormat: onFormat
    });

    return me;
};
