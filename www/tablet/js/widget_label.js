/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

var Modul_label = function () {

/*    function formatValue(elem, val) {
        if (elem.isValidData('format')) {
            var pipe = elem.data('format'),
                functs = pipe.split('|');
            console.log(functs);
            for (var i=0,len=functs.length;i<len;i++){
                var func = functs[i].replace(')','').trim().split('('),
                    params = func[1].split(',');
                console.log(func[0],params); 
                val = window[func[0]](params)
            }
        }
        return val;
    }*/

    function update_value(elem) {

        var value = (elem.hasClass('timestamp')) ? elem.getReading('get').date : elem.getReading('get').val;

        if (ftui.isValid(value)) {
            var val = ftui.getPart(value, elem.data('part'));
            var unit = elem.data('unit');
            val = me.substitution(val, elem.data('substitution'));
            val = me.map(elem.data('map-get'), val, val);
            //val = me.round(val, elem.data('round'));
            //val = formatValue(elem, val);
            val = me.factor(val, elem.data('factor'));
            val = me.fix(val, elem.data('fix'));
            val = elem.data('pre-text') + val + elem.data('post-text');
            ftui.log(4, 'label.update_value: value=' + val);
            if (!isNaN(parseFloat(val)) && isFinite(val) && val.indexOf('.') > -1) {
                var vals = val.split('.');
                val = "<span class='label-precomma'>" + vals[0] + "</span>" +
                    "<span class='label-comma'>.</span>" +
                    "<span class='label-aftercomma'>" + vals[1] + "</span>";
            }

            if (!elem.hasClass('fixedlabel') && !elem.hasClass('fixcontent')) {
                if (unit) {
                    elem.html(val + "<span class='label-unit'>" + window.unescape(unit) + "</span>");
                } else {
                    elem.html(val);
                }
                // init embedded widgets
                if (elem.find('[data-type]').length > 0) {
                    ftui.initWidgets('[data-wgid="' + elem.wgid() + '"]');
                }
            }
            me.update_cb(elem, val);
        }
        var color = elem.data('color');
        if (color && !elem.isDeviceReading('color')) {
            elem.css("color", ftui.getStyle('.' + color, 'color') || color);
        }

    }

    function init_attr(elem) {

        elem.initData('get', 'STATE');
        elem.initData('unit', '');
        elem.initData('color', '');
        elem.initData('limits', elem.data('states') || '');
        elem.initData('limits-get', (elem.data('device')) ? elem.data('device') + ':' + elem.data('get') : elem.data('get'));
        elem.initData('limits-part', elem.data('part'));
        elem.initData('substitution', '');
        elem.initData('pre-text', '');
        elem.initData('post-text', '');
        elem.initData('refresh', 0);

        // if hide reading is defined, set defaults for comparison
        if (elem.isValidData('hide')) {
            elem.initData('hide-on', '(true|1|on)');
        }
        elem.initData('hide', elem.data('get'));
        if (elem.isValidData('hide-on')) {
            elem.initData('hide-off', '!on');
        }
        me.addReading(elem, 'hide');

        elem.data('fix', ($.isNumeric(elem.data('fix'))) ? Number(elem.data('fix')) : -1);

        me.addReading(elem, 'get');
        me.addReading(elem, 'limits-get');
        if (elem.isDeviceReading('color')) {
            me.addReading(elem, 'color');
        }
    }

    function init_ui(elem) {
        var interval = elem.data('refresh');
        if ($.isNumeric(interval) && interval > 0) {
            var tid = setInterval(function () {
                if (elem && elem.data('get')) {

                    update_value(elem);

                } else {
                    clearInterval(tid);
                }
            }, Number(interval) * 1000);
        }

    }

    function update_colorize(value, elem) {
        //set colors according matches for values
        var limits = elem.data('limits');
        var colors = elem.data('colors');
        var classes = elem.data('classes');
        if (limits && $.isArray(limits)) {
            var idx = ftui.indexOfGeneric(limits, value);
            if (idx > -1) {
                if (colors) {
                    var layer = (elem.hasClass('bg-limit') ? 'background' : 'color');
                    elem.css(layer, ftui.getStyle('.' + colors[idx], 'color') || colors[idx]);
                }
                if (classes) {
                    for (var i = 0, len = classes.length; i < len; i++) {
                        elem.removeClass(classes[i]);
                    }
                    elem.addClass(classes[idx]);
                }
            }
        }
    }

    function update_cb(elem) {}

    function update(dev, par) {

        me.elements.each(function (index) {
            var elem = $(this);


            // update from normal state reading
            if (elem.matchDeviceReading('get', dev, par)) {
                update_value(elem);
            }

            //extra reading for dynamic color
            if (elem.matchDeviceReading('color', dev, par)) {
                var val = elem.getReading('color').val;
                if (ftui.isValid(val)) {
                    val = '#' + val.replace('#', '');
                    elem.css("color", val);
                }
            }

            //extra reading for colorize
            if (elem.matchDeviceReading('limits-get', dev, par)) {
                var lval = elem.getReading('limits-get').val;
                if (ftui.isValid(lval)) {
                    var v = ftui.getPart(lval, elem.data('limits-part'));
                    update_colorize(v, elem);
                }
            }

            me.updateHide(elem, dev, par);

        });



    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'label',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
        update_cb: update_cb,
        update_colorize: update_colorize
    });

    return me;
};
