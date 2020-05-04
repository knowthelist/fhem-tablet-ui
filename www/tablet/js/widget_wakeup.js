/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_wakeup() {
    if (!$.fn.wakeUp) {
        return ["lib/jquery.wakeup.js"];
    }
}

var Modul_wakeup = function () {

    // mandatory function, get called on start up
    function init() {
        var bell_id = $.wakeUp(function () {
            setTimeout(function () {
                ftui.setOnline();
            }, 3000);
        });
    }

    // mandatory function, get called after start up once and on every FHEM poll response
    // here the widget get updated
    function update(dev, par) {}

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'wakeup',
        init: init,
        update: update,
    });

    return me;
};