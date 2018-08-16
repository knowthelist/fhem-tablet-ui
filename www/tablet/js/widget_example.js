/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

// widget implementation starts here
// change 'Modul_example' to 'Modul_mywidgetname', 'depends_example' to 'depends_mywidgetname'
// and 'widgetname:"example",' to 'widgetname:"mywidgetname",'
// usage: <div data-type="example" data-device="dummy1" data-get="volume"></div>

function depends_example() {
    var deps = [];
    /* e.g.
    if (!$.fn.datetimepicker){
        $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'lib/jquery.datetimepicker.css" type="text/css" />');
        deps.push(ftui.config.basedir + "lib/jquery.datetimepicker.js");
    }
    if(typeof window["Modul_label"] === 'undefined'){
        deps.push('label');
    }
    */
    return deps;
}

var Modul_example = function () {

    // privat sub function
    function doSomething(elem) {

        if (elem.hasClass('colorfull')) {
            elem.css({
                backgroundColor: '#aa44ff',
            });
        }
    }

    // mandatory function, get called on start up
    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");
            
            elem.initData('get', 'STATE');
            elem.initData('color', '#aa6633');

            // subscripe my readings for updating
            me.addReading(elem, 'get');
            me.addReading(elem, 'color');

            // call sub function for each instance of this widget
            doSomething(elem);
        });
    }

    // mandatory function, get called after start up once and on every FHEM poll response
    // here the widget get updated
    function update(dev, par) {
        // do updates from reading for content
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.getReading('get').val;
                if (value) {
                    elem.html(value);
                }
            });

        // do updates from reading for color
        me.elements.filterDeviceReading('color', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var val = elem.getReading('color').val;
                if (val) {
                    val = '#' + val.replace('#', '');
                    elem.css("color", val);
                }
            });
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'example',
        init: init,
        update: update,
    });

    return me;
};