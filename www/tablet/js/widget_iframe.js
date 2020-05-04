/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * originally created by Thomas Nesges
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_iframe() {
        return [ftui.config.basedir + "lib/fa-multi-button.min.js"];
}

var Modul_iframe = function () {

    function init_attr(elem) {
        elem.initData('check-src', elem.data('src'));
        elem.initData('timeout', 3000);
        elem.initData('scrolling', 'no');
        elem.initData('fill', 'no');
        elem.initData('height', 100);
        elem.initData('width', 100);
        elem.initData('icon-spinner', 'fa-spinner fa-spin');
        elem.initData('color-spinner', '#aa6900');
        elem.initData('icon-error', 'fa-frown-o');
        elem.initData('color-error', '#505050');
        elem.initData('get', 'STATE');
        elem.initData('check', true);

        me.addReading(elem, 'get');
        if (elem.isValidData('url')) {
            me.addReading(elem, 'url');
        }
    }

    function init_ui(elem) {
        if (elem.data('check')) {
            elem.empty();
            var spinner = $('<div />').appendTo(elem);
            spinner.famultibutton({
                mode: 'signal',
                icon: elem.data('icon-spinner'),
                backgroundIcon: null,
                offColor: elem.data('color-spinner'),
            });

            $.ajax({
                type: 'HEAD',
                method: 'GET',
                url: elem.data('check-src'),
                timeout: elem.data('timeout'),
                success: function () {
                    elem.empty();
                    var style = '';
                    if (elem.data('fill') == 'yes') {
                        style = 'position:absolute;left:0;top:0;height:100%;width:100%;';
                    } else {
                        style = 'height:' + elem.data('height') + 'px;width:' + elem.data('width') + 'px;';
                    }
                    ftui.log(2, 'iframe - after check - src=' + elem.data('src'));
                    $("<iframe src='" + elem.data('src') + "' style='" + style + "border:none' scrolling='" + elem.data('scrolling') + "'/>").appendTo(elem);
                },
                error: function (x, t, m) {
                    elem.empty();
                    console.log('Error trying to load ' + elem.data('src') + ':', t, '-', m);
                    var spinner = $('<div />').appendTo(elem);
                    spinner.famultibutton({
                        mode: 'signal',
                        icon: elem.data('icon-error'),
                        backgroundIcon: null,
                        offColor: elem.data('color-error'),
                    });
                }
            });
        } else {
            elem.empty();
            var style = '';
            var width = elem.data('width');
            var widthUnit = ($.isNumeric(width)) ? 'px' : '';
            var height = elem.data('height');
            var heightUnit = ($.isNumeric(height)) ? 'px' : '';
            if (elem.data('fill') == 'yes') {
                style = 'position:absolute;left:0;top:0;height:100%;width:100%;';
            } else {
                style = 'height:' + height + heightUnit + ';width:' + width + widthUnit + ';';
            }
            ftui.log(2, 'iframe - src=' + elem.data('src'));
            $("<iframe src='" + elem.data('src') + "' style='" + style + "border:none' scrolling='" + elem.data('scrolling') + "'/>").appendTo(elem);
        }
    }

    //usage of "function init()" from Modul_widget()

    function update(dev, par) {

        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.getReading('get').val;
                if (value) {
                    if (value == elem.data('get-refresh'))
                        me.init_ui(elem);
                    else if (value.match(RegExp('^' + elem.data('get-refresh') + '$')))
                        me.init_ui($(this));
                    else if (!elem.data('get-refresh') && elem.data('value') != value)
                        me.init_ui(elem);
                }
                elem.data('value', value);
            });

        //extra reading for url
        me.elements.filterDeviceReading('url', dev, par)
            .each(function (idx) {
                var elem = $(this);
                elem.data('src', elem.getReading('url').val);
                ftui.log(2, 'iframe - set src from url - src=' + elem.data('src'));
                me.init_ui(elem);
            });
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'iframe',
        init_ui: init_ui,
        init_attr: init_attr,
        update: update,
    });

    return me;
};
