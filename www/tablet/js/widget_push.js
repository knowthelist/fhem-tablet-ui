/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_famultibutton:true */

"use strict";

function depends_push() {
    if (typeof Module_famultibutton == 'undefined' || !$.fn.famultibutton) {
        return ["famultibutton"];
    }
}

var Modul_push = function () {

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.initData('device', ' ');
            elem.initData('off-color', ftui.getStyle('.' + me.widgetname + '.off', 'color') || '#505050');
            elem.initData('off-background-color', elem.data('background-color') || ftui.getStyle('.' + me.widgetname + '.off', 'background-color') || '#505050');
            elem.initData('on-color', ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname + '.on', 'color') || '#aa6900');
            elem.initData('on-background-color', ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname + '.on', 'background-color') || '#aa6900');
            elem.initData('background-icon', 'fa-circle-thin');
            elem.initData('set-on', 'on');
            elem.initData('set-off', 'off');

            elem.data('mode', 'push');
            me.init_attr(elem);
            me.init_ui(elem);
        });
    }

    function update(dev, par) {
        
        // reading for lock
        me.elements.filterDeviceReading('lock', dev, par)
            .each(function (idx) {
                var elem = $(this);
                elem.data('readonly', elem.getReading('lock').val);
            });

        // reading for hide
        me.elements.filterDeviceReading('hide', dev, par)
            .each(function (idx) {
                var elem = $(this);
                me.checkHide(elem, elem.getReading('hide').val);
            });

        // reading for reachable
        me.elements.filterDeviceReading('reachable', dev, par)
            .each(function (idx) {
                var elem = $(this);
                elem.removeClass(function (index, css) {
                    return (css.match(/(^|\s)reachable-\S+/g) || []).join(' ');
                });
                elem.addClass('reachable-' + elem.getReading('reachable').val);
            });


        // reading for warn
        me.elements.filterDeviceReading('warn', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var warn = elem.getReading('warn').val;
                if (warn > 0 || warn == 'true' || warn == 'on') {
                    me.showOverlay(elem, ftui.getPart(warn, elem.data('get-warn')));
                } else {
                    me.showOverlay(elem, "");
                }
            });
    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'push',
        init: init,
        update: update,
    });

    return me;
};