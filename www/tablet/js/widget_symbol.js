/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_famultibutton:true */

"use strict";

function depends_symbol() {
    if (typeof window["Modul_famultibutton"] === 'undefined' || !$.fn.famultibutton) {
        return ["famultibutton"];
    }
}

var Modul_symbol = function () {

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");
            
            elem.initClassColor('on-color'); 

            elem.initData('on-color', elem.data('color') || '#aa6900');
            elem.initData('off-color', elem.data('color') || '#505050');
            elem.initData('on-background-color', elem.data('background-color') || '#aa6900');
            elem.initData('off-background-color', elem.data('background-color') || '#505050');
            elem.initData('background-icon', null);
            elem.initData('icon', (($.isArray(elem.data('icons'))) ? elem.data('icons')[0] : 'ftui-window'));
            elem.initData('get-warn', -1);
            elem.data('mode', 'signal');
            elem.initData('reachable-on', '!off');
            elem.initData('reachable-off', '(false|0)');
            me.addReading(elem, 'reachable');
            if (elem.isDeviceReading('reachable-on')) {
                me.addReading(elem, 'reachable-on');
            }
            if (elem.isDeviceReading('reachable-off')) {
                me.addReading(elem, 'reachable-off');
            }
            me.init_attr(elem);
            me.init_ui(elem);
        });
    }

    function update_cb(elem, state) {
        $('.fa-stack:has(.zero)').removeClass('fa-stack');
        if (elem.hasClass('warn') || elem.children().children('#fg').hasClass('warn'))
            me.showOverlay(elem, ftui.getPart(state, elem.data('get-warn')));
        else
            me.showOverlay(elem, "");
    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'symbol',
        init: init,
        update_cb: update_cb,
    });

    return me;
};
