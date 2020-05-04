/* FTUI Plugin
 * Copyright (c) 2017 by dh9ts
 * https://forum.fhem.de/index.php/topic,63759.0.html
 */

/* global ftui:true, Modul_widget:true */

"use strict";

/* Params:
 *
 * data-device:
 *   The name of the FileLog device.
 *   By default, the event "linesInTheFile" is used to trigger an update.
 *   This event has to be activated manually in the FileLog device (attribute eventOnThreshold; example value 1).
 *
 * data-ago:
 *   Default=0. When set to a value >0, the widget will load older log lines.
 *   Value/Time is given in Minutes.
 *   Alternative value: today - means only log lines from today will be displayed
 *
 * data-max-items:
 *   Default=-1, that means "no maximum". If set to a value >0, the display of log lines is limited to this number.
 *
 * data-height:
 *   Height of the widget.
 *
 * data-width:
 *   Width of the widget.
 *
 * date-refresh-btn:
 *   Default=0. When activated (=1) there will be a refresh button displayed.
 *
 * data-disable-update-event:
 *   Default=0. When activated (=1) updates will be deactivated, even when the log emits 'linesInTheFile' events.
 *
 * auto-update:
 *   Default=0. When set to a value >0, the widget will cyclic update the log. Intervall is in Seconds.
 *   NOT-IMPLEMENTED-YET
 *
 * data-substitution:
 *
 * data-newest-first:
 *   Default=0. When activated (=1) the newest log line will be the first line; otherwise it'll be the latest line.
 */

/* FHEM Forum:
 *
 * https://forum.fhem.de/index.php/topic,63759.0.html
 */

/* History:
 * 
 * 2016-12-31
 *   initial release
 * 2018-12-30 by sinus61
 *   - fixed csrf problem
 *   - added data-substitution
 * 2019-01-04 by sinus61
 *   - fixed url problem
 * 2019-03-10
 *   - added data-newest-first
 * 2019-04-17
 *   - added data-ago="today"
 * 2019-04-20
 *   - removed class "events" (maybe paste and copy error in initial widget release / widget_eventmonitor.js)
 *   - added class "filelog-lines" (valid for html-tag surrounding all the log lines)
 *   - added class "filelog-line" (valid for html-tag surrounding one log line)
 */

function depends_filelog() {
    var deps = [];
    return deps;
}

var Modul_filelog = function () {
    function init_attr(elem) {
        elem.initData('height', '150px');
        elem.initData('width', '400px');
        elem.initData('max-items', -1);
        elem.initData('get', 'linesInTheFile');
        elem.initData('refresh-btn', 0);
        elem.initData('disable-update-event', 0);
        elem.initData('substitution', ''); //sinus61
        elem.initData('newest-first', 0);

        // Creation-time of Widget. 
        elem.data('start-time', new Date()); 

        if (elem.data('disable-update-event') === 0) {
          me.addReading(elem, 'get');
        }
    }

    function init_ui(elem) {
        var lines = $('<div/>', {
            class: 'filelog-lines'
        }).appendTo(elem);

        lines.css({
            'height': elem.data('height'),
            'width': elem.data('width')
        });

		    elem.data('elements', lines);

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

		    // If Update event is disabled, update at least once.
		    if (elem.data('disable-update-event') == 1) {
			    me.refresh(elem);
		    }
	  }

	  function refresh(elem) {
        var device = elem.attr('data-device') || '';

        // Calculation of Start and Endtime. Starttime is when widget was created!
        if (elem.attr('data-ago') == "today") {
          var timestamp = new Date();

          var mindate = timestamp.yyyymmdd() + "_" + "00:00:00";
          var maxdate = timestamp.yyyymmdd() + "_" + "23:59:59";
        } else if (elem.attr('data-ago') == "yesterday") {
          var today = new Date();
          var yesterday = new Date(new Date().setDate(new Date().getDate()-1));

          var mindate = yesterday.yyyymmdd() + "_" + "00:00:00";
          var maxdate = today.yyyymmdd() + "_" + "23:59:59";
        } else {
          var minutes = parseFloat(elem.attr('data-ago') || 0);
          var now = new Date();
          var ago = new Date();
          var mindate = now;
          var maxdate = now;

          ago = elem.data('start-time').addMinutes(-1 * minutes);
          mindate = ago.yyyymmdd() + "_" + ago.hhmmss();

          maxdate.setDate(now.getDate() + 1);
          maxdate = maxdate.yyyymmdd() + "_" + maxdate.hhmmss();
        }

        // Get the entries from the FileLog device.
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
            url: ftui.config.fhemDir,
            async: true,
            cache: false,
            context: {
                elem: elem
            },
            data: {
                cmd: cmd.join(' '),
                fwcsrf: ftui.config.csrf,
                XHR: "1"
            },
        }).done(function (data) {
            var newLines = data.split('\n');
            var lines =  elem.data('elements');
            var max = elem.data('max-items');

            // Remove old entries.
            $.each(lines.children(), function(index, value) {
              value.remove();
            });

            // Add new entries.
            if (elem.data('newest-first') === 1) {
              var newLinesReversed = newLines.slice(0).reverse();

              $.each(newLinesReversed, function (index, value) {
                if (value) {
                  if ((max > 0) && (lines.children().length >= max))
						        return false;

                  value = me.substitution(value, elem.data('substitution'));
                  lines.last().append("<div class='filelog-line'>" + value + "</div>");
                }
              });
            } else {
              $.each(newLines, function (index, value) {
                if (value) {
                  // Limit amount of entries -> Delete old entries which exceed the limit.
                  if ((max > 0) && (lines.children().length >= max))
						        lines.find('.filelog-line:first').remove();

                  value = me.substitution(value, elem.data('substitution'));
                  lines.last().append("<div class='filelog-line'>" + value + "</div>");
                }
              });
            
              // Scroll to the end to show last entry.
              lines.scrollTop(lines.last()[0].scrollHeight);
            }
        });
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
