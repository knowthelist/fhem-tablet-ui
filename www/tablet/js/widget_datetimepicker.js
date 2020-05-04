/* FTUI Plugin
 * Copyright (c) 2015-2018 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 * 
 * https://github.com/xdan/datetimepicker
 */

/* global ftui:true, Modul_label:true, Switchery:true */

"use strict";

function depends_datetimepicker() {
    var deps = [];
    if (!$.fn.datetimepicker) {
        $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'lib/jquery.datetimepicker.css" type="text/css" />');
        deps.push(ftui.config.basedir + "lib/jquery.datetimepicker.min.js");
    }
    if ( window['Modul_label'] === void 0) {
        deps.push('label');
    }
    return deps;
}

var Modul_datetimepicker = function () {

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");
            
            elem.initData('cmd', 'set');
            elem.data('set-value', elem.data('set-value') || '$v');
            elem.initData('unit', '<span style="font-size: 180%;">&#32;&#9660;</span>');
            elem.initData('format', 'Y-m-d H:i');
            elem.initData('theme', 'dark');
            elem.initData('timepicker', true);
            elem.initData('datepicker', true);
            elem.initData('minTime', false);
            elem.initData('maxTime', false);
            elem.initData('minDate', false);
            elem.initData('maxDate', false);
            elem.initData('step', '60');
            elem.initData('timeheightintimepicker', '30');
            me.init_attr(elem);
            console.log('minTime:',elem.data('minTime'));
            var picker = elem.datetimepicker({
                lang: 'de',
                theme: elem.data('theme'),
                format: elem.data('format'),
                timepicker: elem.data('timepicker'),
                datepicker: elem.data('datepicker'),
                step: elem.data('step'),
                timeHeightInTimePicker: elem.data('timeheightintimepicker'),
                minTime: elem.data('minTime'),
                maxTime: elem.data('maxTime'),
                minDate: elem.data('minDate'),
                maxDate: elem.data('maxDate'),
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