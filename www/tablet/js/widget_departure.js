/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true, Switchery:true */

"use strict";


var Modul_departure = function () {

    $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'css/ftui_departure.css" type="text/css" />');

    function startTimer(elem) {
        var interval = elem.data('refresh');
        if ($.isNumeric(interval) && interval > 0) {
            setInterval(function () {
                if (elem.is(':visible') || elem.hasClass('hiddenrefresh')) {
                    requestUpdate(elem);
                }
            }, Number(interval) * 1000);
        }
    }

    function requestUpdate(elem) {
        var cmdl = [elem.data('cmd'), elem.data('device'), elem.data('get')].join(' ');
        ftui.setFhemStatus(cmdl);
        if (ftui.config.DEBUG) {
            ftui.toast(cmdl);
        }
    }

    function init_attr(elem) {
        elem.initData('get', 'STATE');
        elem.initData('cmd', 'get');
        elem.initData('color', ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname, 'color') || '#222');
        elem.initData('background-color', ftui.getStyle('.' + me.widgetname, 'background-color') || '#C0C0C0');
        elem.initData('icon-color', ftui.getStyle('.' + me.widgetname, 'icon-color') || '#aa6900');
        elem.initData('text-color', ftui.getStyle('.' + me.widgetname, 'text-color') || '#ddd');
        elem.initData('width', '200');
        elem.initData('height', '250');
        elem.initData('refresh', elem.data('interval') || '120');

        me.addReading(elem, 'get');
    }

    function init_ui(elem) {

        var icon = elem.data('icon');


        // prepare container element
        elem.html('')
            .addClass('departure')
            .css({
                width: elem.data('width') + 'px',
                maxWidth: elem.data('width') + 'px',
                height: elem.data('height') + 'px',
                color: elem.mappedColor('text-color'),
                backgroundColor: elem.mappedColor('background-color'),
            });

        // prepare icon
        var elemIcon = $('<div/>', {
                class: 'icon',
            })
            .css({
                color: elem.mappedColor('icon-color'),
            })
            .prependTo(elem);
        if (icon)
            elemIcon.addClass('fa ' + icon + ' fa-lg fa-fw');
        else
            elemIcon.html('H');

        // prepare station label element
        $('<div/>', {
                class: 'station',
            })
            .text(elem.data('get'))
            .appendTo(elem);

        // prepare refresh element
        var elemRefresh = $('<div/>', {
            class: 'refresh fa fa-refresh fa-fw',
        }).appendTo(elem);

        // prepare timestamp element
        $('<div/>', {
            class: 'time',
        }).appendTo(elem);

        // prepare list header
        var text = '&nbsp;<div class="header">';
        text += '<div class="line">Linie</div>';
        text += '<div class="destination">Richtung</div>';
        text += elem.hasClass('deptime') ? '<div class="minutes">Zeit</div></div>' : '<div class="minutes">in Min</div></div>';
        elem.append(text);

        // prepare list text element
        $('<div/>', {
                class: 'listText',
            })
            .fadeOut()
            .appendTo(elem);

        // event handler
        elemRefresh.on('click', function (e) {
            requestUpdate(elem);
        });

        // init interval timer
        startTimer(elem);

        // first refresh
        requestUpdate(elem);

        // Refresh slider position after it became visible
        elem.closest('[data-type="popup"]').on("fadein", function (event) {
            requestUpdate(elem);
        });

        $(document).on('changedSelection', function () {
            requestUpdate(elem);
        });
    }

    function update(dev, par) {
        // update from normal state reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var list = elem.getReading('get').val;
                if (ftui.isValid(list)) {
                    var elemText = elem.find('.listText');
                    elemText.fadeOut();
                    var ts = elem.getReading('get').date;
                    if (ts) {
                        elem.find('.time').html(ts.toDate().hhmm());
                    }
                    var text = '';
                    var n = 0;
                    var collection = JSON.parse(list);
                    for (var idx in collection) {
                        n++;
                        var line = collection[idx];
                        var when = line[2];
                        if (elem.hasClass('deptime') && !when.match(/:/)) {
                            when = ts.toDate().addMinutes(when).hhmm();
                        }
                        text += (n % 2 === 0 && elem.hasClass('alternate')) ? '<div class="connection even">' : '<div class="connection">';
                        text += '<div class="line">' + line[0] + '</div>';
                        text += '<div class="destination">' + line[1] + '</div>';
                        text += '<div class="minutes">' + when + '</div></div>';
                    }
                    elemText.html(text).fadeIn();
                }
            });

    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_widget(), {
        //override members
        widgetname: 'departure',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};