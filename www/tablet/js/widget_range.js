/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

$('head').append('<link rel="stylesheet" href="' + ftui.config.dir + '/../css/ftui_range.css" type="text/css" />');

var Modul_range = function () {

    function init_attr(elem) {

        elem.initData('high', 'STATE');
        elem.initData('low', '');
        elem.initData('width', 8);
        elem.initData('height', 220);
        elem.initData('max', 30);
        elem.initData('min', -10);
        elem.initData('limit-low', 0);
        elem.initData('limit-high', 20);
        elem.initData('color', ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname + '.range', 'color') || '#aa6900');
        elem.initData('color-low', ftui.getStyle('.' + me.widgetname + '.low', 'color') || '#337ab7');
        elem.initData('color-high', ftui.getStyle('.' + me.widgetname + '.high', 'color') || '#ad3333');

        me.addReading(elem, 'low');
        me.addReading(elem, 'high');

    }

    function init_ui(elem) {

        var levelArea = $('<div/>', {
                class: 'levelArea',
            })
            .css({
                width: elem.data('width'),
                height: elem.data('height'),
            });

        //levelRange
        $('<div/>', {
                class: 'levelRange',
            }).appendTo(levelArea)
            .css({
                width: elem.data('width'),
            });

        //Labels
        if (!elem.hasClass('nolabels')) {
            $('<div/>', {
                    class: 'labelMax',
                }).appendTo(levelArea)
                .text(elem.data('max') + '-');

            $('<div/>', {
                    class: 'labelLimitMax',
                }).appendTo(levelArea)
                .text(elem.data('limit-high') + '-');

            $('<div/>', {
                    class: 'labelLimitMin',
                }).appendTo(levelArea)
                .text(elem.data('limit-low') + '-');

            $('<div/>', {
                    class: 'labelMin',
                }).appendTo(levelArea)
                .text(elem.data('min') + '-');
        }

        elem.append(levelArea);
        return elem;
    }

    function update(dev, par) {

        me.elements.filterDeviceReading('high', dev, par)
            .add(me.elements.filterDeviceReading('low', dev, par))
            .each(function (index) {
                var elem = $(this);
                var value_high = parseFloat(elem.getReading('high').val);
                var value_low = parseFloat(elem.getReading('low').val);
                var height = parseFloat(elem.data('height'));
                var min = parseFloat(elem.data('min'));
                var max = parseFloat(elem.data('max'));
                var limit_low = parseFloat(elem.data('limit-low'));
                var limit_high = parseFloat(elem.data('limit-high'));

                if (isNaN(value_high)) value_high = max;
                if (isNaN(value_low)) value_low = min;
                if (!(isNaN(value_high) || isNaN(value_low))) {

                    var levelRange = elem.find('.levelRange');
                    if (levelRange) {

                        var top = height * (value_high - min) / (max - min);
                        var bottom = height * (value_low - min) / (max - min);
                        var limit_top = 100 - 100 * (limit_high - value_low) / (value_high - value_low);
                        var limit_bottom = 100 - 100 * (limit_low - value_low) / (value_high - value_low);
                        var llimit_top = height * (limit_high - min) / (max - min);
                        var llimit_bottom = height * (limit_low - min) / (max - min);

                        if (top > height) top = height;
                        if (bottom < 0) bottom = 0;
                        if (limit_top < 0) limit_top = 0;
                        if (limit_bottom > height) limit_bottom = height;

                        var colorHigh = elem.mappedColor('color-high');
                        var color = elem.mappedColor('color');
                        var colorLow = elem.mappedColor('color-low');

                        var gradient = colorHigh + ' ' + limit_top + '%,' +
                            color + ' ' + limit_top + '%,' +
                            color + ' ' + limit_bottom + '%,' +
                            colorLow + ' ' + limit_bottom + '%)';
                        levelRange.css({
                            top: height - top + 'px',
                            bottom: bottom + 'px',
                        });

                        levelRange.css({
                            background: '-webkit-linear-gradient(top, ' + gradient,
                        }); /* Chrome10-25,Safari5.1-6 */
                        levelRange.css({
                            background: 'linear-gradient(to bottom, ' + gradient,
                        }); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */

                        if (limit_high == max)
                            elem.find('.labelLimitMax').hide();
                        else
                            elem.find('.labelLimitMax').css({
                                bottom: llimit_top - 6 + 'px'
                            }).show();
                        if (limit_low == min)
                            elem.find('.labelLimitMin').hide();
                        else
                            elem.find('.labelLimitMin').css({
                                bottom: llimit_bottom - 6 + 'px'
                            }).show();
                    }
                }
            });
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'range',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};