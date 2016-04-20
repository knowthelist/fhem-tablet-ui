var Modul_image = function () {

    function init_attr (elem) {
        elem.initData('get'     , 'STATE');
        elem.initData('opacity' ,  0.8);
        elem.initData('height'  ,  'auto');
        elem.initData('width'   ,  '100%');
        elem.initData('size'    ,  '50%');
        elem.initData('url'     ,  '');
        elem.initData('path'    ,  '');
        elem.initData('suffix'  ,  '');
        elem.initData('refresh' ,  15*60);
        
        this.addReading(elem,'get');
    };

    function init() {
        var base=this;
        this.elements = $('div[data-type="'+this.widgetname+'"]',this.area);
        this.elements.each(function(index) {
            var elem = $(this);
            base.init_attr(elem);
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
                    url = addurlparam(url, '_', new Date().getTime());
                }
                elemImg.attr('src', url );
                
                var counter=0;
                var refresh=elem.data('refresh');
                setInterval(function() {
                    counter++;
                    if(counter >= refresh) {
                        counter = 0;
                        if(url.match(/_=\d+/)) {
                            url = addurlparam(url, '_', new Date().getTime());
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
    };

    function update (dev,par) {
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
    };

    function addurlparam (uri, key, value) {
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
    };

    // public
    // inherit all public members from base class
    return $.extend(new Modul_widget(), {
        //override or own public members
        widgetname: 'image',
        init: init,
        init_attr: init_attr,
        update: update,
    });
   };
