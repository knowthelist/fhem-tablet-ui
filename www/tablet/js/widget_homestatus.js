/* FTUI Plugin
 * Copyright (c) 2015-2018 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_knob:true */

"use strict";

function depends_homestatus() {
    var deps = [];
    if (!$('link[href$="lib/font-awesome.min.css"]').length) {
        deps.push(ftui.config.basedir + "lib/font-awesome.min.css");
    }
    if (window["Modul_knob"] === void 0 || !$.fn.knob) {
        deps.push("knob");
    }
    return deps;
}

var Modul_homestatus = function () {

    var isUpdating = false;

    function drawDial() {

        /*jshint validthis: true */
        var sector = 0,
            c = this.g, // context
            x = this.tx, // touch x position
            y = this.ty, // touch y position
            mx = this.x + this.w2,
            my = this.y + this.w2,
            xy = this.xy,
            radius = this.radius,
            ratio = window.devicePixelRatio,
            texts = this.$.data('texts'),
            iconSize = 20 * ratio,
            fontSize = 10 * ratio,
            fontWeight = this.$.data('icon-weight'),
            cfont = fontSize + "px sans-serif",
            cfafont = fontWeight + iconSize + "px " + this.$.data("icon-font"),
            textWidth = $.map(texts, function (text) {
                return (c.measureText(text).width * ratio) / 2;
            });
        if (!this.$.data('iconIDs')) {
            this.$.data('iconIDs', $.map(this.$.data('icons'), function (icon) {
                return ftui.getIconId(icon);
            }));
        }
        var icons = this.$.data('iconIDs');

        //Assign sector 1 for center pressed or value is 0
        if (Math.pow((mx - x), 2) + Math.pow((my - y), 2) < Math.pow(radius * 0.4, 2) || this.cv === 0)
            sector = 1;

        if (sector == 1) {
            // inner circle
            c.lineWidth = radius * 0.8;
            c.strokeStyle = this.o.fgColor;
            c.beginPath();
            c.arc(xy, xy, radius * 0.4, 0, 2 * Math.PI);
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
            c.lineWidth = radius;
            c.beginPath();
            c.strokeStyle = this.o.fgColor;
            c.arc(xy, xy, radius * 1.3, start, end);
            c.stroke();
        }

        // sections
        c.strokeStyle = this.o.bgColor;
        c.lineWidth = radius;
        c.beginPath();
        c.arc(xy, xy, radius * 1.3, 0, 0.025);
        c.stroke();
        c.beginPath();
        c.arc(xy, xy, radius * 1.3, Math.PI - 0.025, Math.PI);
        c.stroke();
        c.beginPath();
        c.arc(xy, xy, radius * 1.3, 1.5 * Math.PI - 0.025, 1.5 * Math.PI);
        c.stroke();
        if (texts.length > 4) {
            c.beginPath();
            c.arc(xy, xy, radius * 1.3, 0.5 * Math.PI - 0.025, 0.5 * Math.PI);
            c.stroke();
        }

        // inner circle line
        c.lineWidth = 2;
        c.strokeStyle = this.o.bgColor;
        c.beginPath();
        c.arc(xy, xy, radius * 0.8, 0, 2 * Math.PI);
        c.stroke();

        // outer circle line
        c.lineWidth = 2;
        c.beginPath();
        c.arc(xy, xy, radius * 1.8, 0, 2 * Math.PI, false);
        c.stroke();

        c.fillStyle = (sector == 1) ? this.o.maxColor : this.o.minColor;
        c.font = cfont;
        c.fillText(texts[0], xy - textWidth[0], xy + 16 * ratio);

        c.font = cfafont;
        c.fillText(icons[0], xy - radius * 0.05 - fontSize, xy + radius * 0.05);

        // 1 - left top
        c.fillStyle = (sector == 2) ? this.o.maxColor : this.o.minColor;
        c.font = cfafont;
        c.fillText(icons[1], xy - radius * 1.1, xy - radius * 0.8);
        c.font = cfont;
        c.fillText(texts[1], xy - radius * 1.25 - textWidth[1], xy - fontSize);

        // 3 - right top
        c.fillStyle = (sector == 4) ? this.o.maxColor : this.o.minColor;
        c.font = cfafont;
        c.fillText(icons[3], xy + radius * 0.6, xy - radius * 0.8);
        c.font = cfont;
        c.fillText(texts[3], xy + radius * 1.25 - textWidth[3], xy - fontSize);

        if (texts.length > 4) {
            c.fillStyle = (sector == 3) ? this.o.maxColor : this.o.minColor;
            // 2 right bottom
            c.font = cfafont;
            c.fillText(icons[2], xy + radius * 0.6, xy + radius * 1.2);
            c.font = cfont;
            c.fillText(texts[2], xy + radius * 1.25 - textWidth[2], xy + fontSize * 2);
            c.fillStyle = (sector == 5) ? this.o.maxColor : this.o.minColor;
            // 4 left bottom
            c.font = cfafont;
            c.fillText(icons[4], xy - radius * 0.9, xy + radius * 1.2);
            c.font = cfont;
            c.fillText(texts[4], xy - radius * 1.25 - textWidth[4], xy + fontSize * 2);
        } else {
            // 2 bottom
            c.fillStyle = (sector == 3) ? this.o.maxColor : this.o.minColor;
            c.font = cfafont;
            c.fillText(icons[2], xy - 12 * ratio, xy + radius * 1.3);
            c.font = cfont;
            c.fillText(texts[2], xy - radius * 0.01 - textWidth[2], xy + radius * 1.6);
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

    function actualSettings(elem) {

        elem.reinitData('fgcolor', ftui.getStyle('.' + me.widgetname, 'color') || '#aa6900');
        elem.reinitData('bgcolor', ftui.getStyle('.' + me.widgetname, 'background-color') || 'aaaaaa');
        elem.reinitData('mincolor', ftui.getStyle('.' + me.widgetname + '.icon', 'background-color') || '#2A2A2A');
        elem.reinitData('maxcolor', ftui.getStyle('.' + me.widgetname + '.icon', 'color') || '#696969');


        return {
            'fgColor': elem.data('fgcolor'),
            'bgColor': elem.data('bgcolor'),
            'minColor': elem.data('mincolor'),
            'maxColor': elem.data('maxcolor')
        };
    }

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function () {
            var elem = $(this);
            elem.attr('data-ready', '');

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
            elem.data('icon-font', elem.data('icon-font') || '"Font Awesome 5 Free"');
            elem.data('icon-weight', (elem.data('icon-font') === '"Font Awesome 5 Free"') ? '900 ' : '');
            elem.data('min', 0);
            elem.data('max', 2 * Math.PI);
            elem.data('step', 0.01);

            elem.initData('fgcolor', ftui.getClassColor(elem) || ftui.getStyle('.homestatus', 'color') || '#aa6900');
            elem.initData('bgcolor', ftui.getStyle('.homestatus', 'background-color') || '#aaaaaa');

            elem.initData('mincolor', ftui.getStyle('.homestatus.icon', 'background-color') || elem.data('mincolor') || '#2A2A2A');
            elem.initData('maxcolor', ftui.getStyle('.homestatus.icon', 'color') || elem.data('maxcolor') || '#696969');

            elem.data('angleoffset', 0);
            elem.data('anglearc', 360);
            elem.data('displaynominal', false);
            elem.data('thickness', 1);

            me.init_attr(elem);
            me.init_ui(elem);

            var knob_elem = elem.find('input');

            // refresh once to draw all
            setTimeout(function () {
                isUpdating = true;
                knob_elem.val(elem.data('curval')).trigger('change');
                isUpdating = false;
            }, 300);
        });
    }

    function update(dev, par) {
        isUpdating = true;

        me.elements.each(function () {
            var elem = $(this);
            var knob_elem = elem.find('input');

            // update from desired temp reading
            if (elem.matchDeviceReading('get', dev, par)) {
                var value = elem.getReading('get').val;
                if (value) {
                    if (knob_elem) {
                        var states = elem.data('get-on');
                        var val = 0;
                        var idx = ftui.indexOfGeneric(states, value);
                        ftui.log(3, 'Homstatus: update state=' + value + ' idx=' + idx);
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
                        ftui.log(3, 'Homstatus: update curval=' + elem.data('curval') + ' val=' + val);
                        if (knob_elem && elem.data('curval') != val) {
                            knob_elem.val(val).trigger('change');
                            elem.data('curval', val);
                        }
                    }
                }
            }

            // update from lock reading
            me.updateLock(elem, dev, par);

            //extra reading for reachable
            me.updateReachable(elem, dev, par);
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
        actualSettings: actualSettings,
        onFormat: onFormat,
        onRelease: onRelease,
        onChange: onChange,
    });

    return me;
};
