/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true, Powerange:true */

"use strict";

function depends_slider() {
    if (!$.fn.Powerange) {
        $('head').append('<link rel="stylesheet" href="' + ftui.config.dir + '/../lib/powerange.min.css" type="text/css" />');
        return ["lib/powerange.min.js"];
    }
}

var Modul_slider = function () {

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {

            var elem = $(this);

            elem.initData('get', 'STATE');
            elem.initData('set', '');
            elem.initData('cmd', 'set');
            elem.initData('on', 'on');
            elem.initData('off', 'off');
            elem.initData('width', null);
            elem.initData('height', null);
            elem.initData('value', 0);
            elem.initData('min', 0);
            elem.initData('max', 100);
            elem.initData('step', null);
            elem.initData('set-value', '$v');
            elem.initData('get-value', elem.data('part') || -1);
            elem.initData('color', ftui.getClassColor(elem) || ftui.getStyle('.slider', 'color') || '#aa6900');
            elem.initData('background-color', ftui.getStyle('.slider', 'background-color') || '#404040');

            me.addReading(elem, 'get');

            var id = elem.data("device") + "_" + elem.data('get');

            var storeval = localStorage.getItem("slider_" + id);
            storeval = (storeval) ? storeval : '5';
            var input_elem = $('<input/>', {
                type: 'text',
                class: 'slider',
            }).appendTo(elem);

            elem.data('selection', 0);
            var pwrng = new Powerange(input_elem[0], {
                vertical: !elem.hasClass('horizontal'),
                min: elem.data('min'),
                max: elem.data('max'),
                step: elem.data('step'),
                tap: elem.hasClass('tap') || false,
                klass: elem.hasClass('horizontal') ? 'slider_horizontal' : 'slider_vertical',
                callback: (function () {
                    var pwrng = elem.data('Powerange');
                    var selMode = elem.data('selection');
                    var v = 0,
                        sliVal = 0;
                    var isunsel = 1;
                    if (pwrng) {
                        isunsel = $(pwrng.slider).hasClass('unselectable');
                        if (isunsel) {
                            elem.data('selection', 1);
                        }
                        sliVal = pwrng.element.value;
                        v = elem.hasClass('negated') ? pwrng.options.max + pwrng.options.min - sliVal : sliVal;
                    }

                    if (elem.hasClass('value')) {
                        elem.find('#slidervalue').text(v);
                    }

                    // isunsel == false (0) means drag is over
                    if ((!isunsel) && (selMode)) {
                        if (elem.hasClass('FS20')) {
                            v = ftui.FS20.dimmerValue(v);
                        }
                        elem.data('value', elem.data('set-value').toString().replace('$v', v.toString()));

                        // write visible value (from pwrng) to local storage NOT the fhem exposed value)
                        localStorage.setItem("slider_" + id, sliVal);
                        elem.transmitCommand();

                        elem.data('selection', 0);

                    }
                }).bind(this),
            });
            elem.data('Powerange', pwrng);
            var rangeContainer = elem.find('.range-container');
            var rangeQuantity = elem.find('.range-quantity');
            var rangeBar = elem.find('.range-bar');
            rangeQuantity.css({
                'background-color': elem.data('color')
            });
            rangeBar.css({
                'background-color': elem.data('background-color')
            });

            if (elem.hasClass('negated')) {
                var rangeBarColor = rangeBar.css('background-color');
                rangeBar.css({
                    'background-color': rangeQuantity.css('background-color')
                });
                rangeQuantity.css({
                    'background-color': rangeBarColor
                });
            }

            localStorage.setItem("slider_" + id, storeval);

            if (elem.hasClass('horizontal')) {
                if (elem.data('width')) {
                    rangeContainer.css({
                        'width': elem.data('width') + 'px',
                        'max-width': elem.data('width') + 'px',
                        'height': '0px'
                    });
                } else {
                    if (elem.hasClass('mini'))
                        rangeContainer.css({
                            'width': '60px',
                            'max-width': '60px'
                        });
                    else
                        rangeContainer.css({
                            'width': '120px',
                            'max-width': '120px'
                        });
                }
                if (elem.data('height')) {
                    rangeBar.css({
                        'height': elem.data('height') + 'px',
                        'max-height': elem.data('height') + 'px',
                        'top': '-' + elem.data('height') / 2 + 'px',
                    });
                }
            } else {
                if (elem.data('height')) {
                    rangeContainer.css({
                        'height': elem.data('height') + 'px',
                        'max-height': elem.data('height') + 'px'
                    });
                } else {
                    if (elem.hasClass('mini'))
                        rangeContainer.css({
                            'height': '60px',
                            'max-height': '60px'
                        });
                    else
                        rangeContainer.css({
                            'height': '120px',
                            'max-height': '120px'
                        });
                }
                if (elem.data('width')) {
                    rangeBar.css({
                        'width': elem.data('width') + 'px',
                        'max-width': elem.data('width') + 'px',
                        'left': '-' + elem.data('width') / 4 + 'px',
                    });
                }
            }

            if (elem.hasClass('value')) {
                var lbl = $('<div/>', {
                    id: 'slidervalue',
                    class: 'slidertext normal',
                }).appendTo(rangeContainer);
            }

            if (elem.hasClass('readonly'))
                elem.children().find('.range-handle').css({
                    'visibility': 'hidden'
                });

            elem.addClass(pwrng.options.klass);
            pwrng.setStart(storeval);

            // Refresh slider position after it became visible
            elem.closest('[data-type="popup"]').on("fadein", function (event) {
                var storeval = localStorage.getItem("slider_" + id);
                pwrng.setStart(parseInt(storeval));
            });
        });
    }

    function update(dev, par) {
        // update from normal state reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var state = elem.getReading('get').val;
                if (state) {
                    var pwrng = elem.data('Powerange');
                    var input_elem = elem.find('input');
                    var part = elem.data('get-value') || elem.data('part');
                    var nstate = ftui.getPart(state, part);
                    var tstate = nstate;
                    if (new RegExp('^' + elem.data('on') + '$').test(nstate.toString()))
                        nstate = pwrng.options.max;
                    if (new RegExp('^' + elem.data('off') + '$').test(nstate.toString()))
                        nstate = pwrng.options.min;
                    if ($.isNumeric(nstate) && input_elem) {
                        var v = elem.hasClass('negated') ? pwrng.options.max + pwrng.options.min - parseInt(nstate) : parseInt(nstate);
                        pwrng.setStart(parseInt(v));
                        localStorage.setItem("slider_" + dev + "_" + par, v);
                        ftui.log(1, 'slider dev:' + dev + ' par:' + par + ' changed to:' + v);
                    }
                    if (elem.hasClass('value')) {
                        var slidervalue = elem.find('#slidervalue');
                        if (slidervalue) {
                            if (elem.hasClass('textvalue')) {
                                slidervalue.text(tstate);
                            } else {
                                slidervalue.text(nstate);
                            }
                        }
                    }
                    input_elem.css({
                        visibility: 'visible'
                    });
                }
            });
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'slider',
        init: init,
        update: update,
    });

    return me;
};