/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_famultibutton:true */

"use strict";

function depends_pagebutton() {
    if (typeof Module_famultibutton == 'undefined' || !$.fn.famultibutton) {
        return ["famultibutton"];
    }
}

var Modul_pagebutton = function () {

    function loadPage(elem) {
        console.time('fetch content');
        var sel = elem.data('load');
        var hashUrl = elem.data('url').replace('#', '');
        var lockID = ['ftui', me.widgetname, hashUrl, sel].join('_');
        if (localStorage.getItem(lockID)) {
            ftui.log(1, 'pagebutton load locked ID=' + lockID);
            return;
        }
        localStorage.setItem(lockID, 'locked');
        ftui.log(1, me.widgetname + ': start to load content from $("' + sel + '")');
        $(sel).load(hashUrl + " " + sel + " > *", function (data_html) {
            console.timeEnd('fetch content');
            ftui.log(1, me.widgetname + ': new content from $("' + sel + '") loaded');
            ftui.initPage(sel);
            if (elem.hasClass('default')) {
                $(sel).addClass('active');
                elem.closest('nav').trigger('changedSelection');
                $(document).trigger('changedSelection');
            }
            $(document).on("initWidgetsDone", function (e, area) {
                if (area == sel) {
                    localStorage.removeItem(lockID);
                    startReturnTimer(me.elements.eq(0));
                }
            });
        });
    }

    function startReturnTimer(elem) {

        var waitUntilReturn = elem.data('return-time');
        var lastUrl = localStorage.getItem('pagebutton_lastSel');
        var returnTimer = localStorage.getItem('pagebutton_returnTimer');
        clearTimeout(returnTimer);
        if (waitUntilReturn > 0 && lastUrl !== elem.data('load')) {
            ftui.log(1, 'Reload main page in : ' + waitUntilReturn + ' seconds');
            returnTimer = setTimeout(function () {
                // back to first page
                me.toggleOn(elem);
            }, waitUntilReturn * 1000);
            localStorage.setItem('pagebutton_returnTimer', returnTimer);
        }
    }

    function changeState(elem, isOn) {
        var faelem = elem.data('famultibutton');
        if (isOn) {
            if (faelem) {
                faelem.setOn();
            }
            // overwrite default colors for showMultiStates
            elem.data('on-colors', [elem.data('on-color')]);
            elem.data('on-background-colors', [elem.data('on-background-color')]);
        } else {
            if (faelem) {
                faelem.setOff();
            }
            // overwrite default colors for showMultiStates
            elem.data('on-colors', [elem.data('off-color')]);
            elem.data('on-background-colors', [elem.data('off-background-color')]);
        }
        var state = elem.getReading('get').val;
        if (ftui.isValid(state)) {
            var states = elem.data('states') || elem.data('limits') || elem.data('get-on');
            if ($.isArray(states)) {
                me.showMultiStates(elem, states, state);
            }
        }
    }

    function init() {
        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.initData('off-color', ftui.getStyle('.button.off', 'color') || '#2A2A2A');
            elem.initData('off-background-color', elem.data('background-color') || ftui.getStyle('.button.off', 'background-color') || '#505050');
            elem.initData('on-color', ftui.getClassColor(elem) || ftui.getStyle('.button.on', 'color') || '#2A2A2A');
            elem.initData('on-background-color', elem.data('background-color') || ftui.getStyle('.button.on', 'background-color') || '#aa6900');
            elem.initData('background-icon', 'fa-circle');
            elem.initData('active-pattern', '.*/' + elem.data('url'));
            elem.initData('get-warn', -1);
            elem.initData('blink', 'off');
            elem.initData('return-time', 0);

            me.init_attr(elem);
            me.init_ui(elem);
            var elem_url = elem.data('url');

            elem.on("toggleOn", function (event) {
                // only set this button to active just before switching page
                me.elements.each(function (index) {
                    changeState($(this), false);
                });
                changeState(elem, true);
                var sel = elem.data('load');
                if (sel) {
                    elem.closest('nav').trigger('changedSelection');
                    $(sel).siblings().removeClass('active');
                    //load page if not done until now
                    if ($(sel + " > *").children().length === 0 || elem.hasClass('nocache'))
                        loadPage.call(me, elem);
                    $(sel).addClass('active');
                    localStorage.setItem('pagebutton_lastSel', sel);
                    startReturnTimer(me.elements.eq(0));
                    $(document).trigger('changedSelection');
                }
            });

            // is-current-button detection
            var url = window.location.pathname + ((window.location.hash.length) ? '#' + window.location.hash : '');
            var isActive = url.match(new RegExp('^' + elem.data('active-pattern') + '$'));
            if (isActive || ftui.config.filename === '' && elem_url === 'index.html') {
                elem.siblings().removeClass('default');
                elem.addClass('default');
            }
            changeState(elem, isActive);

            // multi state support
            var states = elem.data('states') || elem.data('get-on');
            if ($.isArray(states)) {
                var idx = ftui.indexOfGeneric(states, url);
                me.showMultiStates(elem, states, url, idx);
            }

            // activate element
            $(window).bind('hashchange', function (e) {
                var url = window.location.pathname + ((window.location.hash.length) ? '#' + window.location.hash : '');
                var isActive = url.match(new RegExp('^' + elem.data('active-pattern') + '$'));
                if (elem) {
                    changeState(elem, isActive);
                }
            });

            // remove all left locks
            var sel = elem.data('load');
            var dataUrl = elem.data('url');
            var hashUrl = (ftui.isValid(dataUrl)) ? dataUrl.replace('#', '') : '';
            var lockID = ['ftui', me.widgetname, hashUrl, sel].join('_');
            localStorage.removeItem(lockID);

            // prefetch page if necessary
            if (elem.isValidData('load') && elem.isValidData('url') && (elem.hasClass('prefetch'))) {

                // pre fetch sub pages randomly delayed
                setTimeout(function () {
                    loadPage(elem);
                }, 5000 * Math.random() + 500);
            }

            // load area content but wait until main page is loaded
            if (elem.hasClass('default')) {
                $(document).one("initWidgetsDone", function (e, area) {
                    var sel = elem.data('load');
                    if ($(sel + " > *").children().length === 0 || elem.hasClass('nocache')) {
                        loadPage(elem);
                    } else {
                        $(sel).addClass('active');
                        elem.closest('nav').trigger('changedSelection', [elem.text()]);
                        $(document).trigger('changedSelection');
                    }
                });
            }


            // start return timer after last activity
            if (me.elements.eq(0).data('return-time') > 0) {
                $('body').once('touchend mouseup', function (e) {
                    startReturnTimer(me.elements.eq(0));
                });
            }

            $(this).attr('title', $(this).data('url'));
        });
    }

    function toggleOff(elem) {
        setTimeout(function () {
            elem.setOn();
            elem.trigger('toggleOn');
        }, 50);
    }

    function update_cb(elem, state) {
        if (!elem.isValidData('warn')) {
            if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
                me.showOverlay(elem, ftui.getPart(state, elem.data('get-warn')));
            else
                me.showOverlay(elem, "");
        }

        var id = elem.data('device') + "_" + elem.data('get') + "_" + elem.data('url');

        if (elem.children().filter('#fg').hasClass('activate')) {
            //only for the first occurance (Flipflop logic)
            if (localStorage.getItem(id) !== 'true') {
                localStorage.setItem(id, 'true');
                me.toggleOn(elem);
            }
        } else {
            localStorage.setItem(id, 'false');
        }
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_famultibutton(), {
        //override or own public members
        widgetname: 'pagebutton',
        update_cb: update_cb,
        toggleOff: toggleOff,
        init: init,
    });

    return me;
};