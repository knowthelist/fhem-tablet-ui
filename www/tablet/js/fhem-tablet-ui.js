/* FHEM tablet ui */
/**
 * UI builder framework for FHEM
 *
 * Version: 2.6.15
 *
 * Copyright (c) 2015-2017 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 */

/* global Framework7:true, jQuery:true */

"use strict";


// -------- Framework7---------
// https://framework7.io/docs/

if (typeof Framework7 === 'function') {
    var f7 = {
        ftui: new Framework7({
            animateNavBackIcon: true
        }),
        options: {
            dynamicNavbar: true,
            domCache: true
        },
        views: []
    };
    $('.view').each(function (index) {
        var view = f7.ftui.addView('#' + $(this)[0].id, {
            dynamicNavbar: true
        });
        f7.ftui.views.push(view);

    });
    f7.ftui.onPageInit('*', function (page) {
        ftui.log(page.name + ' initialized');
        ftui.initWidgets('[data-page="' + page.name + '"]');
    });
}

// -------- Widget Base---------
var Modul_widget = function () {

    var subscriptions = {};
    var elements;

    function update_lock(dev, par) {
        me.elements.filterDeviceReading('lock', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var value = elem.getReading('lock').val;
                if (elem.matchingState('lock', value) === 'on') {
                    elem.addClass('lock');
                }
                if (elem.matchingState('lock', value) === 'off') {
                    elem.removeClass('lock');
                }
            });
    }

    function update_hide(dev, par) {
        me.elements.filterDeviceReading('hide', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var value = elem.getReading('hide').val;
                if (elem.matchingState('hide', value) === 'on') {
                    if (ftui.isValid(elem.data('hideparents'))) {
                        elem.parents(elem.data('hideparents')).hide();
                    } else {
                        elem.hide();
                    }
                }
                if (elem.matchingState('hide', value) === 'off') {
                    if (ftui.isValid(elem.data('hideparents'))) {
                        elem.parents(elem.data('hideparents')).show();
                    } else {
                        elem.show();
                    }
                }
            });
    }

    function update_reachable(dev, par) {
        me.elements.filterDeviceReading('reachable', dev, par)
            .each(function (idx) {
                var elem = $(this);
                var value = elem.getReading('reachable').val;
                if (elem.matchingState('reachable', value) === 'on') {
                    elem.removeClass('unreachable');
                }
                if (elem.matchingState('reachable', value) === 'off') {
                    elem.addClass('unreachable');
                }
            });

    }

    function substitution(value, subst) {
        if (ftui.isValid(subst)) {
            if ($.isArray(subst)) {
                for (var i = 0, len = subst.length; i < len; i += 2) {
                    var match = value.match(new RegExp('^' + subst[i] + '$'));
                    if (match && i + 1 < len) {
                        //console.log(value, 'match', subst[i], subst[i + 1]);
                        return subst[i + 1].replace('$1', value);

                    }
                }
            } else if (subst.match(/^s/)) {
                var f = subst.substr(1, 1);
                var sub = subst.split(f);
                return value.replace(new RegExp(sub[1], sub[3]), sub[2]);
            } else if (subst.match(/weekdayshort/))
                return ftui.dateFromString(value).ee();
            else if (subst.match(/.*\(\)/))
                return eval('value.' + subst);
        }
        return value;
    }


    function fix(value, fix) {
        return ($.isNumeric(value) && fix >= 0) ? Number(value).toFixed(fix) : value;
    }

    function map(mapObj, readval, defaultVal) {
        if ((typeof mapObj === "object") && (mapObj !== null)) {
            for (var key in mapObj) {
                if (readval === key || readval.match(new RegExp('^' + key + '$'))) {
                    return mapObj[key];
                }
            }
        }
        return defaultVal;
    }

    function init_attr(elem) {}

    function init_ui(elem) {
        elem.text(me.widgetname);
    }


    function init() {
        ftui.log(1, "init widget: name=" + me.widgetname + " area=" + me.area);
        me.elements = $('[data-type="' + me.widgetname + '"]', me.area);
        me.elements.each(function (index) {
            me.init_attr($(this));
            me.init_ui($(this));
        });
    }

    function addReading(elem, key) {
        var data = elem.data(key);
        if (ftui.isValid(data)) {
            if ($.isArray(data) || !data.toString().match(/^[#\.\[].*/)) {
                var device = elem.data('device');
                if (!$.isArray(data)) {
                    data = new Array(data.toString());
                }
                for (var i = 0, len = data.length; i < len; i++) {
                    var reading = data[i];
                    // fully qualified readings => DEVICE:READING
                    if (reading.match(/:/)) {
                        var fqreading = reading.split(':');
                        device = fqreading[0];
                        reading = fqreading[1];
                    }
                    // fill objects for mapping from FHEMWEB paramid to device + reading
                    if (ftui.isValid(device) && ftui.isValid(reading) && 
                        device !== '' && reading !== '' &&
                        device !== ' ' && reading !== ' ' ) {
                        device = device.toString();
                        var paramid = (reading === 'STATE') ? device : [device, reading].join('-');
                        subscriptions[paramid] = {};
                        subscriptions[paramid].device = device;
                        subscriptions[paramid].reading = reading;
                    }
                }
            }
        }
    }

    function update(dev, par) {
        ftui.log(1, 'warning: ' + me.widgetname + ' has not implemented update function');
    }

    var me = {
        widgetname: 'widget',
        area: '',
        init: init,
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
        update_lock: update_lock,
        update_reachable: update_reachable,
        update_hide: update_hide,
        substitution: substitution,
        fix: fix,
        map: map,
        addReading: addReading,
        subscriptions: subscriptions,
        elements: elements
    };

    return me;
};

// ------- Plugins --------
var plugins = {
    modules: [],

    addModule: function (module) {
        this.modules.push(module);
    },

    removeArea: function (area) {
        for (var i = this.modules.length - 1; i >= 0; i -= 1) {
            if (this.modules[i].area === area) {
                this.modules.splice(i, 1);
            }
        }
    },

    updateParameters: function () {
        ftui.subscriptions = {};
        ftui.subscriptionTs = {};
        ftui.devs = [ftui.config.webDevice];
        ftui.reads = ['STATE', 'longpoll'];
        for (var i = this.modules.length - 1; i >= 0; i -= 1) {
            var module = this.modules[i];
            for (var key in module.subscriptions) {
                ftui.subscriptions[key] = module.subscriptions[key];
                ftui.subscriptionTs[key + '-ts'] = module.subscriptions[key];
                var d = ftui.subscriptions[key].device;
                if (ftui.devs.indexOf(d) < 0) {
                    ftui.devs.push(d);
                }
                var r = ftui.subscriptions[key].reading;
                if (ftui.reads.indexOf(r) < 0) {
                    ftui.reads.push(r);
                }
            }
        }

        // build filter
        var devicelist = (ftui.devs.length > 0) ? $.map(ftui.devs, $.trim).join() : '.*';
        var readinglist = (ftui.reads.length > 0) ? $.map(ftui.reads, $.trim).join(' ') : '';

        if (!ftui.config.longPollFilter) {
            ftui.poll.longPollFilter = devicelist + ' ' + readinglist;
        } else {
            ftui.poll.longPollFilter = ftui.config.longPollFilter
        }

        if (!ftui.config.shortPollFilter) {
            ftui.poll.shortPollFilter = devicelist + ' ' + readinglist;
        } else {
            ftui.poll.shortPollFilter = ftui.config.shortPollFilter
        }

        // force shortpoll
        ftui.states.lastShortpoll = 0;
    },

    load: function (name, area) {
        ftui.log(1, 'Load widget : ' + name);
        return ftui.loadPlugin(name, area);
    },

    update: function (dev, par) {

        $.each(this.modules, function (index, module) {
            //Iterate each module and run update function if module is available
            if (typeof module === 'object') {
                module.update(dev, par);
            }
        });
        // update data-bind elements
        ftui.updateBindElements('ftui.deviceStates');

        ftui.log(1, 'update done for "' + dev + ':' + par + '"');
    }
};

// -------- FTUI ----------

var ftui = {

    version: '2.6.15',
    config: {
        DEBUG: false,
        DEMO: false,
        dir: '',
        filename: '',
        basedir: '',
        fhemDir: '',
        debuglevel: 0,
        doLongPoll: true,
        lang: 'de',
        toastPosition: 'bottom-left',
        shortpollInterval: 0,
        styleCollection: {},
        stdColors: ["green", "orange", "red", "ligthblue", "blue", "gray", "white", "mint"]
    },

    poll: {
        currLine: 0,
        xhr: null,
        longPollRequest: null,
        shortPollTimer: null,
        longPollTimer: null,
        lastUpdateTimestamp: new Date(1970, 1, 1),
        lastEventTimestamp: new Date(1970, 1, 1),
        lastShortpollTimestamp: new Date(1970, 1, 1),
    },

    states: {
        width: 0,
        lastSetOnline: 0,
        lastShortpoll: 0,
        longPollRestart: false
    },

    deviceStates: {},
    paramIdMap: {},
    timestampMap: {},
    subscriptions: {},
    subscriptionTs: {},
    gridster: {
        instances: {},
        instance: null,
        baseX: 0,
        baseY: 0,
        margins: 5,
        mincols: 0,
        cols: 0,
        rows: 0
    },

    init: function () {

        ftui.paramIdMap = {};
        ftui.timestampMap = {};
        ftui.devs = [ftui.config.webDevice];
        ftui.reads = ['STATE'];
        ftui.config.longPollType = $("meta[name='longpoll_type']").attr("content") || 'websocket';
        var longpoll = $("meta[name='longpoll']").attr("content") || '1';
        ftui.config.doLongPoll = (longpoll != '0');
        ftui.config.shortPollFilter = $("meta[name='shortpoll_filter']").attr("content");
        ftui.config.longPollFilter = $("meta[name='longpoll_filter']").attr("content");
        ftui.config.DEMO = ($("meta[name='demo']").attr("content") == '1');
        ftui.config.debuglevel = $("meta[name='debug']").attr("content") || 0;
        ftui.config.webDevice = $("meta[name='web_device']").attr("content") || 'WEB';
        ftui.config.maxLongpollAge = $("meta[name='longpoll_maxage']").attr("content") || 240;
        ftui.config.DEBUG = (ftui.config.debuglevel > 0);
        ftui.config.TOAST = $("meta[name='toast']").attr("content") || 5; //1,2,3...= n Toast-Messages, 0: No Toast-Messages
        ftui.config.toastPosition = $("meta[name='toast_position']").attr("content") || 'bottom-left';
        ftui.config.shortpollInterval = $("meta[name='shortpoll_only_interval']").attr("content") || 30;
        ftui.config.shortPollDelay = $("meta[name='shortpoll_restart_delay']").attr("content") || 3000;
        //self path
        var url = window.location.pathname;
        ftui.config.filename = url.substring(url.lastIndexOf('/') + 1);
        ftui.log(1, 'Filename: ' + ftui.config.filename);
        ftui.config.fhemDir = $("meta[name='fhemweb_url']").attr("content") || location.origin + "/fhem/";
        ftui.config.fhemDir = ftui.config.fhemDir.replace('///', '//');
        ftui.log(1, 'FHEM dir: ' + ftui.config.fhemDir);
        // lang
        var userLang = navigator.language || navigator.userLanguage;
        ftui.config.lang = $("meta[name='lang']").attr("content") || (ftui.isValid(userLang)) ? userLang.split('-')[0] : 'de';
        // credentials
        ftui.config.username = $("meta[name='username']").attr("content");
        ftui.config.password = $("meta[name='password']").attr("content");

        // Get CSFS Token
        ftui.getCSrf();

        // init Toast
        function configureToast() {
            if ($.toast && !$('link[href$="lib/jquery.toast.min.css"]').length)
                $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'lib/jquery.toast.min.css" type="text/css" />');
        }

        if (!$.fn.toast) {
            ftui.dynamicload(ftui.config.basedir + "lib/jquery.toast.min.js", false).done(function () {
                configureToast();
            });
        } else {
            configureToast();
        }

        // after the page became visible, check server connection
        $(document).on('visibilitychange', function () {
            if (document.visibilityState === 'hidden') {
                // page is hidden
            } else {
                // page is visible
                ftui.log(1, 'Page became visible again -> start healthCheck in 3 secondes ');
                setTimeout(function () {
                    ftui.healthCheck();
                }, 3000);
            }
        });


        try {
            // try to use localStorage
            localStorage.setItem('ftui', ftui.version);
            localStorage.removeItem('ftui');
        } catch (e) {
            // there was an error so...
            ftui.toast('You are in Privacy Mode<br>Please deactivate Privacy Mode and then reload the page.', 'error');
        }

        // detect clickEventType
        var android = ftui.getAndroidVersion();
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        var onlyTouch = ((android && parseFloat(android) < 5) || iOS);
        ftui.config.clickEventType = (onlyTouch) ? 'touchstart' : 'touchstart mousedown';
        ftui.config.moveEventType = ((onlyTouch) ? 'touchmove' : 'touchmove mousemove');
        ftui.config.releaseEventType = ((onlyTouch) ? 'touchend' : 'touchend mouseup');
        ftui.config.leaveEventType = ((onlyTouch) ? 'touchleave' : 'touchleave mouseout');

        //add background for modal dialogs
        $("<div id='shade' />").prependTo('body').hide();
        $('#shade').on(ftui.config.clickEventType, function (e) {
            $(document).trigger("shadeClicked");
        });

        ftui.readStatesLocal();


        // init FTUI CSS if not already loaded
        if ($('link[href$="css/fhem-tablet-ui.css"]').length === 0 &&
            $('link[href$="css/fhem-tablet-ui.min.css"]').length === 0) {
            var cssUrl = ftui.config.basedir + 'css/fhem-tablet-ui.css';
            $.when($.get(cssUrl, function () {
                $('<link>', {
                    rel: 'stylesheet',
                    type: 'text/css',
                    'href': cssUrl
                }).prependTo('head');
            })).then(function () {
                var ii = 0;
                var cssListener = setInterval(function () {
                    ftui.log(1, 'fhem-tablet-ui.css dynamically loaded. Waiting until it is ready to use...');
                    if ($("body").css("text-align") === "center") {
                        ftui.log(1, 'fhem-tablet-ui.css is ready to use.');
                        clearInterval(cssListener);
                        ftui.loadStyleSchema();
                        ftui.initPage();
                    }
                    ii++;
                    if (ii > 120) {
                        clearInterval(cssListener);
                        ftui.toast("fhem-tablet-ui.css not ready to use", 'error');
                    }
                }, 50);
            });
        } else {
            ftui.loadStyleSchema();
            ftui.initPage();
        }

        $(document).on("initWidgetsDone", function () {
            // start shortpoll delayed
            ftui.startShortPollInterval(500);
            // restart longpoll
            ftui.states.longPollRestart = true;
            ftui.restartLongPoll();
            ftui.initHeaderLinks();
            ftui.disableSelection();
        });

        if (!f7) {
            // dont show focus frame
            $("*:not(select):not(textarea)").focus(function () {
                $(this).blur();
            });
        }


        setInterval(function () {
            ftui.healthCheck();
        }, 60000);

    },

    initGridster: function (area) {

        ftui.gridster.minX = parseInt($("meta[name='widget_base_width'],meta[name='gridster_min_width']").attr("content") || 0);
        ftui.gridster.minY = parseInt($("meta[name='widget_base_height'],meta[name='gridster_min_height']").attr("content") || 0);
        ftui.gridster.baseX = parseInt($("meta[name='widget_base_width'],meta[name='gridster_base_width']").attr("content") || 0);
        ftui.gridster.baseY = parseInt($("meta[name='widget_base_height'],meta[name='gridster_base_height']").attr("content") || 0);
        ftui.gridster.cols = parseInt($("meta[name='gridster_cols']").attr("content") || 0);
        ftui.gridster.rows = parseInt($("meta[name='gridster_rows']").attr("content") || 0);
        ftui.gridster.resize = parseInt($("meta[name='gridster_resize']").attr("content") || (ftui.gridster.baseX + ftui.gridster.baseY) > 0 ? 0 : 1);
        if ($("meta[name='widget_margin']").attr("content"))
            ftui.gridster.margins = parseInt($("meta[name='widget_margin']").attr("content"));

        function configureGridster() {

            var highestCol = -1;
            var highestRow = -1;
            var baseX = 0;
            var baseY = 0;
            var cols = 0;
            var rows = 0;

            $(".gridster > ul > li").each(function () {
                var colVal = $(this).data("col") + $(this).data("sizex") - 1;
                if (colVal > highestCol)
                    highestCol = colVal;
                var rowVal = $(this).data("row") + $(this).data("sizey") - 1;
                if (rowVal > highestRow)
                    highestRow = rowVal;
            });

            //console.log(ftui.gridster.cols, ftui.gridster.rows, ftui.gridster.baseX, ftui.gridster.baseY);

            cols = (ftui.gridster.cols > 0) ? ftui.gridster.cols : highestCol;
            rows = (ftui.gridster.rows > 0) ? ftui.gridster.rows : highestRow;

            var colMargins = 2 * cols * ftui.gridster.margins;
            var rowMargins = 2 * rows * ftui.gridster.margins;

            baseX = (ftui.gridster.baseX > 0) ? ftui.gridster.baseX : (window.innerWidth - colMargins) / cols;
            baseY = (ftui.gridster.baseY > 0) ? ftui.gridster.baseY : (window.innerHeight - rowMargins) / rows;

            if (baseX < ftui.gridster.minX) {
                baseX = ftui.gridster.minX;
            }
            if (baseY < ftui.gridster.minY) {
                baseY = ftui.gridster.minY;
            }

            ftui.gridster.mincols = parseInt($("meta[name='widget_min_cols']").attr("content") || cols);

            if (ftui.gridster.instances[area])
                ftui.gridster.instances[area].destroy();

            ftui.gridster.instances[area] = $(".gridster > ul", area).gridster({
                widget_base_dimensions: [baseX, baseY],
                widget_margins: [ftui.gridster.margins, ftui.gridster.margins],
                draggable: {
                    handle: '.gridster li > header'
                },
                min_cols: parseInt(ftui.gridster.mincols),
            }).data('gridster');

            if (ftui.gridster.instances[area]) {
                if ($("meta[name='gridster_disable']").attr("content") == '1') {
                    ftui.gridster.instances[area].disable();
                }
                if ($("meta[name='gridster_starthidden']").attr("content") == '1') {
                    $('.gridster').hide();
                }
            }
            // corrections for gridster in gridster element
            var gridgrid = $('.gridster > ul > li:has(* .gridster)');
            if (gridgrid.length > 0) {
                gridgrid.css({
                    'background-color': 'transparent',
                    'margin': '-' + ftui.gridster.margins + 'px',
                    'width': gridgrid.parent().width() - gridgrid.position().left,
                    'height': '100%'
                });
            }

            $('.gridster > ul > li:has(.center)').addClass('vbox');
            // max height for inner boxes
            $('.gridster > ul > li:has(.vbox)').addClass('vbox');
            $('.gridster li > header ~ .hbox:only-of-type').each(function (index) {
                $(this).css({
                    'height': 'calc(100% - ' + $(this).siblings('header').outerHeight() + 'px)'
                });
            });
        }

        if ($('.gridster').length > 0) {

            if (!$('link[href$="lib/jquery.gridster.min.css"]').length)
                $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'lib/jquery.gridster.min.css" type="text/css" />');

            if (!$.fn.gridster) {
                ftui.dynamicload(ftui.config.basedir + "lib/jquery.gridster.min.js", false).done(function () {
                    configureGridster();
                });
            } else {
                configureGridster();
            }

            if (ftui.gridster.resize) {
                $(window).on('resize', function () {
                    if (ftui.states.width !== window.innerWidth) {
                        clearTimeout(ftui.states.delayResize);
                        ftui.states.delayResize = setTimeout(configureGridster, 500);
                        ftui.states.width = window.innerWidth;
                    }
                });
            }
        }


    },

    initPage: function (area) {

        //init gridster
        area = (ftui.isValid(area)) ? area : '';
        console.time('initPage');
        ftui.log(2, 'initPage - area=' + area);

        ftui.initGridster(area);

        //include extern html code
        var deferredArr = $.map($('[data-template]', area), function (templ, i) {
            var templElem = $(templ);
            return $.get(
                templElem.data('template'), {},
                function (data) {
                    var parValues = templElem.data('parameter');
                    for (var key in parValues) {
                        data = data.replace(new RegExp(key, 'g'), parValues[key]);
                    }
                    templElem.html(data);
                }
            );
        });

        //get current values of readings not before all widgets are loaded
        $.when.apply(this, deferredArr).then(function () {
            //continue after loading the includes
            ftui.initWidgets(area);
            ftui.log(1, 'init templates - Done');
        });

    },

    initWidgets: function (area) {

        area = (ftui.isValid(area)) ? area : '';
        var types = [];
        ftui.log(3, plugins);
        plugins.removeArea(area);
        ftui.log(3, plugins);
        ftui.log(2, 'initWidgets - area=' + area);

        //collect required widgets types
        $('[data-type]', area).each(function (index) {
            var type = $(this).data("type");
            if (types.indexOf(type) < 0) {
                types.push(type);
            }
        });

        //init widgets
        var deferredArr = $.map(types, function (type, i) {
            return plugins.load(type, area);
        });

        //get current values of readings not before all widgets are loaded
        $.when.apply(this, deferredArr).then(function () {
            plugins.updateParameters();
            ftui.log(1, 'initWidgets - Done');
            console.timeEnd('initPage');
            $(document).trigger("initWidgetsDone", [area]);
        });
    },

    initHeaderLinks: function () {

        if (($('[class*=fa-]').length > 0 ||
                $('[data-type="select"]').length > 0 ||
                $('[data-type="homestatus"]').length > 0) &&
            !$('link[href$="lib/font-awesome.min.css"]').length
        )
            $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'lib/font-awesome.min.css" type="text/css" />');
        if ($('[class*=oa-]').length > 0 && !$('link[href$="lib/openautomation.css"]').length)
            $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'lib/openautomation.css" type="text/css" />');
        if ($('[class*=fs-]').length > 0 && !$('link[href$="lib/fhemSVG.css"]').length)
            $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'lib/fhemSVG.css" type="text/css" />');
        if ($('[class*=mi-]').length > 0 && !$('link[href$="lib/material-icons.min.css"]').length)
            $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'lib/material-icons.min.css" type="text/css" />');
        if ($('[class*=wi-]').length > 0 && !$('link[href$="lib/weather-icons.min.css"]').length)
            $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'lib/weather-icons.min.css" type="text/css" />');
        if ($('[class*=wi-wind]').length > 0 && !$('link[href$="lib/weather-icons-wind.min.css"]').length)
            $('head').append('<link rel="stylesheet" href="' + ftui.config.basedir + 'lib/weather-icons-wind.min.css" type="text/css" />');

    },

    startLongpoll: function () {
        ftui.log(2, 'startLongpoll: ' + ftui.config.doLongPoll);
        if (ftui.config.doLongPoll) {
            ftui.config.shortpollInterval = $("meta[name='shortpoll_interval']").attr("content") || 15 * 60; // 15 minutes
            ftui.longPollTimer = setTimeout(function () {
                ftui.longPoll();
            }, 100);
        }
    },

    stopLongpoll: function () {
        ftui.log(2, 'stopLongpoll');
        clearInterval(ftui.longPollTimer);
        if (ftui.longPollRequest)
            ftui.longPollRequest.abort();
        if (ftui.websocket) {
            ftui.websocket.close();
            ftui.websocket = null;
        }
    },

    restartLongPoll: function (msg, error) {
        ftui.log(2, 'restartLongpoll');
        var delay;
        clearTimeout(ftui.longPollTimer);
        if (msg) {
            ftui.toast("Disconnected from FHEM<br>" + msg, error);
        }
        ftui.stopLongpoll();

        if (ftui.states.longPollRestart) {
            delay = 2000;
        } else {
            ftui.toast("Retry to connect in 10 seconds");
            delay = 10000;
        }
        ftui.longPollTimer = setTimeout(function () {
            ftui.startLongpoll();
        }, delay);
    },

    startShortPollInterval: function (delay) {
        ftui.log(1, 'start shortpoll in (ms):' + (delay || ftui.config.shortpollInterval * 1000));
        clearInterval(ftui.shortPollTimer);
        ftui.shortPollTimer = setTimeout(function () {
            //get current values of readings every x seconds
            ftui.shortPoll();
            ftui.startShortPollInterval();
        }, (delay || ftui.config.shortpollInterval * 1000));
    },


    shortPoll: function (silent) {
        var ltime = new Date().getTime() / 1000;
        if ((ltime - ftui.states.lastShortpoll) < ftui.config.shortpollInterval)
            return;
        ftui.log(1, 'start shortpoll');
        var startTime = new Date();

        // invalidate all readings for detection of outdated ones
        for (var i = 0, len = ftui.devs.length; i < len; i++) {
            var params = ftui.deviceStates[ftui.devs[i]];
            for (var reading in params) {
                params[reading].valid = false;
            }
        }
        console.time('get jsonlist2');


        ftui.shortPollRequest =
            ftui.sendFhemCommand('jsonlist2 ' + ftui.poll.shortPollFilter)
            .done(function (fhemJSON) {
                console.timeEnd('get jsonlist2');
                console.time('read jsonlist2');
                ftui.log(3, 'fhemJSON: 0=' + Object.keys(fhemJSON)[0] + ' 1=' + Object.keys(fhemJSON)[1]);

                // function to import data
                function checkReading(device, section) {
                    for (var reading in section) {
                        var isUpdated = false;
                        var paramid = (reading === 'STATE') ? device : [device, reading].join('-');
                        var newParam = section[reading];
                        if (typeof newParam !== 'object') {
                            //ftui.log(5,'newParam='+newParam);
                            newParam = {
                                "Value": newParam,
                                "Time": ''
                            };
                        }

                        // is there a subscription, then check and update widgets
                        if (ftui.subscriptions[paramid]) {
                            var oldParam = ftui.getDeviceParameter(device, reading);
                            isUpdated = (!oldParam || oldParam.val !== newParam.Value || oldParam.date !== newParam.Time);
                            //ftui.log(5,'isUpdated='+isUpdated);
                        }
                        //write into internal cache object
                        var params = ftui.deviceStates[device] || {};
                        var param = params[reading] || {};
                        param.date = newParam.Time;
                        param.val = newParam.Value;
                        //console.log('*****',device);
                        param.valid = true;
                        params[reading] = param;
                        ftui.deviceStates[device] = params;

                        ftui.paramIdMap[paramid] = {};
                        ftui.paramIdMap[paramid].device = device;
                        ftui.paramIdMap[paramid].reading = reading;
                        ftui.timestampMap[paramid + '-ts'] = {};
                        ftui.timestampMap[paramid + '-ts'].device = device;
                        ftui.timestampMap[paramid + '-ts'].reading = reading;

                        //update widgets only if necessary
                        if (isUpdated) {
                            ftui.log(5, '[shortPoll] do update for ' + device + ',' + reading);
                            plugins.update(device, reading);
                        }
                    }

                }

                // import the whole fhemJSON
                if (fhemJSON && fhemJSON.Results) {
                    var len = fhemJSON.Results.length;
                    ftui.log(2, 'shortpoll: fhemJSON.Results.length=' + len);
                    var results = fhemJSON.Results;
                    for (var i = 0; i < len; i++) {
                        var res = results[i];
                        var devName = res.Name;
                        if (devName.indexOf('FHEMWEB') < 0 && devName.indexOf('WEB_') < 0) {
                            checkReading(devName, res.Internals);
                            checkReading(devName, res.Attributes);
                            checkReading(devName, res.Readings);
                        }
                    }

                    // finished
                    var duration = ftui.diffSeconds(startTime, new Date());
                    if (ftui.config.DEBUG) {
                        var paramCount = Object.keys(ftui.paramIdMap).length;
                        ftui.toast("Full refresh done in " +
                            duration + "s for " +
                            paramCount + " parameter(s)");
                    }
                    ftui.log(1, 'shortPoll - Done');
                    ftui.states.lastShortpoll = ltime;
                    ftui.poll.lastShortpollTimestamp = new Date();
                    ftui.saveStatesLocal();
                    ftui.updateBindElements('ftui.');
                    if (!silent) {
                        ftui.onUpdateDone();
                    }
                } else {
                    ftui.log(1, "shortPoll request failed: Result is null");
                    ftui.toast("<u>ShortPoll Request Failed: : Result is null </u><br>", 'error');
                }
                console.timeEnd('read jsonlist2');
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                ftui.log(1, "shortPoll request failed: " + err);
                ftui.states.lastSetOnline = 0;
                ftui.states.lastShortpoll = 0;
                if (textStatus.indexOf('parsererror') < 0) {
                    ftui.toast("<u>ShortPoll Request Failed, will retry in " + ftui.config.shortPollDelay / 1000 + "s</u><br>" + err, 'error');
                    ftui.getCSrf();
                    ftui.startShortPollInterval(3000);
                } else {
                    ftui.toast("<u>ShortPoll Request Failed</u><br>" + err, 'error');
                }

            });
    },

    longPoll: function () {

        if (ftui.config.DEMO) {
            console.log('DEMO-Mode: no longpoll');
            return;
        }

        if ('WebSocket' in window &&
            ftui.config.longPollType === 'websocket' &&
            ftui.deviceStates[ftui.config.webDevice] &&
            ftui.deviceStates[ftui.config.webDevice].longpoll &&
            ftui.deviceStates[ftui.config.webDevice].longpoll.val &&
            ftui.deviceStates[ftui.config.webDevice].longpoll.val === 'websocket') {

            if (ftui.websocket) {
                ftui.log(3, 'valid ftui.websocket found');
                return;
            }
            if (ftui.config.DEBUG) {
                ftui.toast("Longpoll (WebSocket) started");
            }
            var wsURL = ftui.config.fhemDir.replace(/^http/i, "ws") + "?XHR=1&inform=type=status;addglobal=1;filter=" +
                ftui.poll.longPollFilter + ";fmt=JSON" +
                "&fwcsrf=" + ftui.config.csrf;
            ftui.log(1, 'websockets URL=' + wsURL);
            ftui.states.longPollRestart = false;

            ftui.websocket = new WebSocket(wsURL);
            ftui.websocket.onclose = function (event) {
                var reason;
                if (event.code == 1000)
                    reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
                else if (event.code == 1001)
                    reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
                else if (event.code == 1002)
                    reason = "An endpoint is terminating the connection due to a protocol error";
                else if (event.code == 1003)
                    reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
                else if (event.code == 1004)
                    reason = "Reserved. The specific meaning might be defined in the future.";
                else if (event.code == 1005)
                    reason = "No status code was actually present.";
                else if (event.code == 1006)
                    reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
                else if (event.code == 1007)
                    reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
                else if (event.code == 1008)
                    reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
                else if (event.code == 1009)
                    reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
                else if (event.code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
                    reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
                else if (event.code == 1011)
                    reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
                else if (event.code == 1015)
                    reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
                else
                    reason = "Unknown reason";
                ftui.log(1, "websocket closed: " + reason);
                ftui.restartLongPoll(reason);
            };
            ftui.websocket.onerror = function (msg) {
                ftui.log(1, "Error while longpoll");
                if (ftui.config.debuglevel > 1) {
                    ftui.toast("Error while longpoll (websocket)", 'error');
                }
            };
            ftui.websocket.onmessage = function (msg) {
                ftui.handleUpdates(msg.data);
            };

        } else {

            ftui.log(1, 'longpoll: websockets not supportetd or not activated > fall back to AJAX');
            if (ftui.xhr) {
                ftui.log(3, 'valid ftui.xhr found');
                return;
            }
            if (ftui.longPollRequest) {
                ftui.log(3, 'valid ftui.longPollRequest found');
                return;
            }
            ftui.poll.currLine = 0;
            if (ftui.config.DEBUG) {
                if (ftui.states.longPollRestart)
                    ftui.toast("Longpoll (AJAX) re-started");
                else
                    ftui.toast("Longpoll (AJAX) started");
            }
            ftui.log(1, (ftui.states.longPollRestart) ? "Longpoll re-started" : "Longpoll started");
            ftui.states.longPollRestart = false;

            ftui.longPollRequest = $.ajax({
                    url: ftui.config.fhemDir,
                    cache: false,
                    async: true,
                    method: 'GET',
                    data: {
                        XHR: 1,
                        inform: "type=status;addglobal=1;filter=" + ftui.poll.longPollFilter + ";fmt=JSON",
                        fwcsrf: ftui.config.csrf
                    },
                    username: ftui.config.username,
                    password: ftui.config.password,
                    xhr: function () {
                        ftui.xhr = new window.XMLHttpRequest();
                        ftui.xhr.addEventListener("readystatechange", function (e) {
                            var data = e.target.responseText;
                            if (e.target.readyState === 4) {
                                return;
                            }
                            if (e.target.readyState === 3) {
                                ftui.handleUpdates(data);
                            }
                        }, false);

                        ftui.log(1, 'ajax lomgpoll responseURL=' + ftui.xhr.responseURL);
                        ftui.log(1, 'ajax longpol  statusText=' + ftui.xhr.statusText);
                        return ftui.xhr;
                    }
                })
                .done(function (data) {
                    if (ftui.xhr) {
                        ftui.xhr.abort();
                        ftui.xhr = null;
                    }
                    ftui.longPollRequest = null;
                    if (ftui.states.longPollRestart) {
                        ftui.longPoll();
                    } else {
                        ftui.log(1, "Disconnected from FHEM - poll done - " + data);
                        ftui.restartLongPoll(data);
                    }
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (ftui.xhr) {
                        ftui.xhr.abort();
                        ftui.xhr = null;
                    }
                    ftui.longPollRequest = null;
                    if (ftui.states.longPollRestart) {
                        ftui.longPoll();
                    } else {
                        ftui.log(1, "Error while longpoll: " + textStatus + ": " + errorThrown);
                        if (ftui.config.debuglevel > 1) {
                            ftui.toast("Error while longpoll (ajax)<br>" + textStatus + ": " + errorThrown, 'error');
                        }
                        ftui.restartLongPoll(textStatus + ": " + errorThrown);
                    }
                });

        }
    },

    handleUpdates: function (data) {

        var lines = data.split(/\n/);
        for (var i = ftui.poll.currLine, len = lines.length; i < len; i++) {
            ftui.log(5, lines[i]);
            var lastChar = lines[i].slice(-1);
            if (ftui.isValid(lines[i]) && lines[i] !== '' && lastChar === "]") {
                try {
                    var dataJSON = JSON.parse(lines[i]);
                    var params = null;
                    var param = null;
                    var isSTATE = (dataJSON[1] !== dataJSON[2]);
                    var isTrigger = (dataJSON[1] == '' && dataJSON[2] == '');

                    ftui.log(4, dataJSON);

                    var pmap = ftui.paramIdMap[dataJSON[0]];
                    var tmap = ftui.timestampMap[dataJSON[0]];
                    var subscription = ftui.subscriptions[dataJSON[0]];
                    // update for a parameter
                    if (pmap) {
                        if (isSTATE)
                            pmap.reading = 'STATE';
                        params = ftui.deviceStates[pmap.device] || {};
                        param = params[pmap.reading] || {};
                        param.val = dataJSON[1];
                        param.valid = true;
                        params[pmap.reading] = param;
                        ftui.deviceStates[pmap.device] = params;
                        // dont wait for timestamp for STATE paramters
                        if (isSTATE && ftui.subscriptions[dataJSON[0]]) {
                            ftui.poll.lastDevice = pmap.device;
                            ftui.poll.lastReading = pmap.reading;
                            ftui.poll.lastValue = param.val;
                            plugins.update(pmap.device, pmap.reading);
                        }
                    }
                    // update for a timestamp
                    // STATE updates has no timestamp
                    if (tmap && !isSTATE) {
                        params = ftui.deviceStates[tmap.device] || {};
                        param = params[tmap.reading] || {};
                        param.date = dataJSON[1];
                        params[tmap.reading] = param;
                        ftui.poll.lastUpdateTimestamp = param.date.toDate();
                        ftui.deviceStates[tmap.device] = params;
                        // paramter + timestamp update now completed -> update widgets
                        if (ftui.subscriptionTs[dataJSON[0]]) {
                            ftui.poll.lastDevice = tmap.device;
                            ftui.poll.lastReading = tmap.reading;
                            ftui.poll.lastValue = param.val;
                            plugins.update(tmap.device, tmap.reading);
                        }
                    }
                    // just a trigger
                    if (isTrigger && subscription) {
                        plugins.update(subscription.device, subscription.reading);
                    }
                } catch (err) {
                    ftui.log(1, "Error: (longpoll) " + err);
                    ftui.log(1, "Bad line : " + lines[i]);
                }
            }
        }
        ftui.poll.lastEventTimestamp = new Date();
        ftui.updateBindElements('ftui.poll');

        if (!ftui.websocket) {
            // Ajax longpoll 
            // cumulative data -> remember last line 
            // restart after 9999 lines to avoid overflow
            ftui.poll.currLine = lines.length - 1;
            if (ftui.poll.currLine > 9999) {
                ftui.states.longPollRestart = true;
                ftui.longPollRequest.abort();
            }
        }
    },

    setFhemStatus: function (cmdline) {
        if (ftui.config.DEMO) {
            console.log('DEMO-Mode: no setFhemStatus');
            return;
        }
        // postpone update
        ftui.startShortPollInterval();

        ftui.sendFhemCommand(cmdline);
    },

    sendFhemCommand: function (cmdline) {

        cmdline = cmdline.replace('  ', ' ');
        var dataType = (cmdline.substr(0, 8) == "jsonlist") ? 'json' : 'text';
        ftui.log(1, 'send to FHEM: ' + cmdline);
        return $.ajax({
            async: true,
            cache: false,
            method: 'GET',
            dataType: dataType,
            url: ftui.config.fhemDir,
            username: ftui.config.username,
            password: ftui.config.password,
            data: {
                cmd: cmdline,
                fwcsrf: ftui.config.csrf,
                XHR: "1"
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ftui.toast("<u>FHEM Command failed</u><br>" + textStatus + ": " + errorThrown, 'error');
            }
        });

    },

    loadStyleSchema: function () {

        $.each($('link[href$="-ui.css"],link[href$="-ui.min.css"]'), function (index, thisSheet) {
            if (!thisSheet || !thisSheet.sheet || !thisSheet.sheet.cssRules) return;
            var rules = thisSheet.sheet.cssRules;
            for (var r in rules) {
                if (rules[r].style) {
                    var styles = rules[r].style.cssText.split(';');
                    styles.pop();
                    var elmName = rules[r].selectorText;
                    var params = {};
                    for (var s in styles) {
                        var param = styles[s].toString().split(':');
                        if (param[0].match(/color/)) {
                            params[$.trim(param[0])] = ftui.rgbToHex($.trim(param[1]).replace('! important', '').replace('!important', ''));
                        }
                    }
                    if (Object.keys(params).length > 0)
                        ftui.config.styleCollection[elmName] = params;
                }
            }
        });
    },

    onUpdateDone: function () {
        $(document).trigger("updateDone");
        ftui.checkInvalidElements();
        ftui.updateBindElements();
    },

    checkInvalidElements: function () {
        $('.autohide[data-get]').each(function (index) {
            var elem = $(this);
            var valid = elem.getReading('get').valid;
            if (valid && valid === true)
                elem.removeClass('invalid');
            else
                elem.addClass('invalid');
        });
    },

    updateBindElements: function (filter) {
        $('[data-bind*="' + filter + '"]').each(function (index) {
            var elem = $(this);
            var variable = elem.data('bind');
            if (variable) {
                elem.text(eval(variable));
            }
        });
    },

    setOnline: function () {
        var ltime = new Date().getTime() / 1000;
        if ((ltime - ftui.states.lastSetOnline) > 60) {
            if (ftui.config.DEBUG) ftui.toast("FHEM connected");
            ftui.states.lastSetOnline = ltime;
            // force shortpoll
            ftui.states.lastShortpoll = 0;
            ftui.startShortPollInterval(1000);
            if (!ftui.config.doLongPoll) {
                var longpoll = $("meta[name='longpoll']").attr("content") || '1';
                ftui.config.doLongPoll = (longpoll != '0');
                if (ftui.config.doLongPoll)
                    ftui.startLongpoll();
            }
            ftui.log(1, 'FTUI is online');
        }
    },

    setOffline: function () {
        if (ftui.config.DEBUG) ftui.toast("Lost connection to FHEM");
        ftui.config.doLongPoll = false;
        clearInterval(ftui.shortPollTimer);
        ftui.stopLongpoll();
        ftui.saveStatesLocal();
        ftui.log(1, 'FTUI is offline');
    },

    readStatesLocal: function () {
        if (!ftui.config.DEMO)
            ftui.deviceStates = JSON.parse(localStorage.getItem('deviceStates')) || {};
        else {
            $.ajax({
                    async: false,
                    method: 'GET',
                    url: "/fhem/tablet/data/" + ftui.config.filename.replace(".html", ".dat"),
                })
                .done(function (data) {
                    ftui.deviceStates = JSON.parse(data) || {};
                });
        }
    },

    saveStatesLocal: function () {
        //save deviceStates into localStorage
        var dataToStore = JSON.stringify(ftui.deviceStates);
        localStorage.setItem('deviceStates', dataToStore);
        localStorage.setItem('shortPollDuration', ftui.poll.shortPollDuration);
    },

    getDeviceParameter: function (devname, paraname) {
        if (devname && devname.length > 0) {
            var params = ftui.deviceStates[devname];
            return (params && params[paraname]) ? params[paraname] : null;
        }
        return null;
    },

    loadPlugin: function (name, area) {

        var deferredLoad = new $.Deferred();
        ftui.log(2, 'Create widget : ' + name);

        // get the plugin
        ftui.dynamicload(ftui.config.basedir + "js/widget_" + name + ".js", true).done(function () {

                // get all dependencies of this plugin
                var depsPromises = [];
                var getDependencies = window["depends_" + name];

                // load all dependencies recursive before
                if ($.isFunction(getDependencies)) {

                    var deps = getDependencies();
                    if (deps) {
                        deps = ($.isArray(deps)) ? deps : [deps];
                        $.map(deps, function (dep, i) {
                            if (dep.indexOf(".js") < 0) {
                                depsPromises.push(ftui.loadPlugin(dep));
                            } else {
                                depsPromises.push(ftui.dynamicload(dep, false));
                            }
                        });
                    }
                } else {
                    ftui.log(2, "function depends_" + name + " not found (maybe ok)");
                }

                $.when.apply(this, depsPromises).always(function () {
                    var module = (window["Modul_" + name]) ? new window["Modul_" + name]() : null;
                    if (module) {
                        if (typeof area !== 'undefined') {

                            // add only real widgets not dependencies
                            plugins.addModule(module);
                            if (ftui.isValid(area))
                                module.area = area;

                            ftui.log(1, 'Try to init plugin: ' + name);
                            module.init();

                            //update all what we have until now
                            for (var key in module.subscriptions) {
                                module.update(module.subscriptions[key].device, module.subscriptions[key].reading);
                            }
                        }
                        ftui.log(1, 'Loaded plugin: ' + name);

                    } else {
                        ftui.log(1, 'Failed to create widget: ' + name);
                    }

                    deferredLoad.resolve();
                });

            })
            .fail(function () {
                ftui.toast('Failed to load plugin : ' + name);
                ftui.log(1, 'Failed to load plugin : ' + name + '  - add <script src="js/widget_' + name + '.js" defer></script> do your page, to see more informations about this failure');
                deferredLoad.resolve();
            });

        // return with promise to deliver the plugin deferred
        return deferredLoad.promise();
    },

    dynamicload: function (url, async) {
        var cache = (ftui.config.DEBUG) ? false : true;
        ftui.log(3, 'dynamic load file:' + url + ' / async:' + async);

        var deferred = new $.Deferred();

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = (async) ? true : false;
        script.src = url;
        script.onload = function () {
            ftui.log(3, 'dynamic load done:' + url);
            deferred.resolve();
        };

        document.getElementsByTagName('head')[0].appendChild(script);
        return deferred.promise();
    },

    getCSrf: function () {

        $.ajax({
            'url': ftui.config.fhemDir,
            'type': 'GET',
            cache: false,
            username: ftui.config.username,
            password: ftui.config.password,
            data: {
                XHR: "1"
            },
            'success': function (data, textStatus, jqXHR) {
                ftui.config.csrf = jqXHR.getResponseHeader('X-FHEM-csrfToken');
                ftui.log(1, 'Got csrf from FHEM:' + ftui.config.csrf);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            ftui.log(1, "Failed to get csrfToken: " + textStatus + ": " + errorThrown);
            ftui.config.shortPollDelay = 30000;
        });

    },

    healthCheck: function () {
        if (ftui.config.debuglevel > 0) {
            var d = new Date();
            d.setTime(ftui.states.lastShortpoll * 1000);
            console.log('--------- start healthCheck --------------');
            console.log('now:', new Date());
            console.log('FTUI version: ' + ftui.version);
            console.log('Longpoll: ' + ftui.config.doLongPoll);
            console.log('Longpoll type: ' + ftui.config.longPollType);
            console.log('Longpoll objects there: ' + (ftui.isValid(ftui.longPollRequest) && ftui.isValid(ftui.xhr) || ftui.isValid(ftui.websocket)));
            console.log('Longpoll curent line: ' + ftui.poll.currLine);
            console.log('Longpoll last event before: ' + ftui.poll.lastEventTimestamp.ago());
            console.log('Longpoll last reading update before: ' + ftui.poll.lastUpdateTimestamp.ago());
            console.log('Shortpoll interval: ' + ftui.config.shortpollInterval);
            console.log('Shortpoll last run before: ' + d.ago());
            console.log('FHEM dev/par count: ' + Object.keys(ftui.paramIdMap).length);
            console.log('FTUI known devices count: ' + Object.keys(ftui.deviceStates).length);
            console.log('Page length: ' + $('html').html().length);
            console.log('Widgets count: ' + $('[data-type]').length);
            console.log('--------- end healthCheck ---------------');
        }
        var timeDiff = new Date() - ftui.poll.lastEventTimestamp;
        if (timeDiff / 1000 > ftui.config.maxLongpollAge &&
            ftui.config.maxLongpollAge > 0 &&
            !ftui.config.DEMO &&
            ftui.config.doLongPoll) {
            ftui.log(1, 'No longpoll event since ' + timeDiff / 1000 + 'secondes -> restart polling');
            ftui.setOnline();
            ftui.restartLongPoll('Reason: missing longpoll events', 'error');
        }
    },

    FS20: {
        'dimmerArray': [0, 6, 12, 18, 25, 31, 37, 43, 50, 56, 62, 68, 75, 81, 87, 93, 100],
        'dimmerValue': function (value) {
            var idx = ftui.indexOfNumeric(this.dimmerArray, value);
            return (idx > -1) ? this.dimmerArray[idx] : 0;
        }
    },

    rgbToHsl: function (rgb) {
        var r = parseInt(rgb.substring(0, 2), 16);
        var g = parseInt(rgb.substring(2, 4), 16);
        var b = parseInt(rgb.substring(4, 6), 16);
        r /= 255;
        g /= 255;
        b /= 255;
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
        }
        return [h, s, l];
    },

    hslToRgb: function (h, s, l) {
        var r, g, b;
        var hex = function (x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        };

        var hue2rgb;
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            hue2rgb = function (p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [hex(Math.round(r * 255)), hex(Math.round(g * 255)), hex(Math.round(b * 255))].join('');
    },

    rgbToHex: function (rgb) {
        var tokens = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (tokens && tokens.length === 4) ? "#" +
            ("0" + parseInt(tokens[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(tokens[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(tokens[3], 10).toString(16)).slice(-2) : rgb;
    },

    getGradientColor: function (start_color, end_color, percent) {
        // strip the leading # if it's there
        start_color = this.rgbToHex(start_color).replace(/^\s*#|\s*$/g, '');
        end_color = this.rgbToHex(end_color).replace(/^\s*#|\s*$/g, '');

        // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
        if (start_color.length == 3) {
            start_color = start_color.replace(/(.)/g, '$1$1');
        }

        if (end_color.length == 3) {
            end_color = end_color.replace(/(.)/g, '$1$1');
        }

        // get colors
        var start_red = parseInt(start_color.substr(0, 2), 16),
            start_green = parseInt(start_color.substr(2, 2), 16),
            start_blue = parseInt(start_color.substr(4, 2), 16);

        var end_red = parseInt(end_color.substr(0, 2), 16),
            end_green = parseInt(end_color.substr(2, 2), 16),
            end_blue = parseInt(end_color.substr(4, 2), 16);

        // calculate new color
        var diff_red = end_red - start_red;
        var diff_green = end_green - start_green;
        var diff_blue = end_blue - start_blue;

        diff_red = ((diff_red * percent) + start_red).toString(16).split('.')[0];
        diff_green = ((diff_green * percent) + start_green).toString(16).split('.')[0];
        diff_blue = ((diff_blue * percent) + start_blue).toString(16).split('.')[0];

        // ensure 2 digits by color
        if (diff_red.length == 1)
            diff_red = '0' + diff_red;

        if (diff_green.length == 1)
            diff_green = '0' + diff_green;

        if (diff_blue.length == 1)
            diff_blue = '0' + diff_blue;

        return '#' + diff_red + diff_green + diff_blue;
    },

    getPart: function (value, part) {
        if (ftui.isValid(part)) {
            if ($.isNumeric(part)) {
                var tokens = (ftui.isValid(value)) ? value.toString().split(" ") : '';
                return (tokens.length >= part && part > 0) ? tokens[part - 1] : value;
            } else {
                var ret = '';
                if (ftui.isValid(value)) {
                    var matches = value.match(new RegExp('^' + part + '$'));
                    if (matches) {
                        for (var i = 1, len = matches.length; i < len; i++) {
                            ret += matches[i];
                        }
                    }
                }
                return ret;
            }
        }
        return value;
    },

    showModal: function (modal) {
        if (modal)
            $("#shade").fadeIn();
        else
            $("#shade").fadeOut();
    },

    precision: function (a) {
        var s = a + "",
            d = s.indexOf('.') + 1;
        return !d ? 0 : s.length - d;
    },

    indexOfGeneric: function (array, find) {
        if (!array) return -1;
        for (var i = 0, len = array.length; i < len; i++) {
            if (!$.isNumeric(array[i]))
                return ftui.indexOfRegex(array, find);
        }
        return ftui.indexOfNumeric(array, find);
    },

    indexOfNumeric: function (array, val) {
        var ret = -1;
        for (var i = 0, len = array.length; i < len; i++) {
            if (Number(val) >= Number(array[i]))
                ret = i;
        }
        return ret;
    },

    indexOfRegex: function (array, find) {
        for (var i = 0, len = array.length; i < len; i++) {
            try {
                var match = find.match(new RegExp('^' + array[i] + '$'));
                if (match)
                    return i;
            } catch (e) {}
        }
        return array.indexOf(find);
    },

    isValid: function (v) {
        return (typeof v !== 'undefined' && v !== undefined && typeof v !== typeof notusedvar);
    },

    // global date format functions
    dateFromString: function (str) {
        var m = str.match(/(\d+)-(\d+)-(\d+)[_\s](\d+):(\d+):(\d+).*/);
        var m2 = str.match(/^(\d+)$/);
        var m3 = str.match(/(\d\d).(\d\d).(\d\d\d\d)/);

        var offset = new Date().getTimezoneOffset();
        return (m) ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]) :
            (m2) ? new Date(m2[1] * 1000) :
            (m3) ? new Date(+m3[3], +m3[2] - 1, +m3[1], 0, -offset, 0, 0) : new Date();
    },

    diffMinutes: function (date1, date2) {
        var diff = new Date(date2 - date1);
        return (diff / 1000 / 60).toFixed(0);
    },

    diffSeconds: function (date1, date2) {
        var diff = new Date(date2 - date1);
        return (diff / 1000).toFixed(1);
    },

    durationFromSeconds: function (time) {
        var hrs = Math.floor(time / 3600);
        var mins = Math.floor((time % 3600) / 60);
        var secs = time % 60;
        var ret = "";
        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    },

    mapColor: function (value) {
        return ftui.getStyle('.' + value, 'color') || value;
    },

    parseJsonFromString: function (str) {
        return JSON.parse(str);
    },

    getAndroidVersion: function (ua) {
        ua = (ua || navigator.userAgent).toLowerCase();
        var match = ua.match(/android\s([0-9\.]*)/);
        return match ? match[1] : false;
    },

    getStyle: function (selector, prop) {
        var props = ftui.config.styleCollection[selector];
        var style = (props && props[prop]) ? props[prop] : null;
        if (style === null) {
            var reverseSelector = '.' + selector.split('.').reverse().join('.');
            reverseSelector = reverseSelector.substring(0, reverseSelector.length - 1);
            props = ftui.config.styleCollection[reverseSelector];
            style = (props && props[prop]) ? props[prop] : null;
        }
        return style;
    },

    getClassColor: function (elem) {
        for (var i = 0, len = ftui.config.stdColors.length; i < len; i++) {
            if (elem.hasClass(ftui.config.stdColors[i])) {
                return ftui.getStyle('.' + ftui.config.stdColors[i], 'color');
            }
        }
        return null;
    },

    getIconId: function (iconName) {
        if (!iconName || iconName === '' || !$('link[href$="lib/font-awesome.min.css"]').length)
            return "?";
        var cssFile = $('link[href$="lib/font-awesome.min.css"]')[0];
        if (cssFile && cssFile.sheet && cssFile.sheet.cssRules) {
            var rules = cssFile.sheet.cssRules;
            for (var rule in rules) {
                if (rules[rule].selectorText && rules[rule].selectorText.match(new RegExp(iconName + ':'))) {
                    var id = rules[rule].style.content;
                    if (!id)
                        return iconName;
                    id = id.replace(/"/g, '').replace(/'/g, "");
                    return (/[^\u0000-\u00ff]/.test(id)) ? id :
                        String.fromCharCode(parseInt(id.replace('\\', ''), 16));
                }
            }
        }
    },

    disableSelection: function () {
        $("body").each(function () {
            this.onselectstart = function () {
                return false;
            };
            this.unselectable = "on";
            $(this).css('-moz-user-select', 'none');
            $(this).css('-webkit-user-select', 'none');
        });
    },

    toast: function (text, error) {
        //https://github.com/kamranahmedse/jquery-toast-plugin
        if (ftui.config.TOAST !== 0) {
            var tstack = ftui.config.TOAST;
            if (ftui.config.TOAST == 1)
                tstack = false;
            if (error && error === 'error') {
                if (f7) {
                    f7.ftui.addNotification({
                        title: 'FTUI',
                        message: text,
                        hold: 1500
                    });
                } else if ($.toast) {
                    $.toast({
                        heading: 'Error',
                        text: text,
                        hideAfter: 20000, // in milli seconds
                        icon: 'error',
                        loader: false,
                        position : ftui.config.toastPosition,
                        stack: tstack
                    });
                }
            } else
            if (f7) {
                f7.ftui.addNotification({
                    title: 'FTUI',
                    message: text,
                    hold: 1500
                });
            } else if ($.toast) {
                $.toast({
                    text: text,
                    loader: false,
                    position : ftui.config.toastPosition,
                    stack: tstack
                });
            }

        }
    },

    log: function (level, text) {
        if (ftui.config.debuglevel >= level)
            console.log(text);
    },
};




// global helper functions

String.prototype.toDate = function () {
    return ftui.dateFromString(this);
};

String.prototype.parseJson = function () {
    return ftui.parseJsonFromString(this);
};

String.prototype.toMinFromSec = function () {
    var x = Number(this);
    var ss = (Math.floor(x % 60)).toString();
    var mm = (Math.floor(x /= 60)).toString();
    return mm + ":" + (ss[1] ? ss : "0" + ss[0]);
};

String.prototype.toHoursFromSec = function () {
    var x = Number(this);
    var hh = (Math.floor(x / 3600)).toString();
    var ss = (Math.floor(x % 60)).toString();
    var mm = (Math.floor(x / 60) - (hh * 60)).toString();
    return hh + ":" + (mm[1] ? mm : "0" + mm[0]) + ":" + (ss[1] ? ss : "0" + ss[0]);
};

Date.prototype.addMinutes = function (minutes) {
    return new Date(this.getTime() + minutes * 60000);
};

Date.prototype.ago = function (format) {
    var now = new Date();
    var ms = (now - this);
    var x = ms / 1000;
    var seconds = Math.floor(x % 60);
    x /= 60;
    var minutes = Math.floor(x % 60);
    x /= 60;
    var hours = Math.floor(x % 24);
    x /= 24;
    var days = Math.floor(x);
    var strUnits = (ftui.config.lang === 'de') ? ['Tag(e)', 'Stunde(n)', 'Minute(n)', 'Sekunde(n)'] : ['day(s)', 'hour(s)', 'minute(s)', 'second(s)'];
    var ret;
    if (ftui.isValid(format)) {
        ret = format.replace('dd', days);
        ret = ret.replace('hh', (hours > 9) ? hours : '0' + hours);
        ret = ret.replace('mm', (minutes > 9) ? minutes : '0' + minutes);
        ret = ret.replace('ss', (seconds > 9) ? seconds : '0' + seconds);
        ret = ret.replace('h', hours);
        ret = ret.replace('m', minutes);
        ret = ret.replace('s', seconds);
    } else {
        ret = (days > 0) ? days + " " + strUnits[0] + " " : "";
        ret += (hours > 0) ? hours + " " + strUnits[1] + " " : "";
        ret += (minutes > 0) ? minutes + " " + strUnits[2] + " " : "";
        ret += seconds + " " + strUnits[3];
    }
    return ret;
};

Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]); // padding
};

Date.prototype.hhmm = function () {
    var hh = this.getHours().toString();
    var mm = this.getMinutes().toString();
    return (hh[1] ? hh : "0" + hh[0]) + ':' + (mm[1] ? mm : "0" + mm[0]); // padding
};

Date.prototype.hhmmss = function () {
    var hh = this.getHours().toString();
    var mm = this.getMinutes().toString();
    var ss = this.getSeconds().toString();
    return (hh[1] ? hh : "0" + hh[0]) + ':' + (mm[1] ? mm : "0" + mm[0]) + ':' + (ss[1] ? ss : "0" + ss[0]); // padding
};

Date.prototype.ddmm = function () {
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return (dd[1] ? dd : "0" + dd[0]) + '.' + (mm[1] ? mm : "0" + mm[0]) + '.'; // padding
};

Date.prototype.ddmmhhmm = function () {
    var MM = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    var hh = this.getHours().toString();
    var mm = this.getMinutes().toString();
    return (dd[1] ? dd : "0" + dd[0]) + '.' + (MM[1] ? MM : "0" + MM[0]) + '. ' +
        (hh[1] ? hh : "0" + hh[0]) + ':' + (mm[1] ? mm : "0" + mm[0]);
};

Date.prototype.eeee = function () {
    var weekday_de = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (ftui.config.lang === 'de')
        return weekday_de[this.getDay()];
    return weekday[this.getDay()];
};

Date.prototype.eee = function () {
    var weekday_de = ['Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam'];
    var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (ftui.config.lang === 'de')
        return weekday_de[this.getDay()];
    return weekday[this.getDay()];
};

Date.prototype.ee = function () {
    var weekday_de = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    var weekday = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    if (ftui.config.lang === 'de')
        return weekday_de[this.getDay()];
    return weekday[this.getDay()];
};


function onjQueryLoaded() {

    /*   EVENTS */

    // event "page is loaded" -> start FTUI

    ftui.init();

    $('.menu').on('click', function () {
        $('.menu').toggleClass('show');
    });

    $(window).on('beforeunload', function () {
        ftui.log(5, 'beforeunload');
        ftui.setOffline();
    });

    $(window).on('online offline', function () {
        ftui.log(5, 'online offline');
        if (navigator.onLine)
            ftui.setOnline();
        else
            ftui.setOffline();
    });

    window.onerror = function (msg, url, lineNo, columnNo, error) {
        var file = url.split('/').pop();
        ftui.toast([file + ':' + lineNo, error].join('<br/>'), 'error');
        return false;
    };

    $.fn.once = function (a, b) {
        return this.each(function () {
            $(this).off(a).on(a, b);
        });
    };

    //for widget

    $.fn.widgetId = function () {
        return ['ftui', $(this).data('type'), $(this).data('device'), $(this).data('get'), $(this).index()].join('_');
    };

    $.fn.filterData = function (key, value) {
        return this.filter(function () {
            return $(this).data(key) == value;
        });
    };

    $.fn.filterDeviceReading = function (key, device, param) {
        return this.filter(function () {
            var elem = $(this);
            var value = elem.data(key);
            return (String(value) === param && String(elem.data('device')) === device) ||
                (value === device + ':' + param) ||
                ($.inArray(param, value) > -1 && String(elem.data('device')) === device) ||
                ($.inArray(device + ':' + param, value) > -1);
        });
    };

    $.fn.isValidData = function (key) {
        return typeof $(this).data(key) != 'undefined';
    };

    $.fn.initData = function (key, value) {
        var elem = $(this);
        elem.data(key, elem.isValidData(key) ? elem.data(key) : value);
        return elem;
    };

    $.fn.mappedColor = function (key) {
        return ftui.getStyle('.' + $(this).data(key), 'color') || $(this).data(key);
    };

    $.fn.matchingState = function (key, value) {

        if (!ftui.isValid(value)) {
            return '';
        }
        var state = String(ftui.getPart(value, $(this).data(key + '-part')));
        var onData = $(this).data(key + '-on');
        var offData = $(this).data(key + '-off');
        var on = String(onData);
        var off = String(offData);
        if (ftui.isValid(onData)) {
            if (state === on) {
                return 'on';
            } else if (state.match(new RegExp('^' + on + '$'))) {
                return 'on';
            }
        }
        if (ftui.isValid(offData)) {
            if (state === off) {
                return 'off';
            } else if (state.match(new RegExp('^' + off + '$'))) {
                return 'off';
            }
        }
        if (ftui.isValid(onData) && ftui.isValid(offData)) {
            if (on === '!off' && state !== off) {
                return 'on';
            } else if (off === '!on' && state !== on) {
                return 'off';
            }
        }
    };

    $.fn.isDeviceReading = function (key) {
        var reading = $(this).data(key);
        return reading && !$.isNumeric(reading) && reading.match(/:/);
    };

    $.fn.isExternData = function (key) {
        var data = $(this).data(key);
        if (!data) return '';
        return (data.match(/^[#\.\[].*/));
    };

    $.fn.getReading = function (key, idx) {
        var devname = String($(this).data('device')),
            paraname = $(this).data(key);
        if ($.isArray(paraname)) {
            paraname = paraname[idx];
        }
        paraname = String(paraname);
        if (paraname && paraname.match(/:/)) {
            var temp = paraname.split(':');
            devname = temp[0];
            paraname = temp[1];
        }
        if (devname && devname.length > 0) {
            var params = ftui.deviceStates[devname];
            return (params && params[paraname]) ? params[paraname] : {};
        }
        return {};
    };

    $.fn.valOfData = function (key) {
        var data = $(this).data(key);
        if (!ftui.isValid(data)) return '';
        return (data.toString().match(/^[#\.\[].*/)) ? $(data).data('value') : data;
    };

    $.fn.transmitCommand = function () {
        if ($(this).hasClass('notransmit')) return;
        var cmdl = [$(this).valOfData('cmd'), $(this).valOfData('device'), $(this).valOfData('set'), $(this).valOfData('value')].join(' ');
        ftui.setFhemStatus(cmdl);
        ftui.toast(cmdl);
    };

}

// detect self location
var src = document.querySelector('script[src*="fhem-tablet-ui"]').getAttribute('src');
var file = src.split('/').pop();
src = src.replace('/' + file, '');
var dir = src.split('/').pop();
ftui.config.basedir = src.replace(dir, '');
if (ftui.config.basedir === '') ftui.config.basedir = './';
console.log('Base dir: ' + ftui.config.basedir);

// load jQuery lib
if (!ftui.isValid(window.jQuery)) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function () {
        (function ($) {
            $(document).ready(function () {
                console.log('jQuery dynamically loaded');
                onjQueryLoaded();
            });
        })(jQuery);

    };
    script.src = ftui.config.basedir + "lib/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);
} else {
    $(document).ready(function () {
        onjQueryLoaded();
    });
}