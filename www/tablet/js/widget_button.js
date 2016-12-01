/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_famultibutton:true */

"use strict";

function depends_button() {
    if (typeof Module_famultibutton == 'undefined')
        return ["famultibutton"];
}

var Modul_button = function () {

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.initData('off-color', ftui.getStyle('.button.off', 'color') || '#2A2A2A');
            elem.initData('off-background-color', ftui.getStyle('.button.off', 'background-color') || '#505050');
            elem.initData('on-color', ftui.getClassColor($(this)) || ftui.getStyle('.button.on', 'color') || '#2A2A2A');
            elem.initData('on-background-color', ftui.getStyle('.button.on', 'background-color') || '#aa6900');
            elem.initData('get-warn', -1);

            me.init_attr(elem);
            elem = me.init_ui($(this));

            if (!elem.data('device')) {
                elem.setOn();
            }
        });
    }

    function update_cb(elem, state) {
        if (elem.hasClass('warn') || elem.children().filter('#fg').hasClass('warn'))
            me.showOverlay(elem, ftui.getPart(state, elem.data('get-warn')));
        else
            me.showOverlay(elem, "");
    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'button',
        init: init,
        update_cb: update_cb,
    });

    return me;
};