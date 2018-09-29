/* FTUI Plugin
 * Copyright (c) 2015-2018 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_famultibutton:true */

"use strict";

function depends_playstream() {
    if (window['Module_famultibutton'] === void 0 || !$.fn.famultibutton) {
        return ["famultibutton"];
    }
}

var Modul_playstream = function () {

    function startStream(elem) {

        var faElem = elem.data('famultibutton');

        //stop all streams
        me.elements.each(function (index, el) {
            stopStream($(this));
        });

        faElem.setOn();

        var audio = elem.data('audio');
        var volume = elem.data('volume');

        audio.src = elem.data('src');
        audio.type = elem.data('type');
        audio.load();
        audio.play().catch(function (error) {
            ftui.log(1, "Error: " + error);
        });
        if ($.isNumeric(volume)) {
            audio.volume = parseInt(volume) / 100.0;
        }

        var elemFgIcon = elem.children().children('#fg');
        elemFgIcon.removeClass();
        elemFgIcon.addClass('fa fa-stack-1x');
        elemFgIcon.addClass(elem.data('icon-play'));
    }

    function stopStream(elem) {

        var audio = elem.data('audio');
        audio.pause();
        audio.src = null;
        audio.load();
        var elemFgIcon = elem.children().children('#fg');
        elemFgIcon.removeClass();
        elemFgIcon.addClass('fa fa-stack-1x');
        elemFgIcon.addClass(elem.data('icon'));
        elem.data('famultibutton').setOff();
    }

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");

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
            elem.initData('audio', new Audio());
            elem.initData('type', 'audio/mpeg');

            elem.data('mode', 'toggle');

            if (!elem.isUrlData('url')) {
                me.addReading(elem, 'url');
            } else {
                elem.data('src',elem.data('url'));
            }

            if (!$.isNumeric(elem.data('volume'))) {
                me.addReading(elem, 'volume');
            }
            me.init_attr(elem);
            me.init_ui(elem);
        });
    }

    function toggleOn(elem) {

        startStream(elem);
        var setOn = elem.data('set-on');
        if (setOn !== '') {
            elem.data('value', setOn);
            elem.transmitCommand();
        }
    }

    function toggleOff(elem) {

        stopStream(elem);
        var setOff = elem.data('set-off');
        if (setOff !== '') {
            elem.data('value', setOff);
            elem.transmitCommand();
        }
    }

    function update(dev, par) {

        // update from normal state reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.getReading('get').val;
                var state = ftui.getPart(value, elem.data('part'));
                var faElem = elem.data('famultibutton');

                if (elem.matchingState('get', state) === 'on') {
                    if (faElem.getState() !== true) {
                        startStream(elem);
                    }
                }
                if (elem.matchingState('get', state) === 'off') {
                    if (faElem.getState() !== false) {
                        stopStream(elem);
                    }
                }
            });

        // update from extra reading for volume
        me.elements.filterDeviceReading('volume', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var volume = elem.getReading('volume').val;
                if ($.isNumeric(volume)) {
                    ftui.log(3, ['playstream - set volume to :', parseInt(volume) / 100.0].join(''));
                    elem.data('audio').volume = parseInt(volume) / 100.0;
                }
            });

        // update from extra reading for url
        me.elements.filterDeviceReading('url', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var url = elem.getReading('url').val;
                if (ftui.isValid(url)) {
                    ftui.log(3, ['playstream - set url to :', url].join(''));
                    elem.data('src', url);
                    if ( !elem.data('audio').paused) {
                        startStream(elem);
                    }
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
