/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, plugins:true, Modul_widget:true */

"use strict";

var Modul_input = function () {

    function updateExtReading(elem) {
        elem.data('ext_get', elem.valOfData('device') + ':' + elem.valOfData('get'));
        elem.find('.textinput').val(elem.getReading('ext_get').val);
        me.addReading(elem,'ext_get');
        plugins.updateParameters();
    }

    function init_attr(elem) {
        elem.initData('get', 'STATE');
        elem.initData('set', '');
        elem.initData('cmd', 'set');
        elem.initData('value', '');

        if (elem.isExternData('device')) {
            $(elem.data('device')).once('changedValue', function (e) {
                updateExtReading(elem);
            });
            $(document).on('updateDone', function (e) {
                updateExtReading(elem);
            });
        }
        if (elem.isExternData('get')) {
            $(elem.data('get')).once('changedValue', function (e) {
                updateExtReading(elem);
            });
            $(document).on('updateDone', function (e) {
                updateExtReading(elem);
            });
        } else
            me.addReading(elem, 'get');
    }

    function init_ui(elem) {
        // prepare input element
        var elemInput = $('<input/>', {
                class: 'textinput',
            }).attr({
                type: 'text',
            }).css({
                visibility: 'visible'
            })
            .val(elem.data('value'))
            .appendTo(elem);

        elem.bind("enterKey", function (e) {
            elemInput.blur();
            elem.transmitCommand();
        });
        elemInput.keyup(function (e) {
            elem.data('value', elem.find('.textinput').val());
            if (e.keyCode === 13)
                elem.trigger("enterKey");
        });
    }

    function update(dev, par) {

        // update from normal state reading
        me.elements.filterDeviceReading('get', dev, par)
            .add(me.elements.filterDeviceReading('ext_get', dev, par))
            .each(function (index) {
                var elem = $(this);
                var value = (elem.isExternData('get')) ? elem.getReading('ext_get').val : elem.getReading('get').val;
                elem.find('.textinput').val(value);
            });
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'input',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};