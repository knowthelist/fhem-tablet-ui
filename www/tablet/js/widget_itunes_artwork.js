/* FTUI Plugin
 * Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
 * originally created by Thomas Nesges,
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_image:true */

"use strict";

function depends_itunes_artwork() {
    if (typeof Modul_image == 'undefined')
        return ["image"];
}

var Modul_itunes_artwork = function () {

    function init_attr(elem) {
        elem.initData('get', 'STATE');

        // reading and reading-value that say "Player has stopped"
        elem.initData('get-playstatus', 'STATE');
        elem.initData('get-playstatus-stop', 'stop');
        me.addReading(elem, 'get-playstatus');

        // dir for standard images
        var _dir = ftui.config.dir.replace(/(.*\/).*/, '$1');

        elem.data('opacity', elem.data('opacity') || 1);
        elem.data('size', elem.data('size') || 150);
        elem.data('height', elem.data('size'));
        elem.data('width', elem.data('size'));
        elem.data('media', elem.data('media') || 'music');
        elem.data('entity', elem.data('entity') || 'song');
        elem.data('timeout', elem.data('timeout') || 3000);
        elem.data('loadingimg', elem.data('loadingimg') || _dir + '../images/loading.svg');
        elem.data('stoppedimg', elem.data('stoppedimg') || _dir + '../images/stop.svg');
        elem.data('notfoundimg', elem.data('notfoundimg') || _dir + '../images/unknown.svg');
        elem.data('stripbrackets', elem.data('stripbrackets') || false);
        elem.data('stripregex', elem.data('stripregex') || '');

        var img = elem.find('img');
        img.attr('src', elem.data('loadingimg'));
    }

    function checkValidity(elem) {

        if (elem.data('updateinprogress'))
            return;

        elem.data('updateinprogress', true);
        // there's a timing issue with readings updates in MPD
        var timedUpdate = setTimeout($.proxy(function () {
            var get = elem.data('get');
            var done = 0;
            var changed = false;
            var val = [];
            for (var i = 0, len = get.length; i < len; i++) {
                // get all readings
                val[i] = elem.getReading('get', i).val;

                // remember old readings and see if they've changed
                if (elem.data('ov' + i) !== val[i]) {
                    elem.data('ov' + i, val[i]);
                    changed = true;
                }

                // count read values; update is done only if all values are available
                if (val[i]) {
                    done++;
                }
            }

            // fetch coverimage after all readings are read
            if ((changed || elem.data('force')) && val.length == done) {
                elem.find('img').attr('src', elem.data('loadingimg'));

                // delete timestamp values (workarroud for list-bug in requestFhem)
                for (var g = 0; g < get.length; g++) {
                    var pre;
                    // strip brackets
                    if (elem.data('stripbrackets')) {
                        pre = val[g];
                        val[g] = val[g].replace(/\(.*?\)/g, '');
                        val[g] = val[g].replace(/\[.*?\]/g, '');
                        val[g] = val[g].replace(/\{.*?\}/g, '');
                        val[g] = val[g].replace(/<.*?\>/g, '');
                        console.log(me.widgetname, 'stripbrackets', pre, val[g]);
                    }
                    // strip regex
                    if (elem.data('stripregex')) {
                        pre = val[g];
                        val[g] = val[g].replace(new RegExp(elem.data('stripregex'), 'g'), '');
                        console.log(me.widgetname, 'stripregex', elem.data('stripregex'), pre, val[g]);
                    }
                }
                console.log(me.widgetname, 'update', get, val);
                elem.find('img').attr('src', elem.data('loadingimg'));
                itunes(elem, val);
            }

            elem.data('updateinprogress', false);
        }, me), 300);


    }

    function itunes(elem, val) {
        console.log(me.widgetname, 'itunes.start', val);
        $.ajax({
            url: "https://itunes.apple.com/search",
            dataType: "jsonp",
            data: {
                term: val.join(' '),
                media: elem.data('media'),
                entity: elem.data('entity'),
            },
            elem: elem,
            val: val,
            size: elem.data('size'),
            img: elem.find('img'),
            timeout: elem.data('timeout'),
            beforeSend: function (jqXHR, settings) {
                jqXHR.url = settings.url;
            },
            error: function (jqXHR, textStatus, message) {
                console.log(me.widgetname, 'itunes.error', textStatus, message, jqXHR.url);
            },
            success: function (data, textStatus, jqXHR) {
                if ($.isArray(data.results) && data.results[0] && data.results[0].artworkUrl100) {
                    var artwork;
                    if (this.size <= 60) {
                        artwork = data.results[0].artworkUrl60;
                    } else {
                        artwork = data.results[0].artworkUrl100;
                    }
                    if (artwork) {
                        var pxratiosize = Math.round(window.devicePixelRatio * this.size);
                        artwork = artwork.replace(/100x100/, pxratiosize + 'x' + pxratiosize);

                        this.img.attr('src', artwork);
                        console.log(me.widgetname, 'itunes.artwork', artwork);
                    } else {
                        console.log(me.widgetname, 'itunes.artwork', '-');
                    }
                } else {
                    // no results found for our search terms
                    console.log(me.widgetname, 'itunes.results', '-');
                    this.img.attr('src', this.elem.data('notfoundimg'));
                    // ..shorten the terms by 1 and try again until only one term is left
                    if (val.length > 1) {
                        this.val.pop();
                        itunes(elem, this.val);
                    }
                }
            },
        });
    }

    function update(dev, par) {

        //reading for playstatus
        me.elements.filterDeviceReading('get-playstatus', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var playstatus = elem.getReading('get-playstatus').val;
                if (playstatus === elem.data('get-playstatus-stop')) {
                    elem.find('img').attr('src', elem.data('stoppedimg'));
                    console.log(me.widgetname, 'playstatus', elem.data('get-playstatus'), playstatus);
                }

                if (!elem.data('_playstatus')) {
                    // enforce update after first start
                    elem.data('force', true);
                    console.log(me.widgetname, 'enforce update after first start', playstatus);
                    checkValidity(elem);
                } else {
                    // enforce update if playstatus has changed from stop to anything else
                    if (playstatus && elem.data('_playstatus') && elem.data('_playstatus') === elem.data('get-playstatus-stop') && elem.data('_playstatus') !== playstatus) {
                        elem.data('force', true);
                        console.log(me.widgetname, 'enforce update', elem.data('_playstatus'), playstatus);
                        checkValidity(elem);
                    } else {
                        elem.data('force', false);
                    }

                }
                elem.data('_playstatus', playstatus);
            });

        // readings for image tags
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                checkValidity($(this));
            });

    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_image(), {
        //override or own public members
        widgetname: 'itunes_artwork',
        init_attr: init_attr,
        update: update,
    });

    return me;
};

// https://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html