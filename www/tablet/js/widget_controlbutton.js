/* FTUI Plugin
 * Copyright (c) 2017 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_famultibutton:true */

"use strict";

function depends_controlbutton() {
    var deps = [];
    if (!$('link[href$="css/ftui_controlbutton.css"]').length) {
        $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'css/ftui_controlbutton.css" type="text/css" />');
    }
    deps.push('famultibutton');
    return deps;
}

var Modul_controlbutton = function () {

    function clicked(elem, isOn) {

        var value = isOn ? elem.data('set-on') : elem.data('set-off');
        elem.data('value', value);
        elem.transmitCommand();
    }

    function drawElement(elem, isOn) {

        var controlbuttonArea = elem.controlbuttonArea || elem.find('.controlbutton-area');
        var controlbuttonIcon = elem.controlbuttonIcon || elem.find('.controlbutton-icon');

        if (isOn) {
            controlbuttonArea.css("background-color", elem.mappedColor('on-background-color'));
            controlbuttonIcon.css("color", elem.data('onColor'));
            elem.addClass('active');
            elem.trigger('setOn');
        } else {
            controlbuttonArea.css("background-color", elem.data('offBackgroundColor'));
            controlbuttonIcon.css("color", elem.data('offColor'));
            elem.removeClass('active');
            elem.trigger('setOff');
        }
        elem.data('checked', isOn);
    }


    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");

            elem.initData('icon', 'fa-lightbulb-o');
            elem.initData('off-color', ftui.getStyle('.controlbutton.off', 'color') || '#fff');
            elem.initData('off-background-color', ftui.getStyle('.controlbutton.off', 'background-color') ||
                'transparent');
            elem.initData('on-color', ftui.getStyle('.controlbutton.on', 'color') || '#000');
            elem.initData('on-background-color', ftui.getClassColor($(this)) || ftui.getStyle(
                '.controlbutton.on',
                'background-color') || '#fff');
            me.init_attr(elem);


            // Wrapper
            var wrapper = $('<div class="controlbutton-wrapper"></div>')
                .css({
                    width: elem.data('width'),
                    height: elem.data('height')
                });


            // wipeArea
            elem.controlbuttonArea = $('<div/>', {
                    class: 'controlbutton-area',
                })
                .css({
                    background: elem.mappedColor('background-color')
                });


            // wipeIcon
            elem.controlbuttonIcon = $('<i/>', {
                    class: 'controlbutton-icon fa ' + elem.data('icon')
                })
                .css({
                    color: elem.mappedColor('icon-color'),
                    background: elem.mappedColor('background-color')
                })
                .appendTo(elem.controlbuttonArea);


            // Events
            elem.on(ftui.config.clickEventType, function (e) {
                e.stopImmediatePropagation();

                elem.touch_pos_y = $(window).scrollTop();
                elem.touch_pos_x = $(window).scrollLeft();
                elem.clicked = true;
            });


            elem.on(ftui.config.releaseEventType, function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                console.log(Math.abs(elem.touch_pos_y - $(window).scrollTop()));

                if (Math.abs(elem.touch_pos_y - $(window).scrollTop()) > 3 ||
                    Math.abs(elem.touch_pos_x - $(window).scrollLeft()) > 3 ||
                    !elem.clicked) return;

                var isOn = !elem.data('checked');
                elem.data('checked', isOn);

                drawElement(elem, isOn);
                me.clicked(elem, isOn);
                elem.clicked = false;

                return false;
            });


            // store input object for usage in update function of base class
            elem.data("famultibutton", wrapper);

            // provide On / Off functions like a famultibutton
            wrapper.setOn = function () {
                drawElement(elem, true);
            };
            wrapper.setOff = function () {
                drawElement(elem, false);
            };


            // init state is off
            drawElement(elem, false);

            wrapper.append(elem.controlbuttonArea);
            elem.append(wrapper);

        });
    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'controlbutton',
        clicked: clicked,
        init: init,
    });
    return me;
};
