/* FTUI Plugin
 * Copyright (c) 2015-2016 Mario Stephan <mstephan@shared-files.de>
 * Under MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

/* global ftui:true, Modul_widget:true */

"use strict";

var Modul_simplechart = function () {

    function createElem(elem) {
        return $(document.createElementNS('http://www.w3.org/2000/svg', elem));
    }

    function getSvgPoints(arg) {
        var res = [];
        for (var i = 0, l = arg.length; i < l; i++) {
            if (arg[i])
                res.push(arg[i].join(','));
        }
        return res.join(' ');
    }

    function init_attr(elem) {

        elem.initData('minvalue', 10);
        elem.initData('maxvalue', 30);
        elem.initData('xticks', 360);
        elem.initData('yticks', 5);
        elem.initData('yunit', '');
        elem.initData('get', 'STATE');

        me.addReading(elem, 'get');
    }

    function init_ui(elem) {

        var defaultHeight = elem.hasClass('fullsize') ? '85%' : '';
        var svgElement = $('<svg>' +
            '<svg class="chart" x="0%" width="91%" preserveAspectRatio="none">' +
            '<g transform="scale(1, -1)">' +
            '<polyline points=""/>' +
            '</g></svg>' +
            '</svg>');
        svgElement.appendTo(elem)
            .css("width", elem.data('width') || '93%')
            .css("height", elem.data('height') || defaultHeight);

    }

    function refresh(elem) {
        var minarray = elem.data('minvalue');
        var maxarray = elem.data('maxvalue');
        var min = parseFloat($.isArray(minarray) ? minarray[0] : minarray);
        var max = parseFloat($.isArray(maxarray) ? maxarray[maxarray.length-1] : maxarray);
        var xticks = parseFloat(elem.data('xticks'));
        var yticks = parseFloat(elem.data('yticks'));
        var fix = ftui.precision(elem.data('yticks'));
        var unit = elem.data('yunit');
        var caption = elem.data('caption');
        var noticks = (elem.data('width') <= 100) ? true : elem.hasClass('noticks');
        var days = parseFloat(elem.attr('data-daysago') || 0);
        var endnow = elem.data('endplotnow');
        var now = new Date();
        var ago = new Date();
        var vals = [];
        var mindate = now;
        var maxdate = now;
        if (days > 0 && days < 1) {
            ago.setTime(now.getTime() - (days * 24 * 60 * 60 * 1000));
            mindate = ago.yyyymmdd() + '_' + ago.hhmmss();
        } else if (endnow) {
            ago.setDate(now.getDate() - days);
            //align to hours if span is larger than 12h
            if (days > 0.5) {
                mindate = ago.yyyymmdd() + '_' + ago.getHours() + ':00:00';
            } else {
                mindate = ago.yyyymmdd() + '_' + ago.hhmm() + ':00';
            }
        } else {
            ago.setDate(now.getDate() - days);
            mindate = ago.yyyymmdd() + '_00:00:00';
        }
        //var maxdate= now.yyyymmdd() + '_23:59:59';
        if (!endnow) {
            maxdate.setDate(now.getDate() + 1);
            maxdate = maxdate.yyyymmdd() + '_00:00:00';
        }
        else if (days > 0.5) {
            maxdate.setHours(maxdate.getHours() + 1);
            maxdate = maxdate.yyyymmdd() + '_' + maxdate.getHours() + ':00:00';
        } else {
            maxdate.setMinutes(maxdate.getMinutes() + 1);
            maxdate = nextmin.yyyymmdd() + '_' + nextmin.hhmm() + ':00';
        }

        //console.log( "mindate: " + mindate);
        //console.log( "maxdate: " + maxdate);

        var column_spec;
        if (elem.attr("data-columnspec")) {
            column_spec = elem.attr("data-columnspec");
        } else {
            var device = elem.attr('data-device') || '';
            var reading = elem.attr('data-get') || '';
            column_spec = device + ':' + reading;
        }
        if (!column_spec.match(/.+:.+/)) {
            console.log('columnspec ' + column_spec + ' is not ok in simplechart' + (elem.attr('data-device') ? ' for device ' + elem.attr('data-device') : ''));
            return;
        }

        var logdevice = elem.attr("data-logdevice");
        var logfile = elem.attr("data-logfile") || "-";

        var cmd = ['get', logdevice, logfile, '-', mindate, maxdate, column_spec ].join(' ');

        ftui.sendFhemCommand(cmd)
            .done(function (data) {
                var points = [];
                var lines = data.split('\n');
                var point = [];
                var i = 0;
                var tstart = ftui.dateFromString(mindate);
                $.each(lines, function (index, value) {
                    if (value) {
                        var val = ftui.getPart(value.replace('\r\n', ''), 2);
                        var minutes = ftui.diffMinutes(tstart, ftui.dateFromString(value));
                        if (val && minutes && $.isNumeric(val)) {
                            point = [minutes, val];
                            vals.push(val);
                            i++;
                            points[index] = point;
                            var j = 0,
                                len = 0;
                            if (val > max && $.isArray(maxarray)) {
                                for (j = maxarray.length-1; j > 0; j--) {
                                    console.log('------------------------j:',j);
                                    if (maxarray[j] > val) {
                                        max = maxarray[j];
                                        break;
                                    }
                                }
                            }
                            if (val < min && $.isArray(minarray)) {
                                for (j = 0, len = minarray.length; j < len; j++) {
                                    if (minarray[j] < val) {
                                        min = minarray[j];
                                        break;
                                    }
                                }
                            }
                        }
                    }
                });

                //add last know point
                points[i] = point;

                var xrange = parseInt(ftui.diffMinutes(tstart, ftui.dateFromString(maxdate)));
                var strokeWidth = (document.documentElement.style.vectorEffect === undefined) ? (max - min) / 150 : 1;
                var strokeWidthDashed = (strokeWidth == 1) ? 1.2 : 10;

                var svg = elem.find('svg.chart');
                if (svg) {
                    //clear previous content
                    svg.parent().find('text').remove();
                    svg.find('line').remove();
                    var polyline = svg.find('polyline');
                    if (polyline) {
                        var graph = polyline.parent();
                        //y-axis
                        var yaxis = createElem('line');
                        yaxis.attr({
                            'id': 'yaxis',
                            'x1': '3',
                            'y1': min,
                            'x2': '3',
                            'y2': max,
                            'style': 'stroke:#555;stroke-width:' + strokeWidth + 'px',
                            'vector-effect': 'non-scaling-stroke',
                        });
                        polyline.parent().append(yaxis);

                        if (!noticks) {
                            //y-ticks
                            for (var y = min; y <= max; y += yticks) {
                                var line = createElem('line');
                                line.attr({
                                    'x1': '0',
                                    'y1': y,
                                    'x2': xrange,
                                    'y2': y,
                                    'style': 'stroke:#555;stroke-width:' + strokeWidth + 'px',
                                    'vector-effect': 'non-scaling-stroke',
                                });
                                graph.prepend(line);
                                var text = createElem('text');
                                var textY = (caption) ? (((max - y) * 100) / (max - min) * 0.8 + 12) : (((max - y) * 100) / (max - min) * 0.87 + 5);

                                text.attr({
                                    'x': '99%',
                                    'y': textY + '%',
                                    'style': 'font-size:9px',
                                    'text-anchor': "end",
                                    'fill': '#ddd',
                                });
                                text.text(((fix > -1 && fix <= 20) ? y.toFixed(fix) : y) + unit);
                                svg.parent().append(text);
                            }

                            //x-axis
                            var textX1 = createElem('text');
                            textX1.attr({
                                'x': '0',
                                'y': '100%',
                                'fill': '#ddd',
                                'style': 'font-size:9px',
                            });
                            textX1.text(tstart.ddmm());
                            svg.parent().append(textX1);

                            for (var x = xticks; x <= xrange; x += xticks) {

                                var tx = new Date(tstart);
                                var textX2 = createElem('text');
                                textX2.attr({
                                    'x': 93 * x / xrange + '%',
                                    'y': '100%',
                                    'text-anchor': "middle",
                                    'fill': '#ddd',
                                    'style': 'font-size:9px',
                                });
                                tx.setMinutes(tstart.getMinutes() + x);
                                //console.log(tx);
                                var textX2Value = (tx.hhmm() == "00:00") ? tx.ddmm() : tx.hhmm();
                                textX2.text(textX2Value);
                                svg.parent().append(textX2);

                                var xtick1 = createElem('line');
                                xtick1.attr({
                                    'x1': 100 * x / xrange + '%',
                                    'y1': min,
                                    'x2': 100 * x / xrange + '%',
                                    'y2': max,
                                    'stroke-dasharray': strokeWidth * 2 + ',' + strokeWidth * 2,
                                    'style': 'stroke:#555;stroke-width:' + strokeWidthDashed + 'px',
                                    'vector-effect': 'non-scaling-stroke',
                                });
                                graph.append(xtick1);
                            }

                        } else {
                            var elmLine = createElem('line');
                            elmLine.attr({
                                'x1': '0',
                                'y1': min,
                                'x2': xrange,
                                'y2': min,
                                'style': 'stroke:#555;stroke-width:' + strokeWidth + 'px',
                                'vector-effect': 'non-scaling-stroke',
                            });
                            graph.prepend(elmLine);

                        }


                        //show chart caption if set
                        if (caption) {
                            var textCaption = createElem('text');
                            textCaption.attr({
                                'x': '50%',
                                'y': '8',
                                'fill': '#ddd',
                                'text-anchor': "middle",
                                'style': 'font-size:10px;font-weight:bold',
                            });
                            caption = caption.replace('$min', Math.min.apply(null, vals))
                                .replace('$max', Math.max.apply(null, vals))
                                .replace('$cur', vals[vals.length - 1]);
                            textCaption.text(caption);
                            svg.parent().append(textCaption);
                        }
                        //The graph it self
                        polyline.attr({
                            'points': getSvgPoints(points),
                            'style': 'fill:none;stroke:orange;stroke-width:' + strokeWidth * 2 + 'px',
                            'vector-effect': 'non-scaling-stroke'
                        });
                    }
                    //Viewbox (autoscaler)
                    var graphHeight = (caption) ? 80 : 87;
                    var graphTop = (caption) ? 10 : 2;
                    svg.attr({
                        "height": graphHeight + "%",
                        y: graphTop + "%"
                    });
                    svg[0].setAttribute('viewBox', [0, -max, xrange, max - min].join(' '));
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
    // inherit all public members from base class
    var me = $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'simplechart',
        init_attr: init_attr,
        init_ui: init_ui,
        update: update,
    });

    return me;
};