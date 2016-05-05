// load widget base functions
if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

// widget implementation starts here
// change 'widget_example' to 'widget_mywidgetname'
// and 'widgetname:"example",' to 'widgetname:"mywidgetname",'
var widget_example = $.extend({}, widget_widget, {
    widgetname:"example",
    // privat sub function
    init_attr: function(elem) {
        elem.initData('text'  ,'STATE');
        elem.initData('color' ,'#aa6633');

        elem.addReading('text');
        elem.addReading('color');
    },
    // mandatory function, get called on start up
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            // call sub function for each instance of this widget
            base.init_attr($(this));
        });
    },
    // mandatory function, get called after start up once and on every FHEM poll
    update: function (dev,par) {
        var base = this;
        // update reading for content
        this.elements.filterDeviceReading('text',dev,par)
        .each(function(index) {
            var elem = $(this);
            var value = elem.getReading('text').val;
            if (value){
                elem.html(value);
            }
        });

        // update reading for color
        base.elements.filterDeviceReading('color',dev,par)
        .each(function(idx) {
            var elem = $(this);
            var val = elem.getReading('color').val;
            if(val) {
                val = '#'+val.replace('#','');
                elem.css( "color", val );
            }
        });
    }
});
