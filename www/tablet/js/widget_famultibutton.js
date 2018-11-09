/* FTUI Plugin
 * Copyright (c) 2015-2017 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_famultibutton() {

    var deps = [];
    if (!$.fn.famultibutton) {
        deps.push(ftui.config.basedir + "lib/fa-multi-button.min.js");
    }
    if (!$.fn.draggable) {
        deps.push(ftui.config.basedir + "lib/jquery-ui.min.js");
    }
    return deps;

}

var Modul_famultibutton = function () {


    // Notification from other widgets
    $(document).on("onforTimerStarted", function (event, wgtId) {
        if (me.elements.length > 0) {
            me.elements.filter('div[data-timer-id="' + wgtId + '"]').each(function (index) {
                checkForRunningTimer($(this), wgtId);
            });
        }
    });

    $(document).on("onforTimerStopped", function (event, wgtId) {
        if (me.elements.length > 0) {
            me.elements.filter('div[data-timer-id="' + wgtId + '"]').each(function (index) {
                stopRunningTimer($(this));
            });
        }
    });

    function getSecondes(elem) {
        var seton = elem.data("set-on");
        var secondes;
        if (seton && !$.isNumeric(seton) && !$.isArray(seton) && ftui.getPart(seton, 1) === "on-for-timer") {
            secondes = ftui.getPart(elem.data("set-on"), 2);
        } else if (elem.isDeviceReading('countdown')) {
            secondes = elem.data("secondes");
        } else {
            secondes = elem.data("countdown");
        }
        return secondes;
    }

    function startTimer(elem) {
        var id = elem.data("device") + "_" + elem.data('get');
        var now = new Date();
        var til = new Date(sessionStorage.getItem("ftui.timer_til." + id));
        var count = (til - now) / 1000;
        var secondes = count;

        var faelem = elem.data('famultibutton');
        if (faelem && count > 0) {
            clearTimeout(elem.data('timer'));
            faelem.setProgressValue(1);
            elem.data('timer', setInterval(function () {
                if (count-- <= 0) {
                    clearInterval(elem.data('timer'));
                    sessionStorage.removeItem("ftui.timer_sec." + id);
                    sessionStorage.removeItem("ftui.timer_til." + id);
                }
                faelem.setProgressValue(count / secondes);
            }, 1000));
        }
    }

    function checkForTimer(elem, force) {
        var id = elem.data("device") + "_" + elem.data('get');
        var secondes = sessionStorage.getItem("ftui.timer_sec." + id);
        if (!secondes) {
            secondes = getSecondes(elem);
        }
        if (secondes && $.isNumeric(secondes)) {
            var ts = elem.getReading('get').date;

            if (ts || force) {
                var now = (ts && !force) ? ts.toDate() : new Date();
                var til = now;

                til.setTime(now.getTime() + (parseInt(secondes) * 1000));

                if (force) {
                    sessionStorage.setItem("ftui.timer_sec." + id, secondes);
                }

                sessionStorage.setItem("ftui.timer_til." + id, til);
                startTimer(elem);

                if (force) {
                    // inform other widgets to check their timer
                    $(document).trigger('onforTimerStarted', [id]);
                }
            }
        }
    }

    function checkForRunningTimer(elem, id) {

        if (sessionStorage.getItem("ftui.timer_til." + id)) {
            var secondes = getSecondes(elem);
            if (sessionStorage.getItem("ftui.timer_sec." + id) == secondes) {
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
        elem.find('#warn').remove();
        if (ftui.isValid(value) && value !== "") {
            var val = ($.isNumeric(value)) ? Number(value).toFixed(elem.data('warn-fixed')) : '!';
            var digits = val.toString().length;
            if (elem.isValidData('warn-icon')) {
                val = '<i class="fa ' + elem.data('warn-icon') + '"><i/>';
            }
            var faElem = elem.find('.famultibutton');
            var warnElem = $('<i/>', {
                id: 'warn',
                class: 'digits' + digits
            }).html(val).appendTo(faElem);

            if (elem.isValidData('warn-color')) {
                warnElem.css({
                    color: elem.data('warn-color')
                });
            }
            if (elem.isValidData('warn-background-color')) {
                warnElem.css({
                    backgroundColor: elem.data('warn-background-color')
                });
            }
            if (elem.hasClass('warnsamecolor')) {
                warnElem.css({
                    color: '#000',
                    backgroundColor: elem.data('on-color')
                });
            }
        }
    }

    function showMultiStates(elem, states, state) {

        var idx = ftui.indexOfGeneric(states, state);
        if (idx > -1) {
            var faelem = elem.data('famultibutton');
            if (faelem) {
                var isOn = elem.isValidData('active') ? elem.data('active') : (state == elem.data('set-on'));
                if (isOn) {
                    faelem.setOn();
                } else {
                    faelem.setOff();
                }

                /*jshint -W030*/
                var icons = elem.data("icons"),
                    classes = elem.data("classes"),
                    bgicons = elem.data("background-icons"),
                    colors = elem.data("colors"),
                    bgcolors = elem.data("background-colors");

                sessionStorage.setItem(['ftui', elem.widgetId(), 'idx'].join('.'), idx);
                var faElem = elem.find('.famultibutton');


                if (classes !== void 0 && classes[idx] !== void 0) {
                    faElem.removeClass(classes.join(" "));
                    faElem.addClass(classes[idx]);
                }

                if (colors !== void 0 && colors[idx] !== void 0) {
                    var colorValue = (colors[idx].match(/:/)) ? elem.getReading("colors", idx).val : colors[idx];
                    faelem.setForegroundColor(ftui.getStyle('.' + colorValue, 'color') || colorValue);
                }

                if (bgcolors !== void 0 && bgcolors[idx] !== void 0) {
                    var bgColorValue = (bgcolors[idx].match(/:/)) ? elem.getReading("background-colors", idx).val : bgcolors[idx];
                    faelem.setBackgroundColor(ftui.getStyle('.' + bgColorValue, 'color') || bgColorValue);
                }

                if (icons !== void 0 && icons[idx] !== void 0) {
                    faelem.setForegroundIcon(icons[idx]);
                }

                if (bgicons !== void 0 && bgicons[idx] !== void 0) {
                    faelem.setBackgroundIcon(bgicons[idx]);
                }
            }
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
            checkForTimer(elem, 'force');
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
            sessionStorage.removeItem("ftui.timer_sec." + id);
            sessionStorage.removeItem("ftui.timer_til." + id);

            // inform other widgets to check their timer
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
        } else if (elem.attr('data-js-cmd')) {
            target = elem.attr('data-js-cmd');
            type = 'js-cmd';
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
            var s = sessionStorage.getItem(['ftui', elem.widgetId(), 'idx'].join('.')) || 0;
            var set = sets[s] !== void 0 ? sets[s] : sets[0];
            //supress sending possible

            var states = elem.data('states') || elem.data('limits') || elem.data('get-on');
            if (set !== '') {
                s++;
                if (s >= sets.length) s = 0;
                sessionStorage.setItem(['ftui', elem.widgetId(), 'idx'].join('.'), s);

                // update widgets with multistate mode directly on click

                if ($.isArray(states)) {
                    me.showMultiStates(elem, states, set);
                }

                target = [elem.data('cmd'), device, elem.data('set'), set].join(' ');
                type = 'fhem-cmd';

            } else {
                // keep current state
                if ($.isArray(states)) {
                    me.showMultiStates(elem, states, elem.data('value'));
                } else {
                    if (onoff === 'off')
                        elem.setOn();
                    else
                        elem.setOff();
                }
            }
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
                if (device && device !== void 0 && device !== " ") {
                    ftui.toast(target);
                }
                $.get(target);
                break;
            case 'js-cmd':
                eval(target);
                break;
            case 'fhem-cmd':
                if (device && device !== void 0 && device !== " ") {
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

        // init embedded widgets
        if (elem.find('[data-type]').length > 0) {
            ftui.initWidgets('[data-wgid="' + elem.wgid() + '"]');
        }

        var size = elem.data('size');
        var sizeUnit = ($.isNumeric(size)) ? '%' : '';
        if (size) {
            elem.css({
                'font-size': size + sizeUnit
            });
        }

        var id = elem.data('device') + "_" + elem.data('get');

        if (id !== 'undefined_STATE' && id !== ' _STATE' && id !== ' _') {

            elem.attr('data-timer-id', id);

            // any old on-for-timer still active ?
            checkForRunningTimer(elem, id);
        }

        if (elem.hasClass('drag')) {
            elem.draggable();
            elem.draggable();
        }

        if (elem.hasClass('drop')) {
            elem.droppable({
                hoverClass: "drop-hover",
                accept: ".drag",
                drop: function (event, ui) {
                    elem.data('value', ui.draggable.data('device'));
                    ui.draggable.animate({
                        top: "0px",
                        left: "0px"
                    });
                    elem.transmitCommand();
                }
            });
        }
        return elem;
    }

    function init_attr(elem) {
        elem.initData('get', 'STATE');
        elem.initData('set', '');
        elem.initData('cmd', 'set');
        elem.initData('get-on', '(true|1|on|open|ON)');
        elem.initData('get-off', '!on');

        var getOn = elem.data('get-on');
        var getOff = elem.data('get-off');
        elem.initData('set-on', (getOn !== '(true|1|on|open|ON)' && getOn !== '!off') ? elem.data('get-on') : 'on');
        elem.initData('set-off', (getOff !== '!on') ? elem.data('get-off') : 'off');
        elem.initData('mode', 'toggle');
        elem.initData('doubleclick', 0);
        elem.initData('firstclick-background-color', '#6F4500');
        elem.initData('firstclick-color', null);
        elem.initData('get-warn', -1);

        // reachable parameter
        elem.initData('reachable-on', '!off');
        elem.initData('reachable-off', '(false|0)');
        me.addReading(elem, 'reachable');
        if (elem.isDeviceReading('reachable-on')) {
            me.addReading(elem, 'reachable-on');
        }
        if (elem.isDeviceReading('reachable-off')) {
            me.addReading(elem, 'reachable-off');
        }

        // if hide reading is defined, set defaults for comparison
        if (elem.isValidData('hide')) {
            elem.initData('hide-on', '(true|1|on)');
        }
        elem.initData('hide', 'STATE');
        if (elem.isValidData('hide-on')) {
            elem.initData('hide-off', '!on');
        }
        me.addReading(elem, 'hide');
        if (elem.isDeviceReading('hide-on')) {
            me.addReading(elem, 'hide-on');
        }
        if (elem.isDeviceReading('hide-off')) {
            me.addReading(elem, 'hide-off');
        }

        // if lock reading is defined, set defaults for comparison
        if (elem.isValidData('lock')) {
            elem.initData('lock-on', '(true|1|on)');
        }
        elem.initData('lock', elem.data('get'));
        if (elem.isValidData('lock-on')) {
            elem.initData('lock-off', '!on');
        }
        me.addReading(elem, 'lock');
        if (elem.isDeviceReading('lock-on')) {
            me.addReading(elem, 'lock-on');
        }
        if (elem.isDeviceReading('lock-off')) {
            me.addReading(elem, 'lock-off');
        }

        me.addReading(elem, 'get');
        if (elem.isDeviceReading('get-on')) {
            me.addReading(elem, 'get-on');
        }
        if (elem.isDeviceReading('get-off')) {
            me.addReading(elem, 'get-off');
        }

        // counterdown
        if (elem.isDeviceReading('countdown')) {
            me.addReading(elem, 'countdown');
        }

        // warn parameter
        elem.initData('warn-on', '(true|on|[1-9]{1}[0-9]*)');
        elem.initData('warn-off', '(false|off|0)');
        elem.initData('warn-fixed', '0');
        me.addReading(elem, 'warn');

        var elemData = elem.data();
        elem.initData("off-color", elemData.color || "#505050");
        elem.initData("off-background-color", elemData.backgroundColor || "#505050");
        elem.initData("on-color", elemData.color || "#aa6900");
        elem.initData("on-background-color", elemData.backgroundColor || "#aa6900");

        // change back with front colors
        if (elem.hasClass("invert")) {
            var c1 = elemData.offBackgroundColor;
            elem.data("off-background-color", elemData.offColor);
            elem.data("off-color", c1);
            var c2 = elemData.onBackgroundColor;
            elem.data("on-background-color", elemData.onColor);
            elem.data("on-color", c2);
        }

        // translate html color names into FTUI colors
        elem.data("off-color", ftui.getStyle("." + elemData.offColor, "color") || elemData.offColor);
        elem.data("on-color", ftui.getStyle("." + elemData.onColor, "color") || elemData.onColor);
        elem.data("off-background-color", ftui.getStyle("." + elemData.offBackgroundColor, "color") || elemData.offBackgroundColor);
        elem.data("on-background-color", ftui.getStyle("." + elemData.onBackgroundColor, "color") || elemData.onBackgroundColor);

        if (elem.isDeviceReading("on-color")) {
            me.addReading(elem, "on-color");
        }
        if (elem.isDeviceReading("on-background-color")) {
            me.addReading(elem, "on-background-color");
        }
        if (elem.isDeviceReading("off-color")) {
            me.addReading(elem, "off-color");
        }
        if (elem.isDeviceReading("off-background-color")) {
            me.addReading(elem, "off-background-color");
        }

        me.extractReadings(elem, "colors");
        me.extractReadings(elem, "background-colors");
    }

    function update_cb(elem) {}

    function update(dev, par) {

        me.elements.each(function (index) {
            var elem = $(this);

            // update from normal state reading
            $.each(['get', 'get-on', 'get-off'], function (idx, key) {
                if (elem.matchDeviceReading(key, dev, par)) {
                    var value = elem.getReading('get').val;
                    var state = ftui.getPart(value, elem.data('part'));
                    //ftui.log(2, 'famultibutton.update for "get": state=' + state + ' dev=' + dev + ' par=' + par + ' key=' + key + ' index=' + index + ' idx=' +idx);
                    if (ftui.isValid(state)) {
                        elem.data('value', state);
                        var states = elem.data('states') || elem.data('limits') || elem.data('get-on');
                        if ($.isArray(states)) {
                            me.showMultiStates(elem, states, state);
                        } else {
                            var faelem = elem.data('famultibutton');
                            if (faelem) {
                                if (elem.matchingState('get', state) === 'on') {
                                    faelem.setOn();
                                    checkForTimer(elem);
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
                }
            });


            // update from extra reading for colorize
            var oparm = ['offColor', 'onColor', 'onBackgroundColor', 'offBackgroundColor'];
            var selec = ['#fg', '#fg', '#bg', '#bg'];
            var estat = [false, true, true, false];
            $.each(['off-color', 'on-color', 'on-background-color', 'off-background-color'], function (index, key) {
                if (elem.matchDeviceReading(key, dev, par)) {
                    var val = elem.getReading(key).val;
                    if (ftui.isValid(val)) {
                        val = '#' + val.replace('#', '');
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
                }
            });

            // extra reading for warn
            if (elem.matchDeviceReading('warn', dev, par)) {
                var warn = elem.getReading('warn').val;
                if (elem.matchingState('warn', warn) === 'on') {
                    me.showOverlay(elem, ftui.getPart(warn, elem.data('get-warn')));
                }
                if (elem.matchingState('warn', warn) === 'off') {
                    me.showOverlay(elem, "");
                }
            }

            // extra reading for countdown
            if (elem.matchDeviceReading('countdown', dev, par)) {
                elem.data('secondes', elem.getReading('countdown').val);
            }

            // extra reading for reachable
            me.updateReachable(elem, dev, par);

            // extra reading for hide
            me.updateHide(elem, dev, par);

            // extra reading for lock
            me.updateLock(elem, dev, par);

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
