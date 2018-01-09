/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_medialist() {
    var deps = [];

    if (!$('link[href$="css/ftui_medialist.css"]').length) {
        deps.push(ftui.config.basedir + "css/ftui_medialist.css");
    }

    return deps;
}

var Modul_medialist = function () {

    function changedCurrent(elem, pos) {
        elem.find('.media').each(function (index) {
            $(this).removeClass('current');
        });
        var idx = pos;
        if (elem.data('set-value') === 'index1' || elem.hasClass('index1')) {
            idx = pos - 1;
        }
        if (elem.data('set-value') === 'file' || elem.hasClass('file')) {
            idx = elem.find('.media').filter(function (index) {
                return $(this).data("file") === pos;
            }).index();
        }

        var currentElem = elem.find('.media').eq(idx);
        if (currentElem.length > 0) {
            currentElem.addClass("current");
            if (elem.hasClass("autoscroll")) {
                elem.scrollTop(currentElem.offset().top - elem.offset().top + elem.scrollTop());
            }
        }
    }

    function init_attr(elem) {
        elem.initData('get', 'STATE');
        elem.initData('set', 'play');
        elem.initData('set-value', 'index0');
        elem.initData('pos', 'Pos');
        elem.initData('cmd', 'set');
        elem.initData('color', ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname, 'color') || '#222');
        elem.initData('background-color', ftui.getStyle('.' + me.widgetname, 'background-color') || 'transparent');
        elem.initData('text-color', ftui.getStyle('.' + me.widgetname, 'text-color') || '#ddd');
        elem.initData('width', '90%');
        elem.initData('height', '80%');

        me.addReading(elem, 'get');
        me.addReading(elem, 'pos');
    }

    function init_ui(elem) {

        // prepare container element
        var width = elem.data('width');
        var widthUnit = ($.isNumeric(width)) ? 'px' : '';
        var height = elem.data('height');
        var heightUnit = ($.isNumeric(height)) ? 'px' : '';

        elem.html('')
            .addClass('media-list')
            .css({
                width: width + widthUnit,
                maxWidth: width + widthUnit,
                height: height + heightUnit,
                color: elem.mappedColor('text-color'),
                backgroundColor: elem.mappedColor('background-color'),
            });

        elem.on('click', '.media', function () {
            var value = $(this).index();
            if (elem.data('set-value') === 'index1' || elem.hasClass('index1')) {
                value = $(this).index() + 1;
            }
            if (elem.data('set-value') === 'file' || elem.hasClass('file')) {
                value = $(this).data('file');
            }
            elem.data('value', value);
            elem.transmitCommand();
        });
    }

    function update(dev, par) {

        // update medialist reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var list = elem.getReading('get').val;
                var pos = elem.getReading('pos').val;

                if (ftui.isValid(list) && list !== '<BINARY>') {
                    elem.html('');
                    var text = '';
                    try {
                        var collection = JSON.parse(list);

                        for (var idx = 0, len=collection.length; idx < len; idx++) {
                            var media = collection[idx];
                            text += '<div class="media" data-file="' + media.File + '">';
                            text += '<div class="media-image">';
                            text += '<img class="cover" src="' + media.Cover + '"/>';
                            text += '</div>';
                            text += '<div class="media-text">';
                            text += '<div class="title" data-track="' + media.Track + '">' + media.Title + '</div>';
                            text += '<div class="artist">' + media.Artist + '</div>';
                            text += '<div class="duration">' + ((media.Time > 0) ? ftui.durationFromSeconds(media.Time) : '&nbsp;') + '</div>';
                            text += '</div></div>';
                        }
                    } catch (e) {
                        ftui.log(1, 'widget-' + me.widgetname + ': error:' + e);
                        ftui.log(1, list);
                        ftui.toast('<b>widget-' + me.widgetname + '</b><br>' + e, 'error');
                    }
                    elem.append(text).fadeIn();
                }
                if (pos) {
                    changedCurrent(elem, pos);
                }
            });

        //extra reading for current position
        me.elements.filterDeviceReading('pos', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var pos = elem.getReading('pos').val;
                if (ftui.isValid(pos)) {
                    changedCurrent(elem, pos);
                }
            });
    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_widget(), {
        //override members
        widgetname: 'medialist',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};