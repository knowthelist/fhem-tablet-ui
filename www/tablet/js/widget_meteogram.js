// load highcharts libs
dynamicload('lib/highcharts/highcharts.js', null, null, false);
dynamicload('lib/highcharts/themes/dark-unica.js', null, null, false);
dynamicload('js/highcharts-meteogram.js', null, null, false);

var widget_meteogram = {
    widgetname: 'meteogram',
    init_attr: function(elem) {
        elem.data('get','STATE');
        elem.data('location', elem.data('location') || 'Tyskland/Berlin/Berlin');
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            widget_meteogram.init_attr($(this));
        });
    },
    refresh: function () {

        var title = $(this).data('title');
        var place = $(this).data('location');

        var locationURL = 'http://www.yr.no/place/' + place + '/forecast_hour_by_hour.xml';

        if ( title ) {
            /** Override the title based on the XML data */
            Meteogram.prototype.getTitle = function () {
                return title;
            };
        }

        // Get the XML file through Highcharts' jsonp provider, see
        // https://github.com/highslide-software/highcharts.com/blob/master/samples/data/jsonp.php
        // for source code.

        $.getJSON(
            'http://www.highcharts.com/samples/data/jsonp.php?url=' + locationURL + '&callback=?',
            function (xml) {
                var meteogram = new Meteogram(xml, 'container');
            }
        );

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
