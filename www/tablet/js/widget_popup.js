if(typeof widget_widget == 'undefined') {
    dynamicload('js/widget_widget.js');
}

if (!$.fn.draggable)
    dynamicload('../pgm2/jquery-ui.min.js', null, null, false);

var widget_popup= $.extend({}, widget_widget, {
    widgetname: 'popup',
    hide: function(elem,mode) {
        switch(mode) {
            case 'animate':
                elem.animate({
                    height: 0,
                    width: 0,
                    top: elem.options.start_top,
                    left: elem.options.start_left,
                    opacity: 0
                }, 500, "swing", function() {
                  showModal(false);
                });
            break;
        default:
            elem.fadeOut(500, function() {
                showModal(false);
            });
        }
    },
    show: function(elem,mode) {
        showModal(true);
        switch(mode) {
            case 'animate':
            elem.show();
            elem.animate({
             height: elem.options.height,
             width: elem.options.width,
               top: elem.options.end_top,
               left: elem.options.end_left,
             opacity: 1
            }, 500, "swing");
            break;
        default:
            elem.css({
               height:   elem.options.height,
               width:    elem.options.width,
               top:      elem.options.end_top,
               left:     elem.options.end_left,
            });
            elem.fadeIn(500);
        }
    },
    init_attr: function(elem) {
        elem.initData('get'     ,'STATE');
        elem.initData('get-on'  ,'on');
        elem.initData('get-off' ,'off');
        elem.initData('height'  ,'400px');
        elem.initData('width'   ,'100%');
        elem.initData('mode'    ,'animate');
        elem.initData('starter' ,null);
        elem.addReading('get');
    },
    init: function () {
        var base=this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            var elem = $(this);
            base.init_attr(elem);

            var dialog = elem.find('.dialog');
            var starter = (elem.data('starter')) ? $(document).find( elem.data('starter') ) : elem.children(":first");
            var close = jQuery('<div/>', {
                 class: 'dialog-close'
              }).html('x').appendTo(dialog);

            if (dialog && close && starter){
                dialog.draggable();
                dialog.css({'height':elem.data('height'),'width':elem.data('width')});
                starter.css({'cursor': 'pointer'});
                elem.closest('.gridster>ul>li').css({overflow: 'visible'});
                dialog.options={};

                $(window).resize(function() {
                    dialog.options.end_top = ($(window).height() - dialog.outerHeight()) / 2;
                    dialog.options.end_left = ($(window).width() - dialog.outerWidth()) / 2;
                    dialog.options.start_top = starter.offset().top;
                    dialog.options.start_left = starter.offset().left;
                    dialog.options.height = elem.data('height');
                    dialog.options.width = elem.data('width');
                  dialog.css({
                     height:  0,
                     width:   0,
                     top:     dialog.options.start_top,
                     left:    dialog.options.start_left,
                  });
                });

                //prepare events
                close.on('click',function() {
                    base.hide(dialog,elem.data('mode'));
                });

                $(document).on('shadeClicked', function() {
                    base.hide(dialog,elem.data('mode'));
                });

                starter.on('click',function(e) {
                    e.preventDefault();
                    base.show(dialog,elem.data('mode'));
                    $(this).trigger('fadein');
                  });
            }
        });
        $(window).resize();
    },
   update: function (dev,par) {
       var base = this;
       this.elements.filterDeviceReading('get',dev,par)
       .each(function(index) {
           var elem = $(this);
           var state = elem.getReading('get').val;
           if (state) {
               if ( state == $(this).data('get-on') )
                    $(this).children(":first").trigger('click');
               else if ( state == $(this).data('get-off') )
                    $(this).find('.dialog-close').trigger('click');
               else if ( state.match(new RegExp('^' + $(this).data('get-on') + '$')) )
                    $(this).children(":first").trigger('click');
               else if ( state.match(new RegExp('^' + $(this).data('get-off') + '$')) )
                    $(this).find('.dialog-close').trigger('click');
               else if ( $(this).data('get-off')=='!on' && state != $(this).data('get-on') )
                    $(this).children(":first").trigger('click');
               else if ( $(this).data('get-on')=='!off' && state != $(this).data('get-off') )
                    $(this).find('.dialog-close').trigger('click');
           }
       });
   }
});
