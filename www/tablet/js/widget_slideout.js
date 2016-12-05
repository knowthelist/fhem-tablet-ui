/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true, Slideout:true */

"use strict";

function depends_slideout() {
    if (!$.fn.Slideout) {
        $('head').append('<link rel="stylesheet" href="' + ftui.config.dir + '/../css/ftui_slideout.css" type="text/css" />');
        return ["lib/slideout.min.js"];
    }
}

var Modul_slideout = function () {

    function init_attr(elem) {
        elem.initData('label', '#linkname');
        elem.initData('panel', 'main#panel');
        elem.initData('menu', 'nav#menu');
        elem.initData('icon', 'fa-bars');
        elem.initData('position', 'left');
        elem.initData('icon-color', ftui.getStyle('.' + me.widgetname, 'icon-color') || '#222');
    }

    function init_ui(elem) {

        var panel = $(elem.data('panel'))[0];
        var menu = $(elem.data('menu'))[0];

        if (ftui.isValid(panel) && ftui.isValid(menu)) {

            var slideout = new Slideout({
                'panel': panel,
                'menu': menu,
                'padding': (elem.data('position') === 'left') ? 256 : -256,
                'tolerance': 70,
                'touch': elem.hasClass('notouch') ? false : true,
            });
            elem.addClass('fa-stack');

            if (elem.data('position') === 'right') {
                $(elem.data('menu')).css({
                    'left': 'auto'
                });
            }

            // prepare icon
            var icon = elem.data('icon');
            var elemIcon = $('<div/>', {
                    class: 'icon',
                })
                .css({
                    color: elem.mappedColor('icon-color'),
                })
                .addClass('fa ' + icon + ' fa-lg fa-fw')
                .appendTo(elem);

            elem.click(function (event) {
                slideout.toggle();
            });


            $(elem.data('menu')).on('changedSelection', function (event, text) {
                var elemLinkName = $(elem.data('label'));
                if (elemLinkName)
                    elemLinkName.text(text);
                if (!elem.hasClass('keepopen')) {
                    slideout.close();
                }
            });

            slideout.on('beforeopen', function () {
                $('.fixed').addClass('open-' + elem.data('position'));
            });

            slideout.on('beforeclose', function () {
                $('.fixed').removeClass('open-' + elem.data('position'));
            });

        } else {
            ftui.log(1, 'Slideout: Error - no panel element or menu element found');
        }

        return elem;
    }

    function update(dev, par) {}

    var me = $.extend(new Modul_widget(), {
        widgetname: 'slideout',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};