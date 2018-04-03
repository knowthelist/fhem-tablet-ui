/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

var Modul_spinner = function () {

    $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'css/ftui_spinner.css" type="text/css" />');

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
        if (elem.hasClass('value') || elem.hasClass('valueonly') || elem.hasClass('plain')) {
            var textElem = elem.find('.spinnerText');
            if (isNaN(value))
                textElem.text(value);
            else
                textElem.text(value + elem.data('unit'));
        }
    }

    function onClicked(elem, factor) {

        if (elem.hasClass('lock')) {
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

        //init standard attributes 
        _base.init_attr.call(me, elem);
        
        elem.initClassColor('color'); 
        
       if (elem.hasClass('large')) {
            elem.data('height', 70);
            elem.data('width', 300);
        }
        if (elem.hasClass('small')) {
            elem.data('height', 35);
            elem.data('width', 150);
        }

        elem.initData('color', '#aa6900');
        elem.initData('gradient-color', []);
        elem.initData('background-color', '#4a4a4a');
        elem.initData('icon-left-color', '#aaa');
        elem.initData('icon-right-color', '#aaa');
        elem.initData('text-color', '#ccc');
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

        if (elem.isDeviceReading('text-color')) {
            me.addReading(elem, 'text-color');
        }

    }

    function init_ui(elem) {

        var leftIcon = elem.data('icon-left');
        var rightIcon = elem.data('icon-right');
        var width = elem.data('width');
        var widthUnit = ($.isNumeric(width)) ? 'px' : '';
        var height = elem.data('height');
        var heightUnit = ($.isNumeric(height)) ? 'px' : '';

        // prepare container element
        var elemWrappern = $('<div/>', {
                class: 'spinner',
            })
            .css({
                width: width + widthUnit,
                maxWidth: width + widthUnit,
                height: height + heightUnit,
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
            .prependTo(elemWrappern);
        if (leftIcon)
            elemLeftIcon.addClass('fa ' + leftIcon + ' fa-lg fa-fw');
        else {
            elemLeftIcon.html('&minus;');
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
            .appendTo(elemWrappern);

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
            .appendTo(elemWrappern);
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
        if (elem.hasClass('value') || elem.hasClass('valueonly') || elem.hasClass('plain')) {
            var elemText = $('<div/>', {
                class: 'spinnerText',
            }).css({
                width: '50%',
            }).appendTo(elemWrappern);
            if (elem.hasClass('valueonly') || elem.hasClass('plain'))
                elemText.css({
                    fontSize: elem.data('height') * 0.6 + 'px',
                });
        }

        // event handler
        // UP button
        elemRightIcon.on(ftui.config.clickEventType, function (e) {
            elemRightIcon.fadeTo("fast", 0.5);
            e.preventDefault();
            e.stopPropagation();
            onClicked(elem, 1);
        });
        elemRightIcon.on(ftui.config.releaseEventType + ' ' + ftui.config.leaveEventType, function (e) {
            elemRightIcon.fadeTo("fast", 1);
            if (elem.delayTimer)
                onReleased(elem);
            e.preventDefault();
            e.stopPropagation();
        });
        elemRightIcon.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        // DOWN button
        elemLeftIcon.on(ftui.config.clickEventType, function (e) {
            elemLeftIcon.fadeTo("fast", 0.5);
            e.preventDefault();
            e.stopPropagation();
            onClicked(elem, -1);
        });
        elemLeftIcon.on(ftui.config.releaseEventType + ' ' + ftui.config.leaveEventType, function (e) {
            elemLeftIcon.fadeTo("fast", 1);
            if (elem.delayTimer)
                onReleased(elem);
            e.preventDefault();
        });
        elemLeftIcon.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        //Overlay
        elem.append($('<div/>', {
            class: 'overlay'
        }));

        //Wrapper
        //elem.wrapAll('<div class="spinner-wrapper"></div>');
        elemWrappern.appendTo(elem);
    }

    function update(dev, par) {

        me.elements.each(function (index) {
            var elem = $(this);

            // update from normal state reading
            if (elem.matchDeviceReading('get', dev, par)) {
                var state = elem.getReading('get').val;
                if (state) {
                    var part = elem.data('get-value');
                    var val = ftui.getPart(state, part);
                    elem.data('value', val);
                    drawLevel(elem);
                }
            }

            //extra reading for dynamic color of text
            if (elem.matchDeviceReading('text-color', dev, par)) {
                var valColor = elem.getReading('text-color').val;
                if (valColor) {
                    valColor = '#' + valColor.replace('#', '');
                    elem.find('.spinnerText').css("color", valColor);
                }
            }

            //extra reading for reachable
            me.updateReachable(elem, dev, par);

            //extra reading for hide
            me.updateHide(elem, dev, par);

            //extra reading for lock
            me.updateLock(elem, dev, par);

        });
    }

    // public
    // inherit all public members from base class
    var base = new Modul_widget();
    var _base = {};
    _base.init_attr = base.init_attr;
    var me = $.extend(base, {
        //override or own public members
        widgetname: 'spinner',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};
