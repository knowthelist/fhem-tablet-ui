/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_popup() {
    if (!$.fn.draggable)
        return [ftui.config.basedir + "lib/jquery-ui.min.js"];
}

var Modul_popup = function () {

    function hide(dialog, mode) {
        switch (mode) {
        case 'animate':
            dialog.animate({
                height: 0,
                width: 0,
                top: dialog.options.start_top,
                left: dialog.options.start_left,
                opacity: 0
            }, 500, "swing", function () {
                ftui.showModal(false);
                dialog.trigger('fadeout');
            });
            break;
        case 'animateTop':
            dialog.animate({
                top: dialog.options.start_top,
                left: dialog.options.start_left,
            }, 500, "swing", function () {
                ftui.showModal(false);
                dialog.trigger('fadeout');
            });
            break;
        default:

            dialog.fadeOut(500, function () {
                ftui.showModal(false);
                dialog.trigger('fadeout');
            });
        }
    }

    function show(dialog, mode) {
        dialog.detach();
        $('body').append(dialog);
        if (dialog.options.shade) {
            ftui.showModal(true);
        }
        switch (mode) {
        case 'animate':
            dialog.show();
            dialog.animate({
                height: dialog.options.height,
                width: dialog.options.width,
                top: dialog.options.end_top,
                left: dialog.options.end_left,
                opacity: 1
            }, 500, "swing", function () {
                dialog.trigger('fadein');
            });
            break;
        case 'animateTop':
            dialog.show();
            dialog.animate({
                top: dialog.options.end_top,
                left: dialog.options.end_left,
            }, 500, "swing", function () {
                dialog.trigger('fadein');
            });
            break;
        default:
            dialog.css({
                height: dialog.options.height,
                width: dialog.options.width,
                top: dialog.options.end_top,
                left: dialog.options.end_left,
            });
            dialog.fadeIn(500);
            dialog.trigger('fadein');
        }
    }

    function init_attr(elem) {
        elem.initData('get', 'STATE');
        elem.initData('get-on', 'on');
        elem.initData('get-off', 'off');
        elem.initData('height', '300px');
        elem.initData('width', '400px');
        elem.initData('mode', 'animate');
        elem.initData('starter', null);
        elem.initData('draggable', true);

        me.addReading(elem, 'get');
    }

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            me.init_attr(elem);

            var id = [me.widgetname, me.area, index].join('_');
            var dialog = elem.find('.dialog');
            var starter = (elem.data('starter')) ? $(document).find(elem.data('starter')) : elem.children(":first");
            if (starter.hasClass('dialog')) {
                starter = $('<div/>', {
                    class: 'dialog-starter'
                }).prependTo(elem);
            } else
                starter.addClass('dialog-starter');

            var close = $('<div/>', {
                class: 'dialog-close',
                id: elem.attr('id')
            }).html('x').appendTo(dialog);

            if (dialog && close && starter) {
                elem.attr('data-id', id);
                dialog.attr('data-id', id);
                starter.attr('data-id', id);
                close.attr('data-id', id);

                if (elem.data('draggable')) {
                    if ($.fn.draggable)
                        dialog.draggable();
                    else {
                        console.log("widget_popup tries to load jquery ui. insert correct script tag into html header to avoid error (and this warning)");
                        console.log('e.g.: <script type="text/javascript" src="lib/jquery-ui.min.js"></script>');
                    }
                }

                if (elem.hasClass('interlock')) {
                    close.hide();
                    dialog.addClass('interlock');
                }

                dialog.css({
                    'height': elem.data('height'),
                    'width': elem.data('width')
                });
                starter.css({
                    'cursor': 'pointer'
                });
                elem.closest('.gridster>ul>li').css({
                    overflow: 'visible'
                });
                dialog.options = {};
                dialog.options.shade = !elem.hasClass('noshade');

                //prepare events
                $(window).resize(function () {
                    var width = elem.data('width');
                    var height = elem.data('height');
                    if ( String(elem.data('width')).indexOf('%') > 0 ){
                        dialog.options.end_left = (elem.isValidData('left')) ? elem.data('left') : ((100 - parseInt(width)) / 2) + '%';
                    } else {
                        dialog.options.end_left = (elem.isValidData('left')) ? elem.data('left') : ($(window).width() - parseInt(width)) / 2; 
                    }
                    if ( String(elem.data('height')).indexOf('%') > 0 ){
                        dialog.options.end_top = (elem.isValidData('top')) ? elem.data('top') : ((100 - parseInt(height)) / 2) + '%';
                    } else {
                        dialog.options.end_top = (elem.isValidData('top')) ? elem.data('top') : ($(window).height() - parseInt(height)) / 2; 
                    }

                    dialog.options.height = height;
                    dialog.options.width = width;

                    if (elem.data('mode') === 'animateTop') {
                        dialog.options.start_top = 0 - parseInt(dialog.options.height); 
                        dialog.options.start_left = dialog.options.end_left; 
                        dialog.css({
                            top: dialog.options.start_top,
                            left: dialog.options.start_left,
                        });
                    } else {
                        dialog.options.start_top = (ftui.isValid(starter) ) ? starter.offset().top + parseInt(dialog.options.height)/2 : 0;
                        dialog.options.start_left = (ftui.isValid(starter) ) ? starter.offset().left + parseInt(dialog.options.width)/2 : 0;
                        dialog.css({
                            height: 0,
                            width: 0,
                            top: dialog.options.start_top,
                            left: dialog.options.start_left,
                        });

                    }
                });

                close.on('click', function () {
                    hide(dialog, elem.data('mode'));
                });

                $(document).on('shadeClicked', function () {
                    if ($('.dialog.interlock:visible').length === 0) {
                        hide(dialog, elem.data('mode'));
                    }
                });

                starter.on('clicked click', function (e) {
                    e.preventDefault();
                    show(dialog, elem.data('mode'));
                    elem.trigger('fadein');
                    return false;
                });
            }
        });
        $(window).resize();
    }

    function update(dev, par) {

        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                var elem = $(this);
                var value = elem.getReading('get').val;
                var state = ftui.getPart(value, elem.data('part'));
                if (ftui.isValid(state)) {
                    var id = elem.data('id');

                    if (elem.matchingState('get', state) === 'on') {
                        $('div[data-id="' + id + '"].dialog-starter').trigger('click');
                    }
                    if (elem.matchingState('get', state) === 'off') {
                        ftui.showModal(false);
                        $('div[data-id="' + id + '"].dialog-close').trigger('click');
                    }
                }
            });
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'popup',
        init: init,
        init_attr: init_attr,
        update: update,
    });

    return me;
};