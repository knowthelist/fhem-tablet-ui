/* FTUI Plugin
 * Copyright (c) 2015-2018 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

var Modul_reload = function () {

    function init_attr(elem) {

        elem.initData('get-on', 1);
        elem.initData('set-off', 0);

        // init base attributes
        base.init_attr.call(me, elem);
    }

    function init_ui(elem) {}

    function update(dev, par) {
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var state = elem.getReading('get').val;
                if (elem.matchingState('get', state) === 'on') {
                    elem.data('value', elem.data('set-off'));
                    elem.transmitCommand();
                    // quick and dirty fix to ensure set is done before reload
                     setTimeout(function () {
                            location.reload();
                    }, 1000);
                }
            });
    }


    // public
    // inherit all public members from base class
    var parent = new Modul_widget();
    var base = {
        init_attr: parent.init_attr,
    };
    var me = $.extend(parent, {
        //override or own public members
        widgetname: 'reload',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};
