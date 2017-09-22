/* FTUI Plugin
 * Copyright (c) 2017 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */


"use strict";

function depends_controller() {
    if (!$('link[href$="css/ftui_controller.css"]').length)
        $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'css/ftui_controller.css" type="text/css" />');
    return [];

}

var Modul_controller = function () {

    function onChangeEvent(elem, e) {

        if (elem.isDown) {
        var event = e.originalEvent;
        var position = event.touches ? event.touches[0].pageY : e.pageY;

        elem.height = elem.controllerArea.height();
        var diff = elem.height - (position - elem.controllerArea.offset().top);

        if (diff > elem.height) {
            diff = elem.height;
        }
        if (diff < 0) {
            diff = 0;
        }
        //console.log(diff,elem.height,elem.pixel);
        elem.pixel = diff;
        elem.percent = diff * 100 / elem.height;
        
            drawLevel(elem);
        }
    }

    function sendLevel(elem) {

        if (elem.hasClass('lock')) {
            elem.addClass('fail-shake');
            setTimeout(function () {

                elem.pixel = elem.oldPixel;
                elem.percent = elem.oldPercent;
                elem.removeClass('fail-shake');
            }, 500);
            return;
        }

        var max = parseFloat(($.isNumeric(elem.data('max'))) ? elem.data('max') : elem.getReading('max').val);
        var min = parseFloat(($.isNumeric(elem.data('min'))) ? elem.data('min') : elem.getReading('min').val);
        var value = elem.percent * ((max - min) + min) / 100;
        var fix = parseInt(elem.data('fix'));
        value = (-1 < fix && fix <= 20) ? Number(value).toFixed(fix) : value;

        elem.data('value', value);
        elem.oldPixel = elem.pixel;
        elem.oldPercent = elem.percent;
        elem.transmitCommand();
    }

    function drawLevel(elem) {

        var controllerArea = elem.controllerArea || elem.find('.controller-area');
        elem.height = controllerArea.height();
        
        var pixel = ftui.isValid(elem.pixel) ?  elem.pixel : elem.data('percent') * elem.height / 100;
        var controllerRange = elem.controllerRange || elem.find('.controller-range');

        controllerRange.css({
            height: pixel + "px",
            top: elem.height - pixel + "px"
        });
    }

    function init_attr(elem) {

        // init base attributes
        _base.init_attr(elem);

        // init special attributes
        elem.initData('max', 100);
        elem.initData('min', 0);
        elem.initData('step', '1');
        elem.initData('fix', ftui.precision(elem.data('step')));
        elem.initData('height', elem.hasClass('fullsize') ? '100%' : '11em');
        elem.initData('width', elem.hasClass('fullsize') ? '100%' : '4em');
        elem.initData('color', ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname + '.range', 'color') || '#fff');
        elem.initData('background-color', ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname + '.range', 'background-color') ||
            'rgba(40,40,40,0.5)');
        elem.initData('icon', 'fa-lightbulb-o');
        elem.initData('icon-color', ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname + '.icon', 'color') ||
            '#aaa');


        // numeric value means fix value, others mean it is a reading
        if (!$.isNumeric(elem.data('max'))) {
            me.addReading(elem, 'max');
        }
        if (!$.isNumeric(elem.data('min'))) {
            me.addReading(elem, 'min');
        }

        return elem;
    }

    function init_ui(elem) {

        // Wrapper
        var wrapper = $('<div class="controller-wrapper"></div>')
            .css({
                width: elem.data('width'),
                height: elem.data('height')
            });

        // wipeArea
        elem.controllerArea = $('<div/>', {
                class: 'controller-area',
            })
            .css({
                background: elem.mappedColor('background-color')
            });


        // controllerRange
        elem.controllerRange = $('<div/>', {
                class: 'controller-range',
            })
            .css({
                background: elem.mappedColor('color')
            })
            .appendTo(elem.controllerArea);

        // wipeIcon
        elem.controllerIcon = $('<i/>', {
                class: 'controller-icon fa fa-2x ' + elem.data('icon')
            })
            .css({
                color: elem.mappedColor('icon-color')
            })
            .appendTo(elem.controllerArea);

        // Events
        elem.on(ftui.config.clickEventType, function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            elem.isDown = true;
            onChangeEvent(elem, e);
        });

        elem.on(ftui.config.enterEventType, function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            if (e.which === 0) {
                elem.isDown = false;
            }
        });

        elem.on(ftui.config.leaveEventType, function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            onChangeEvent(elem, e);
            if ((elem.pixel <= 1 || elem.pixel >= elem.height) && elem.isDown) {
                sendLevel(elem);
            }
        });

        elem.on(ftui.config.releaseEventType, function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            if (elem.isDown) {
                elem.isDown = false;
                sendLevel(elem);
            }

            return false;
        });

        elem.on(ftui.config.moveEventType, function (e) {

            onChangeEvent(elem, e);
        });

        // force refresh
        $(document).on('changedSelection', function () {
            drawLevel(elem);
        });

        wrapper.append(elem.controllerArea);
        elem.append(wrapper);

        return elem;
    }

    function update(dev, par) {

        // update from normal state reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var state = elem.getReading('get').val;
                //console.log(state, dev, par);
                if (state) {
                    var part = elem.data('get-value');
                    var val = ftui.getPart(state, part);
                    elem.data('value', val);
                    var max = parseFloat(($.isNumeric(elem.data('max'))) ? elem.data('max') : elem.getReading('max').val);
                    var min = parseFloat(($.isNumeric(elem.data('min'))) ? elem.data('min') : elem.getReading('min').val);
                    var value = parseFloat(val);
                    value = (isNaN(value)) ? min : value;
                    elem.data('percent', (value - min) / (max - min) * 100);
                    drawLevel(elem);
                }

            });

        //extra reading for lock
        me.update_lock(dev, par);

        //extra reading for hide
        me.update_hide(dev, par);

        //extra reading for reachable
        me.update_reachable(dev, par);
    }

    // public
    // inherit all public members from base class
    var base = new Modul_widget();
    var _base = {};
    _base.init_attr = base.init_attr;
    var me = $.extend(base, {
        //override or own public members
        widgetname: 'controller',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};
