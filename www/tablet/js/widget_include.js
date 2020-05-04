/* FTUI Plugin
 * Copyright (c) 2017 Mario Stephan <mstephan@shared-files.de>
 * originally created 2017 Thomas Gödicke <tgoedicke89@gmail.com>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

var Modul_include = function () {
    
    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");

            $.get(elem.data('url'), {}, function (data) {
                var parValues = elem.data('parameter');
                for (var key in parValues) {
                    data = data.replace(new RegExp(key, 'g'), parValues[key]);
                }
                elem.html(data);
                ftui.initPage('[data-wgid="' + elem.wgid() + '"]');
            });
        });
    }
    
    var me = $.extend(new Modul_widget(), {
        widgetname: 'include',
        init: init,
    });
    
    return me;
};