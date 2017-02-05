/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_classchanger() {
    var deps = [];
    return deps;
}

var Modul_classchanger = function () {

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {

            var elem = $(this);
            elem.initData('get', 'STATE');

            elem.initData('get-on', 'on');
            elem.initData('get-off', 'off');

            elem.initData('on-class', 'on');
            elem.initData('off-class', 'off');

            me.addReading(elem, 'get');

        });
    }

    function update(dev, par) {

        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.getReading('get').val;
                if (value == elem.data('get-on')) {
                    elem.removeClass(elem.data('off-class'));
                    elem.addClass(elem.data('on-class'));
                } else {
                    elem.removeClass(elem.data('on-class'));
                    elem.addClass(elem.data('off-class'));
                }
            });

    }

    var me = $.extend(new Modul_widget(), {

        widgetname: 'classchanger',
        init: init,
        update: update,
    });

    return me;
};