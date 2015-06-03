if(typeof widget_widget == 'undefined') {
    dynamicload('js/widget_widget.js');
}

var widget_image = $.extend({}, widget_widget, {
    widgetname: 'image',
    init_attr: function(elem) {
        elem.data('get',        elem.data('get')        || 'STATE');
        elem.data('opacity',    elem.data('opacity')    || 0.8);
        elem.data('height',     elem.data('height')     || 'auto');
        elem.data('width',      elem.data('width')      || '100%');
        elem.data('size',       elem.data('size')       || '50%');
        elem.data('url',        elem.data('url'));
        elem.data('path',       elem.data('path'));
        elem.data('suffix',     elem.data('suffix'));
        elem.data('refresh',    elem.data('refresh')    || 15*60);
        
        readings[$(this).data('get')] = true;
    },
    init: function () {
        base=this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            var elem =  jQuery('<img/>', {
                alt: 'img',
            }).appendTo($(this));
            elem.css({
                'opacity':          $(this).data('opacity'),
                'height':           $(this).data('height'),
                'width':            $(this).data('width'),
                'max-width':        $(this).data('size'),
            });
    
            //3rd party source refresh
            if ($(this).data('url')){
                var counter=0;
                var url=$(this).data('url');
                var refresh=$(this).data('refresh');
                elem.attr('src', url );
                setInterval(function() {
                    counter++;
                    if(counter == refresh) {
                        counter = 0;
                        elem.attr('src',url);
                    }
                }, 1000);
            }
        });
    },
    update: function (dev,par) {
        var deviceElements = this.elements.filter('div[data-device="'+dev+'"]');
        deviceElements.each(function(index) {
            var img = $(this).find('img');
            if ( $(this).data('get')==par){
                var value = getDeviceValue( $(this), 'get' );
                if (img && value){
                    var src = [$(this).data('path'), value, $(this).data('suffix')].join('');
                    img.attr('src', src );
                }
            }
        });
    }
});
