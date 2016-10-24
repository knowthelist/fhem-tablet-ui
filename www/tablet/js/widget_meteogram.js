/*

  Das Widget benötigt "Highcharts",
  diese kann hier => http://www.highcharts.com/download heruntergeladen werden.
  Der in der ZIP-Datei enthaltene Ordner "js" muss Tabletui-Ordner/lib/highcharts entpackt werden.

  */

// load highcharts libs
function depends_meteogram (){
    if (!$.fn.highchart)
    {
        return [  'lib/highcharts/highcharts.js'
                , 'lib/highcharts/themes/dark-unica.js'
                , 'js/highcharts-meteogram.js'
        ];
    }
};


var Modul_meteogram = function() {

    function init_attr(elem) {
        elem.initData('location'    , 'Tyskland/Berlin/Berlin');
        elem.initData('get'         , 'STATE');

        this.addReading(elem,'get');
    }

    function refresh(elem) {
        var title = elem.data('title');
        var place = elem.data('location');

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
                var meteogram = new Meteogram(xml, elem[0]);
            }
        );
    }

    function update(dev, par) {
        me = this;
        me.elements.filterDeviceReading('get', dev, par)
        .each(function(index) {
            refresh($(this));
        });
    };

    // public
    // inherit all public members from base clas
    var me = this;
    return $.extend(new Modul_widget(), {
          widgetname: 'meteogram'
        , init_attr: init_attr
        , update: update
    });
};
