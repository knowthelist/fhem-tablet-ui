/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true, Swiper:true */

"use strict";

function depends_swiper() {
    if (!$.fn.Swiper) {
        $('head').append('<link rel="stylesheet" href="' + ftui.config.dir + '/../lib/swiper.min.css" type="text/css" />');
        return ["lib/swiper.jquery.min.js"];
    }
}

var Modul_swiper = function () {

    function activateSlide(elem, states, state) {
        var idx = ftui.indexOfGeneric(states, state);
        if (idx > -1) {
            var swiper = elem[0].swiper;
            if (swiper)
                swiper.slideTo(idx);
        }
    }

    function init_attr(elem) {

        elem.initData('get', 'STATE');
        elem.initData('width', '100%');
        elem.initData('height', '100%');
        elem.initData('autoplay', null);
        elem.initData('tabclass', 'swipertab');

        me.addReading(elem, 'get');
    }

    function init_ui(elem) {
        var elemPagination = null;
        var elemPrev = null;
        var elemNext = null;

        // prepare container and wrapper elements
        elem.addClass('swiper-container');
        elem.find('ul').addClass('swiper-wrapper');
        elem.find('ul>li').addClass('swiper-slide');
        elem.css({
            width: elem.data('width'),
            height: elem.data('height'),
        });

        if (!elem.hasClass('nopagination')) {
            elemPagination = $('<div/>')
                .addClass('swiper-pagination')
                .appendTo(elem);
        }
        if (elem.hasClass('navbuttons')) {
            elemPrev = $('<div/>')
                .addClass('swiper-button-prev')
                .appendTo(elem);
            elemNext = $('<div/>')
                .addClass('swiper-button-next')
                .appendTo(elem);
        }

        var swiper = new Swiper(elem, {
            pagination: elemPagination,
            paginationClickable: true,
            nextButton: elemNext,
            prevButton: elemPrev,
            moveStartThreshold: 70,
            autoplay: elem.data('autoplay'),
            autoplayDisableOnInteraction: false,
            hashnav: elem.hasClass('hashnav'),
            noSwipingClass: 'noswipe',
        });


        // navigation via hash value
        if (elem.hasClass('hashnav')) {
            $(window).bind('hashchange', function () {
                var hash = window.location.hash.replace('#', '');
                var idx = elem.find('li').index(elem.find('[data-hash="' + hash + '"]'));
                if (idx > -1)
                    swiper.slideTo(idx);
            });
        }
        // navigation via tab elements
        var tabclass = elem.data('tabclass');
        if (tabclass) {
            $('.' + tabclass).bind('setOn', function () {
                var idx = $(".swipertab").index(this);
                if (idx > -1)
                    swiper.slideTo(idx);
            });
        }

        /*elem.find('ul>li>*').click(function(event) {
            //console.log('click');
            //event.preventDefault();
            //more functionality here
        });*/

        // Refresh swiper after it became visible
        elem.closest('[data-type="popup"]').on("fadein", function (event) {
            swiper.update();
        });

        return elem;
    }

    function update(dev, par) {
        // update from normal state reading
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var state = elem.getReading('get').val;
                if (state) {
                    var states = elem.data('states') || elem.data('get-on');
                    if ($.isArray(states)) {
                        activateSlide(elem, states, state);
                    }
                }
            });
    }


    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'swiper',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });
    return me;
};