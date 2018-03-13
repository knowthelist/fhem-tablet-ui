/* FTUI Plugin
 * Copyright (c) 2015-2018 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_famultibutton:true */

"use strict";

function depends_pagebutton() {
    if (typeof window["Modul_famultibutton"] === 'undefined' || !$.fn.famultibutton) {
        return ["famultibutton"];
    }
}

var Modul_pagebutton = function () {

    var fetchCount = 1;
    var hasHash = (window.location.hash.length > 0);
    var lastUrl = "";

    $(document).one("initWidgetsDone", function (e, area) {
        var defaultElem = me.elements.filter('.default');
        if (defaultElem.length > 0) {
            changePage(defaultElem);
        }
    });

    $(document).on("initWidgetsDone", function (e, area) {
        me.elements.each(function (index) {
            var elem = $(this);
            if (elem.data('load') === area) {
                sessionStorage.removeItem(elem.data('lock-id'));
                startReturnTimer(me.elements.eq(0));
            }
        });
    });

    // activate element after browser navigation
    $(window).bind('hashchange', function (e) {
        var url = window.location.href;
        if (lastUrl !== url) {
            me.elements.each(function (index) {
                var elem = $(this);
                var isActive = url.match(new RegExp('^' + elem.data('active-pattern') + '$'));
                changeState(elem, isActive);
                if (isActive) {
                    changePage(elem);
                }
            });
        }
    });

    function loadPage(elem) {

        var deferred = new $.Deferred();
        var elemData = elem.data();

        if (elemData) {
            var page = elemData.load;
            var url = elemData.url;

            // is the content already loaded
            if (!$(page).hasClass('loaded') || elem.hasClass('nocache')) {

                if (ftui.isValid(url)) {
                    var hashUrl = url.replace('#', '');
                    var lockID = ['ftui', me.widgetname, hashUrl, page].join('.');

                    if (!sessionStorage.getItem(lockID)) {

                        sessionStorage.setItem(lockID, 'locked');
                        elem.attr('data-lock-id', lockID);
                        ftui.log(1, me.widgetname + ': start to load ' + hashUrl + ' content into $("' + page + '")');

                        $(page).load(hashUrl + " " + page + " > *", function () {

                            ftui.log(1, me.widgetname + ': new content from $("' + page + '") loaded');

                            $(page).addClass('loaded');
                            ftui.initPage(page);
                            deferred.resolve();

                        });
                    } else {
                        ftui.log(1, me.widgetname + ': load is locked. ID=' + lockID);
                        deferred.reject();
                    }
                } else {
                    ftui.log(1, me.widgetname + ': url is not valid. url=' + url);
                    deferred.reject();
                }
            } else {
                ftui.log(1, me.widgetname + ': page is already loaded. page=' + page);
                deferred.resolve();
            }
        } else {
            ftui.log(1, me.widgetname + ': elem is not valid. elem=' + elem.html());
            deferred.reject();
        }
        return deferred.promise();
    }

    function changePage(elem) {

        var elemData = elem.data();
        var page = elemData.load;
        var url = elemData.url;
        var parentPage = elemData.parent || $(page).parents('.page').attr('id');
        var parentElem = me.elements.filter('[data-load="' + parentPage + '"]');

        //load parent page if not done until now
        loadPage(parentElem).always(function () {
            showPage($(parentPage), parentElem.data('fade-duration'));
            //load page if not done until now
            loadPage(elem).always(function () {
                showPage($(page), elemData.fadeDuration);
            });
        });

        lastUrl = window.location.href;
        sessionStorage.setItem('ftui.pagebutton.lastSel', page);
        startReturnTimer(me.elements.eq(0));
    }

    function showPage(elemPage, duration) {

        if (elemPage.length > 0) {
            if (duration === 0) {
                elemPage.siblings().filter('.page.active').removeClass("active").hide();
                elemPage.addClass('active').show();
            } else {
                elemPage.siblings().filter('.page').fadeOut(duration, function () {
                    elemPage.siblings().filter('.page.active').removeClass("active");
                    elemPage.fadeIn(duration, function () {
                        elemPage.addClass('active');
                    });
                });
            }
            elemPage.closest('nav').trigger('changedSelection');
            $(document).trigger('changedSelection');
            ftui.log(1, me.widgetname + ': show page. id=' + elemPage.attr('id'));
        }
    }

    function startReturnTimer(elem) {

        var waitUntilReturn = elem.data('return-time');
        var lastUrl = sessionStorage.getItem('ftui.pagebutton.lastSel');
        var returnTimer = sessionStorage.getItem('ftui.pagebutton.returnTimer');
        clearTimeout(returnTimer);
        if (waitUntilReturn > 0 && lastUrl !== elem.data('load')) {
            ftui.log(1, 'Reload main page in : ' + waitUntilReturn + ' seconds');
            returnTimer = setTimeout(function () {
                // back to first page
                me.toggleOn(elem);
            }, waitUntilReturn * 1000);
            sessionStorage.setItem('ftui.pagebutton.returnTimer', returnTimer);
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



    function init_attr(elem) {

        elem.initData('off-color', '#505050');
        elem.initData('off-background-color', elem.data('background-color') || 'transparent');
        elem.initData('on-color', ftui.getClassColor(elem) || '#2A2A2A');
        elem.initData('on-background-color', elem.data('background-color') || '#505050');
        
        //init standard attributes 
        base.init_attr.call(me, elem);


        elem.initData('background-icon', 'fa-circle');
        elem.initData('active-pattern', '.*/' + elem.data('url'));
        elem.initData('get-warn', -1);
        elem.initData('blink', 'off');
        elem.initData('fade-duration', 'slow');
        elem.initData('return-time', 0);

    }

    function init_ui(elem) {

        //init standard ui elements 
        base.init_ui.call(me, elem);

        var sel = elem.data('load');
        var dataUrl = elem.data('url');
        var hashUrl = (ftui.isValid(dataUrl)) ? dataUrl.replace('#', '') : '';
        if (hasHash) {
            elem.removeClass('default');
        }


        // is-current-button detection
        var url = window.location.pathname + (hasHash ? window.location.hash : '');
        var isActive = url.match(new RegExp('^' + elem.data('active-pattern') + '$'));
        if (isActive || (ftui.config.filename === '' && dataUrl === 'index.html')) {
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

        // remove all left locks
        var lockID = ['ftui', me.widgetname, hashUrl, sel].join('.');
        sessionStorage.removeItem(lockID);


        isActive = false;
        // prefetch page if necessary
        if (elem.isValidData('load') && elem.isValidData('url') && (elem.hasClass('prefetch')) &&
            (!isActive)) {
            // pre fetch sub pages delayed
            var delay = fetchCount * ftui.poll.shortPollDuration;
            fetchCount++;
            setTimeout(function () {
                clearTimeout(ftui.longPollTimer);
                loadPage(elem);
            }, delay);

            // postpone longpoll start
            clearTimeout(ftui.longPollTimer);
        }

        // start return timer after last activity
        if (me.elements.eq(0).data('return-time') > 0) {
            $('body').once('touchend mouseup', function (e) {
                startReturnTimer(me.elements.eq(0));
            });
        }

        if (!elem.hasClass('notitle')) {
            elem.attr('title', elem.data('url'));
        }

        elem.on("toggleOn", function (event) {

            // only set this button to active just before switching page
            me.elements.each(function (index) {
                changeState($(this), false);
            });
            changeState(elem, true);

            // delay next action to render changes
            setTimeout(function () {
                changePage(elem);
            }, 10);
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
            if (elem.hasClass('warn') || elem.children().children('#fg').hasClass('warn'))
                me.showOverlay(elem, ftui.getPart(state, elem.data('get-warn')));
            else
                me.showOverlay(elem, "");
        }

        var id = elem.data('device') + "_" + elem.data('get') + "_" + elem.data('url');

        if (elem.children('.famultibutton').hasClass('active')) {
            ftui.log(2, 'pagebutton: set "' + id + '" to default due to state:' + state);
            elem.siblings().removeClass('default');
            elem.addClass('default');
            me.toggleOn(elem);
        }
    }

    // public
    // inherit all public members from base class
    var parent = new Modul_famultibutton();
    var base = {
        init_attr: parent.init_attr,
        init_ui: parent.init_ui
    };
    var me = $.extend(parent, {
        //override or own public members
        widgetname: 'pagebutton',
        update_cb: update_cb,
        toggleOff: toggleOff,
        init_attr: init_attr,
        init_ui: init_ui
    });

    return me;
};
