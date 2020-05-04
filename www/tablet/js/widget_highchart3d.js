// load highcharts libs
dynamicload('lib/highcharts/highcharts.js', null, null, false);
dynamicload('lib/highcharts/highcharts-3d.js', null, null, false);
dynamicload('lib/highcharts/themes/dark-unica.js', null, null, false);

var widget_highchart3d = {
    widgetname: 'highchart3d',
    precision: function(a) {var s = a + "", d = s.indexOf('.') + 1; return !d ? 0 : s.length - d;},
    init_attr: function(elem) {
        elem.data('minvalue', typeof elem.data('minvalue') != 'undefined' ? elem.data('minvalue')  : 10);
        elem.data('maxvalue', typeof elem.data('maxvalue') != 'undefined' ? elem.data('maxvalue')  : 30);
        elem.data('xticks',   elem.data('xticks')                                                 || 360);
        elem.data('yticks',   elem.data('yticks')                                                 || 5);
        elem.data('yunit',    unescape(elem.data('yunit')                                         || '' ));
        elem.data('get',      elem.data('get')                                                    || 'STATE');
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            widget_highchart3d.init_attr($(this));
        });
    },
    refresh: function () {
        var elementId = $(this).id;
        var minarray = $(this).data('minvalue');
        var maxarray = $(this).data('maxvalue');
        var min = parseFloat( $.isArray(minarray) ? minarray[0] : minarray );
        var max = parseFloat( $.isArray(maxarray) ? maxarray[0] : maxarray );
        var tickInterval = parseFloat( $(this).data('tickinterval')) || null;
        var tickAmount = parseFloat( $(this).data('tickamount')) || null;
        var fix = widget_highchart3d.precision( $(this).data('yticks') );
        var xunit = $(this).data('xunit');
        var yunit = $(this).data('yunit');
        var title = $(this).data('title');
        var subtitle = $(this).data('subtitle');
        var tooltip = $(this).data('tooltip');
        var legendEnabled = !($(this).data('legend') == 0);
        var noticks = ( $(this).data('width') <=100 ) ? true : $(this).hasClass('noticks');
        var days = parseFloat($(this).attr('data-daysago') || 0);
        var now = new Date();
        var ago = new Date();
        var mindate = now;
        var maxdate = now;
        var lineNames = [];
        var lineTypes = [];

        if ( days > 0 && days < 1 ){
            ago.setTime(now.getTime() - (days*24*60*60*1000));
            mindate= ago.yyyymmdd() + '_'+ago.hhmmss() ;
        }
        else {
            ago.setDate(now.getDate() - days);
            mindate= ago.yyyymmdd() + '_00:00:00';
        }

        maxdate.setDate(now.getDate() + 1);
        maxdate = maxdate.yyyymmdd() + '_00:00:00';

        if( $(this).attr("data-linetypes") ) {
            lineTypes = $(this).attr("data-linetypes").split(',');
        }

        if( $(this).attr("data-linenames") ) {
            lineNames = $(this).attr("data-linenames").split(',');
        }

        var pointFormat = {};
        if( tooltip ){
            pointFormat = {pointFormat:tooltip};
        }

        var column_spec;
        if( $(this).attr("data-columnspec") ) {
            column_spec = $(this).attr("data-columnspec");
        } else {
            var device  = $(this).attr('data-device') || '';
            var reading = $(this).attr('data-get') || '';
            column_spec = device + ':' + reading;
        }

        if( ! column_spec.match(/.+:.+/) ) {
            console.log('columnspec ' + column_spec + ' is not ok in highchart3d'
                      + ($(this).attr('data-device') ? ' for device '+$(this).attr('data-device') : ''));
        }

        var logdevice = $(this).attr("data-logdevice");
        var logfile = $(this).attr("data-logfile") || "-";

        var cmd =['get', logdevice, logfile, '-', mindate, maxdate, column_spec].join(' ');

        ftui.sendFhemCommand(cmd)
            .done(function(data ) {

            var seriesCount=0;
            var seriesData=[];
            var lineData=[];
            var lines = data.split('\n');
            var point=[];
            var firstTime = ftui.dateFromString(mindate);
            var dataCount = 0;

            $.each( lines, function( index, value ) {
                if ( value ) {
                    var val = ftui.getPart(value.replace('\r\n',''),2);

                    var eventTime = ftui.dateFromString(value).getTime();

                    if ( val && eventTime && $.isNumeric(val) ) {

                        point = [eventTime*1,val*1];
                        lineData[dataCount++] = point;

                        if ( val > max && $.isArray(maxarray) ) {
                            for(var j=0; j<maxarray.length; j++) {
                                if ( maxarray[j] > val ) {
                                    max = maxarray[j];
                                    break;
                                }
                            }
                        }

                        if ( val < min && $.isArray(minarray) ) {
                            for(var j=0; j<minarray.length; j++) {
                                if ( minarray[j] < val ) {
                                    min = minarray[j];
                                    break;
                                }
                            }
                        }

                    } else {

                        /* dataline merken */

                        var dataName = val;
                        if ( lineNames[seriesCount] ) {
                            dataName = lineNames[seriesCount];
                        }
                        var lineType = 'area';
                        if ( lineTypes[seriesCount] ) {
                            lineType = lineTypes[seriesCount];
                        }

                        seriesData[seriesCount++] = {name: dataName, data: lineData };
                        dataCount = 0;
                        lineData=[];
                    }
                }
            });

            var xrange  = parseInt(ftui.diffMinutes(firstTime,ftui.dateFromString(maxdate)));

            this.elem.highcharts({
                chart: {
                    backgroundColor:'transparent',
                    type: 'column',
                    margin: 75,
                    options3d: {
                        enabled: true,
                        alpha: 15,
                        beta: 25,
                        depth: 100,
                        viewDistance: 45
                    }
                },
                title: {
                    text: title
                },
                subtitle: {
                    text: subtitle
                },
                xAxis: {
                    title: {
                        text: xunit
                    },
                    tickInterval: tickInterval,
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: yunit
                    },
                    min: min,
                    max: max,
                    tickAmount: tickAmount,
                    labels: {
                        formatter: function () {
                            return this.value;
                        }
                    }
                },
                tooltip: pointFormat,
                plotOptions: {
                    column: {
                        depth: 25
                    }
                },
                legend: {
                    enabled: legendEnabled
                },
                credits: { text: '', href: '#' },
                series: seriesData
            });

        });

    },
    update: function (dev, par) {
        var base = this;
        var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(
            function(index) {
                if ( $(this).data('get') == par ) {
                    base.refresh.apply(this);
                }
            }
        );
    },
};
