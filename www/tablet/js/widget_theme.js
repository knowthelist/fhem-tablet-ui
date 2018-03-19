/* FTUI Plugin
 * Copyright (c) 2018 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 * https://github.com/knowthelist/fhem-tablet-ui
 */

/* global ftui:true, Modul_widget:true, plugins:true */

"use strict";

// usage: <link rel="stylesheet" href="css/fhem-darkblue-ui.css" data-device="ftuitest" 
//          data-type="theme" data-get="theme" data-get-on="night" data-get-off="!night" />

var Modul_theme = function () {

    function init_ui(elem) {}

    function update(dev, par) {

        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var state = elem.getReading('get').val;
                if (elem.matchingState('get', state) === 'on') {
                    elem.removeAttr('disabled');
                    ftui.loadStyleSchema();  
                    plugins.reinit();
                }
                if (elem.matchingState('get', state) === 'off') {
                    elem.attr('disabled', 'disabled');
                    ftui.loadStyleSchema(); 
                    plugins.reinit();
                }
            });
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'theme',
        init_ui: init_ui,
        update: update
    });

    return me;
};
