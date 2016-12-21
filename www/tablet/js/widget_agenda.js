/* FTUI Plugin
 * Copyright (c) 2016 hypetsch 
 * https://github.com/knowthelist/fhem-tablet-ui/pull/168
 */

/* global ftui:true, Modul_widget:true */

"use strict";

var Modul_agenda = function () {

    function init_attr(elem) {

        elem.initData('max'   , 100);
        elem.initData('c-term', 'c-term');

        me.addReading(elem, 'c-term');

        for( var i = 1; i <= elem.data('max'); ++i) {
            var num = ("00" + i).slice(-3);
            var reading;

            reading = 't_'+num+'_summary';
            elem.initData(reading, reading);
            me.addReading(elem, reading);

            reading = 't_' + num + '_bdate';
            elem.initData(reading, reading);
            me.addReading(elem, reading);

            reading = 't_' + num + '_btime';
            elem.initData(reading, reading);
            me.addReading(elem, reading);

            reading = 't_' + num + '_edate';
            elem.initData(reading, reading);
            me.addReading(elem, reading);

            reading = 't_' + num + '_etime';
            elem.initData(reading, reading);
            me.addReading(elem, reading);

            reading = 't_' + num + '_location';
            elem.initData(reading, reading);
            me.addReading(elem, reading);

            reading = 't_' + num + '_source';
            elem.initData(reading, reading);
            me.addReading(elem, reading);
        }
    }

    function init_ui(elem) {
    }

    function getDate(elem, datename, timename) {
        var d = elem.getReading(datename).val.split('.');
        var t = elem.getReading(timename).val.split(':');
        return new Date(d[2], d[1] - 1, d[0], t[0], t[1], t[2]);
    }

    function diffDays(date1, date2) {
        var diff = new Date(new Date(date2.getYear(), date2.getMonth(), date2.getDate()) -
                   new Date(date1.getYear(), date1.getMonth(), date1.getDate())
                );
        return Math.floor((diff / 1000 / 60 / 60 / 24));
    }

    function prettyPrintDate(date) {
        var text = "";
        switch (diffDays(new Date(), date)) {
            case 0: text += "Heute" + ", "; break;
            case 1: text += "Morgen" + ", "; break;
        }

        text += date.eeee() + ", " + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
        return text;
    }

    function readCalendarConfig(elem, source, setting, defaultValue) {
        try {
            var cfg = elem.data('config');
            var val = eval("cfg." + source + "." + setting);
            if (val && val !== "")
                return val;
            else
                return defaultValue;
        }
        catch (e) {
            console.log(e);
            return defaultValue;
        }
    }

    function update_cb(elem) {
    }

    function update(dev,par) {

        // update from normal state reading
        me.elements.filterDeviceReading('c-term', dev, par)
        .each(function(index) {

            var elem = $(this);
            var text = '';
            var count = elem.getReading('c-term').val;

            // render container
            text += '<div class="container padding" style="overflow:hidden;">';

            if( count === 0 )
                text += '<div data-type="label">Keine Termine</div>';
            else if (count > elem.data('max'))
                count = elem.data('max');

            var currentDate = new Date(2000, 1, 1);
            for( var i = 1; i <= count; i++ ) {
                var num = ('00' + i).slice(-3);

                var summary = elem.getReading('t_' + num + '_summary').val;
                var bdate = me.getDate(elem, 't_' + num + '_bdate', 't_' + num + '_btime');
                var edate = me.getDate(elem, 't_' + num + '_edate', 't_' + num + '_etime');
                var source = elem.getReading('t_' + num + '_source').val;

                // check if new day
                if( diffDays(currentDate, bdate) !== 0 ) {
                    text += '<div class="center container padding inline top-narrow-10">';
                    text += '<div class="left-align small darker" style="width:100%; border-bottom:1px solid #393939">';
                    text += me.prettyPrintDate(bdate);
                    text += '</div>';
                    text += '</div>';

                    currentDate = bdate;
                }

                var icon = me.readCalendarConfig(elem, source, "icon", "");
                var color = me.readCalendarConfig(elem, source, "color", "");
                var abbr = me.readCalendarConfig(elem, source, "abbreviation", "");

                if( icon !== "" && icon.substr(0,3) == "fa-" ) {
                    icon = "fa " + icon;
                    abbr = "";
                }

                text += '<div class="center container padding inline top-narrow-10">';
                text += '<div class="center large white ' + icon + '" style="line-height:30px;background-color:' + color + '; min-height:30px; width:35px;">';
                text += abbr;
                text += '</div>';
                text += '<div class="" style="padding-left:5px; width:100%; min-height:30px; background:rgba(0, 0, 0, .08);">';
                text += '<div class="left-align bold">' + summary + '</div>';
                text += '<div class="left-align small darker">';

                var durationDays = diffDays(bdate, edate);
                if (durationDays == 1 && bdate.getHours() === 0 && bdate.getMinutes() === 0 && edate.getHours() === 0 && edate.getMinutes() === 0)
                    text += 'Ganzer Tag';
                else if (durationDays === 0)
                    text += bdate.hhmm() + ' - ' + edate.hhmm();
                else
                    text += bdate.hhmm() + ' - ' + me.prettyPrintDate(edate);

                text += '</div>';
                text += '</div>';
                text += '</div>';
            }

            // close container
            text += '</div>';

            elem.html( text );
        });
    }

    // public
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        // override or own public members
        widgetname: 'agenda',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
        update_cb: update_cb,
        prettyPrintDate: prettyPrintDate,
        getDate: getDate,
        readCalendarConfig: readCalendarConfig,
        diffDays: diffDays
    });
    
    return me;
};

