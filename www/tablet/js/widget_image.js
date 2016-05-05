if(typeof widget_widget == 'undefined') {
    dynamicload('js/widget_widget.js');
}

var widget_image = $.extend({}, widget_widget, {
    widgetname: 'image',
    init_attr: function(elem) {
        elem.initData('get'     , 'STATE');
        elem.initData('opacity' ,  0.8);
        elem.initData('height'  ,  'auto');
        elem.initData('width'   ,  '100%');
        elem.initData('size'    ,  '50%');
        elem.initData('url'     ,  '');
        elem.initData('path'    ,  '');
        elem.initData('suffix'  ,  '');
        elem.initData('refresh' ,  15*60);
        
        elem.addReading('get');
    },
    init: function () {
        var base=this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            var elem = $(this);
            var elemImg =  jQuery('<img/>', {
                alt: 'img',
            }).appendTo(elem);
            elemImg.css({
                'opacity':          elem.data('opacity'),
                'height':           elem.data('height'),
                'width':            elem.data('width'),
                'max-width':        elem.data('size'),
            });
    
            //3rd party source refresh
            if (elem.data('url')){
                var url = elem.data('url');
                if( elem.data('nocache') || elem.hasClass('nocache') ) {
                    url = base.addurlparam(url, '_', new Date().getTime());
                }
                elemImg.attr('src', url );
                
                var counter=0;
                var refresh=elem.data('refresh');
                setInterval(function() {
                    counter++;
                    if(counter >= refresh) {
                        counter = 0;
                        if(url.match(/_=\d+/)) {
                            url = base.addurlparam(url, '_', new Date().getTime());
                        }
                        elemImg.attr('src', url);
                    }
                }, 1000);
            }
            // onClick events
            elem.on('click',function(e) {
                var cmd = elem.data('fhem-cmd');
                if (cmd)
                    ftui.setFhemStatus(cmd);
            });
        });
    },
    update: function (dev,par) {
        var base = this;
        this.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var value = elem.getReading('get').val;
            if (value) {
                    var src = [elem.data('path'), value, elem.data('suffix')].join('');
                    elem.find('img').attr('src', src );
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
        ftui.log(1,'widget_image url='+uri);
        return uri;
    }
});
