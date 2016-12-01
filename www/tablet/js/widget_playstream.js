/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_famultibutton:true */

"use strict";

function depends_playstream() {
    if (typeof Module_famultibutton == 'undefined' || !$.fn.famultibutton) {
        return ["famultibutton"];
    }
}

var Modul_playstream = function () {

    function startStream(elem) {
        elem.data('audio').play();
        var elemFgIcon = elem.children().filter('#fg');
        elemFgIcon.removeClass();
        elemFgIcon.addClass('fa fa-stack-1x');
        elemFgIcon.addClass(elem.data('icon-play'));
    }

    function stopStream(elem) {
        elem.data('audio').pause();
        var elemFgIcon = elem.children().filter('#fg');
        elemFgIcon.removeClass();
        elemFgIcon.addClass('fa fa-stack-1x');
        elemFgIcon.addClass(elem.data('icon'));
    }

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.initData('off-color', ftui.getStyle('.playstream.off', 'color') || '#2A2A2A');
            elem.initData('off-background-color', ftui.getStyle('.playstream.off', 'background-color') || '#505050');
            elem.initData('on-color', ftui.getClassColor(elem) || ftui.getStyle('.playstream.on', 'color') || '#2A2A2A');
            elem.initData('on-background-color', ftui.getStyle('.playstream.on', 'background-color') || '#aa6900');
            elem.initData('background-icon', 'fa-circle');
            elem.initData('icon', (($.isArray(elem.data('icons'))) ? elem.data('icons')[0] : 'fa-play'));
            elem.initData('icon-play', (($.isArray(elem.data('icons')) && elem.data('icons').length > 1) ? elem.data('icons')[1] : 'fa-pause'));
            elem.initData('set-on', '');
            elem.initData('set-off', '');
            elem.initData('volume', 'volume');
            elem.initData('audio', new Audio(elem.data('url')));

            elem.data('mode', 'toggle');
            me.addReading(elem, 'volume');
            me.init_attr(elem);
            me.init_ui(elem);
        });
    }

    function toggleOn(elem) {

        //stop all streams
        me.elements.each(function (index, el) {
            $(this).data('audio').pause();
        });
        //switch all paused buttons to OFF after 500ms
        setTimeout(function () {
            me.elements.each(function (index, el) {
                if ($(this).data('audio').paused) {
                    $(this).data('famultibutton').setOff();
                }
            });
        }, 500);
        //start stream
        startStream(elem);
    }

    function toggleOff(elem) {
        //stop this streams
        stopStream(elem);
    }

    function update(dev, par) {

        // update from normal state reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var state = elem.getReading('get').val;
                if (state) {
                    var states = elem.data('get-on');
                    var faelem = elem.data('famultibutton');
                    if (faelem) {
                        if (state == elem.data('get-on')) {
                            faelem.setOn();
                            startStream(elem);
                        } else if (state == elem.data('get-off')) {
                            faelem.setOff();
                            stopStream(elem);
                        } else if (state.match(new RegExp('^' + elem.data('get-on') + '$'))) {
                            faelem.setOn();
                            startStream(elem);
                        } else if (state.match(new RegExp('^' + elem.data('get-off') + '$'))) {
                            faelem.setOff();
                            stopStream(elem);
                        } else if (elem.data('get-off') == '!on' && state != elem.data('get-on')) {
                            faelem.setOff();
                            stopStream(elem);
                        } else if (elem.data('get-on') == '!off' && state != elem.data('get-off')) {
                            faelem.setOn();
                            startStream(elem);
                        }
                    }
                }
            });
        // update from extra reading for volume
        me.elements.filterDeviceReading('volume', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var volume = elem.getReading('volume').val;
                if ($.isNumeric(volume)) {
                    ftui.log(3, 'playstream - set volume to :', parseInt(volume) / 100.0);
                    elem.data('audio').volume = parseInt(volume) / 100.0;
                }
            });
    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'playstream',
        init: init,
        toggleOn: toggleOn,
        toggleOff: toggleOff,
        update: update,
    });

    return me;
};