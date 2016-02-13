if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_input = $.extend({}, widget_widget, {
    widgetname:"input",
    init_attr: function(elem) {
        elem.initData('get' ,'STATE');
        elem.initData('set' ,'');
        elem.initData('cmd' ,'set');
        elem.initData('value' ,'');
        elem.addReading('get');
    },
    init_ui : function(elem) {
        var base = this;
        // prepare level element
        var elemInput = jQuery('<input/>', {
            class: 'textinput',
        }).attr({
              type: 'text',
        }).css({visibility:'visible'})
        .val(elem.data('value'))
        .appendTo(elem);

        elem.bind("enterKey",function(e){
            elem.transmitCommand();
        });
        elemInput.keyup(function(e){
            elem.data('value', elem.find('.textinput').val());
            if(e.keyCode === 13)
                elem.trigger("enterKey");
        });
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            base.init_ui($(this));
        });
    },
    update: function (dev,par) {
        var base = this;
        // update from normal state reading
        this.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var value = elem.getReading('get').val;
            if (value){
                elem.find('.textinput').val(value);
            }
        });
    }
});
