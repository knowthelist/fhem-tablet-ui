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

    function elemID(elem) {
        return me.widgetname + "_" + elem.data("device") + "_" + elem.data('get');
    }

    function onChange(elem) {
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
            localStorage.setItem(elemID(elem), sliVal);
            elem.transmitCommand();

            elem.data('selection', 0);

        }
    }

    function init_attr(elem) {

        elem.initData('get', 'STATE');
        elem.initData('set', '');
        elem.initData('cmd', 'set');
        elem.initData('on', 'on');
        elem.initData('off', 'off');
        elem.initData('width', null);
        elem.initData('height', null);
        elem.initData('margin', '3px');
        elem.initData('value', 0);
        elem.initData('min', 0);
        elem.initData('max', 100);
        elem.initData('step', 1);
        elem.initData('set-value', '$v');
        elem.initData('get-value', elem.data('part') || -1);
        elem.initData('color', ftui.getClassColor(elem) || ftui.getStyle('.slider', 'color') || '#aa6900');
        elem.initData('background-color', ftui.getStyle('.slider', 'background-color') || '#404040');

        me.addReading(elem, 'get');
        // numeric value means fix value, others mean it is a reading
        if (!$.isNumeric(elem.data('max'))) {
            me.addReading(elem, 'max');
        }
        if (!$.isNumeric(elem.data('min'))) {
            me.addReading(elem, 'min');
        }

    }

    function init_ui(elem) {

        var id = elemID(elem);

        var storeval = localStorage.getItem(id);
        storeval = (storeval) ? storeval : '5';

        var input_elem = $('<input/>', {
            type: 'text',
            class: me.widgetname,
        }).appendTo(elem);

        elem.data('selection', 0);

        var pwrng = new Powerange(input_elem[0], {
            vertical: !elem.hasClass('horizontal'),
            min: elem.data('min') || 0,
            max: elem.data('max') || 100,
            step: elem.data('step'),
            decimal: true,
            tap: elem.hasClass('tap') || false,
            klass: elem.hasClass('horizontal') ? me.widgetname + '_horizontal' : me.widgetname + '_vertical',
            callback: function () {
                me.onChange(elem);
            }
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

        localStorage.setItem(id, storeval);
        var width = elem.data('width');
        var widthUnit = ($.isNumeric(width)) ? 'px' : '';
        var height = elem.data('height');
        var heightUnit = ($.isNumeric(height)) ? 'px' : '';
        var margin = elem.data('margin');
        var marginUnit = ($.isNumeric(margin)) ? 'px' : '';

        if (elem.hasClass('horizontal')) {
            elem.css({
                'margin-bottom': margin + marginUnit,
                'height': height + heightUnit
            });

            if (width) {
                elem.css({
                    'width': width + widthUnit
                });
            } else {
                if (elem.hasClass('mini'))
                    elem.css({
                        'width': '60px'
                    });
                else
                    elem.css({
                        'width': '120px'
                    });
            }
            if (height) {
                rangeBar.css({
                    'height': height + heightUnit,
                    'max-height': height + heightUnit,
                    'top': '-' + height / 2 + heightUnit
                });
                elem.css({
                    'height': height + heightUnit,
                    'max-height': height + heightUnit,
                    'top': '-' + height / 2 + heightUnit
                });
            }
        } else {
            if (height) {
                elem.css({
                    'height': height + heightUnit
                });
            } else {
                if (elem.hasClass('mini'))
                    elem.css({
                        'height': '60px'
                    });
                else
                    rangeContainer.css({
                        'height': '120px'
                    });
            }
            if (width) {
                rangeBar.css({
                    'width': width + widthUnit,
                    'max-width': width + widthUnit,
                    'left': '-' + width / 4 + widthUnit,
                });
            }
        }

        if (elem.hasClass('value')) {
            var lbl = $('<div/>', {
                id: 'slidervalue',
                class: 'slidertext normal',
            }).appendTo(rangeContainer);
        }

        if (elem.hasClass('readonly')) {
            elem.children().find('.range-handle').css({
                'visibility': 'hidden',
                'width': '0px',
                'height': '0px'
            });
        }

        elem.addClass(pwrng.options.klass);

        pwrng.setStart(storeval);

        function onResize() {
            var storeval = localStorage.getItem(id);
            pwrng.setStart(parseInt(storeval));
            // second call necessary
            pwrng.setStart(parseInt(storeval));
        }

        // Refresh slider position after it became visible
        elem.closest('[data-type="popup"]').on("fadein", function (event) {
            setTimeout(function() {
              onResize();  
                
            },500);
        });

        $(document).on('changedSelection', function () {
            onResize();
        });

        $(window).resize(function () {
            onResize();
        });
    }

    function update(dev, par) {
        // update from normal state reading
        me.elements.filterDeviceReading('get', dev, par)
            .add(me.elements.filterDeviceReading('min', dev, par))
            .add(me.elements.filterDeviceReading('max', dev, par))
            .each(function (index) {
                var elem = $(this);
                var state = elem.getReading('get').val;
                if (ftui.isValid(state)) {
                    var pwrng = elem.data('Powerange');
                    var input_elem = elem.find('input');
                    var part = elem.data('get-value') || elem.data('part');
                    var txtValue = ftui.getPart(state, part);
                    var val = parseFloat(txtValue);
                    pwrng.options.min = ($.isNumeric(elem.data('min'))) ? elem.data('min') : elem.getReading('min').val;
                    pwrng.options.max = ($.isNumeric(elem.data('max'))) ? elem.data('max') : elem.getReading('max').val;

                    pwrng.options.min = parseFloat(pwrng.options.min);
                    pwrng.options.max = parseFloat(pwrng.options.max);

                    if (val > pwrng.options.max) {
                        val = pwrng.options.max;
                    }
                    if (val < pwrng.options.min) {
                        val = pwrng.options.min;
                    }

                    if (new RegExp('^' + elem.data('on') + '$').test(txtValue))
                        val = pwrng.options.max;
                    if (new RegExp('^' + elem.data('off') + '$').test(txtValue))
                        val = pwrng.options.min;
                    if ($.isNumeric(val) && input_elem) {
                        var v = elem.hasClass('negated') ? pwrng.options.max + pwrng.options.min - parseInt(val) : parseInt(val);
                        pwrng.setStart(parseInt(v));
                        localStorage.setItem(elemID(elem), v);
                        ftui.log(1, 'slider dev:' + dev + ' par:' + par + ' changed to:' + v);

                        //set colors according matches for values
                        var limits = elem.data('limits');
                        if (limits) {
                            var colors = elem.data('colors');

                            // if data-colors isn't set, try using #505050 instead
                            if (typeof colors == 'undefined') {
                                colors = new Array('#505050');
                            }

                            // fill up colors and icons to states.length
                            // if an index s isn't set, use the value of s-1
                            for (var s = 0, len = limits.length; s < len; s++) {
                                if (typeof colors[s] == 'undefined') {
                                    colors[s] = colors[s > 0 ? s - 1 : 0];
                                }
                            }

                            var idx = ftui.indexOfGeneric(limits, val);
                            if (idx > -1) {
                                elem.children().find('.range-quantity').css("background-color", colors[idx]);
                            }
                        }
                        elem.attr('title', val);
                    }
                    if (elem.hasClass('value')) {
                        var slidervalue = elem.find('#slidervalue');
                        if (slidervalue) {
                            if (elem.hasClass('textvalue')) {
                                slidervalue.text(txtValue);
                            } else {
                                slidervalue.text(val);
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
        init_ui: init_ui,
        init_attr: init_attr,
        onChange: onChange,
        update: update,
    });

    return me;
};