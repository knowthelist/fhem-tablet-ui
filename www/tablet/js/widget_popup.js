if(typeof widget_widget == 'undefined') {
    dynamicload('js/widget_widget.js');
}

var widget_popup= $.extend({}, widget_widget, {
    widgetname: 'popup',
    init_attr: function(elem) {
        elem.data('get',        elem.data('get')                                    || 'STATE');
        elem.data('get-on',     elem.isValidData('get-on')  ? elem.data('get-on')    : 'on');
        elem.data('get-off',    elem.isValidData('get-off') ? elem.data('get-off')   : 'off');
        elem.data('height',     elem.data('height')                                 || 'auto');
        elem.data('width',      elem.data('width')                                  || '100%');
        
        readings[$(this).data('get')] = true;
    },
    init: function () {
        var base=this;
        this.elements = $('div[data-type="'+this.widgetname+'"]');
        this.elements.each(function(index) {
            var elem = $(this);
            base.init_attr(elem);

            var dialog = elem.find('.dialog');
            var starter = elem.children(":first");
            var close = jQuery('<div/>', {
                 class: 'dialog-close'
              }).html('x').appendTo(dialog);

            if (dialog && close && starter){

                dialog.css({'height':elem.data('height'),'width':elem.data('width')});
                starter.css({'cursor': 'pointer'});
                elem.closest('.gridster>ul>li').css({overflow: 'visible'});
                $(window).resize(function() {
                  dialog.css({
                    top: ($(window).height() - dialog.outerHeight()) / 2,
                    left: ($(window).width() - dialog.outerWidth()) / 2
                  });
                });

                //prepare events
                close.on('click',function() {
                  dialog.fadeOut(500, function() {
                    showModal(false);
                  });
                });

                starter.on('click',function(e) {
                    e.preventDefault();
                    showModal(true);
                    dialog.fadeIn(500);
                  });
            }
        });
        $(window).resize();
    },
   update: function (dev,par) {
       var deviceElements= this.elements.filter('div[data-device="'+dev+'"]');
       deviceElements.each(function(index) {
           if ( $(this).data('get')==par) {
               var state = getDeviceValue( $(this), 'get' );
               if (state) {
                   if ( state == $(this).data('get-on') )
                        $(this).children(":first").trigger('click');
                   else if ( state == $(this).data('get-off') )
                        $(this).find('a.dialog-close').trigger('click');
                   else if ( state.match(new RegExp('^' + $(this).data('get-on') + '$')) )
                        $(this).children(":first").trigger('click');
                   else if ( state.match(new RegExp('^' + $(this).data('get-off') + '$')) )
                        $(this).find('a.dialog-close').trigger('click');
                   else if ( $(this).data('get-off')=='!on' && state != $(this).data('get-on') )
                        $(this).children(":first").trigger('click');
                   else if ( $(this).data('get-on')=='!off' && state != $(this).data('get-off') )
                        $(this).find('a.dialog-close').trigger('click');
               }
           }
       });
   }
});
