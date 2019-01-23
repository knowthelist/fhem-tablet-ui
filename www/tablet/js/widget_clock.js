/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * originally created by Thomas Nesges
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

var Modul_clock = function () {

    function init_attr(elem) {
        elem.initData('format', 'H:i:s');
        elem.initData('offset', 0);
        elem.initData('serverDiff', 0);
        elem.initData('shortday-length', 3);
        elem.initData('days', ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]);
        elem.initData('shortmonth-length', 3);
        elem.initData('months', ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]);

        if (!elem.hasClass("localonly")) {
            ftui.sendFhemCommand('{localtime}')
                .done(function (fhemResult) {
                    var now = new Date();
                    var ft = new Date(fhemResult);
                    elem.data('serverDiff', now.getTime() - ft.getTime());
                });
        }

        if (!$.isArray(elem.data('days'))) {
            if (elem.data('days').match(/englisc?h/)) {
                elem.data('days', ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
            } else {
                console.log(me.widgetname, 'init_attr', 'ERROR: data-days must be an array');
            }
        }

        if (!$.isArray(elem.data('months'))) {
            if (elem.data('months').match(/englisc?h/)) {
                elem.data('months', ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
            } else {
                console.log(me.widgetname, 'init_attr', 'ERROR: data-months must be an array');
            }
        }

    }

    function getDateTime(elem) {
        var now = new Date();
        var now_msec = now.getTime();
        return new Date(now_msec - elem.data('serverDiff') + 3600000 * Number(elem.data('offset')));
    }

    function createDateArray(elem) {
        var d = [];
        var now = getDateTime(elem);

        // Y: Jahreszahl, vierstellig
        // y: Jahreszahl, zweistellig
        // m: Monatszahl, mit f¸hrender Null
        // n: Monatszahl, ohne f¸hrende Null
        // d: Tag des Monats, mit f¸hrender Null
        // j: Tag des Monats, ohne f¸hrende Null
        // H: Stunde des Tages, mit f¸hrender Null
        // G: Stunde im 24-Stunden-Format, ohne f¸hrender Null
        // i: Minute der Stunde, mit f¸hrender Null
        // s: Sekunde der Minute, mit f¸hrender Null
        // u: Millisekunden mit f¸hrender Null
        // O: Zeitunterschied zur Greenwich time (GMT) in Stunden
        // U: Sekunden seit Beginn der UNIX-Epoche (January 1 1970 00:00:00 GMT)
        // w: Wochentagszahl (Sonntag = 0, Samstag = 6)
        // N: Wochentagszahl nach ISO-8601 (Montag = 1, Sonntag = 7)
        // l: Wochentag
        // D: Wochentag gek?rzt
        // S: Anhang der englischen Aufz?hlung f?r einen Monatstag, zwei Zeichen
        // F: Monat als ganzes Wort, wie January oder March
        // M: Monatsname gek?rzt
        // g: Stunde im 12-Stunden-Format, ohne f?hrende Nullen
        // h: Stunde im 12-Stunden-Format, mit f?hrenden Nullen
        // a: am/pm
        // A: AM/PM
        // W: ISO-8601 Wochennummer des Jahres

        // TODO:
        // z: Der Tag des Jahres

        d['Y'] = now.getFullYear();
        d['n'] = now.getMonth() + 1;
        d['j'] = now.getDate();
        d['G'] = now.getHours();
        d['i'] = now.getMinutes();
        d['s'] = now.getSeconds();
        d['w'] = now.getDay();
        d['u'] = now.getMilliseconds();
        d['O'] = now.getTimezoneOffset() / 60;
        d['U'] = Math.floor(now.getTime() / 1000);
        d['y'] = d['Y'] - 2000;
        d['d'] = d['j'] < 10 ? '0' + d['j'] : d['j'];
        d['m'] = d['n'] < 10 ? '0' + d['n'] : d['n'];
        d['H'] = d['G'] < 10 ? '0' + d['G'] : d['G'];
        d['i'] = d['i'] < 10 ? '0' + d['i'] : d['i'];
        d['s'] = d['s'] < 10 ? '0' + d['s'] : d['s'];
        d['u'] = parseInt(d['u'] / 100);
        d['N'] = d['w'] === 0 ? 7 : d['w'];
        d['l'] = elem.data('days')[(Number(d['N']) - 1)];
        d['D'] = d['l'].substr(0, elem.data('shortday-length'));
        d['S'] = String(d['j']).match(/[23]?1$/) ? 'st' : String(d['j']).match(/[23]?2$/) ? 'nd' : String(d['j']).match(/[23]?3$/) ? 'rd' : 'th';
        d['F'] = elem.data('months')[(Number(d['n']) - 1)];
        d['M'] = d['F'].substr(0, elem.data('shortmonth-length'));
        d['g'] = d['G'] <= 12 ? d['G'] : d['G'] - 12;
        d['h'] = d['g'] < 10 ? '0' + d['g'] : d['g'];
        d['a'] = d['G'] <= 12 ? 'am' : 'pm';
        d['A'] = d['a'].toUpperCase();
        now.setUTCDate(now.getUTCDate() + 4 - (now.getUTCDay()||7));
        var yearStart = new Date(Date.UTC(now.getUTCFullYear(),0,1));
        d['W'] = Math.ceil(( ( (now - yearStart) / 86400000) + 1)/7);

        return d;
    }

    function createDateText(format, d) {
        // split formatstring into it's letters and replace one after the other
        var datearr = format.split('');
        for (var l = 0; l < datearr.length; l++) {
            for (var key in d) {
                if (datearr[l] == key) {
                    datearr[l] = d[key];
                    // stop replacing after a match
                    break;
                }
            }
        }
        return datearr.join('');
    }

    function updateText(elem) {
        var d = createDateArray(elem);
        var text = createDateText(elem.data('format'), d);
        elem.text(text);
    }

    function startRefreshTimer(elem, interval) {

        var now = getDateTime(elem),
            s = now.getSeconds(),
            ms = now.getMilliseconds();

        var waitMs = (interval === 'ms') ?
            100 :
            (interval === 's') ?
            1000 - ms * 1 :
            60000 - s * 1000 - ms * 1;

        var tid = setTimeout(function () {
            if (elem && elem.data('days')) {

                updateText(elem);
                startRefreshTimer(elem, interval);

            } else {
                clearTimeout(tid);
            }
        }, waitMs);

    }

    function init_ui(elem) {
        updateText(elem);
        if (elem.data('format').indexOf('u') > -1) {
            startRefreshTimer(elem, 'ms');
        } else if (elem.data('format').indexOf('s') > -1) {
            startRefreshTimer(elem, 's');
        } else {
            startRefreshTimer(elem, 'm');
        }
    }

    function update(dev, par) {}

    // public
    // inherit members from base class
    var me = $.extend(new Modul_widget(), {
        //override members
        widgetname: 'clock',
        init_ui: init_ui,
        init_attr: init_attr,
        update: update,
    });

    return me;
};
