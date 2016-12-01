/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

var Modul_spinner = function () {

    $('head').append('<link rel="stylesheet" href="' + ftui.config.dir + '/../css/ftui_spinner.css" type="text/css" />');

    function getValueNumeric(elem) {
        var value = elem.data('value');
        switch (value) {
        case elem.data('off'):
            return parseFloat(elem.data('min')) - parseFloat(elem.data('step'));
        case elem.data('on'):
            return parseFloat(elem.data('max')) + parseFloat(elem.data('step'));
        default:
            value = parseFloat(value);
            return (isNaN(value)) ? elem.data('min') : value;
        }
    }

    function drawLevel(elem) {
        var max = parseFloat(($.isNumeric(elem.data('max'))) ? elem.data('max') : elem.getReading('max').val);
        var min = parseFloat(($.isNumeric(elem.data('min'))) ? elem.data('min') : elem.getReading('min').val);
        var step = parseFloat(elem.data('step'));
        var width = parseFloat(elem.data('width')) / 2;
        var value = getValueNumeric(elem);
        var fix = parseInt(elem.data('fix'));
        var color = elem.mappedColor('color');
        var gradColor = elem.data('gradient-color');
        var valueRel = (value - min) / (max - min);
        var pixel = width * valueRel;
        var levelRange = elem.find('.levelRange');
        if (levelRange) {
            // draw bar position / width
            levelRange.css({
                left: elem.hasClass('positiononly') ? (pixel - valueRel * 10) + 'px' : '0px',
                width: elem.hasClass('positiononly') ? '10px' : pixel + 'px',
            });
            // draw gradient bar
            if ($.isArray(gradColor) && gradColor.length > 1) {
                var mid = 100 * valueRel - 50;
                var stopHigh = parseInt(mid - mid / 2);
                var stopLow = parseInt(mid + mid / 2);
                var colorLow = ftui.mapColor(gradColor[0]);
                var colorHigh = ftui.mapColor(gradColor[1]);
                var gradient = colorHigh + ' ' + stopHigh + '%,' +
                    colorLow + ' ' + stopLow + '%)';
                if (elem.hasClass('positiononly')) {
                    levelRange.css({
                        background: ftui.getGradientColor(colorLow, colorHigh, valueRel),
                    });
                } else {
                    levelRange.css({
                        background: '-webkit-linear-gradient(right, ' + gradient,
                    }); /* Chrome10-25,Safari5.1-6 */
                    levelRange.css({
                        background: 'linear-gradient(to left, ' + gradient,
                    }); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
                }
            } else {
                // draw uni color bar
                levelRange.css({
                    background: color,
                });
            }
        }
        value = (-1 < fix && fix <= 20) ? Number(value).toFixed(fix) : value;
        if (value == min - step && elem.data('off') != -123) {
            value = elem.data('off');
        } else if (value == max + step && elem.data('on') != -123) {
            value = elem.data('on');
        }
        elem.data('value', value);
        if (elem.hasClass('value') || elem.hasClass('valueonly')) {
            var textElem = elem.find('.spinnerText');
            if (isNaN(value))
                textElem.text(value);
            else
                textElem.text(value + elem.data('unit'));
        }
    }

    function onClicked(elem, factor) {

        if (me.isReadOnly(elem)) {
            elem.addClass('fail-shake');
            setTimeout(function () {
                elem.removeClass('fail-shake');
            }, 500);
            return;
        }

        var step = parseFloat(elem.data('step'));
        var min = parseFloat(elem.data('min'));
        var max = parseFloat(elem.data('max'));
        var value = getValueNumeric(elem);
        clearTimeout(elem.delayTimer);
        var changeValue = function () {
            value = value + factor * step;
            if (value < min) value = elem.hasClass('circulate') ? max : min;
            if (value > max) value = elem.hasClass('circulate') ? min : max;
            elem.data('value', value);
            drawLevel(elem);
        };
        // short press
        changeValue();
        elem.delayTimer = setTimeout(function () {
            elem.repeatTimer = setInterval(function () {
                // long press
                changeValue();
            }, elem.data('shortdelay'));
        }, elem.data('longdelay'));
    }

    function onReleased(elem) {
        clearTimeout(elem.repeatTimer);
        clearTimeout(elem.delayTimer);
        elem.delayTimer = setTimeout(function () {
            elem.transmitCommand();
            elem.delayTimer = 0;
        }, elem.data('longdelay'));
    }

    function init_attr(elem) {
        elem.initData('get', 'STATE');
        elem.initData('set', '');
        elem.initData('cmd', 'set');
        elem.initData('color', ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname, 'color') || '#aa6900');
        elem.initData('gradient-color', []);
        elem.initData('background-color', ftui.getStyle('.' + me.widgetname, 'background-color') || '#4a4a4a');
        elem.initData('icon-left-color', ftui.getStyle('.' + me.widgetname, 'icon-left-color') || '#aaa');
        elem.initData('icon-right-color', ftui.getStyle('.' + me.widgetname, 'icon-right-color') || '#aaa');
        elem.initData('text-color', ftui.getStyle('.' + me.widgetname, 'text-color') || '#ccc');
        elem.initData('icon-left', elem.data('icon') || null);
        elem.initData('icon-right', null);
        elem.initData('shortdelay', 80);
        elem.initData('longdelay', 500);
        elem.initData('width', '200');
        elem.initData('height', '50');
        elem.initData('value', '0');
        elem.initData('min', '0');
        elem.initData('max', '100');
        elem.initData('off', -123);
        elem.initData('on', -123);
        elem.initData('step', '1');
        elem.initData('fix', ftui.precision(elem.data('step')));
        elem.initData('unit', '');
        elem.initData('get-value', elem.data('part') || -1);

        me.addReading(elem, 'get');
        if (elem.isDeviceReading('text-color')) {
            me.addReading(elem, 'text-color');
        }
        if (elem.isDeviceReading('lock')) {
            me.addReading(elem, 'lock');
        }
    }

    function init_ui(elem) {

        var leftIcon = elem.data('icon-left');
        var rightIcon = elem.data('icon-right');

        // prepare container element
        elem.html('')
            .addClass('spinner')
            .css({
                width: elem.data('width') + 'px',
                maxWidth: elem.data('width') + 'px',
                height: elem.data('height') + 'px',
                lineHeight: elem.data('height') * 0.9 + 'px',
                color: elem.mappedColor('text-color'),
                backgroundColor: elem.mappedColor('background-color'),
            });

        // prepare left icon
        var elemLeftIcon = $('<div/>', {
                class: 'lefticon',
            })
            .css({
                color: elem.mappedColor('icon-left-color'),
            })
            .prependTo(elem);
        if (leftIcon)
            elemLeftIcon.addClass('fa ' + leftIcon + ' fa-lg fa-fw');
        else {
            elemLeftIcon.html('-');
            elemLeftIcon.css({
                fontSize: elem.data('height') * 0.9 + 'px',
                fontFamily: 'sans serif',
            });
        }

        // prepare level element
        var levelArea = $('<div/>', {
                class: 'levelArea',
            }).css({
                width: '50%',
            })
            .appendTo(elem);

        //levelRange
        $('<div/>', {
            class: 'levelRange',
        }).appendTo(levelArea);

        // prepare right icon
        var elemRightIcon = $('<div/>', {
                class: 'righticon',
            })
            .css({
                color: elem.mappedColor('icon-right-color'),
            })
            .appendTo(elem);
        if (rightIcon)
            elemRightIcon.addClass('fa ' + rightIcon + ' fa-lg fa-fw');
        else {
            elemRightIcon.html('+');
            elemRightIcon.css({
                fontSize: elem.data('height') * 0.9 + 'px',
                fontFamily: 'sans serif',
            });
        }

        // prepare text element
        if (elem.hasClass('value') || elem.hasClass('valueonly')) {
            var elemText = $('<div/>', {
                class: 'spinnerText',
            }).css({
                width: '50%',
            }).appendTo(elem);
            if (elem.hasClass('valueonly'))
                elemText.css({
                    fontSize: elem.data('height') * 0.6 + 'px',
                });
        }

        // event handler
        // UP button
        elemRightIcon.on('touchstart mousedown', function (e) {
            elemRightIcon.fadeTo("fast", 0.5);
            onClicked(elem, 1);
            e.preventDefault();
        });
        elemRightIcon.on('touchend touchleave mouseup mouseout', function (e) {
            elemRightIcon.fadeTo("fast", 1);
            if (elem.delayTimer)
                onReleased(elem);
            e.preventDefault();
        });

        // DOWN button
        elemLeftIcon.on('touchstart mousedown', function (e) {
            elemLeftIcon.fadeTo("fast", 0.5);
            onClicked(elem, -1);
            e.preventDefault();
        });
        elemLeftIcon.on('touchend touchleave mouseup mouseout', function (e) {
            elemLeftIcon.fadeTo("fast", 1);
            if (elem.delayTimer)
                onReleased(elem);
            e.preventDefault();
        });
    }

    function update(dev, par) {

        // update from normal state reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var state = elem.getReading('get').val;
                if (state) {
                    var part = elem.data('get-value');
                    var val = ftui.getPart(state, part);
                    elem.data('value', val);
                    drawLevel(elem);
                }
            });

        //extra reading for dynamic color of text
        me.elements.filterDeviceReading('text-color', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var val = elem.getReading('text-color').val;
                if (val) {
                    val = '#' + val.replace('#', '');
                    elem.find('.spinnerText').css("color", val);
                }
            });

        //extra reading for lock
        me.elements.filterDeviceReading('lock', dev, par)
            .each(function (idx) {
                var elem = $(this);
                elem.data('readonly', elem.getReading('lock').val);
            });
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'spinner',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};