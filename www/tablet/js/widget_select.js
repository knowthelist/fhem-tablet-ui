/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

var Modul_select = function () {

    function fillList(elem) {
        var select_elem = elem.find('select');
        if (select_elem) {
            var items = elem.data('items') || '';
            var alias = elem.data('alias') || elem.data('items');
            select_elem.empty();
            for (var i = 0; i < items.length; i++) {
                select_elem.append('<option value="' + items[i] + '">' + (alias && alias[i] || items[i]) + '</option>');
            }
        }
    }

    function setCurrentItem(elem) {
        var value = elem.getReading('get').val;
        elem.find('select').val(value);
        elem.data('value', value);
    }

    function init_attr(elem) {
        elem.initData('get', 'STATE');
        elem.initData('set', ((elem.data('get') !== 'STATE') ? elem.attr('data-get') : ''));
        elem.initData('cmd', 'set');
        elem.initData('quote', '');
        elem.initData('list', 'setList');
        elem.initData('delimiter', ':');

        me.addReading(elem, 'get');
        me.addReading(elem, 'list');
        if (elem.isValidData('alias') && !$.isArray(elem.data('alias'))) {
            me.addReading(elem, 'alias');
        }
    }

    function init_ui(elem) {
        // prepare select element
        elem.addClass('select');
        var wrap_elem = $('<div/>', {}).addClass('select_wrapper').appendTo(elem);
        var select_elem = $('<select/>', {})
            .on('change', function (e) {
                elem.data('value', elem.data('quote') + $("option:selected", this).val() + elem.data('quote'));
                $(this).blur();
                elem.transmitCommand();
                elem.trigger('changedValue');
            })
            .appendTo(wrap_elem);
        fillList(elem);
        elem.data('value', elem.data('quote') + $("option:selected", select_elem).val() + elem.data('quote'));
    }

    function update(dev, par) {
        // update from normal state reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                setCurrentItem($(this));
            });

        // update alias reading
        me.elements.filterDeviceReading('alias', dev, par)
            .each(function (index) {
                var elem = $(this);
                var delimiter = elem.data('delimiter');
                var items = elem.getReading('alias').val;
                if (ftui.isValid(items)) {
                    items = items.split(delimiter);
                    elem.data('alias', items);
                    fillList(elem);
                }
            });

        //extra reading for list items
        me.elements.filterDeviceReading('list', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var delimiter = elem.data('delimiter');
                var items = elem.getReading('list').val;
                if (ftui.isValid(items)) {
                    if (elem.data('list') === 'setList') {
                        var setreading = (elem.data('set') === '') ? 'state' : elem.data('set');
                        items = items.split(' ');
                        var founditems = items;
                        $.each(items, function (key, value) {
                            var tokens = value.split(delimiter);
                            if (tokens && tokens.length > 1) {
                                if (tokens[0] == setreading)
                                    founditems = tokens[1].split(',');
                            }
                        });
                        items = founditems;
                    } else
                        items = items.split(delimiter);
                }
                elem.data('items', items);
                fillList(elem);
                setCurrentItem(elem);
            });
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'select',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};