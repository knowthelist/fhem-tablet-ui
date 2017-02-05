/* FTUI Plugin
 * Copyright (c) 2015-2017 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_famultibutton() {
    if (!$.fn.famultibutton) {
        return ["lib/fa-multi-button.min.js"];
    }
}

var Modul_famultibutton = function () {

    function getSecondes(elem) {
        var seton = elem.data("set-on");
        var secondes;
        if (seton && !$.isNumeric(seton) && !$.isArray(seton) && ftui.getPart(seton, 1) === "on-for-timer") {
            secondes = ftui.getPart(elem.data("set-on"), 2);
        }
        if (elem.data("countdown")) {
            secondes = elem.data("countdown");
        }
        return secondes;
    }

    function startTimer(elem) {
        var id = elem.data("device") + "_" + elem.data('get');
        var now = new Date();
        var til = new Date(localStorage.getItem("ftui_timer_til_" + id));
        var secondes = localStorage.getItem("ftui_timer_sec_" + id);
        var count = (til - now) / 1000;

        var faelem = elem.data('famultibutton');
        if (faelem) {
            clearTimeout(elem.data('timer'));
            faelem.setProgressValue(1);
            elem.data('timer', setInterval(function () {
                if (count-- <= 0) {
                    clearInterval(elem.data('timer'));
                    localStorage.removeItem("ftui_timer_sec_" + id);
                    localStorage.removeItem("ftui_timer_til_" + id);
                }
                faelem.setProgressValue(count / secondes);
            }, 1000));
        }
    }

    function checkForTimer(elem) {
        var secondes = getSecondes(elem);
        if (secondes && $.isNumeric(secondes)) {
            var now = new Date();
            var til = new Date();
            var id = elem.data("device") + "_" + elem.data('get');
            til.setTime(now.getTime() + (parseInt(secondes) * 1000));
            localStorage.setItem("ftui_timer_sec_" + id, secondes);
            localStorage.setItem("ftui_timer_til_" + id, til);
            startTimer(elem);

            //inform other widgets to check their timer
            $(document).trigger('onforTimerStarted', [id]);
        }
    }

    function checkForRunningTimer(elem, id) {
        var secondes = getSecondes(elem);
        if (localStorage.getItem("ftui_timer_til_" + id)) {
            if (localStorage.getItem("ftui_timer_sec_" + id) == secondes || !secondes) {
                startTimer(elem);
            } else {
                stopRunningTimer(elem);
            }
        }
    }

    function stopRunningTimer(elem) {
        var faelem = elem.data('famultibutton');
        if (faelem) {
            faelem.setProgressValue(0);
        }
        clearInterval(elem.data('timer'));
    }

    function doubleclicked(elem, onoff) {
        if (elem.data('doubleclick') * 1 > 0) {
            if (!elem.data('_firstclick')) {
                elem.data('_firstclick', true);
                if (onoff == 'on') {
                    elem.data('_firstclick_reset', setTimeout(function () {
                        elem.data('_firstclick', false);
                        elem.setOff();
                    }, elem.data('doubleclick') * 1));
                    elem.setOff();
                } else {
                    elem.data('_firstclick_reset', setTimeout(function () {
                        elem.data('_firstclick', false);
                        elem.setOn();
                    }, elem.data('doubleclick') * 1));
                    elem.setOn();
                }
                elem.children().children('#bg').css('color', elem.data('firstclick-background-color'));
                elem.children().children('#fg').css('color', elem.data('firstclick-color'));
                return false;
            } else {
                elem.data('_firstclick', false);
                clearTimeout(elem.data('_firstclick_reset'));
            }
        }
        return true;
    }

    function showOverlay(elem, value) {
        elem.find('#warn-back').remove();
        elem.find('#warn').remove();
        if (ftui.isValid(value) && value !== "") {
            var val = ($.isNumeric(value) && value < 100) ? Number(value).toFixed(0) : '!';
            var faElem = elem.find('.famultibutton');
            var bgWarnElem = $('<i/>', {
                id: 'warn-back',
                class: 'fa fa-stack-1x fa-circle'
            }).appendTo(faElem);

            var fgWarnElem = $('<i/>', {
                id: 'warn',
                class: 'fa fa-stack-1x '
            }).html(val).appendTo(faElem);

            if (elem.isValidData('warn-color')) {
                fgWarnElem.css({
                    color: elem.data('warn-color')
                });
            }
            if (elem.isValidData('warn-background-color')) {
                bgWarnElem.css({
                    color: elem.data('warn-background-color')
                });
            }
            if (elem.hasClass('warnsamecolor')) {
                fgWarnElem.css({
                    color: '#000'
                });
                bgWarnElem.css({
                    color: elem.data('on-color')
                });
            }
        }
    }

    function showMultiStates(elem, states, state, idxOn) {

        var icons = elem.data('icons');
        var bgicons = elem.data('background-icons');
        var colors = elem.data('colors') || elem.data('on-colors');
        var bgcolors = elem.data('background-colors') || elem.data('on-background-colors');


        // if data-icons isn't set, try using data-icon or fa-power-off instead
        if (typeof icons == 'undefined') {
            icons = new Array(elem.data('icon') || 'fa-power-off');
        }
        // if data-background-icons isn't set, try using data-background-icon or '' instead
        if (typeof bgicons == 'undefined') {
            bgicons = new Array(elem.data('background-icon') || '');
        }
        // if data-colors isn't set, try using data-on-color, data-off-color or #505050 instead
        if (typeof colors == 'undefined') {
            colors = new Array(elem.data('on-color') || elem.data('off-color') || '#505050');
        }
        // if data-background-colors isn't set, try using data-on-background-color, data-off-background-color or #505050 instead
        if (typeof bgcolors == 'undefined') {
            bgcolors = new Array(elem.data('on-background-color') || elem.data('off-background-color') || '#505050');
        }

        // fill up colors and icons to states.length
        // if an index s isn't set, use the value of s-1
        for (var s = 0, len = states.length; s < len; s++) {
            if (typeof icons[s] == 'undefined') {
                icons[s] = icons[s > 0 ? s - 1 : 0];
            }
            if (typeof bgicons[s] == 'undefined') {
                bgicons[s] = bgicons[s > 0 ? s - 1 : 0];
            }
            if (typeof colors[s] == 'undefined') {
                colors[s] = colors[s > 0 ? s - 1 : 0];
            }
            if (typeof bgcolors[s] == 'undefined') {
                bgcolors[s] = bgcolors[s > 0 ? s - 1 : 0];
            }
        }

        var elm = elem.children().children('#fg');
        var idx = ftui.indexOfGeneric(states, state);
        if (idx > -1) {
            var faelem = elem.data('famultibutton');
            if (faelem) {
                idxOn = idxOn || 0;
                if (idx === idxOn) {
                    faelem.setOn();
                } else {
                    faelem.setOff();
                }
            }
            var id = elem.data('device') + "_" + elem.data('get');
            localStorage.setItem(me.widgetname + '_' + id + '_index', idx);

            // Get color values from reading or from fix array
            var colorValue = (colors[idx].match(/:/)) ? elem.getReading(colors[idx]).val : colors[idx];
            var bgColorValue = (bgcolors[idx].match(/:/)) ? elem.getReading('on-background-color').val : bgcolors[idx];

            elm.removeClass()
                .addClass('fa fa-stack-1x')
                .addClass(icons[idx])
                .css("color", ftui.getStyle('.' + colorValue, 'color') || colorValue);
            var bgelm = elem.children().children('#bg');
            bgelm.removeClass()
                .addClass('fa fa-stack-2x')
                .addClass(bgicons[idx]);
            bgelm.css("color", ftui.getStyle('.' + bgColorValue, 'color') || bgColorValue);

        }
    }

    function toggleOn(elem) {

        if (elem.hasClass('lock')) {
            elem.addClass('fail-shake');
            setTimeout(function () {
                var faelem = elem.data('famultibutton');
                if (faelem) {
                    faelem.setOff();
                }
                elem.removeClass('fail-shake');
            }, 500);
            return;
        }
        if (doubleclicked(elem, 'on')) {
            me.clicked(elem, 'on');
            elem.trigger("toggleOn");
            checkForTimer(elem);
            var blink = elem.data('blink');
            // blink=on     -> always reset state after 200ms
            // blink=off    -> never reset state after 200ms
            // blink=undef  -> reset state after 200ms if device is not set
            if (blink == 'on' || (!elem.data('device') && blink != 'off')) {
                setTimeout(function () {
                    var faelem = elem.data('famultibutton');
                    if (faelem) {
                        faelem.setOff();
                    }
                }, 200);
            }
        }
    }

    function toggleOff(elem) {

        if (elem.hasClass('lock')) {
            elem.addClass('fail-shake');
            setTimeout(function () {
                var faelem = elem.data('famultibutton');
                if (faelem) {
                    faelem.setOn();
                }
                elem.removeClass('fail-shake');
            }, 500);
            return;
        }
        if (doubleclicked(elem, 'off')) {
            me.clicked(elem, 'off');
            elem.trigger("toggleOff");
            var id = elem.data("device") + "_" + elem.data('get');
            stopRunningTimer(elem);
            localStorage.removeItem("ftui_timer_sec_" + id);
            localStorage.removeItem("ftui_timer_til_" + id);

            //inform other widgets to check their timer
            $(document).trigger('onforTimerStopped', [id]);

            var blink = elem.data('blink');
            if (blink == 'on' || (!elem.data('device') && blink != 'off')) {
                setTimeout(function () {
                    elem.setOn();
                }, 200);
            }
        }
    }

    function clicked(elem, onoff) {
        var target;
        var type;
        var device = elem.data('device');

        if (elem.attr('data-url')) {
            target = elem.attr('data-url');
            type = 'url';
        } else if (elem.attr('data-url-xhr')) {
            target = elem.attr('data-url-xhr');
            type = 'url-xhr';
        } else if (elem.attr('data-fhem-cmd')) {
            target = elem.attr('data-fhem-cmd');
            type = 'fhem-cmd';
        } else {
            var sets = elem.data('set-states') || elem.data('set-' + onoff);
            // no value given means don't send it and keep current state
            if (sets === '') {
                if (onoff === 'off')
                    elem.setOn();
                else
                    elem.setOff();
                return;
            }
            if (!$.isArray(sets)) {
                sets = new Array(String(sets));
            }
            var id = device + "_" + elem.data('get');
            var s = localStorage.getItem(me.widgetname + '_' + id + '_index') || 0;
            var set = typeof sets[s] != 'undefined' ? sets[s] : sets[0];
            s++;
            if (s >= sets.length) s = 0;
            localStorage.setItem(me.widgetname + '_' + id + '_index', s);

            // update widgets with multistate mode directly on click
            var states = elem.data('states') || elem.data('limits') || elem.data('get-on');
            if ($.isArray(states)) {
                me.showMultiStates(elem, states, set);
            }
            target = [elem.data('cmd'), device, elem.data('set'), set].join(' ');
            type = 'fhem-cmd';
        }
        switch (type) {
        case 'url':
            if (elem.hasClass('blank')) {
                window.open(target, '_blank');
            } else {
                document.location.href = target;
            }
            break;
        case 'url-xhr':
            if (device && typeof device != "undefined" && device !== " ") {
                ftui.toast(target);
            }
            $.get(target);
            break;
        case 'fhem-cmd':
            if (device && typeof device != "undefined" && device !== " ") {
                ftui.toast(target);
            }
            ftui.setFhemStatus(target);
            break;
        }
        elem.trigger("toggled");
    }

    function valueChanged(elem, v) {}

    function init_ui(elem) {

        elem.famultibutton({
            mode: elem.data('mode'),
            toggleOn: function () {
                me.toggleOn(elem);
            },
            toggleOff: function () {
                me.toggleOff(elem);
            },
            valueChanged: function (v) {
                me.valueChanged(elem, v);
            },
        });

        var id = elem.data('device') + "_" + elem.data('get');

        if (id !== ' _STATE' && id !== ' _' ) {

            // Notification from other widgets
            $(document).on("onforTimerStarted", function (event, wgtId) {
                checkForRunningTimer(elem, id);
            });

            $(document).on("onforTimerStopped", function (event, wgtId) {
                if (wgtId == id) {
                    stopRunningTimer(elem);
                }
            });

            // any old on-for-timer still active ?
            checkForRunningTimer(elem, id);
        }

        return elem;
    }

    function init_attr(elem) {

        elem.initData('get', 'STATE');
        elem.initData('set', '');
        elem.initData('cmd', 'set');
        elem.initData('get-on', 'true|1|on|open');
        elem.initData('get-off', 'false|0|off|closed');
        elem.initData('set-on', (elem.data('get-on')) != 'true|1|on|open' ? elem.data('get-on') : 'on');
        elem.initData('set-off', (elem.data('get-off')) != 'false|0|off|closed' ? elem.data('get-off') : 'off');
        elem.initData('mode', 'toggle');
        elem.initData('doubleclick', 0);
        elem.initData('firstclick-background-color', '#6F4500');
        elem.initData('firstclick-color', null);
        elem.initData('get-warn', -1);

        // reachable parameter
        elem.initData('reachable-on', '!off');
        elem.initData('reachable-off', 'false|0');
        me.addReading(elem, 'reachable');

        // if hide reading is defined, set defaults for comparison
        if (elem.isValidData('hide')) {
            elem.initData('hide-on', 'true|1|on');
        }
        elem.initData('hide', 'STATE');
        if (elem.isValidData('hide-on')) {
            elem.initData('hide-off', '!on');
        }
        me.addReading(elem, 'hide');

        // if lock reading is defined, set defaults for comparison
        if (elem.isValidData('lock')) {
            elem.initData('lock-on', 'true|1|on');
        }
        elem.initData('lock', elem.data('get'));
        if (elem.isValidData('lock-on')) {
            elem.initData('lock-off', '!on');
        }
        me.addReading(elem, 'lock');

        me.addReading(elem, 'get');
        
        // warn parameter
        elem.initData('warn-on', 'true|on|[1-9]{1}[0-9]*');
        elem.initData('warn-off', 'false|off|0');
        me.addReading(elem, 'warn');

        elem.initData('off-color', elem.data('color') || ftui.getStyle('.' + me.widgetname + '.off', 'color') || '#505050');
        elem.initData('off-background-color', elem.data('background-color') || ftui.getStyle('.' + me.widgetname + '.off', 'background-color') || '#505050');
        elem.initData('on-color', elem.data('color') || ftui.getStyle('.' + me.widgetname + '.on', 'color') || '#aa6900');
        elem.initData('on-background-color', elem.data('color') || elem.data('background-color') || ftui.getStyle('.' + me.widgetname + '.on', 'background-color') || '#aa6900');

        if (elem.hasClass('invert')) {
            var c1 = elem.data('off-background-color');
            elem.data('off-background-color', elem.data('off-color'));
            elem.data('off-color', c1);
            var c2 = elem.data('on-background-color');
            elem.data('on-background-color', elem.data('on-color'));
            elem.data('on-color', c2);
        }

        // translate html color names into FTUI colors
        elem.data('off-color', ftui.getStyle('.' + elem.data('off-color'), 'color') || elem.data('off-color'));
        elem.data('on-color', ftui.getStyle('.' + elem.data('on-color'), 'color') || elem.data('on-color'));
        elem.data('off-background-color', ftui.getStyle('.' + elem.data('off-background-color'), 'color') || elem.data('off-background-color'));
        elem.data('on-background-color', ftui.getStyle('.' + elem.data('on-background-color'), 'color') || elem.data('on-background-color'));

        if (elem.isDeviceReading('on-color')) {
            me.addReading(elem, 'on-color');
        }
        if (elem.isDeviceReading('on-background-color')) {
            me.addReading(elem, 'on-background-color');
        }
        if (elem.isDeviceReading('off-color')) {
            me.addReading(elem, 'off-color');
        }
        if (elem.isDeviceReading('off-background-color')) {
            me.addReading(elem, 'off-background-color');
        }
    }

    function update_cb(elem) {}

    function update(dev, par) {

        // update from normal state reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.getReading('get').val;
                var state = ftui.getPart(value, elem.data('part'));
                if (ftui.isValid(state)) {
                    var states = elem.data('states') || elem.data('limits') || elem.data('get-on');
                    if ($.isArray(states)) {
                        me.showMultiStates(elem, states, state);
                    } else {
                        var faelem = elem.data('famultibutton');
                        if (faelem) {
                            if (elem.matchingState('get', state) === 'on') {
                                faelem.setOn();
                            }
                            if (elem.matchingState('get', state) === 'off') {
                                faelem.setOff();
                            }
                        }
                    }
                    if (!elem.isValidData('warn')) {
                        me.update_cb(elem, state);
                    }
                }
            });
        // update from extra reading for colorize
        var oparm = ['offColor', 'onColor', 'onBackgroundColor', 'offBackgroundColor'];
        var selec = ['#fg', '#fg', '#bg', '#bg'];
        var estat = [false, true, true, false];
        $.each(['off-color', 'on-color', 'on-background-color', 'off-background-color'], function (index, key) {
            me.elements.filterDeviceReading(key, dev, par)
                .each(function (idx) {
                    var elem = $(this);
                    var val = elem.getReading(key).val;
                    if (ftui.isValid(val)) {
                        val = '#' + val.replace('#', '');
                        console.log(val);

                        var faelem = elem.data('famultibutton');
                        if (faelem) {
                            // change color in options
                            faelem.o[oparm[index]] = val;
                            if (faelem.getState() === estat[index]) {
                                // it's current state -> change directly
                                elem.find(selec[index]).css("color", val);
                            }
                        }
                    }
                });
        });

        //extra reading for lock
        me.update_lock(dev, par);

        //extra reading for hide
        me.update_hide(dev, par);

        //extra reading for reachable
        me.update_reachable(dev, par);


        //extra reading for warn
        me.elements.filterDeviceReading('warn', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var warn = elem.getReading('warn').val;
                if (elem.matchingState('warn', warn) === 'on') {
                    me.showOverlay(elem, ftui.getPart(warn, elem.data('get-warn')));
                }
                if (elem.matchingState('warn', warn) === 'off') {
                    me.showOverlay(elem, "");
                }
            });
    }

    // public
    // inherit all public members from base class

    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'famultibutton',
        init_attr: init_attr,
        init_ui: init_ui,
        toggleOn: toggleOn,
        toggleOff: toggleOff,
        clicked: clicked,
        doubleclicked: doubleclicked,
        update: update,
        update_cb: update_cb,
        showMultiStates: showMultiStates,
        valueChanged: valueChanged,
        showOverlay: showOverlay
    });

    return me;
};