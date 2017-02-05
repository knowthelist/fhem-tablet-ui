/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_famultibutton:true */

"use strict";

function depends_symbol() {
    if (typeof Module_famultibutton == 'undefined' || !$.fn.famultibutton) {
        return ["famultibutton"];
    }
}

var Modul_symbol = function () {

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.initData('off-color', elem.data('color') || ftui.getStyle('.symbol.off', 'color') || '#505050');
            elem.initData('off-background-color', elem.data('background-color') || ftui.getStyle('.symbol.off', 'background-color') || '#505050');
            elem.initData('on-color', elem.data('color') || ftui.getClassColor(elem) || ftui.getStyle('.symbol.on', 'color') || '#aa6900');
            elem.initData('on-background-color', elem.data('background-color') || ftui.getStyle('.symbol.on', 'background-color') || '#aa6900');
            elem.initData('background-icon', null);
            elem.initData('icon', (($.isArray(elem.data('icons'))) ? elem.data('icons')[0] : 'ftui-window'));
            elem.initData('get-warn', -1);
            elem.data('mode', 'signal');
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