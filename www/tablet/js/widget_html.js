/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_html() {
    var deps = [];
    return deps;
}

// ToDo: data-lock as reading
/* Example
    <input type="checkbox" data-type="html"
           data-checked="dummy2:STATE" data-map-checked='{"on":"true", "off":"false"}'
           data-changed="dummy2:STATE" data-map-changed='{"true":"on", "false":"off"}'>
*/

var Modul_html = function () {

    function onClicked(elem) {

        console.log('onClicked', elem);

        if (elem.isValidData('url')) {
            document.location.href = elem.data('url');
            var hashUrl = window.location.hash.replace('#', '');
            if (hashUrl && elem.isValidData('load')) {
                elem.closest('nav').trigger('changedSelection', [elem.text()]);
                var sel = elem.data('load');
                if (sel) {
                    $(sel).siblings().removeClass('active');
                    //load page if not done until now
                    if ($(sel + " > *").children().length === 0 || elem.hasClass('nocache'))
                    //loadPage(elem);
                        $(sel).addClass('active');
                }
            }
        } else if (elem.isValidData('url-xhr')) {
            ftui.toast(elem.data('url-xhr'));
            $.get(elem.data('url-xhr'));
        } else if (elem.isValidData('fhem-cmd')) {
            ftui.toast(elem.data('fhem-cmd'));
            ftui.setFhemStatus(elem.data('fhem-cmd'));
        } else {

            var value = '';
            var map = elem.data('map-clicked');

            if ((typeof map === "object") && (map !== null)) {
                var len = Object.keys(map).length;
                value = map[Object.keys(map)[0]];
                for (var i = 0; i < len; i++) {
                    if (elem.hasClass(Object.keys(map)[i])) {
                        if (i + 1 == len) {
                            value = map[Object.keys(map)[0]];
                        } else {
                            value = map[Object.keys(map)[i + 1]];
                        }
                        break;
                    }
                }
            }
            elem.data('value', value);
            changed(elem);
        }

    }

    function onChanged(elem) {

        console.log('onChanged', elem);
        //re-map current state of the control into value
        var value = '';
        var map = elem.data('map-changed');

        if ((typeof map === "object") && (map !== null)) {
            var len = Object.keys(map).length;
            value = map[Object.keys(map)[0]];

            for (var i = 0; i < len; i++) {
                if (elem.attr('type') === 'checkbox') {
                    if (elem[0].checked.toString() === Object.keys(map)[i]) {
                        value = map[Object.keys(map)[i]];
                        break;
                    }
                }
            }

        } else if (elem.attr('type') === 'range' || elem.attr('type') === 'radio' || elem[0].nodeName === 'SELECT') {
            value = elem.val();
        }
        elem.data('value', value);

        changed(elem);
    }

    function changed(elem) {

        console.log('changed', elem);

        var device = elem.data('device');
        var reading = elem.data('clicked') || elem.data('changed') || '';
        // fully qualified readings => DEVICE:READING
        if (reading.match(/:/)) {
            var fqreading = reading.split(':');
            device = fqreading[0];
            reading = fqreading[1];
        }
        // fill objects for mapping from FHEMWEB paramid to device + reading
        if (ftui.isValid(device) && ftui.isValid(reading)) {
            elem.data('set', (reading === 'STATE') ? '' : reading);
            elem.data('device', device);
        }
        // exchange value and send to FHEM
        elem.transmitCommand();
    }

    function init() {

        me.elements = $('[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {

            var elem = $(this);
            elem.initData('val', elem.data('value')); // value is reserved for widget intern usage, therefore we switch to val
            elem.initData('value', elem.val());
            elem.initData('set', '');
            elem.initData('cmd', 'set');
            elem.initData('part', -1);
            elem.initData('unit', '');
            elem.initData('pre-text', '');
            elem.initData('post-text', '');
            elem.initData('substitution', '');

            if (elem.isDeviceReading('val')) {
                me.addReading(elem, 'val');
            }
            if (elem.isDeviceReading('content')) {
                me.addReading(elem, 'content');
            }
            if (elem.isDeviceReading('checked')) {
                me.addReading(elem, 'checked');
            }
            if (elem.isDeviceReading('class')) {
                me.addReading(elem, 'class');
            }

            if (elem.attr('type') === 'checkbox' || elem.attr('type') === 'radio' || elem.attr('type') === 'range' || elem[0].nodeName === 'SELECT') {
                if (elem.isValidData('changed')) {
                    elem.on('change', function () {
                        onChanged(elem);
                    });
                }
            } else if (elem.attr('type') === 'text') {
                elem.bind("enterKey", function (e) {
                    elem.blur();
                    changed(elem);
                });
                elem.keyup(function (e) {
                    elem.data('value', elem.val());
                    if (e.keyCode === 13)
                        elem.trigger("enterKey");
                });
            } else {
                if (elem.isValidData('clicked')) {
                    elem.on('click', function () {
                        onClicked(elem);
                    });
                }
            }
        });
    }

    function update(dev, par) {

        //reading for value
        me.elements.filterDeviceReading('val', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.getReading('val').val;

                if (elem.attr('type') === 'range' || elem.attr('type') === 'text' || elem[0].nodeName === 'SELECT') {
                    elem.val(value);
                }

            });

        //reading for content
        me.elements.filterDeviceReading('content', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var content = (elem.hasClass('timestamp')) ? elem.getReading('content').date : elem.getReading('content').val;
                if (ftui.isValid(content)) {
                    var cont = ftui.getPart(content, elem.data('part'));
                    var unit = elem.data('unit');
                    cont = me.substitution(cont, elem.data('substitution'));
                    cont = me.map(elem.data('map-content'), cont, cont);
                    cont = me.fix(cont, elem.data('fix'));
                    cont = elem.data('pre-text') + cont + elem.data('post-text');
                    if (!isNaN(parseFloat(cont)) && isFinite(cont) && cont.indexOf('.') > -1) {
                        var vals = cont.split('.');
                        cont = "<span class='label-precomma'>" + vals[0] + "</span>" +
                            "<span class='label-comma'>.</span>" +
                            "<span class='label-aftercomma'>" + vals[1] + "</span>";
                    }

                    if (unit)
                        elem.html(cont + "<span class='label-unit'>" + window.unescape(unit) + "</span>");
                    else
                        elem.html(cont);
                    if (elem.children().length > 0) {
                        elem.trigger('domChanged');
                    }
                }
            });

        //reading for class
        me.elements.filterDeviceReading('class', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var read = elem.getReading('class').val;
                if (ftui.isValid(read)) {
                    var map = elem.data('map-class');
                    if ((typeof map === "object") && (map !== null)) {
                        $.each(map, function (key, value) {
                            elem.removeClass(value);
                        });
                    }
                    elem.addClass(me.map(map, read, read));
                }
            });

        //reading for checked
        me.elements.filterDeviceReading('checked', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var read = elem.getReading('checked').val;
                if (ftui.isValid(read)) {
                    var map = elem.data('map-checked');
                    var def = elem.data('value');
                    elem.prop('checked', me.map(map, read, def) === 'true');
                }
            });

    }

    var me = $.extend(new Modul_widget(), {

        widgetname: 'html',
        init: init,
        update: update,
    });

    return me;
};