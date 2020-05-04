/* global ftui:true, Modul_widget:true, moment:true */

//"use strict";

function depends_fullcalview() {
    if (!$.fn.fullCalendar) {
        $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'fullcalendar/fullcalendar.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'lib/jquery.qtip.min.css" type="text/css" />');
        return [ftui.config.basedir + 'fullcalendar/lib/moment.min.js',
		ftui.config.basedir + 'fullcalendar/fullcalendar.js',
		ftui.config.basedir + 'fullcalendar/lang/de.js',
		ftui.config.basedir + 'ical/ical.js',
		ftui.config.basedir + 'ical/ical_events.js',
		ftui.config.basedir + 'ical/ical_fullcalendar.js',
		ftui.config.basedir + 'lib/jquery.qtip.min.js',
		ftui.config.basedir + 'lib/moment.min.js'];
    }
}

var showURL = false;

var Modul_fullcalview = function () {
    var sources_to_load_cnt;
    var eventsources;
    var eventcolors;
    var eventtextcolors;
    var ics_sources = [];
    var firstRun = [];
    var recur_done = false;


    var tooltip = $('<div style="position: absolute;"/>').qtip({
        id: 'fullcalendar',
        prerender: true,
        content: {
            text: ' '
        },
        position: {
            my: 'top center',
            at: 'bottom right',
            target: 'event',
            viewport: $('#fullcalendar'),
            adjust: {
                mouse: false,
                scroll: false
            }
        },
        show: false,
        hide: false,
        style: 'qtip-light'
    }).qtip('api');

    function data_req(url, callback) {
        var req = new XMLHttpRequest();
        req.addEventListener('load', callback);
        req.open('GET', url);
        req.send();
    }

    function add_recur_events() {
        if (sources_to_load_cnt < 1 && !recur_done) {
            $('#calendar').fullCalendar('addEventSource', expand_recur_events);
            recur_done = true;
        } else if (recur_done === false) {
            setTimeout(add_recur_events, 30);
        }
    }

    function load_ics(ics) {
        data_req(ics.url, function () {
            $('#calendar').fullCalendar('addEventSource', fc_events(this.response, ics.eID, ics.event_properties));
            sources_to_load_cnt -= 1;
        });
    }

    function init() {

        me.elements = $('div[data-type="' + me.widgetname + '"]:not([data-ready])', me.area);
        me.elements.each(function (index) {
            var elem = $(this);
            elem.attr("data-ready", "");
            
            elem.data('eventlimit', elem.data('eventlimit') || true); //true, false
            elem.data('defaultview', elem.data('defaultview') || 'basicWeek'); //alle verfügbaren Views auflisten
            elem.data('timeformat', elem.data('timeformat') || 'H:mm'); //Format für Zeitangabe
            elem.data('lang', elem.data('lang') || 'de'); //Länderkürzel für Sprache
            elem.data('weeknumbers', elem.data('weeknumbers') || true); //KW Anzeige
            elem.data('contentheight', elem.data('contentheight') || 350); //Höhe
            elem.data('contentwidth', elem.data('contentwidth') || 600); //Breite
            elem.data('headerleft', elem.data('headerleft') || 'title');
            elem.data('headercenter', elem.data('headercenter') || '');
            elem.data('headerright', elem.data('headerright') || 'today month basicWeek basic-->Week prev,next');

            if (elem.data('show_url'))
                showURL = elem.data('show_url'); //elem.data('show_url');  //URLs anzeigen

            elem.append('<div id="calendar" style="margin: 5px;"></div>');
            var eventLimitVar = elem.data('eventlimit');
            var defaultViewVar = elem.data('defaultview');
            var timeFormatVar = elem.data('timeformat');
            var langVar = elem.data('lang');
            var weeknumbersVar = elem.data('weeknumbers');
            var contentHeightVar = elem.data('contentheight');
            var contentWidthVar = elem.data('contentwidth');
            var headerLeftVar = elem.data('headerleft');
            var headerCenterVar = elem.data('headercenter');
            var headerRightVar = elem.data('headerright');
            var eventdataUpdate = [];
            eventsources = ($.isArray(elem.data('device')) ? elem.data('device') : [elem.data('device')]);
            eventcolors = ($.isArray(elem.data('eventcolors')) ? elem.data('eventcolors') : [elem.data('eventcolors')]);
            eventtextcolors = ($.isArray(elem.data('eventtextcolors')) ? elem.data('eventtextcolors') : [elem.data('eventtextcolors')]);
    
            if ((eventsources.length > 0 && eventcolors.length > 0 && eventtextcolors.length > 0) &&
                ((eventsources.length == eventcolors.length) && (eventsources.length == eventtextcolors.length))) {
                for (var n = 0; n < eventsources.length; n++) {
                    eventdataUpdate[n] = eventsources[n] + ':lastUpdate';
                    ics_sources[n] = {
                        eID: '' + eventsources[n] + '',
                        url: ftui.config.fhemDir + '/fhem?detail=' + eventsources[n] + '&dev.get' + eventsources[n] + '=' + eventsources[n] + '&cmd.get' + eventsources[n] + '=get&arg.get' + eventsources[n] + '=vcalendar&val.get' + eventsources[n] + '=&XHR=1',
                        event_properties: {
                            color: '' + eventcolors[n] + '',
                            textColor: '' + eventtextcolors[n] + ''
                        }
                    };
                }

                sources_to_load_cnt = ics_sources.length;

                elem.data('get', eventdataUpdate);
                me.addReading(elem, 'get');

                $('#calendar').fullCalendar({
                    eventLimit: eventLimitVar, // allow "more" link when too many events
                    header: {
                        left: headerLeftVar,
                        center: headerCenterVar,
                        right: headerRightVar
                    },
                    defaultView: defaultViewVar,
                    timeFormat: timeFormatVar,
                    lang: langVar,
                    weekNumbers: weeknumbersVar,
                    contentHeight: contentHeightVar,
                    contentWidth: contentWidthVar,
                    eventClick: function (data, event, view) {
                        var content = '<h3>' + data.title + '</h3>' +
                            '<p><b>Beschreibung:</b> ' + data.description + '<br />' +
                            '<p><b>Ort:</b> ' + data.location + '<br />' +
                            '<p><b>Start:</b> ' + moment(data.start).format('DD.MM.YYYY HH:mm') + '<br />' +
                            (data.end && '<p><b>Ende:</b> ' + moment(data.end).format('DD.MM.YYYY HH:mm') + '</p>' || '');
                        tooltip.set({
                                'content.text': content
                            })
                            .reposition(event).show(event);
                    },
                    dayClick: function () {
                        tooltip.hide();
                    },
                    eventResizeStart: function () {
                        tooltip.hide();
                    },
                    eventDragStart: function () {
                        tooltip.hide();
                    },
                    viewDisplay: function () {
                        tooltip.hide();
                    }
                });

            } else
                console.log('Invalid number of parameters number - please check your config.');
        });
    }

    function update(dev, par) {

        me.elements.filterDeviceReading('get', dev, par).each(function (index) {

            var recur_events = [];

            for (var n = 0; n < eventsources.length; n++) {
                if (eventsources[n] == dev && !firstRun[n]) {
                    (function (clsn) {
                        $('#calendar').fullCalendar('removeEvents', function (event) {
                            return event.eID == eventsources[clsn];
                        });
                    })(n);

                    (function (clsn) {
                        load_ics(ics_sources[clsn]);
                        add_recur_events();
                    })(n);

                    firstRun[n] = true;
                } else {
                    firstRun[n] = false;
                }
            }
        });
    }

    var me = $.extend(new Modul_widget(), {
        widgetname: 'fullcalview',
        init: init,
        update: update,
    });

    return me;
};
