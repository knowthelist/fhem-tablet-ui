/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * originally created by Thomas Nesges
 * https://raw.githubusercontent.com/nesges/Widgets-for-fhem-tablet-ui/master/www/tablet/js/widget_svgplot.js
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_image:true */

"use strict";

function depends_svgplot() {
    var deps = [];
    if (!$.fn.famultibutton) {
        deps.push(ftui.config.basedir + "lib/fa-multi-button.min.js");
    }
    if (typeof Modul_image == 'undefined') {
        deps.push('image');
    }
    return deps;
}

var Modul_svgplot = function () {

    function init_attr(elem) {
        elem.initData('gplotfile', elem.data('device'));
        elem.initData('logdevice', '');
        elem.initData('logfile', 'CURRENT');
        elem.initData('refresh', 300);
    }

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            me.init_attr(elem);
            var spinner = $('<div />').appendTo(elem);
            spinner.famultibutton({
                mode: 'signal',
                icon: 'fa-spinner fa-spin',
                backgroundIcon: null,
                offColor: '#aa6900',
            });

            var device = elem.data('device');
            var gplot = elem.data('gplotfile');
            var logdev = elem.data('logdevice');
            var logfile = elem.data('logfile');
            if (gplot && logdev && logfile) {
                elem.empty();
                var src = ftui.config.fhemDir + '/SVG_showLog?dev=' + device + '&logdev=' + logdev + '&gplotfile=' + gplot + '&logfile=' + logfile + '&_=1';
                var img = $('<img/>', {
                    alt: logfile,
                    src: src,
                }).appendTo(elem);
                img.css({
                    'height': 'auto',
                    'width': '100%',
                });

                var refresh = elem.data('refresh');
                var counter = 0;
                setInterval(function () {
                    counter++;
                    if (counter === refresh) {
                        counter = 0;
                        var src = img.attr('src');
                        if (src.match(/_=\d+/)) {
                            src = _base.addurlparam(src, '_', new Date().getTime());
                        }
                        img.attr('src', src);
                    }
                }, 1000);
            }
        });
    }

    function update(dev, par) {}

    // public
    // inherit all public members from base class
    var base = new Modul_image();
    var _base = {};
    _base.addurlparam = base.addurlparam;
    var me = $.extend(base, {
        //override or own public members
        widgetname: 'svgplot',
        init: init,
        init_attr: init_attr,
        update: update,
    });

    return me;
};