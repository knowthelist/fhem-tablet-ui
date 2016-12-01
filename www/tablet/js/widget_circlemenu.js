/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_circlemenu() {
    if (!$.fn.circleMenu)
        return ["lib/jquery.circlemenu.js"];
}

var Modul_circlemenu = function () {

    function init() {

        me.elements = $('div[data-type="circlemenu"]>ul');
        me.elements.each(function (index) {
            var parent = $(this).parent('div[data-type="circlemenu"]');
            $(this).circleMenu({
                    item_diameter: parent.data('item-diameter') || '4em',
                    item_width: parent.data('item-width'),
                    item_height: parent.data('item-height'),
                    trigger: 'click',
                    circle_radius: parent.data('circle-radius') || 70,
                    direction: parent.data('direction') || 'full',
                    border: parent.data('border') || 'round',
                    close_event: ($(this).hasClass("keepopen") || parent.hasClass("keepopen")) ? '' : 'click',
                    close: function () {
                        setTimeout(function () {
                            ftui.showModal(false);
                        }, 50);
                    },
                    select: function () {
                        setTimeout(function () {
                            ftui.showModal(false);
                        }, 50);
                    },
                    open: function () {
                        var elem = this;
                        if (elem.options.close_event !== '') {
                            parent.data('timeoutMenu', setTimeout(function () {
                                elem.close();
                                setTimeout(function () {
                                    ftui.showModal(false);
                                }, 1000);
                            }, parent.data('close-after') || Math.max(4000, 1000 * (parent.find('li').length - 1))));
                        }
                        if (!parent.hasClass("noshade")) {
                            ftui.showModal(true);
                        }
                    },
                })
                .addClass('circlemenu');
            parent.css({
                    minWidth: parent.data('item-width')
                })
                .closest('.gridster>ul>li').css({
                    overflow: 'visible'
                });


        });
        $('.menu li:not(:first-child)').on('click', function () {
            var timeoutMenu = $(this).parent().data('timeoutMenu');
            if (timeoutMenu)
                clearTimeout(timeoutMenu);
        });

    }

    function update(dev, par) {}

    // public
    // inherit members from base class
    var me = $.extend(new Modul_widget(), {
        //override members
        widgetname: 'circlemenu',
        init: init,
        update: update,
    });

    return me;
};