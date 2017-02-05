/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_slider:true, Powerange: true */

"use strict";

function depends_level() {
    if (typeof Modul_slider == 'undefined' || !$.fn.Powerange) {
        return ["slider"];
    }
}

var Modul_level = function () {

    function onChange(elem) {}

    function init_attr(elem) {

        _base.init_attr(elem);

        elem.addClass('readonly');
    }

    // public
    // inherit all public members from base class
    var base = new Modul_slider();
    var _base = {};
    _base.init_attr = base.init_attr;
    var me = $.extend(base, {
        //override or own public members
        widgetname: 'level',
        onChange: onChange,
        init_attr: init_attr,
    });

    return me;
};