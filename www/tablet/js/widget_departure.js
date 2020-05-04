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
            var tid = setInterval(function () {
                if (elem && elem.data('get')) {
                    requestUpdate(elem);
                } else {
                    clearInterval(tid);
                }
            }, Number(interval) * 1000);
        }
    }

    function requestUpdate(elem) {
        var ltime = new Date().getTime() / 1000;
        if ((ltime - elem.data('lastRefresh') > 15) && (elem.is(':visible') || elem.hasClass('hiddenrefresh'))) {

            var cmdl = [elem.data('cmd'), elem.data('device'), elem.data('get')].join(' ');
            ftui.log(2, 'departure - send request: ' + cmdl);
            ftui.setFhemStatus(cmdl);
            if (ftui.config.DEBUG) {
                ftui.toast(cmdl);
            }
            elem.data('lastRefresh', ltime);
        }
    }

    function init_attr(elem) {
        elem.initData('get', 'STATE');
        elem.initData('title', elem.data('get'));
        elem.initData('cmd', 'get');
        elem.initData('color', ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname, 'color') || '#222');
        elem.initData('background-color', ftui.getStyle('.' + me.widgetname, 'background-color') || '#C0C0C0');
        elem.initData('icon-color', ftui.getStyle('.' + me.widgetname, 'icon-color') || '#aa6900');
        elem.initData('text-color', ftui.getStyle('.' + me.widgetname, 'text-color') || '#ddd');
        elem.initData('width', '200');
        elem.initData('height', '250');
        elem.initData('refresh', elem.data('interval') || '120');
        elem.initData('lastRefresh', 0);

        me.addReading(elem, 'get');
    }

    function init_ui(elem) {

        var icon = elem.data('icon');


        // prepare container element
        var contElem = $('<div/>', {
            class: 'departure-wrapper'
        });

        var width = elem.data('width');
        var widthUnit = ($.isNumeric(width)) ? 'px' : '';
        var height = elem.data('height');
        var heightUnit = ($.isNumeric(height)) ? 'px' : '';
        
        var innerElem = $('<div/>', {
                class: 'departure'
            })
            .css({
                width: width + widthUnit,
                //maxWidth: elem.data('width') + 'px',
                height: height + heightUnit,
                color: elem.mappedColor('text-color'),
                backgroundColor: elem.mappedColor('background-color'),
            }).prependTo(contElem);

        // prepare icon
        var elemIcon = $('<div/>', {
                class: 'icon',
            })
            .css({
                color: elem.mappedColor('icon-color'),
            })
            .prependTo(innerElem);
        if (icon)
            elemIcon.addClass('fa ' + icon + ' fa-lg fa-fw');
        else
            elemIcon.html('H');

        // prepare station label element
        $('<div/>', {
                class: 'station',
            })
            .text(elem.data('title'))
            .appendTo(innerElem);

        // prepare refresh element
        var elemRefresh = $('<div/>', {
            class: 'refresh fa fa-refresh fa-fw',
        }).appendTo(innerElem);

        // prepare timestamp element
        $('<div/>', {
            class: 'time',
        }).appendTo(innerElem);

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
            .appendTo(innerElem);

        elem.html('').append(contElem);


        // event handler
        elemRefresh.on('click', function (e) {
            requestUpdate(elem);
        });

        // init interval timer
        startTimer(elem);

        // first refresh 
        setTimeout(function () {

            requestUpdate(elem);


            // Refresh infos after it became visible
            elem.closest('[data-type="popup"]').on("fadein", function (event) {
                requestUpdate(elem);
            });

            $(document).on('changedSelection', function () {
                requestUpdate(elem);
            });
        }, 5000);
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
                    for (var idx = 0, len = collection.length; idx < len; idx++) {
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
