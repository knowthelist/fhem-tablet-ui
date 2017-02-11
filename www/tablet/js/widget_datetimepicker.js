/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_label:true, Switchery:true */

"use strict";

function depends_datetimepicker() {
    var deps = [];
    if (!$.fn.datetimepicker) {
        $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'lib/jquery.datetimepicker.css" type="text/css" />');
        deps.push(ftui.config.basedir + "lib/jquery.datetimepicker.js");
    }
    if (typeof Module_label == 'undefined') {
        deps.push('label');
    }
    return deps;
}

var Modul_datetimepicker = function () {

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.data('cmd', elem.isValidData('cmd') ? elem.data('cmd') : 'set');
            elem.data('set-value', elem.data('set-value') || '$v');
            elem.data('unit', elem.isValidData('unit') ? elem.data('unit') : '<span style="font-size: 180%;">&#32;&#9660;</span>');
            elem.data('format', elem.isValidData('format') ? elem.data('format') : 'Y-m-d H:i');
            elem.data('theme', elem.isValidData('theme') ? elem.data('theme') : 'dark');
            elem.data('timepicker', elem.isValidData('timepicker') ? elem.data('timepicker') : 'true');
            elem.data('datepicker', elem.isValidData('datepicker') ? elem.data('datepicker') : 'true');
            elem.data('step', elem.isValidData('step') ? elem.data('step') : '60');
            me.init_attr(elem);
            var picker = elem.datetimepicker({
                lang: 'de',
                theme: elem.data('theme'),
                format: elem.data('format'),
                timepicker: elem.data('timepicker'),
                datepicker: elem.data('datepicker'),
                step: elem.data('step'),
                onChangeDateTime: function (dp, $input) {
                    var val = elem.data('set-value').replace('$v', $input.val().toString());
                    elem.text(val);
                    elem.data('value', val);
                    elem.transmitCommand();
                },
            });
        });
    }

    function update_cb(elem, val) {
        elem.datetimepicker({
            value: val
        });
    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_label(), {
        //override members
        widgetname: 'datetimepicker',
        init: init,
        update_cb: update_cb,
    });

    return me;
};