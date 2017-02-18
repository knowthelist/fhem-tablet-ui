/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_knob:true */

"use strict";

function depends_homestatus() {
    if (typeof Modul_knob == 'undefined' || !$.fn.knob) {
        return ["knob"];
    }
}

var Modul_homestatus = function () {

    var isUpdating = false;

 function drawDial() {

        /*jshint validthis: true */
        var sector = 0;
        var c = this.g; // context
        var x = this.tx; // touch x position
        var y = this.ty; // touch y position
        var mx = this.x + this.w2;
        var my = this.y + this.w2;
        var r = this.radius * 0.4;
        var texts = this.$.data('texts');
        var icons = this.$.data('icons');

        //Assign sector 1 for center pressed or value is 0
        if (Math.pow((mx - x), 2) + Math.pow((my - y), 2) < Math.pow(r, 2) || this.cv === 0)
            sector = 1;

        if (sector == 1) {
            // inner circle
            c.lineWidth = this.radius*0.8;
            c.strokeStyle = this.o.fgColor;
            c.beginPath();
            c.arc(this.xy, this.xy, this.radius * 0.4, 0, 2 * Math.PI);
            c.stroke();
        } else {
            // outer section
            var start = 0;
            var end = 0;
            if (this.cv > Math.PI * 0.5 && this.cv <= Math.PI * 1.0) {
                start = 0;
                end = Math.PI;
                sector = 3;
                if (texts.length > 4) {
                    end = 0.5 * Math.PI;
                }
            } else if (this.cv > Math.PI * 1.0 && this.cv <= Math.PI * 1.5) {
                start = 0;
                end = Math.PI;
                sector = 3;
                if (texts.length > 4) {
                    start = 0.5 * Math.PI;
                    end = Math.PI;
                    sector = 5;
                }
            } else if (this.cv > Math.PI * 1.5 && this.cv <= Math.PI * 2) {
                start = Math.PI;
                end = Math.PI * 1.5;
                sector = 2;
            } else if (this.cv > 0 && this.cv <= Math.PI * 0.5) {
                start = Math.PI * 1.5;
                end = Math.PI * 2;
                sector = 4;
            }
            c.lineWidth = this.radius;
            c.beginPath();
            c.strokeStyle = this.o.fgColor;
            c.arc(this.xy, this.xy, this.radius * 1.3, start, end);
            c.stroke();
        }
        
        // sections
        c.strokeStyle = this.o.tkColor;
        c.lineWidth = this.radius;
        c.beginPath();
        c.arc(this.xy, this.xy, this.radius * 1.3, 0, 0.025);
        c.stroke();
        c.beginPath();
        c.arc(this.xy, this.xy, this.radius * 1.3, Math.PI - 0.025, Math.PI);
        c.stroke();
        c.beginPath();
        c.arc(this.xy, this.xy, this.radius * 1.3, 1.5 * Math.PI - 0.025, 1.5 * Math.PI);
        c.stroke();
        if (texts.length > 4) {
            c.beginPath();
            c.arc(this.xy, this.xy, this.radius * 1.3, 0.5 * Math.PI - 0.025, 0.5 * Math.PI);
            c.stroke();
        }

        // inner circle line
        c.lineWidth = 2;
        c.strokeStyle = this.o.tkColor;
        c.beginPath();
        c.arc(this.xy, this.xy, this.radius * 0.8, 0, 2 * Math.PI);
        c.stroke();

        // outer circle line
        c.lineWidth = 2;
        c.beginPath();
        c.arc(this.xy, this.xy, this.radius *1.8, 0, 2 * Math.PI, false);
        c.stroke();

        //cavans font
        var ratio = window.devicePixelRatio;
        var cfont = 10 * ratio + "px sans-serif";
        var cfafont = 22 * ratio + "px " + this.$.data("icon-font");

        c.fillStyle = (sector == 1) ? this.o.minColor : this.o.maxColor;
        c.font = cfont;
        c.fillText(texts[0], this.xy - 14 * ratio, this.xy + 16 * ratio);
        c.font = cfafont;
        c.fillText(ftui.getIconId(icons[0]), this.xy - 12 * ratio, this.xy + 2);

        c.fillStyle = (sector == 2) ? this.o.minColor : this.o.maxColor;
        c.font = cfafont;
        c.fillText(ftui.getIconId(icons[1]), this.xy - this.radius * 1.1    , this.xy - this.radius * 0.8);
        c.font = cfont;
        c.fillText(texts[1], this.xy - this.radius * 1.5, this.xy - 10 * ratio);

        c.fillStyle = (sector == 4) ? this.o.minColor : this.o.maxColor;
        c.font = cfafont;
        c.fillText(ftui.getIconId(icons[3]), this.xy + this.radius * 0.6, this.xy - this.radius * 0.8);
        c.font = cfont;
        c.fillText(texts[3], this.xy + this.radius * 0.9, this.xy - 10 * ratio );

        if (texts.length > 4) {
            c.fillStyle = (sector == 3) ? this.o.minColor : this.o.maxColor;
            c.font = cfafont;
            c.fillText(ftui.getIconId(icons[2]), this.xy + this.radius * 0.6, this.xy + this.radius * 1.2);
            c.font = cfont;
            c.fillText(texts[2], this.xy + this.radius, this.xy + 20 * ratio );
            c.fillStyle = (sector == 5) ? this.o.minColor : this.o.maxColor;
            c.font = cfafont;
            c.fillText(ftui.getIconId(icons[4]), this.xy - this.radius * 0.9, this.xy + this.radius * 1.2);
            c.font = cfont;
            c.fillText(texts[4], this.xy - this.radius * 1.5, this.xy + 20 * ratio);
        } else {
            c.fillStyle = (sector == 3) ? this.o.minColor : this.o.maxColor;
            c.font = cfafont;
            c.fillText(ftui.getIconId(icons[2]), this.xy - 12 * ratio, this.xy + this.radius * 1.3);
            c.font = cfont;
            c.fillText(texts[2], this.xy - 12 * ratio, this.xy + this.radius * 1.6 );
        }

        this.o.status = sector;
        return false;
    }
    
    function onChange(v) {}

    function onRelease(v) {
        /*jshint validthis: true */
        if (!isUpdating) {
            var section = this.o.status;
            var states = this.$.data('set-on');
            this.$.data('value', states[section - 1] || '1');
            this.$.transmitCommand();
            this.$.data('curval', v);
        }
    }

    function onFormat(v) {
        return v;
    }

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            var defaultAlias = ['Home', 'Night', 'Away', 'Holiday', 'Retire'];
            var defaultIcons = ['fa-home', 'fa-bed', 'fa-car', 'fa-suitcase', 'fa-tint'];
            var defaultStates = ['1', '2', '3', '4'];

            if (elem.data('version') && elem.data('version') !== '') {
                defaultStates = ['home', 'asleep', 'absent', 'gone', 'gotosleep'];
            }
            elem.initData('get', 'STATE');
            elem.initData('cmd', elem.data('cmd') || 'set');
            elem.initData('get-on', defaultStates);
            elem.initData('set-on', elem.data('get-on'));
            elem.initData('height', 210);
            elem.initData('width', 210);
            
            
            if (elem.hasClass('small')) {
                elem.data('height', 160);
                elem.data('width', 160);
            }
            me.addReading(elem, 'get');

            var texts = elem.data('alias') || [];
            var icons = elem.data('icons') || [];
            for (var i = 0; i < defaultStates.length; i++) {
                if (typeof texts[i] == 'undefined')
                    texts[i] = defaultAlias[i];
                if (typeof icons[i] == 'undefined')
                    icons[i] = defaultIcons[i];
            }
            elem.data('texts', texts);
            elem.data('icons', icons);
            elem.data('icon-font', elem.data('icon-font') || 'FontAwesome');
            elem.data('min', 0);
            elem.data('max', 2 * Math.PI);
            elem.data('step', 0.01);

            elem.data('bgcolor', elem.data('bgcolor') || ftui.getClassColor(elem) || ftui.getStyle('.homestatus', 'background-color') || '#aaaaaa');
            elem.data('fgcolor', elem.data('fgcolor') || ftui.getClassColor(elem) || ftui.getStyle('.homestatus', 'color') || '#aa6900');
            elem.data('tkcolor', elem.data('tkcolor') || ftui.getStyle('.homestatus.tkcolor', 'color') || '#696969');

            elem.data('mincolor', elem.data('mincolor') || ftui.getStyle('.homestatus.mincolor', 'color') || elem.data('mincolor') || '#2A2A2A');
            elem.data('maxcolor', elem.data('maxcolor') || ftui.getStyle('.homestatus.maxcolor', 'color') || elem.data('maxcolor') || '#696969');

            elem.data('angleoffset', 0);
            elem.data('anglearc', 360);
            elem.data('displayinput', false);
            elem.data('thickness', 1);

            me.init_attr(elem);
            me.init_ui(elem);

            // hack: force refresh
            var ii = 0;
            var cssListener = setInterval(function () {
                ii++;
                isUpdating = true;
                elem.find('input').val(elem.data('curval')).trigger('change');
                isUpdating = false;
                if (ii > 20) {
                    clearInterval(cssListener);
                }
            }, 500);
        });
    }

    function update(dev, par) {
        isUpdating = true;

        // update from desired temp reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var state = elem.getReading('get').val;
                if (ftui.isValid(state)) {
                    var knob_elem = elem.find('input');
                    var states = elem.data('get-on');
                    var val = 0;
                    var idx = ftui.indexOfGeneric(states, state);
                    ftui.log(3, "Homstatus: update state=" + state + " idx=" + idx);
                    if (idx > -1) {
                        switch (idx + 1) {
                        case 3:
                            val = Math.PI * 0.75;
                            break;
                        case 4:
                            val = Math.PI * 0.25;
                            break;
                        case 2:
                            val = Math.PI * 1.75;
                            break;
                        case 5:
                            val = Math.PI * 1.25;
                            break;
                        default:
                            val = 0;
                        }
                    }
                    ftui.log(3, "Homstatus: update curval=" + elem.data('curval') + " val=" + val);
                    if (knob_elem && elem.data('curval') != val) {
                        knob_elem.val(val).trigger('change');
                        elem.data('curval', val);
                    }
                }
            });
        isUpdating = false;
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_knob(), {
        //override or own public members
        widgetname: 'homestatus',
        init: init,
        update: update,
        drawDial: drawDial,
        onFormat: onFormat,
        onRelease: onRelease,
        onChange: onChange,
    });

    return me;
};