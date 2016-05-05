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
    activateSlide : function(elem,states,state) {
        var idx=indexOfGeneric(states,state);
        if (idx>-1){
            var swiper = elem[0].swiper;
            if (swiper)
                swiper.slideTo(idx);
        }
    },
    init_attr : function(elem) {
        elem.initData('get'                     ,'STATE');
        elem.initData('width'                   ,'100%');
        elem.initData('height'                  ,'100%');
        elem.initData('autoplay'                ,null);
        elem.initData('tabclass'                ,'swipertab');

        elem.addReading('get');
    },
    init_ui : function(elem) {
        var base = this;
        var elemPagination = null;
        var elemPrev = null;
        var elemNext = null;

        // prepare container and wrapper elements
        elem.addClass('swiper-container');
        elem.find('ul').addClass('swiper-wrapper');
        elem.find('ul>li').addClass('swiper-slide');
        elem.css({
                  width:elem.data('width'),
                  height:elem.data('height'),
                 });

        if (!elem.hasClass('nopagination')){
            elemPagination=jQuery('<div/>')
                .addClass('swiper-pagination')
                .appendTo(elem);
        }
        if (elem.hasClass('navbuttons')){
            elemPrev=jQuery('<div/>')
                .addClass('swiper-button-prev')
                .appendTo(elem);
            elemNext=jQuery('<div/>')
                .addClass('swiper-button-next')
                .appendTo(elem);
        }

        var swiper = new Swiper(elem, {
            pagination: elemPagination,
            paginationClickable: true,
            nextButton: elemNext,
            prevButton: elemPrev,
            moveStartThreshold:70,
            autoplay:elem.data('autoplay'),
            autoplayDisableOnInteraction:false,
            hashnav: elem.hasClass('hashnav'),
            noSwipingClass: 'noswipe',
        });

        // navigation via hash value
        if (elem.hasClass('hashnav')){
            $(window).bind('hashchange', function() {
                var hash = window.location.hash.replace('#','');
                var idx = elem.find('li').index(elem.find('[data-hash="'+hash+'"]'));
                if (idx > -1)
                    swiper.slideTo(idx);
             });
        }
        // navigation via tab elements
        var tabclass = elem.data('tabclass');
        if (tabclass){
            $('.'+tabclass).bind('setOn', function() {
                var idx = $( ".swipertab" ).index( this );
                if (idx > -1)
                    swiper.slideTo(idx);
             });
        }

        elem.find('ul>li').click(function(event) {
            event.preventDefault();
            //more functionality here
        });

        // Refresh swiper after it became visible
        elem.closest('[data-type="popup"]').on("fadein", function(event) {
            swiper.update();
        });

        return elem;
    },
    update: function (dev,par) {
        var base = this;
        // update from normal state reading
        this.elements.filterDeviceReading('get',dev,par)
        .each(function(index) {
            var elem = $(this);
            var state = elem.getReading('get').val;
            if (state) {
                var states=elem.data('states') || elem.data('get-on');
                if ( $.isArray(states)) {
                    base.activateSlide(elem,states,state);
                }
            }
        })
    },
});
