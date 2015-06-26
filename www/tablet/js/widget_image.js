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
        elem.data('nocache',    elem.data('nocache')    || false);
        
        readings[$(this).data('get')] = true;
    },
    init: function () {
        var base=this;
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
                var url = $(this).data('url');
                if($(this).data('nocache')) {
                    url = base.addurlparam(url, '_', new Date().getTime());
                }
                elem.attr('src', url );
                
                var counter=0;
                var refresh=$(this).data('refresh');
                setInterval(function() {
                    counter++;
                    if(counter == refresh) {
                        counter = 0;
                        if(url.match(/_=\d+/)) {
                            url = base.addurlparam(url, '_', new Date().getTime());
                        }
                        elem.attr('src', url);
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
    },
    addurlparam: function(uri, key, value) {
        // http://stackoverflow.com/a/6021027
        var hash = uri.replace(/^.*#/, '#');
        if(hash!=uri) {
            uri = uri.replace(hash, '');
        } else {
            hash = '';
        }
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";

        if (uri.match(re)) {
            uri = uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            uri = uri + separator + key + "=" + value;
        }
        uri += hash;
        DEBUG && console.log(uri);
        return uri;
    }
});
