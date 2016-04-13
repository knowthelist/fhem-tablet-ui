
function depends_knob (){
    if (!$.fn.draggable)
        return ["../pgm2/jquery-ui.min.js"];
};

var Modul_popup = function () {

    function hide (elem,mode) {
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
    };

    function show (elem,mode) {
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
            }, 500, "swing", function() {
                  elem.trigger('fadein');
                });
            break;
        default:
            elem.css({
               height:   elem.options.height,
               width:    elem.options.width,
               top:      elem.options.end_top,
               left:     elem.options.end_left,
            });
            elem.fadeIn(500);
            elem.trigger('fadein');
        }
    };

    function init_attr (elem) {
        elem.initData('get'         ,'STATE');
        elem.initData('get-on'      ,'on');
        elem.initData('get-off'     ,'off');
        elem.initData('height'      ,'300px');
        elem.initData('width'       ,'400px');
        elem.initData('mode'        ,'animate');
        elem.initData('starter'     ,null);
        elem.initData('draggable'   ,true);
        this.addReading(elem,'get');
    };

    function init () {
        var me=this;
        me.elements = $('div[data-type="'+me.widgetname+'"]',me.area);
        me.elements.each(function(index) {
            var elem = $(this);
            me.init_attr(elem);

            var dialog = elem.find('.dialog');
            var starter = (elem.data('starter')) ? $(document).find( elem.data('starter') ) : elem.children(":first");
            if (starter.hasClass('dialog')){
                starter = jQuery('<div/>', {
                             class: 'dialog-starter'
                          }).prependTo(elem);
            }
            else
                starter.addClass('dialog-starter')

            var close = jQuery('<div/>', {
                 class: 'dialog-close'
              }).html('x').appendTo(dialog);

            if (dialog && close && starter){
                if(elem.data('draggable')) {
                    if ($.fn.draggable)
                        dialog.draggable();
                    else{
                        console.log("widget_popup tries to load jquery ui. insert correct script tag into html header to avoid error (and this warning)")
                        console.log('e.g.: <script type="text/javascript" src="../pgm2/jquery-ui.min.js"></script>');
                    }
                }

                dialog.css({'height':elem.data('height'),'width':elem.data('width')});
                starter.css({'cursor': 'pointer'});
                elem.closest('.gridster>ul>li').css({overflow: 'visible'});
                dialog.options={};

                $(window).resize(function() {
                    dialog.options.end_top = ($(window).height() - parseInt(elem.data('height'))) / 2;
                    dialog.options.end_left = ($(window).width() - parseInt(elem.data('width'))) / 2;
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
                    hide(dialog,elem.data('mode'));
                });

                $(document).on('shadeClicked', function() {
                    hide(dialog,elem.data('mode'));
                });

                starter.on('click',function(e) {
                    e.preventDefault();
                    show(dialog,elem.data('mode'));
                    $(this).trigger('fadein');
                  });
            }
        });
        $(window).resize();
   };

   function update (dev,par) {
       this.elements.filterDeviceReading('get',dev,par)
       .each(function(index) {
           var elem = $(this);
           var state = elem.getReading('get').val;
           if (state) {
               if ( state == $(this).data('get-on') )
                    elem.find('.dialog-starter').trigger('click');
               else if ( state == $(this).data('get-off') )
                    elem.find('.dialog-close').trigger('click');
               else if ( state.match(new RegExp('^' + $(this).data('get-on') + '$')) )
                    elem.find('.dialog-starter').trigger('click');
               else if ( state.match(new RegExp('^' + $(this).data('get-off') + '$')) )
                    elem.find('.dialog-close').trigger('click');
               else if ( $(this).data('get-off')=='!on' && state != $(this).data('get-on') )
                    elem.find('.dialog-starter').trigger('click');
               else if ( $(this).data('get-on')=='!off' && state != $(this).data('get-off') )
                    elem.find('.dialog-close').trigger('click');
           }
       });
   };

   // public
   // inherit all public members from base class
   return $.extend(new Modul_widget(), {
       //override or own public members
       widgetname: 'popup',
       init: init,
       init_attr: init_attr,
       update: update,
   });
};
