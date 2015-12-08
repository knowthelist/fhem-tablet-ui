/* FTUI Plugin
* Copyright (c) 2015 Mario Stephan <mstephan@shared-files.de>
* Under MIT License (http://www.opensource.org/licenses/mit-license.php)
*/

if(typeof widget_widget == 'undefined') {
    loadplugin('widget_widget');
}
if (!$.fn.Swiper){
    dynamicload('lib/swiper.jquery.min.js', null, null, false);
    $('head').append('<link rel="stylesheet" href="'+ dir + '/../lib/swiper.min.css" type="text/css" />');
}

var widget_swiper= $.extend({}, widget_widget, {
    widgetname : 'swiper',
    init_attr : function(elem) {
        elem.initData('width'                   ,'100%');
        elem.initData('height'                  ,'100%');
    },
    init_ui : function(elem) {
        var base = this;

        // prepare container and wrapper elements
        elem.addClass('swiper-container');
        elem.find('ul').addClass('swiper-wrapper');
        elem.find('ul>li').addClass('swiper-slide');
        elem.css({
                  width:elem.data('width'),
                  height:elem.data('height'),
                 });
        var elemPagination=jQuery('<div/>')
            .addClass('swiper-pagination')
            .appendTo(elem);

        var swiper = new Swiper(elem, {
            pagination: elemPagination,
            paginationClickable: true,
            moveStartThreshold:70,
        });

        return elem;
    },
    init: function () {
        var base = this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            base.init_attr($(this));
            base.init_ui($(this));
        });
    },
    update: function (dev,par) {}
});
