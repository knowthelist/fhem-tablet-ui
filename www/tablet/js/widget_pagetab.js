/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_famultibutton:true */

"use strict";

function depends_pagetab() {
    if (typeof Module_famultibutton == 'undefined' || !$.fn.famultibutton) {
        return ["famultibutton"];
    }
}

var Modul_pagetab = function () {

    function startReturnTimer() {
        var mainElem = me.elements.eq(0);
        var waitUntilReturn = mainElem.data('return-time');
        var lastUrl = localStorage.getItem('pagetab_lastUrl');
        var returnTimer = localStorage.getItem('pagetab_returnTimer');
        clearTimeout(returnTimer);
        if (waitUntilReturn > 0 && lastUrl !== mainElem.data('url')) {
            ftui.log(1, 'Reload main tab in : ' + waitUntilReturn + ' seconds');
            returnTimer = setTimeout(function () {
                // back to first page
                localStorage.setItem('pagetab_doload', 'initializing');
                loadPage(mainElem.data('url'), true);
            }, waitUntilReturn * 1000);
            localStorage.setItem('pagetab_returnTimer', returnTimer);
        }
    }

    function loadPage(goUrl, doPush) {
        // set return timer
        localStorage.setItem('pagetab_lastUrl', goUrl);
        startReturnTimer();
        ftui.saveStatesLocal();

        ftui.log(3, 'load page called with : ' + goUrl);
        if (doPush) {
            history.pushState(history.state, history.title, '#' + goUrl);
        } else {
            history.replaceState(history.state, history.title, '#' + goUrl);
        }
        $('div.gridster').fadeTo(200, 0);
        if (ftui.isValid(goUrl)) {
            $.get(goUrl, function (data_html) {
                $('div.gridster')
                    .html($(data_html).closest('div.gridster').html())
                    .fadeTo(600, 1);
                ftui.initPage();
                $('div.gridster').fadeTo(600, 1);
            });
        }
    }

    function toggleOn(elem) {
        var elem_url = elem.data('url');
        ftui.log(3, 'change window location : ' + elem_url);
        localStorage.setItem('pagetab_doload', 'initializing');
        ftui.log(3, 'toggle on with : ' + elem_url);
        loadPage(elem_url, true);
    }

    function toggleOff(elem) {
        setTimeout(function () {
            elem.setOn();
        }, 50);
    }

    function init() {

        ftui.log(3, 'init is executed / currently at : ' + window.location);
        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);

        ftui.log(3, 'get localStore pagetab_doload (init) to: ' + localStorage.getItem('pagetab_doload'));
        var dl = localStorage.getItem('pagetab_doload');
        var isInitialised = (dl === 'initializing');
        if (!dl) {
            if (window.location.hash) {
                ftui.log(3, 'init set doload : ' + window.location.hash);
                localStorage.setItem('pagetab_doload', window.location.hash.replace('#', ''));
            } else {
                ftui.log(3, 'init set doload : ' + 'home: ' + me.elements.eq(0).data('url'));
                localStorage.setItem('pagetab_doload', me.elements.eq(0).data('url'));
            }
            dl = localStorage.getItem('pagetab_doload');
            ftui.log(3, 'init set doload to <initializing> ');
            localStorage.setItem('pagetab_doload', 'initializing');
            loadPage(dl);
        } else if (!isInitialised) {
            ftui.log(3, 'redirect init : ');
            ftui.log(3, 'init set doload to <initializing> ');
            localStorage.setItem('pagetab_doload', 'initializing');
            loadPage(dl);
        } else {
            ftui.log(3, 'normal init : ');

            me.elements.each(function (index) {
                var elem = $(this);
                elem.initData('off-color', ftui.getStyle('.' + me.widgetname + '.off', 'color') || '#606060');
                elem.initData('off-background-color', elem.data('background-color') || ftui.getStyle('.' + me.widgetname + '.off', 'background-color') || 'transparent');
                elem.initData('on-color', ftui.getStyle('.' + me.widgetname + '.on', 'color') || '#222222');
                elem.initData('on-background-color', elem.data('background-color') || ftui.getStyle('.' + me.widgetname + '.on', 'background-color') || '#606060');
                elem.initData('background-icon', 'fa-circle');
                elem.initData('mode', 'toggle');
                elem.initData('text', '');
                elem.initData('return-time', 0);
                me.init_attr(elem);

                elem = me.init_ui(elem);

                var elem_url = elem.data('url');
                var isCurrent = false;

                if (!ftui.config.filename) {
                    if (!window.location.hash) {
                        isCurrent = (index === 0);
                    } else {
                        isCurrent = (window.location.hash.indexOf(elem_url, 1) > -1);
                    }
                } else if (elem_url && elem_url.indexOf(ftui.config.filename) > -1) {
                    isCurrent = true;
                } else {
                    if (!window.location.hash) {
                        isCurrent = (index === 0);
                    } else {
                        isCurrent = (window.location.hash.indexOf(elem_url, 1) > -1);
                    }
                }

                elem.attr('title', elem.data('url'));

                // prepare text element
                if (elem.data('text')) {
                    var elemText = $('<div/>', {
                            class: 'label',
                        })
                        .html(elem.data('text'))
                        .appendTo(elem);
                }

                if (isCurrent) {
                    elem.setOn();
                    elem.data('on-colors', [elem.data('on-color')]);
                    elem.data('on-background-colors', [elem.data('on-background-color')]);
                } else {
                    elem.setOff();
                    elem.data('on-colors', [elem.data('off-color')]);
                    elem.data('on-background-colors', [elem.data('off-background-color')]);
                }
            });

            $(window).once('popstate', function (event) {
                localStorage.setItem('pagetab_doload', 'initializing');
                var hashUrl = window.location.hash.replace('#', '');
                if (hashUrl) {
                    loadPage(hashUrl);
                } else {
                    loadPage(me.elements.eq(0).data('url'));
                }
            });

            // start return timer after last activity
            if (me.elements.eq(0).data('return-time') > 0) {
                $('body').once('touchend mouseup', function (e) {
                    startReturnTimer();
                });
            }

            localStorage.removeItem('pagetab_doload');
        }
    }

    function update(dev, par) {

        // update from normal state reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var state = elem.getReading('get').val;
                if (state) {
                    var states = elem.data('states') || elem.data('get-on');
                    if ($.isArray(states)) {
                        me.showMultiStates(elem, states, state, -1);
                    }
                }
                if (elem.hasClass('warn') || elem.children().children('#fg').hasClass('warn'))
                    me.showOverlay(elem, state);
                else
                    me.showOverlay(elem, "");

                var id = dev + "_" + elem.data('url');

                if (elem.children().children('#fg').hasClass('activate')) {
                    //only for the first occurance (Flipflop logic)
                    if (localStorage.getItem(id) != 'true') {
                        localStorage.setItem(id, 'true');
                        me.toggleOn(elem);
                    }
                } else {
                    localStorage.setItem(id, 'false');
                }
            });
    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'pagetab',
        init: init,
        update: update,
        toggleOn: toggleOn,
        toggleOff: toggleOff,
    });

    return me;
};