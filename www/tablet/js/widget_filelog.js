/* FTUI Plugin
 * Copyright (c) 2017 by dh9ts
 * https://forum.fhem.de/index.php/topic,63759.0.html
 */

/* global ftui:true, Modul_widget:true */

"use strict";

/* Params:
 * 
 * data-device: 
 *   The name of the logfile device.
 *   The Event "linesInTheFile" is used to trigger an update. This has to be set manually in the FileLog.
 * 
 * data-ago:
 *   If set the the widget will load older entries. Default is 0.
 *   Time is given in Minutes.
 * 
 * max-items:
 *   If set, the display of old messages is limited to this number.
 *   Default is -1 (No maximum).
 * 
 * height:
 *   Height of the widget.
 * 
 * width:
 *   Width of the widget.
 * 
 * refresh-btn:
 *   Default=0. When activated (=1) there will be a refresh button displayed.
 * 
 * disable-update-event:
 *   Default=0. When activated (=1) updates will be deactivated, even when the log emits 'linesInTheFile' events.
 * 
 * auto-update:
 *   Default=0. When set to a value >0, the widget will cyclic update the log. Intervall is in Seconds.
 *   NOT-IMPLEMENTED-YET
 */
 
var Modul_filelog = function () {
	
    function init_attr(elem) {
        elem.initData('height', '150px');
        elem.initData('width', '400px');
        elem.initData('max-items', -1);
        elem.initData('get', 'linesInTheFile');
        elem.initData('refresh-btn', 0);
        elem.initData('disable-update-event', 0);

		// Creation-time of Widget. 
        elem.data('start-time', new Date()); 
        
        if (elem.data('disable-update-event') == 0) {
			me.addReading(elem, 'get');
		}
    }

    function init_ui(elem) {

        var content = elem.html();
        elem.html('');
        var starter = $('<div/>', {
                class: 'eventmonitor-starter'
            }).html(content)
            .appendTo(elem);

        var events = $('<div/>', {
            class: 'events'
        }).appendTo(elem);
        
        // Refresh Button.
        if (elem.data('refresh-btn') == 1) {
			var refresh = $('<div/>', {
				class: ''
			}).html('Refresh').appendTo(elem);
			
			// Refresh Event
			refresh.on('click', function (e) {
				me.refresh(elem);
			});
		}
        
        events.css({
            'height': elem.data('height'),
            'width': elem.data('width')
        });
        

		elem.data('elements', events);
		
		// If Update event is disabled, update at least once.
		if (elem.data('disable-update-event') == 1) {
			me.refresh(elem);
		}
	}
	
	function refresh(elem) {
        var device = elem.attr('data-device') || '';
        var reading = elem.attr('data-reading') || '';

		// Calculation of Start and Endtime. Starttime is when widget was created!
		var minutes = parseFloat(elem.attr('data-ago') || 0);
		var now = new Date();
        var ago = new Date();
        var mindate = now;
        var maxdate = now;
        
        ago = elem.data('start-time').addMinutes(-1 * minutes);
        mindate = ago.yyyymmdd() + "_" + ago.hhmmss();
        
        maxdate.setDate(now.getDate() + 1);
        maxdate = maxdate.yyyymmdd() + "_" + maxdate.hhmmss();
        
        // Get the entries from the FileLog.
        var cmd = [
           'get',
           device,
           'CURRENT',
           '-',
           mindate,
           maxdate,
           ''
        ];
        $.ajax({
            url: ftui.config.fhem_dir,
            async: true,
            cache: false,
            context: {
                elem: elem
            },
            data: {
                cmd: cmd.join(' '),
                XHR: "1"
            },
        }).done(function (data) {
            var lines = data.split('\n');
            var events =  elem.data('elements');
            var max = elem.data('max-items');
            
            // Remove old entries.
			$.each(events.children(), function(index, value) {
				value.remove();
			});
            
            // Write new ones.
            $.each(lines, function (index, value) {
                if (value) {
                    // Limit amount of entries -> Delete old entries which exceed the limit.
                    if ((max > 0) && (events.children().length >= max))
						events.find('.event:first').remove();
						
                    events.last().append("<div class='event'>" + value + "</div>")
                }
            });
            
            // Scroll to the end to show last entry.
            events.scrollTop(events.last()[0].scrollHeight);
        })
    }

    function update(dev, par) {
        me.elements.filterDeviceReading('get', dev, par)
            .each(function (index) {
                refresh($(this));
            });
    }

    // public
    // inherit members from base class
    var me = $.extend(new Modul_widget(), {
        //override members.
        widgetname: 'filelog',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
        //public members.
        refresh: refresh,
    });

    return me;
};
