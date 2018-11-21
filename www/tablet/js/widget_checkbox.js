/* FTUI Plugin
 * Copyright (c) 2015-2018 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_famultibutton:true, Switchery:true */

"use strict";

function depends_checkbox() {
    var deps = [];

    if (!$('link[href$="lib/switchery.min.css"]').length) {
        deps.push(ftui.config.basedir + "lib/switchery.min.css");
    }

    if (!$.fn.Switchery) {
        deps.push(ftui.config.basedir + "lib/switchery.min.js");
    }

    if (window["Modul_famultibutton"] === void 0 || !$.fn.famultibutton) {
        deps.push('famultibutton');
    }
    return deps;
}

var Modul_checkbox = function () {

    function clicked(elem, isClicked) {
        var value = isClicked ? elem.data('set-on') : elem.data('set-off');
        elem.data('value', value);
        elem.transmitCommand();
    }

    function switcheryConfig(elem) {

        var elemData = elem.data();
        var ret = {
            size: elem.hasClass('small') ? 'small' : elem.hasClass('large') ? 'large' : 'default',
            color: ftui.getStyle("." + elemData.onBackgroundColor, "color") || elemData.onBackgroundColor,
            secondaryColor: ftui.getStyle("." + elemData.offBackgroundColor, "color") || elemData.offBackgroundColor,
            jackColor: ftui.getStyle("." + elemData.onColor, "color") || elemData.onColor,
            jackSecondaryColor: ftui.getStyle("." + elemData.offColor, "color") || elemData.offColor,
        };
        return ret;
    }

    function reinit() {

        me.elements.each(function (index) {
            var elem = $(this);
            var switchery = elem.data('switchery');

            if (switchery) {

                elem.reinitData('on-color', ftui.getStyle('.checkbox.on', 'color') || '#bfbfbf');
                elem.reinitData('off-color', ftui.getStyle('.checkbox.off', 'color') || '#bfbfbf');
                elem.reinitData('on-background-color', ftui.getStyle('.checkbox.on', 'background-color') || '#aa6900');
                elem.reinitData('off-background-color', ftui.getStyle('.checkbox.off', 'background-color') || '#505050');

                switchery.reinit(switcheryConfig(elem));
                switchery.handleOnchange(true);
            }
        });
    }

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");

            elem.initClassColor('on-background-color');

            elem.initData('on-color', ftui.getStyle('.checkbox.on', 'color') || '#bfbfbf');
            elem.initData('off-color', ftui.getStyle('.checkbox.off', 'color') || '#bfbfbf');
            elem.initData('on-background-color', ftui.getStyle('.checkbox.on', 'background-color') || '#aa6900');
            elem.initData('off-background-color', ftui.getStyle('.checkbox.off', 'background-color') || '#505050');

            me.init_attr(elem);

            // base element that becomes a Switchery
            var input = $('<input/>', {
                type: 'checkbox',
                checked: true,
            }).appendTo(elem);

            // transform the input element into a Switchery
            var switchery = new Switchery(input[0], switcheryConfig(elem));

            elem.data('switchery', switchery);

            // click handler
            var switcherButton = elem.find('.switchery');
            var touchIsAllowed = false;
            switcherButton.on('click', function (event) {
                touchIsAllowed = false;
                me.clicked(elem, input.is(":checked"));
            });

            // touch handler
            switcherButton.on('touchend', function (e) {
                if (touchIsAllowed) {
                    switchery.setPosition(true);
                    me.clicked(elem, input.is(":checked"));
                }
                touchIsAllowed = true;
            });

            switcherButton.on('touchmove', function (e) {
                e.preventDefault();
            });

            // setState for switchery which lacks of such a function
            switchery.setState = function (checkedBool) {
                if ((checkedBool && !switchery.isChecked()) || (!checkedBool && switchery.isChecked())) {
                    switchery.setPosition(true);
                    switchery.handleOnchange(true);
                }
            };

            // store input object for usage in update function of base class
            elem.data("famultibutton", input);

            // provide On / Off functions like a famultibutton
            input.setOn = function () {
                switchery.setState(true);
            };
            input.setOff = function () {
                switchery.setState(false);
            };
            input.setProgressValue = function () {};

            // init state is off
            switchery.setState(false);

        });
    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'checkbox',
        clicked: clicked,
        reinit: reinit,
        init: init,
    });
    return me;
};
