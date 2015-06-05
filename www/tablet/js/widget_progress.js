if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_progress = $.extend({}, widget_famultibutton, {
    widgetname : 'progress',
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            $(this).data('device',          $(this).data('device')          || ' ');
            $(this).data('off-color',       $(this).data('off-color')       || '#505050');
            $(this).data('off-background-color', $(this).data('off-background-color')  || '#404040');
            $(this).data('on-color',        $(this).data('on-color')        || '#aa6900');
            $(this).data('background-icon', $(this).data('background-icon') || 'fa-circle-thin');
            $(this).data('icon',            $(this).data('icon')            || '');
            $(this).data('set-on',          $(this).data('set-on')          || '');
            $(this).data('set-off',         $(this).data('set-off')         || '');
            $(this).data('max',             $(this).data('max')             || '100');
            $(this).data('mode', 'symbol');
            base.init_attr($(this));
            base.init_ui($(this));
            if (!$.isNumeric($(this).data('max')))
                readings[$(this).data('max')] = true;
            if (!$(this).hasClass('novalue')){
                jQuery('<i/>', {
                     id: 'value',
                     class: 'fa fa-stack-1x value '+base.widgetname,
                }).appendTo($(this));
            }
        });
    },
    update: function (dev,par) {

     var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
     deviceElements.each(function(index) {
         if ( $(this).data('get')==par || $(this).data('max')==par){
             var val = getDeviceValue( $(this), 'get' );
             var max = ( $.isNumeric($(this).data('max')) ) ? $(this).data('max') : getDeviceValue( $(this), 'max' );
             var $elem = $(this).data('famultibutton');
             $elem.setProgressValue(val/max);
             var $value = $elem.find('#value');
             if ($value){
                 if ($(this).hasClass('percent')){
                     if (max>0 && val)
                        $value.html(Number(val/max*100).toFixed(0));
                 }
                 else
                    $value.html(val);
             }
         }
     });
    }
 });
