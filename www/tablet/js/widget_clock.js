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
        elem.initData('interval', 1000);
        elem.initData('shortday-length', 3);
        elem.initData('days', ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]);
        elem.initData('shortmonth-length', 3);
        elem.initData('months', ["Januar", "Februar", "M‰rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]);


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

    function init_datearray(elem) {
        var d = [];
        var now = new Date();
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

        // TODO:
        // z: Der Tag des Jahres
        // W: ISO-8601 Wochennummer des Jahres

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
        d['u'] = d['u'] < 10 ? '000' + d['u'] : d['u'] < 100 ? '00' + d['u'] : d['u'] < 1000 ? '0' + d['u'] : d['u'];
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
        // 'W' by mc-hollin http://forum.fhem.de/index.php/topic,34233.msg304630.html#msg304630
        var onejan = new Date(now.getFullYear(), 0, 1);
        var kw = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        d['W'] = kw < 10 ? '0' + kw : kw;

        return d;
    }

    function init_datetext(format, d) {
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

    function init_ui(elem) {

        var tid = setInterval(function () {
            if (elem && elem.data('days')) {

                var d = init_datearray(elem);
                var text = init_datetext(elem.data('format'), d);
                elem.text(text);

            } else {
                clearInterval(tid);
            }
        }, elem.data('interval'));
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