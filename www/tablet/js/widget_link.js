/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true, Powerange: true */

"use strict";

var Modul_link = function () {

    function isReadOnly(elem) {
        var lock = elem.data('readonly');
        return (lock == 'true' || lock == '1' || lock == 'on');
    }

    function onClicked(elem) {

        if (isReadOnly(elem)) {
            elem.addClass('fail-shake');
            setTimeout(function () {
                elem.removeClass('fail-shake');
            }, 500);
            return;
        }

        if (elem.isValidData('url')) {
            var target = elem.data('url');
            if (elem.hasClass('blank')) {
                window.open(target, '_blank');
            } else {
                document.location.href = target;
            }
            var hashUrl = window.location.hash.replace('#', '');
            if (hashUrl && elem.isValidData('load')) {
                elem.closest('nav').trigger('changedSelection', [elem.text()]);
                var sel = elem.data('load');
                if (sel) {
                    $(sel).siblings().removeClass('active');
                    //load page if not done until now
                    if ($(sel + " > *").children().length === 0 || elem.hasClass('nocache'))
                        loadPage(elem);
                    $(sel).addClass('active');
                }
            }
        } else if (elem.isValidData('url-xhr')) {
            ftui.toast(elem.data('url-xhr'));
            $.get(elem.data('url-xhr'));
        } else if (elem.isValidData('fhem-cmd')) {
            ftui.toast(elem.data('fhem-cmd'));
            ftui.setFhemStatus(elem.data('fhem-cmd'));
        } else if (elem.isValidData('device')) {
            elem.transmitCommand();
        }

    }

    function loadPage(elem) {
        console.time('fetch content');
        var sel = elem.data('load');
        var hashUrl = elem.data('url').replace('#', '');
        var lockID = ['ftui', 'link', hashUrl, sel].join('_');
        if (localStorage.getItem(lockID)) {
            ftui.log(1, 'link load locked. lockId=' + lockID);
            return;
        }
        localStorage.setItem(lockID, 'locked');
        ftui.log(1, 'link loadPage: hashUrl=' + hashUrl + " sel=" + sel + " > *");
        $(sel).load(hashUrl + " " + sel + " > *", function (data_html) {
            console.timeEnd('fetch content');
            ftui.log(1, me.widgetname + ': new content from $(' + sel + ') loaded');
            ftui.initPage(sel);
            if (elem.hasClass('default')) {
                $(sel).addClass('active');
                elem.closest('nav').trigger('changedSelection', [elem.text()]);
            }
            $(document).on("initWidgetsDone", function (e, area) {
                if (area == sel) {
                    localStorage.removeItem(lockID);
                }
            });
        });
    }

    function colorize(elem) {
        var url = window.location.pathname + ((window.location.hash.length) ? '#' + window.location.hash : '');
        var isActive = url.match(new RegExp('^' + elem.data('active-pattern') + '$'));
        var color = isActive ? elem.mappedColor('active-color') : elem.mappedColor('color');
        var backgroundColor = isActive ? elem.mappedColor('active-background-color') : elem.mappedColor('background-color');
        var borderColor = isActive ? elem.mappedColor('active-border-color') : elem.mappedColor('border-color');
        elem.css({
            color: color,
            backgroundColor: backgroundColor,
        });
        if (borderColor) {
            elem.css({
                borderColor: borderColor,
                borderWidth: '2px',
                borderStyle: 'solid',
            });
        }
        if (isActive)
            elem.addClass('active');
        else
            elem.removeClass('active');
    }

    function init_attr(elem) {
        elem.initData('cmd', 'set');
        elem.initData('color', ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname, 'color') || '#aa6900');
        elem.initData('background-color', ftui.getStyle('.' + me.widgetname, 'background-color') || null);
        elem.initData('icon-left', elem.data('icon') || null);
        elem.initData('icon-right', null);
        elem.initData('width', 'auto');
        elem.initData('height', 'auto');
        elem.initData('text-align', 'center');
        elem.initData('border-color', null);
        elem.initData('active-pattern', null);
        elem.initData('active-color', elem.data('color'));
        elem.initData('active-border-color', elem.data('border-color'));
        elem.initData('active-background-color', elem.data('background-color'));
        me.addReading(elem, 'get');
        if (elem.isDeviceReading('lock')) {
            me.addReading(elem, 'lock');
        }
    }

    function init_ui(elem) {

        var leftIcon = elem.data('icon-left');
        var rightIcon = elem.data('icon-right');
        var text = elem.html();
        var iconWidth = 0;
        var elem_url = elem.data('url');

        // prepare container element
        elem.html('')
            .addClass('link')
            .css({
                width: elem.data('width'),
                height: elem.data('height'),
                lineHeight: elem.data('height') * 0.9 + 'px',
                cursor: 'pointer',
            });

        if (elem.data('width') == 'auto' && elem.data('height') == 'auto' && (elem.hasClass('round') || elem.hasClass('square'))) {
            if (elem.data('border-color') || elem.data('active-border-color'))
                elem.css({
                    padding: '2px 7px',
                });
            else
                elem.css({
                    padding: '3px 7px',
                });
        }

        // set colors of the container element
        colorize(elem);

        // prepare left icon
        if (leftIcon) {
            var elemLeftIcon = $('<div/>', {
                    class: 'linklefticon fa ' + leftIcon + ' fa-lg fa-fw',
                })
                .prependTo(elem);
            iconWidth = elemLeftIcon.innerWidth();
        }

        // prepare text element
        var elemText = $('<div/>', {
                class: '',
            }).css({
                display: 'inline-block',
                textAlign: elem.data('text-align'),
                verticalAlign: '5%',
                whiteSpace: 'nowrap',
                padding: '3px',
            })
            .html(text)
            .appendTo(elem);

        // prepare right icon
        if (rightIcon) {
            var elemRightIcon = $('<div/>', {
                    class: 'linkrighticon fa ' + rightIcon + ' fa-lg fa-fw',
                })
                .appendTo(elem);
            iconWidth += elemRightIcon.innerWidth();
        }

        if (!elem.hasClass('fixcontent')) {
            // recalculate width of text element
            elemText.css({
                width: elem.innerWidth() - iconWidth - 15 + 'px',
            });
        }

        // event handler
        elem.on('touchend mouseup', function (e) {
            e.preventDefault();
            elem.fadeTo("fast", 1);
            onClicked(elem);
            elem.trigger('click');
        });

        elem.on('touchstart mousedown', function (e) {
            elem.fadeTo("fast", 0.5);
            e.preventDefault();
        });

        elem.on('touchleave mouseout', function (e) {
            elem.fadeTo("fast", 1);
            e.preventDefault();
        });

        $(window).bind('hashchange', function (e) {
            colorize(elem);
        });

        // is-current-link detection
        var url = window.location.pathname + ((window.location.hash.length) ? '#' + window.location.hash : '');
        var isActive = url.match(new RegExp('^' + elem.data('active-pattern') + '$'));
        if (isActive || ftui.config.filename === '' && elem_url === 'index.html') {
            me.elements.each(function (index) {
                $(this).removeClass('default');
            });
            elem.addClass('default');
        }

        // remove all left locks
        var sel = elem.data('load');
        var hashUrl = elem.data('url') || '';
        hashUrl = hashUrl.replace('#', '');
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
                }
            });
        }

        return elem;
    }

    function update(dev, par) {

        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var val = elem.getReading('get').val;
                elem.data('url', val);
                elem.attr('title', val);
            });

        //extra reading for lock
        me.elements.filterDeviceReading('lock', dev, par)
            .each(function (idx) {
                var elem = $(this);
                elem.data('readonly', elem.getReading('lock').val);
            });
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'link',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};