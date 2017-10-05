/*

  Das Widget benötigt "Highcharts",
  diese kann hier => http://www.highcharts.com/download heruntergeladen werden.
  Der in der ZIP-Datei enthaltene Ordner "js" muss Tabletui-Ordner/lib/highcharts entpackt werden.

  */

// load highcharts libs
function depends_meteogram (){
    if (!$.fn.highchart)
    {
        return [  ftui.config.basedir + 'lib/highcharts/highcharts.js'
                , ftui.config.basedir + 'lib/highcharts/themes/dark-unica.js'
                , ftui.config.basedir + 'js/highcharts-meteogram.js'
        ];
    }
};


var Modul_meteogram = function() {

    // Is this correct??
    function startTimer(elem) {
        var interval = elem.data('refresh');
        if ($.isNumeric(interval) && interval > 0) {
            setInterval(function () {
                refresh(elem);
            }, Number(interval) * 1000);
        }
    }

    function init_attr(elem) {
        elem.initData('location'    , 'Tyskland/Berlin/Berlin');
        elem.initData('get'         , 'STATE');
        elem.initData('refresh'     , '3600');
        elem.initData('jsonp-url'   , 'http://www.highcharts.com/samples/data/jsonp.php');

        this.addReading(elem,'get');
    }

    function refresh(elem) {
        var title = elem.data('title');
        var place = elem.data('location');

	var width     = elem.data('width');
	var height    = elem.data('height');
	var jsonp_url = elem.data('jsonp-url');

	if ( width ) {
	    Meteogram.prototype.getWidth = function () {
	        return width;
	    };
	}
	if ( height ) {
	    Meteogram.prototype.getHeight = function () {
	        return height;
	    };
	}

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
//            'http://www.highcharts.com/samples/data/jsonp.php?url=' + locationURL + '&callback=?',
            jsonp_url + '?url=' + locationURL + '&callback=?',
            function (xml) {
                var meteogram = new Meteogram(xml, elem[0]);
            }
        );
    }

    // Is this correct??
    function init_ui(elem) {
        // init interval timer
        startTimer(elem);
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
	, init_ui: init_ui
        , update: update
    });
};
