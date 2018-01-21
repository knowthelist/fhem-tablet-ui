/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

var Modul_rotor = function () {

    function switchElement($elem, delay) {

        var $nextElem = (!$elem.is(':last-child')) ? $elem.next() : $elem.parent().children().eq(0);
        $elem.removeClass('is-visible').addClass('is-hidden');
        $nextElem.removeClass('is-hidden').addClass('is-visible');
        setTimeout(function () {
            switchElement($nextElem, delay);
        }, delay);
    }

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");
            
            elem.initData('delay', 3500);
            var delay = elem.data('delay');
            
            elem.addClass('rotor');
            elem.find('ul').addClass('rotor-wrapper');
            elem.find('li').not(":first").addClass('is-hidden');
            elem.find('li:first').addClass('is-visible');
            setTimeout(function () {
                switchElement(elem.find('.is-visible'), delay);
            }, delay);

        });
    }

    function update(dev, par) {}

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'rotor',
        init: init,
        update: update,
    });
    return me;
};