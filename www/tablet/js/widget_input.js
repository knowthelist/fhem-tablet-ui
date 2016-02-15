/* FTUI Plugin
* Copyright (c) 2016 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*/

if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}

var widget_input = $.extend({}, widget_widget, {
    widgetname:"input",
    updateExtReading: function(elem) {
        elem.data('ext_get' ,elem.valOfData('device')+':'+elem.valOfData('get'));
        elem.find('.textinput').val(elem.getReading('ext_get').val);
        elem.addReading('ext_get');
        elem.requestReading('ext_get');
    },
    init_attr: function(elem) {
        var base    = this;
        elem.initData('get' ,'STATE');
        elem.initData('set' ,'');
        elem.initData('cmd' ,'set');
        elem.initData('value' ,'');

        if (elem.isExternData('device')){
            $(elem.data('device')).once('changedValue', function (e) {
                base.updateExtReading(elem);
            });
            $(document).once('updateDone', function (e) {
                base.updateExtReading(elem);
            });
        }
        if (elem.isExternData('get')){
            $(elem.data('get')).once('changedValue', function (e) {
                base.updateExtReading(elem);
            });
            $(document).once('updateDone', function (e) {
                base.updateExtReading(elem);
            });
        } else
            elem.addReading('get');
    },
    init_ui : function(elem) {
        var base = this;
        // prepare input element
        var elemInput = jQuery('<input/>', {
            class: 'textinput',
        }).attr({
              type: 'text',
        }).css({visibility:'visible'})
        .val(elem.data('value'))
        .appendTo(elem);

        elem.bind("enterKey",function(e){
            elemInput.blur();
            elem.transmitCommand();
        });
        elemInput.keyup(function(e){
            elem.data('value', elem.find('.textinput').val());
            if(e.keyCode === 13)
                elem.trigger("enterKey");
        });
    },
    update: function (dev,par) {
        var base = this;
        // update from normal state reading
        this.elements.filterDeviceReading('get',dev,par)
        .add( this.elements.filterDeviceReading('ext_get',dev,par) )
        .each(function(index) {
            var elem = $(this);
            var value = (elem.isExternData('get'))
                        ?elem.getReading('ext_get').val
                        :elem.getReading('get').val;
            elem.find('.textinput').val(value);
        });
    }
});
