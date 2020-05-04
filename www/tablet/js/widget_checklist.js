/* FTUI Plugin
 * Copyright (c) 2017 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_select:true */

"use strict";

function depends_checklist() {

    var deps = [];

    if (!$('link[href$="css/ftui_checklist.css"]').length) {
        deps.push(ftui.config.basedir + "css/ftui_checklist.css");
    }

    if (typeof window["Modul_select"] === 'undefined') {
        deps.push("select");
    }
    return deps;
}

var Modul_checklist = function () {

    function fillList(elem) {
        elem.html('');
        var text = '';
        var items = elem.data('items') || '';
        var alias = elem.data('alias') || elem.data('items');
        for (var i = 0, len = items.length; i < len; i++) {

            text += '<div class="check-item" data-text="' + items[i] + '">';
            text += '<div class="check-text">';
            text += '<div class="text">' + (alias && alias[i] || items[i]) + '</div>';
            text += '</div>';
            text += '<div class="check-image">';
            text += '<i class="icon fa"/>';
            text += '</div>';
            text += '</div>';
        }

        elem.append(text).fadeIn();
    }


    function setCurrentItem(elem) {
        var items = elem.data('items') || '';
        var list = elem.getReading('get').val;
        for (var i = 0, len = items.length; i < len; i++) {
            var idx = ftui.indexOfGeneric(list, items[i]);
            var select_elem = elem.find('.check-item[data-text="' + items[i] + '"]');
            if (idx >= 0) {
                select_elem.addClass('active');
            } else {
                select_elem.removeClass('active');
            }
        }
    }

    function sendStatus(elem) {

        var arr = [];
        elem.find('.check-item.active').each(function (index) {
            arr.push($(this).data('text'));
        });

        elem.data('value', arr.join(','));
        elem.transmitCommand();

    }

    function init_ui(elem) {

        // prepare container element
        var width = elem.data('width');
        var widthUnit = ($.isNumeric(width)) ? 'px' : '';
        var height = elem.data('height');
        var heightUnit = ($.isNumeric(height)) ? 'px' : '';

        elem.html('')
            .addClass('check-list')
            .css({
                width: width + widthUnit,
                maxWidth: width + widthUnit,
                height: height + heightUnit,
                color: elem.mappedColor('text-color'),
                backgroundColor: elem.mappedColor('background-color'),
            });

        elem.on('click', '.check-item', function () {

            var item = $(this);
            if (item.hasClass('active')) {
                item.removeClass('active');
            } else {
                item.addClass('active');
            }
            clearTimeout(elem.delayTimer);
            elem.delayTimer = setTimeout(function () {
                elem.delayTimer = 0;
                sendStatus(elem);
            }, elem.data('delay'));
        });
    }


    // public
    // inherit members from base class
    var me = $.extend(new Modul_select(), {
        //override members
        widgetname: 'checklist',
        init_ui: init_ui,
        fillList: fillList,
        setCurrentItem: setCurrentItem
    });

    return me;
};
