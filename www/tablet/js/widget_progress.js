if(typeof widget_famultibutton == 'undefined') {
    loadplugin('widget_famultibutton');
}

var widget_progress = $.extend({}, widget_famultibutton, {
    widgetname : 'progress',
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            var elem = $(this);
            elem.initData('device'              , ' ');
            elem.initData('off-color'           , getStyle('.'+this.widgetname+'.off','color')              || '#505050');
            elem.initData('off-background-color', getStyle('.'+this.widgetname+'.off','background-color')   || '#404040');
            elem.initData('on-color'            , getClassColor(elem) || getStyle('.'+this.widgetname+'.on','color')               || '#aa6900');
            elem.initData('on-background-color' , getClassColor(elem) || getStyle('.'+this.widgetname+'.on','background-color')    || '#aa6900');
            elem.initData('background-icon'     , 'fa-circle-thin');
            elem.initData('icon'                , '');
            elem.initData('set-on'              , '');
            elem.initData('set-off'             , '');
            elem.initData('max'                 , '100');
            elem.initData('progress-width'      , '15');
            elem.data('mode', 'symbol');
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
         var elem = $(this);
         if ( $(this).data('get')==par || $(this).data('max')==par){
             var val = getDeviceValue( $(this), 'get' );
             var max = ( $.isNumeric($(this).data('max')) ) ? $(this).data('max') : getDeviceValue( $(this), 'max' );
             var faelem = $(this).data('famultibutton');
             faelem.setProgressValue(val/max);
             var $value = faelem.find('#value');
             var unit = elem.data('unit');
             if ($value){
                 if ($(this).hasClass('percent')){
                     if (max>0 && val)
                        $value.html(Number(val/max*100).toFixed(0) + "<span class='label-unit'>"+unescape(unit)+"</span>");
                 }
                 else
                    $value.html(val + "<span class='progress-unit'>"+unescape(unit)+"</span>");
             }
         }
     });
    }
 });
