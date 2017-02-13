/* FTUI Plugin
 * Copyright (c) 2015-2017 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

function depends_circlemenu() {
    if (!$.fn.circleMenu)
        return [ftui.config.basedir + "lib/jquery.circlemenu.js"];
}

var Modul_circlemenu = function () {

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            var ulElem = elem.find('ul');
            ulElem.circleMenu({
                    item_diameter: elem.data('item-diameter') || '4em',
                    item_width: elem.data('item-width'),
                    item_height: elem.data('item-height'),
                    trigger: 'click',
                    circle_radius: elem.data('circle-radius') || 70,
                    direction: elem.data('direction') || 'full',
                    border: elem.data('border') || 'round',
                    close_event: (ulElem.hasClass("keepopen") || elem.hasClass("keepopen")) ? '' : 'click',
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
                        var cm = this;
                        if (cm.options.close_event !== '') {
                            elem.data('timeoutMenu', setTimeout(function () {
                                cm.close();
                                setTimeout(function () {
                                    ftui.showModal(false);
                                }, 1000);
                            }, elem.data('close-after') || Math.max(4000, 1000 * (elem.find('li').length - 1))));
                        }
                        if (!elem.hasClass("noshade")) {
                            ftui.showModal(true);
                        }
                    },
                })
                .addClass('circlemenu');
            elem.css({
                    minWidth: elem.data('item-width')
                })
                .closest('.gridster>ul>li').css({
                    overflow: 'visible'
                });
console.log('wrap');
            ulElem.wrapAll('<div class="circlemenu-wrapper"></div>');
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