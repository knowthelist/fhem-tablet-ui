/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_famultibutton:true */

"use strict";

function depends_push() {
    if (typeof Module_famultibutton == 'undefined' || !$.fn.famultibutton) {
        return ["famultibutton"];
    }
}

var Modul_push = function () {

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.initData('device', ' ');
            elem.initData('off-color', ftui.getStyle('.' + me.widgetname + '.off', 'color') || '#505050');
            elem.initData('off-background-color', elem.data('background-color') || ftui.getStyle('.' + me.widgetname + '.off', 'background-color') || '#505050');
            elem.initData('on-color', ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname + '.on', 'color') || '#aa6900');
            elem.initData('on-background-color', ftui.getClassColor(elem) || ftui.getStyle('.' + me.widgetname + '.on', 'background-color') || '#aa6900');
            elem.initData('background-icon', 'fa-circle-thin');
            elem.initData('set-on', 'on');
            elem.initData('set-off', '');
            elem.initData('get', '');
            elem.initData('get-on', '');
            elem.initData('get-off', (elem.isValidData('get-on')?'!on':''));
           

            elem.data('mode', (elem.data('set-off') !== '') ? 'updown' : 'push' );
            me.init_attr(elem);
            me.init_ui(elem);
        });
    }


    // public
    // inherit members from base class
    var me = $.extend(new Modul_famultibutton(), {
        //override members
        widgetname: 'push',
        init: init
    });

    return me;
};