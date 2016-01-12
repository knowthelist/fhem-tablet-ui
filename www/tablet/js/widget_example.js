if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_example = $.extend({}, widget_widget, {
    widgetname:"example",
    init_attr: function(elem) {
        elem.initData('text'  ,'STATE');
        elem.initData('color' ,'#aa6633');

        elem.addReading('text');
        elem.addReading('color');
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
        });
    },
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
