function depends_classchanger (){
    var deps = [];
    return deps;
};

var Modul_classchanger = function () {

    function init () {
        var me = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]',this.area);
        this.elements.each(function(index) {

            var elem = $(this);
            elem.initData('get'  ,'STATE');
            
            elem.initData('get-on' ,'on');
            elem.initData('get-off' ,'off');
            
            elem.initData('on-class' ,'on');
			elem.initData('off-class' ,'off');

            me.addReading(elem,'get');

        });
    };

    function update (dev,par) {

        this.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var value = elem.getReading('get').val;
            if (value == elem.data('get-on')){
                elem.removeClass(elem.data('off-class'));
                elem.addClass(elem.data('on-class'));
            } else {
                elem.removeClass(elem.data('on-class'));
                elem.addClass(elem.data('off-class'));            
            }
        });

    };

    return $.extend(new Modul_widget(), {

        widgetname: 'classchanger',
        init: init,
        update: update,
    });
};