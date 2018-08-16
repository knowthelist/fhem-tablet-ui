/* FTUI Plugin
 * Copyright (c) 2017 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

// 

function depends_scale() {
    var deps = [];
    return deps;
}

var Modul_scale = function () {

    // privat sub function
    function drawScale(elem) {

        var canvas = elem.canvas ? elem.canvas[0] : elem.find('canvas')[0];

        if (canvas.getContext) {

            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);

            var max = elem.data('max');
            var min = elem.data('min');
            var fontSize = elem.data('font-size');
            var tick = elem.data('tick');
            var value = elem.data('value');
            var extraTick = elem.data('extra-tick');
            var valColor = elem.data('value-color');
            var valInterval = elem.data('value-interval');
            var tickColor = elem.data('tick-color');
            var orientation = elem.data('orientation');
            var dimension = (orientation === 'horizontal') ? canvas.width : canvas.height;
            var n = extraTick;


            for (var i = min; i < max + 1; i++) {
                n++;
                if (n >= tick) {
                    n = 0;
                    var val = ((dimension - 20) * (i - min) / (max - min)) + 5;
                    if (i <= value) {
                        context.strokeStyle = valColor;
                    } else {
                        context.strokeStyle = tickColor;
                    }

                    context.lineWidth = 1.5;
                    context.beginPath();
                    
                    // thicker lines every n ticks
                    if (i % extraTick === 0) {
                        if (orientation === 'horizontal') {
                            context.moveTo(val, 0);
                            context.lineTo(val, canvas.height - fontSize);
                        } else {
                            context.moveTo(25, dimension-val);
                            context.lineTo(canvas.width, dimension-val);
                        }
                    } else {
                        if (orientation === 'horizontal') {
                            context.moveTo(val, (canvas.height - fontSize) * 0.1);
                            context.lineTo(val, (canvas.height - fontSize) * 0.9);

                        } else {
                            context.moveTo((canvas.width - fontSize) * 0.1 + 25, dimension-val);
                            context.lineTo((canvas.width - fontSize) * 0.9 + fontSize, dimension-val);
                        }
                    }

                    context.stroke();

                    //cavans font
                    var cfont = fontSize * window.devicePixelRatio * 0.5 + "px sans-serif";

                    //draw vvalue as text
                    if (i % valInterval === 0 && !elem.hasClass('notext')) {
                        context.fillStyle = '#eee';
                        context.font = cfont;
                        if (orientation === 'horizontal') {
                            context.fillText(i, val - String(i).length*3, canvas.height);
                        } else {
                            context.fillText(i, 0, dimension-val+5);
                        }
                    }
                }
            }

        }
    }

    function update_colorize(value, elem) {
        //set colors according matches for values
        var limits = elem.data('limits');
        var colors = elem.data('colors');
        if (limits) {
            var idx = ftui.indexOfGeneric(limits, value);
            if (idx > -1) {
                if (colors) {
                    elem.data("value-color", ftui.getStyle('.' + colors[idx], 'color') || colors[idx]);
                }
            }
        }
    }

    function init_attr(elem) {

        //init standard attributes 
        base.init_attr.call(me, elem);

        elem.initData('orientation', 'horizontal');
        elem.initData('width', (elem.data('orientation') === 'horizontal') ? elem.parent().width() * 0.8 : 50);
        elem.initData('height', (elem.data('orientation') === 'horizontal') ? 25 : elem.parent().height() * 0.8 );
        elem.initData('value', 20);
        elem.initData('min', 0);
        elem.initData('max', 100);
        elem.initData('font-size', 12);
        elem.initData('tick', 1);
        
        elem.initData('value-interval', 50);
        elem.initData('extra-tick', 10);
        elem.initData('tick-color', '#bbb');
        elem.initData('limits-part', elem.data('part'));
        elem.initData('limits-get', (elem.data('device')) ? elem.data('device') + ':' + elem.data('get') : elem.data('get'));
        elem.initData('limits', elem.data('states') || []);
        elem.initData('colors', ['#505050']);
        elem.initData('color', '#aa6900');
        if (elem.isDeviceReading('color')) {
            me.addReading(elem, 'color');
        } else {
            elem.data('value-color', elem.data('color'));
        }

    }


    function init_ui(elem) {

        elem.canvas = $('<canvas>').attr({
            id: 'scale',
            height: elem.data('height') + elem.data('font-size'),
            width: elem.data('width')
        }).appendTo(elem);

    }


    function update(dev, par) {

        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var val = elem.getReading('get').val;
                val = ftui.getPart(val, elem.data('part'));
                val = me.substitution(val, elem.data('substitution'));
                val = me.map(elem.data('map-get'), val, val);
                val = me.fix(val, elem.data('fix'));
                elem.data('value', val);
                drawScale(elem);
            });

        // do updates from reading for color
        me.elements.filterDeviceReading('color', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var val = elem.getReading('color').val;
                if (val) {
                    val = '#' + val.replace('#', '');
                    elem.data("value-color", val);
                    drawScale(elem);
                }
            });

        //extra reading for colorize
        me.elements.filterDeviceReading('limits-get', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var val = elem.getReading('limits-get').val;
                if (ftui.isValid(val)) {
                    var v = ftui.getPart(val, elem.data('limits-part'));
                    update_colorize(v, elem);
                    drawScale(elem);
                }
            });
    }

    // public
    // inherit all public members from base class
    var parent = new Modul_widget();
    var base = {
        init_attr: parent.init_attr
    };
    var me = $.extend(parent, {
        //override or own public members
        widgetname: 'scale',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};
