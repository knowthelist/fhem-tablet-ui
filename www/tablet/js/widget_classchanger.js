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

        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");
            
            elem.initData('get', 'STATE');

            elem.initData('get-on', '(true|1|on|open|ON)');
            elem.initData('get-off', '!on');

            elem.initData('on-class', 'on');
            elem.initData('off-class', 'off');

            me.addReading(elem, 'get');

        });
    }

    function update(dev, par) {

        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var state = elem.getReading('get').val;
                if (elem.matchingState('get', state) === 'on') {
                    elem.removeClass(elem.data('off-class'));
                    elem.addClass(elem.data('on-class'));
                }
                if (elem.matchingState('get', state) === 'off') {
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